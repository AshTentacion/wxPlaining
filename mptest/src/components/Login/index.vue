<template>
  <div class="container">
    <p>您还未登录,请使用微信授权登录</p>
    <van-button plain @click="handleGetUserInfo" type="primary">点击获得授权</van-button>
  </div>
</template>
<script>
export default {
  computed: {
    userInfo () {
      return this.$store.state.userStore.userInfo
    },
    devicesInfo () {
      return this.$store.state.dataStore.devicesInfo
    }
  },
  methods: {
    handleGetUserInfo () {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (data) => {
          console.log('handle', data)
          wx.setStorageSync('userInfo', data.userInfo)
          wx.setStorageSync('isLogin', true)
          this.$store.commit('changeUserInfo', wx.getStorageSync('userInfo'))
          this.isShowDevices()
        },
        fail: () => {
          console.log('失败')
        }
      })
    },
    getUserInfo (data) {
      console.log('get', data)
      if (data.mp.detail.rawData) {
        this.handleGetUserInfo()
      }
    },
    isShowDevices () {
      console.log('devices----------', JSON.stringify(this.devicesInfo))
      if (JSON.stringify(this.devicesInfo) === '{}') {
        console.log('11111')
        this.$store.commit('showAddPage')
      } else {
        this.$store.commit('showIndexPage')
      }
      // this.$store.commit('showAddPage')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
  .container{
    @include wh(100%, 100%);
    @include fj(center);
    align-items: center;
    flex-direction: column;
    p{
      margin-bottom: 2rem;
    }
  }
</style>