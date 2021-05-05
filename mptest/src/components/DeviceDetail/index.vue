<template>
  <div class="container">
    <div class="data-header">
      <div class="data-humi">
        <p class="humi-title">当前湿度</p>
        <p class="humi-data">{{deviceNow.humidity}}%RH</p>
      </div>
      <div class="data-col">
        <div class="data-temp">
          <p class="temp-title">当前温度</p>
          <p class="temp-data">{{deviceNow.temperature}}℃</p>
        </div>
        <div class="data-limit">
          <p class="limit-title">在线状态</p>
          <p class="limit-data">{{deviceNow.online ? '在线' : '下线'}}</p>
        </div>
      </div>
    </div>
    <div class="wrap">
      <van-tabs :active="active" @change="onChange" type="card">
        <van-tab title="实时数据">
        </van-tab>
        <van-tab title="历史数据">
          <van-cell-group>
            <van-cell title="选择查询的日期" :value="dateSelected" @click="onDisplay" is-link/>
          </van-cell-group>
        </van-tab>
      </van-tabs>
      <van-tabs :active="childActive" @change="onChangeChild" type="card">
        <van-tab title="湿度"></van-tab>
        <van-tab title="温度"></van-tab>
      </van-tabs>
        <mpvue-echarts v-if="showChart" :echarts="echarts" :onInit="onInit" canvasId="demo-canvas"/>
      <van-popup :show="show" @close="onClose" @click-overlay="onClose" position="bottom">
        <van-datetime-picker
          type="date"
          v-model="date"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>
    <van-toast id="van-toast"/>
  </div>
</template>
<script>
import * as echarts from 'echarts/dist/echarts.simple.min'
import mpvueEcharts from 'mpvue-echarts'
import {mapState} from 'vuex'
import Vue from 'vue'
import req from '../../api/request'
import Toast from './../../../static/vant-weapp/toast/toast'

const timeArray = []
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j += 10) {
    timeArray.push(`${i}:${j === 0 ? '0' + j : j}`)
  }
}

let chart = null

// let initChart = function (canvas, width, height) {
//   console.log(this.temperatureDataList)
//   chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   })
//   canvas.setChart(chart)
//   var option = {
//     backgroundColor: '#fff',
//     color: ['#37A2DA', '#67E0E3'],
//     legend: {
//       data: ['温度']
//     },
//     grid: {
//       containLabel: true
//     },
//     xAxis: {
//       type: 'time'
//     },
//     yAxis: {
//       name: 'data',
//       type: 'value',
//       splitLine: {
//         lineStyle: {
//           type: 'dashed'
//         }
//       }
//     },
//     series: [{
//       name: '',
//       type: 'line',
//       hoverAnimation: false,
//       smooth: true,
//       symbolSize: 4,
//       // data: this.temperatureDataList
//       // {time: 20210406205113, value: 21.97}, {time: 20210406203113, value: 31.97}, {time: 20210406215113, value: 11.97}, {time: 20210406245113, value: 21.97}
//       data: []
//     }]
//   }
//   chart.setOption(option)
//   return chart
// }

