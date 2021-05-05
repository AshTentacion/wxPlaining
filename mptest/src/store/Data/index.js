import req from '../../api/request'
import Vue from 'vue'
// function timestampToTime (timestamp) {
//   var date = new Date(timestamp * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
//   var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
//   var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
//   var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
//   return h + m + s
// }

// let timeAdd = 0
// let valueAdd = 0

function formatter (time) {
  time = time + ''
  time = time.substring(time.length - 6)
  let t = ''
  for (let i = 0; i < time.length; i++) {
    t += time[i]
    if ((i + 1) % 2 === 0 && i !== time.length - 1) {
      t += ':'
    }
  }
  return t
}

const store = {
  state: {
    devicesInfo: {},
    selectedDevice: undefined,
    temperatureDataList: [],
    humiDataList: []
  },
  mutations: {
    setDevicesInfo (state, obj) {
      // state.devicesInfo[obj.id][obj.key] = obj.data
      Vue.set(state.devicesInfo[obj.id], obj.key, obj.data)
    },
    regiestDevices2 (state, id) {
      // state.devicesInfo[id] = {}
      Vue.set(state.devicesInfo, id, {})
    },
    setSelectedDevice (state, id) {
      state.selectedDevice = id
    },
    addTemperatureList (state, data) {
      if (state.temperatureDataList.length > 30) {
        state.temperatureDataList.splice(0, 1)
      }
      state.temperatureDataList.push(data)
    },
    addHumiList (state, data) {
      console.log(data)
      if (state.humiDataList.length > 30) {
        state.humiDataList.splice(0, 1)
      }
      state.humiDataList.push(data)
    }

  },
  actions: {
    //    {
    //   "time": 20210225112846, // 时间：年月日时分秒
    //   "humidity": 352, // 湿度：可当作千分制使用, 范围 0-1000
    //   "temperature": 16.32, // 温度：单位摄氏度, 小数点后有2位有效小数
    //   "online": false, // 硬件在线状态
    //   "watering": false // 浇水状态
    // }
    getSoilDataById (context, id) {
      req
        .call('soil/' + id)
        .then(res => {
          return res.data
        })
        .then(data => {
          console.log('onlineinfo2', data)
          let time = data['time']
          let chartTime = formatter(time)
          context.commit('setDevicesInfo', {
            id,
            key: 'online',
            data: data['online']
          })
          context.commit('setDevicesInfo', {
            id,
            key: 'watering',
            data: data['watering']
          })
          context.commit('setDevicesInfo', {
            id,
            key: 'time',
            data: data['time']
          })
          context.commit('setDevicesInfo', {
            id,
            key: 'humidity',
            data: data['humidity']
          })
          context.commit('addHumiList', {
            time: chartTime,
            value: data['humidity']
          })
          context.commit('setDevicesInfo', {
            id,
            key: 'temperature',
            data: data['temperature']
          })
          context.commit('addTemperatureList', {
            time: chartTime,
            value: data['temperature']
          })
        })
        .catch(err => {
          console.log(err)
        })
    }

  }
}

export default store
