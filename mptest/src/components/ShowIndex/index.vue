<template>
  <div class="container">
    <header>
      <div class="header_title">
        <div class="logo">
          <img src="../../../static/images/starberry.png" alt="">
        </div>
      </div>
      <div class="btns_list">
        <div class="btn_item">
          <van-button @click="plain" type="default" plain>浇水</van-button>
        </div>
        <div class="btn_item">
          <van-button @click="timeoutPlain" type="default" plain>计划浇水</van-button>
        </div>
      </div>
      <scroll-view enable-flex="true" scroll-x="true" class="show_datas">
        <div class="data_item">
          <div class="icon_container">
            <van-icon name="fire-o" size="2rem" color="#75756f"/>
          </div>
          <p>{{deviceNow.temperature}} ℃</p>
        </div>
        <div class="data_item">
          <div class="icon_container">
            <van-icon name="flower-o" size="2rem" color="#75756f"/>
          </div>
          <p>{{deviceNow.humidity}} %RH</p>
        </div>
        <div class="data_item">
          <div class="icon_container">
            <van-icon name="tosend" size="2rem" color="#75756f"/>
          </div>
          <p>{{deviceNow.online == true ? '在线' : '不在线'}}</p>
        </div>
        <div class="data_item">
          <div class="icon_container">
            <van-icon name="setting-o" size="2rem" color="#75756f"/>
          </div>
          <p>{{deviceNow.watering == true ? '正在浇水' : '不在浇水'}}</p>
        </div>
      </scroll-view>
    </header>
    <div class="div_line"></div>
    <div class="content">
      <div class="content_title">
        <p>所有设备</p>
        <span @click="showAddPage">...</span>
      </div>
      <scroll-view enable-flex="true" scroll-y="true" class="device_list">
        <div class="device_item" v-for="(infos, id) of devicesInfo"  @click="tabSelectDevice(id)" :key="id">
          <div class="device_item_info">
            <img src="../../../static/images/flower.png" alt="">
            <p>{{id}}</p>
          </div>
          <div class="div_line"></div>
          <div class="item_bottom">
            <div class="device_status">
              <p :class="infos.online ? 'green' : 'red'">·{{ infos.online ? '在线' : '下线'}}</p>
            </div>
            <div class="device_status">
              <p :class="infos.watering ? 'green' : 'red'">·{{ infos.watering ? '正浇水' : '不在浇水'}}</p>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <van-popup closeable :show="show" @close="onClose" @click-overlay="onClose" custom-style="height: 15rem;width: 15rem; display:flex; flex-direction: column; justify-content: space-around;align-items: center;padding: 20px 0">
      <van-cell-group class="input-device">
        <van-field
          :value="sendingData"
          :placeholder="placeholder"
          :border="true"
          @change="onInput"
        />
        <van-field v-if="requestType == 1"
          :value="sendingData2"
          :placeholder="placeholder2"
          :border="true"
          @change="onInputType2"
        />
      </van-cell-group>
      <van-button type="primary" block @click="submit">提交</van-button>
    </van-popup>
    <van-toast id="van-toast"/>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import req from '../../api/request'