export default {
  data () {
    return {
      showChart: true,
      echarts,
      onInit: this.initChart,
      timeOut: undefined,
      active: 0,
      childActive: 0,
      show: false,
      date: new Date().getTime(),
      dateSelected: undefined,
      historyTemp: [],
      historyHumi: [],
      option: {
        backgroundColor: '#fff',
        color: ['#37A2DA', '#67E0E3'],
        legend: {
          data: ['温度']
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          name: 'data',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          name: '',
          type: 'line',
          hoverAnimation: false,
          smooth: true,
          symbolSize: 4,
          // data: this.temperatureDataList
          // {time: 20210406205113, value: 21.97}, {time: 20210406203113, value: 31.97}, {time: 20210406215113, value: 11.97}, {time: 20210406245113, value: 21.97}
          data: []
        }]
      }
    }
  },
  created () {
    // this.maxDate = new Date()
    // this.minDate = new Date()
    // this.maxDate.setTime(this.maxDate.getTime())
    // this.minDate.setTime(this.minDate.getTime() - 24 * 60 * 60)
  },
  computed: {
    ...mapState({
      'devicesInfo': state => state.dataStore.devicesInfo,
      'selectedDevice': state => state.dataStore.selectedDevice,
      'temperatureDataList': state => state.dataStore.temperatureDataList,
      'humiDataList': state => state.dataStore.humiDataList
    }),
    deviceNow () {
      return this.devicesInfo[this.selectedDevice]
    }
  },
  watch: {
    humiDataList: function (val, oldval) {
      if (this.active === 0 && this.childActive === 0) {
        let timeList = []
        val.forEach(item => {
          timeList.push(item.time)
        })
        this.reChart(val, timeList, 0, 0)
      }
    },
    temperatureDataList: function (val, oldval) {
      console.log(val, this.active, this.childActive)
      if (this.active === 0 && this.childActive === 1) {
        let timeList = []
        val.forEach(item => {
          timeList.push(item.time)
        })
        this.reChart(val, timeList, 0, 1)
      }
    }
  },
  components: {
    mpvueEcharts
  },
  methods: {
    showToast () {
      console.log('showshow')
      Toast.loading({
        message: '加载数据中',
        forbidClick: true,
        loadingType: 'spinner'
      })
    },
    reChart (data, xV, type, childType) {
      let name
      if (type === 0 && childType === 0) {
        name = '湿度'
      } else if (type === 0 && childType === 1) {
        name = '温度'
      }
      if (type === 1) {
        Vue.set(this.option, 'yAxis', {
          show: false
        })
      } else {
        Vue.set(this.option, 'yAxis', {
          show: true
        })
      }
      Vue.set(this.option, 'xAxis', {
        data: xV
      })
      Vue.set(this.option, 'series', {
        name: name,
        type: 'line',
        hoverAnimation: false,
        smooth: true,
        symbolSize: 4,
        data: data
      })
      console.log(this.option)
      chart.setOption(this.option)
    },
    initChart (canvas, width, height) {
      console.log(this.temperatureDataList)
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.option)
      return chart
    },
    onChange (e) {
      this.active = e.mp.detail.index
      console.log('resizeF')
      chart.resize()
    },
    onChangeChild (e) {
      console.log('resizeC')
      chart.resize()
      this.showToast()
      this.childActive = e.mp.detail.index
      if (this.active === 1 && this.childActive === 0) {
        this.reChart(this.historyHumi, timeArray, 1, 0)
      } else if (this.active === 1 && this.childActive === 1) {
        this.reChart(this.historyTemp, timeArray, 1, 1)
      }
    },
    onDisplay () {
      this.show = true
      this.showChart = false
    },
    onClose () {
      this.show = false
    },
    formatDate (date) {
      date = new Date(date)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return `${y}${m}${d}`
    },
    requestHistory () {
      let url = 'soil/' + this.selectedDevice + '/date/' + this.dateSelected
      req.call(url)
        .then((res) => {
          return res.data
        })
        .then((data) => {
          this.showToast()
          this.childActive = 0
          console.log('hisD', data)
          chart.resize()
          this.historyTemp = data.humidity
          this.historyHumi = data.temperature
          if (this.active === 1 && this.childActive === 0) {
            this.reChart(this.historyHumi, timeArray, 1, 0)
          } else if (this.active === 1 && this.childActive === 1) {
            this.reChart(this.historyTemp, timeArray, 1, 1)
          }
        })
        .catch(err => {
          console.log('错误', err)
          setTimeout(() => {
            Toast.fail('请求失败请检查网络')
          }, 1000)
        })
    },
    onConfirm (event) {
      console.log(event.mp)
      this.date = this.formatDate(event.mp.detail)
      this.dateSelected = this.formatDate(event.mp.detail)
      this.requestHistory()
      this.showToast()
      this.show = false
      this.showChart = true
    }
  }
}
</script>
<style lang="scss" scoped>
  charts {
    z-index: -1;
  }
  .wrap {
    width: 100%;
    height: 8rem;
  }
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .data-header{
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
    .data-humi{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      min-height: 300rpx;
      min-width: 90px;
      font-size: 56rpx;
      .humi-title{
        color: rgb(140, 140, 140);
        font-weight: 400;
      }
      .humi-data{
        font-weight: 500;
      }
    }
    .data-col{
      display: flex;
      flex-direction: column;
      margin-left: 20px;
      .data-temp{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        min-height: 280rpx;
        min-width: 90px;
        font-size: 40rpx;
        .temp-title{
          color: rgb(140, 140, 140);
          font-weight: 400;
        }
        .temp-data{
          font-weight: 500;
          font-size: 60rpx;
        }
      }
      .data-limit{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        min-height: 280rpx;
        min-width: 90px;
        font-size: 40rpx;
        .limit-title{
          color: rgb(140, 140, 140);
          font-weight: 400;
        }
        .limit-data{
          font-weight: 500;
          font-size: 60rpx;
        }
      }
    }
  }
  
  
</style>