<template>
  <div class="app">
    <VHeader :title="headerTitle" :type="headerType"></VHeader>
    <div v-if="showIndex" class="full-page">
      <AsideMenu v-if="isShowAsideMenu"></AsideMenu>
      <ShowIndex></ShowIndex>
    </div>
    <div v-if="showDeviceAdd" class="full-page">
      <AddDevice></AddDevice>
    </div>
    <div v-if="showDeviceDetail" class="full-page">
      <DeviceDetail></DeviceDetail>
    </div>
    <div v-if="showLogin" class="full-page">
      <Login></Login>
    </div>

  </div>
</template>

<script>
import ShowIndex from '@/components/ShowIndex'
import VHeader from '@/components/Header/Header'
import AsideMenu from '@/components/AsideMenu'
import Login from '@/components/Login'
import AddDevice from '@/components/AddDevice'
import DeviceDetail from '@/components/DeviceDetail'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      timer: undefined
    }
  },
  computed: {
    ...mapState({
      isShowAsideMenu: state => state.basicStore.showAsideMenu,
      showIndex: state => state.basicStore.showIndex,
      showDeviceAdd: state => state.basicStore.showDeviceAdd,
      showDeviceDetail: state => state.basicStore.showDeviceDetail,
      showLogin: state => state.basicStore.showLogin,
      headerTitle: state => state.basicStore.headerTitle,
      headerType: state => state.basicStore.headerType,
      devicesInfo: state => state.dataStore.devicesInfo
    })
  },
  // onLoad: function () {
  //   // 打开调试
  //   wx.setEnableDebug({
  //     enableDebug: true
  //   })

  //   // 关闭调试
  //   wx.setEnableDebug({
  //     enableDebug: false
  //   })
  //   Tips
  // },
  components: {
    ShowIndex,
    VHeader,
    AsideMenu,
    Login,
    AddDevice,
    DeviceDetail
  },

  methods: {
    ...mapActions([
      'getSoilDataById'
    ]),
    isShowLogin () {
      console.log('showAsideMenu', this.isShowAsideMenu)
      console.log(wx.getStorageSync('userInfo'))
      console.log(wx.getStorageSync('isLogin'))
      if (wx.getStorageSync('isLogin')) {
        this.$store.commit('changeUserInfo', wx.getStorageSync('userInfo'))
        this.$store.commit('showIndexPage')
      }
    },
    regiestDevice () {
      let devices = wx.getStorageSync('devices')
      if (devices !== '') {
        wx.setStorageSync('defaultDevices', devices[0])
        this.$store.commit('setSelectedDevice', devices[0])
        devices.forEach(data => {
          console.log(data, '-----', this.$store)
          this.$store.commit('regiestDevices2', data)
        })
      }
    },
    requestDeviceData () {
      Object.keys(this.devicesInfo).forEach(id => {
        if (id !== '测试数据测试数据') {
          this.getSoilDataById(id)
        }
      })
    },
    setAutoRequest () {
      this.timer = setInterval(() => {
        this.requestDeviceData()
      }, 6000)
    }
  },

  created () {
    this.regiestDevice()
    this.requestDeviceData()
    this.setAutoRequest()
    this.isShowLogin()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
  .full-page{
    width: 100%;
    height: 100%;
  }
  
</style>