import Toast from './../../../static/vant-weapp/toast/toast'
// import Vue from 'vue'
export default {
  data () {
    return {
      // devices: []
      show: false,
      msg: '请求中',
      loading: false,
      sendingData: undefined,
      sendingData2: undefined,
      placeholder: '',
      placeholder2: '',
      requestType: 0
    }
  },
  computed: {
    ...mapState({
      'devicesInfo': state => state.dataStore.devicesInfo,
      'selectedDevice': state => state.dataStore.selectedDevice
    }),
    deviceNow () {
      return this.devicesInfo[this.selectedDevice]
    },
    timeStr () {
      console.log(this.deviceNow['time'])
      return this.timestampToTime(this.deviceNow['time'])
    }
  },
  watch: {
    deviceNow (val, oldval) {
      console.log('update', val, oldval)
      this.$forceUpdate()
    }
  },
  created () {
    // this.getDevices()
    this.$store.commit('regiestDevices2', '测试数据测试数据')
    this.$store.commit('setDevicesInfo', {
      id: '测试数据测试数据',
      key: 'online',
      data: true
    })
    this.$store.commit('setDevicesInfo', {
      id: '测试数据测试数据',
      key: 'humidity',
      data: 50
    })
  },
  methods: {
    tabSelectDevice (id) {
      this.$store.commit('setSelectedDevice', id)
      console.log('all', this.devicesInfo)
      console.log('now', this.deviceNow)
    },
    onClose () {
      this.show = false
    },
    submit () {
      if (this.sendingData === undefined) {
        this.show = false
      } else {
        console.log('sendok', this.requestType)
        if (this.requestType === 0) {
          this.request(
            'operation/w/' + this.selectedDevice + '?code=101&duration=' + this.sendingData * 1000
          )
        } else if (this.requestType === 1) {
          this.request(
            'operation/w/' + this.selectedDevice + '?code=102&duration=' + this.sendingData * 1000 +
            '&wait=' + this.sendingData2 * 1000)
        }
      }
    },
    timestampToTime (timestamp) {
      console.log('1111111111', timestamp)
      var date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      // let Y = date.getFullYear() + '-'
      // let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      // let D = date.getDate() + ' '
      let h = date.getHours() + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds()
      return h + m + s
    },
    onInput (event) {
      this.sendingData = event.mp.detail
    },
    onInputType2 (event) {
      this.sendingData2 = event.mp.detail
    },
    plain () {
      this.show = true
      this.placeholder = '请设置浇水时长(秒)'
      this.requestType = 0
    },
    timeoutPlain () {
      this.show = true
      this.placeholder = '请设置浇水时长(秒)'
      this.placeholder2 = '请设置计划浇水的时间(秒)'
      this.requestType = 1
    },

    request (url) {
      this.show = false
      console.log('reqqqqq')
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      req.call(
        url)
        .then(res => {
          console.log(res, url)
          if (res.data.success) {
            console.log('suss')
            setTimeout(() => {
              Toast.success('请求成功')
            }, 1000)
          } else {
            setTimeout(() => {
              Toast.fail('请求失败，该设备未联网')
            }, 1000)
          }
        })
        .catch(err => {
          console.log('错误', err)
          setTimeout(() => {
            Toast.fail('请求失败请检查网络')
          }, 1000)
        })
    },

    showDeviceDetail () {
      this.$store.commit('showDetailPage')
    },
    showAddPage () {
      this.$store.commit('showAddPage')
    }
    // getDevices () {
    //   let devices = wx.getStorageSync('devices')
    //   this.devices = devices
    // }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
  page{
    @include wh(100%, 100%);
  }
  .div_line{
    border-bottom: 1rpx;
    border-bottom-style: solid;
    border-bottom-color: #E0E3DA;
    width: 100%;
  }
  .green{
    color: rgb(31, 238, 12);
  }
  .red{
    color: #d12b1f
  }
  .container{
    @include fj(flex-start);
    flex-direction: column;
    align-items: center;
    @include wh(100%, 100%);
    
    header{
      flex: 1;
      width: 100%;
      @include fj(flex-start);
      flex-direction: column;
      // align-content: center;
      .header_title{
        height: 0;
        flex: 2;
        @include fj(center);
        flex-direction: column;
        align-items: center;
        img{
          @include wh(2rem, 2rem);
        }
      }
      .btns_list{
        height: 0;
        flex: 1;
        display: flex;
        .btn_item{
          flex: 1;
          @include fj(center);
          align-items: center;
        }
      }
      .show_datas{
        height: 3rem;
        white-space:nowrap;
        color: #75756f;
        .data_item{
          @include wh(2rem, 2rem);
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .icon_container{
            @include wh(1.5rem, 1.5rem);
            border: 1rpx solid #E0E3DA;
            border-radius: 0.5rem;
            @include fj(center);
            align-items: center;
          }
          p{
            margin: 0.1rem 0 0.1rem 0;
          }
        }
      }
    }
    .content{
      flex: 1;
      width: 90%;
      height: 0;
      @include fj(flex-start);
      flex-direction: column;
      .content_title{
        @include wh(auto, 1.5rem);
        @include fj(space-between);
        align-items: center;
      }
      .device_list{
        height:7rem;
        @include fj(flex-start);
        flex-direction: row;
        flex-wrap: wrap;
        .device_item{
          @include wh(40%, 3rem);
          margin: 0.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1rpx solid #E0E3DA;
          border-radius: 0.5rem;
          .device_item_info{
            width: 80%;
            height: 0;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            img{
              @include wh(1rem, 1rem);
            }
            p{
              display: inline-block;
              @include wh(1rem, 1rem);
              text-align: center;
              text-overflow: ellipsis;
              overflow:hidden;
              white-space:nowrap;
              line-height: 1rem;
            }
          }
          .item_bottom{
            width: 100%;
            height: 0;
            flex: 1;
            display: flex;
            .device_status{
              width: 0;
              height: 100%;
              font-size: 0.5em;
              flex: 1;
              @include fj(center);
              align-items: center;
              p{
                border: 1rpx solid #E0E3DA;
                border-radius: 0.3rem;
                display: inline;
                padding: 0.2rem 0.2rem;
              }
            }
            
          }
        }
      }
    }
  }
</style>