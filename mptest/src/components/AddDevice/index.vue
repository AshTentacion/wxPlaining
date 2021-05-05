<template>
  <div class="container">
    <div class="logo">
      <img src="/static/images/user.png" alt="">
    </div>

    <van-cell-group class="input-device">
      <van-field
        :value="value"
        placeholder="请输入设备id"
        :border="true"
        @change="onInput"
      />
    </van-cell-group>

    <div class="submit-button">
      <van-button type="primary" block @click="submit">提交</van-button>
    </div>
    <van-popup :show="show" custom-style="height: 10rem;width: 10rem; display:flex;justify-content: center;align-items: center;"><van-loading size="5rem" vertical>加载中...</van-loading></van-popup>
  </div>
</template>
<script>

import addApi from '../../api/addApi'

export default {
  data () {
    return {
      value: '',
      show: false
    }
  },
  methods: {
    submit () {
      addApi.requestIfAdd(this.value)
        .then(res => {
          let devices = wx.getStorageSync('devices')
          console.log('devices1', devices)
          if (devices === '') {
            devices = []
          }
          devices.push(this.value)
          // 8caab58e562c
          this.$store.commit('regiestDevices2', this.value)
          wx.setStorageSync('devices', devices)
          wx.setStorageSync('defaultDevices', this.value)
          this.$store.commit('setSelectedDevice', this.value)
        })
        .then(() => {
          this.show = true
          setTimeout(() => {
            this.$store.commit('showIndexPage')
            this.show = false
          }, 4000)
        })
    },
    onInput (event) {
      this.value = event.mp.detail
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
  .container{
    @include wh(100%, 90%);
    @include fj(flex-start);
    flex-direction: column;
    align-items: center;
    .logo{
      flex: 1.5;
    }
    .input-device{
      width: 80%;
      flex: 1;
    }
    .submit-button{
      width: 100%;
      flex: 1;
      @include fj(flex-start);
      align-items: flex-end;
      van-button{
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  }
</style>