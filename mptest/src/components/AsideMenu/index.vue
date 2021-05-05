<template>
  <transition name="fadeIn">
      <div class="aside-menu" :style="{paddingTop: paddingTop + 'px'}">
        <van-icon class="icon-back" @click="showAsideMenu" name="arrow-left" size="2rem"/>
        <div class="aside">
          <div class="info">
            <img :src="userInfo.avatarUrl" alt="microzz.com">
            <div class="about">
              <span class="name"><a href="#">{{userInfo.nickName}}</a></span>
            </div>
          </div>
          <div class="settings">
            <div class="content">
              <ul>
                <li @click="showDeviceDetail"><i class="icon-msg" ></i>设备详情</li>
              </ul>
              <ul>
                <li @click="showAddPage"><i class="icon-vip"></i>添加设备</li>
              </ul>
              <ul>
                <li><i class="aboutme"></i>关于</li>
              </ul>
              <div class="back">
                <i @click="showAsideMenu" class="icon-back"></i>
              </div>
            </div>
          </div>
        </div>
        <div @click="showAsideMenu" class="mask"></div>
      </div>
  </transition>
</template>

<script>
import {statusBar} from '@/utils/systemSetting'
export default {
  name: 'AsideMenu',
  data () {
    return {
      isSignIn: false,
      paddingTop: statusBar.android
    }
  },
  computed: {
    isSignInText () {
      return this.isSignIn ? '已签到' : '签到'
    },
    userInfo () {
      return this.$store.state.userStore.userInfo
    }
  },
  methods: {
    showAsideMenu () {
      this.$store.commit('changeShowAsideMenu', false)
    },
    showAddPage () {
      console.log('1111111111')
      this.$store.commit('showAddPage')
    },
    showDeviceDetail () {
      this.$store.commit('showDetailPage')
    }
  },
  mounted () {
    const systemInfo = wx.getSystemInfoSync()
    const ratio = systemInfo.screenHeight / systemInfo.screenWidth // 高宽比例
    const isNewModel = ratio >= 2
    const isIPhone = systemInfo.model.indexOf('iPhone') >= 0
    const barHeight = systemInfo.statusBarHeight || (isNewModel ? statusBar.newModel : isIPhone ? statusBar.iPhone : statusBar.android)
    this.paddingTop = barHeight
  }
}
</script>

<style lang="scss" scoped>
  .fadeIn-enter-active{
    transition: all .4s ease;
  }
  .fadeIn-leave-active{
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fadeIn-enter, .fadeIn-leave-active{
    transform: translateX(-250px);
    opacity: 0;
  }
    .aside-menu{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      z-index: 1;

      .icon-back{
        display: inline-block;
        position: absolute;
        left: 50%;
        top: .8rem;
      }
      .aside{
        flex: 6;
      }
      .mask{
        flex: 4;
      }
      .info{
        padding-top: 20px;
        padding-left: 10px;
        padding-bottom: 8px;
        background-color: #E0E3DA;
        box-shadow: 2px 0 10px gray;
        flex: 1;
        img{
          width: 100px;
          height: 95px;
          border-radius: 60px;
        }
        .about{
          position: relative;
          margin-top: 2px;
          span.name {
            color: rgba(0, 0, 0, .8);
            font-size: .4rem;
          }
          span.sign{
            position: absolute;
            right: 10px;
            top: 5px;
            border: 1px solid white;
            height: 20px;
            width: 50px;
            border-radius: 10px;
            line-height: 20px;
            text-align: center;
            color: black;
            font-size: .2rem;
            cursor: pointer;
          }
        }
      }
      .settings{
        flex: 4.2;
        position: relative;
        height: 100%;
        background: white;
        border-right: 1px solid gray;
        box-shadow: 2px 0 20px gray;

        .content{
          height: 85%;
          ul:nth-of-type(1){
            color: rgba(0, 0, 0, .5);
            padding-top: 20px;
            border-bottom: 6px solid rgba(0, 0, 0, .04);
          }
          ul:nth-of-type(2) {
            color: rgba(0, 0, 0, .5);
            padding-top: 10px;
            padding-bottom: 5px;
            border-bottom: 6px solid rgba(0, 0, 0, .04);
          }
          ul:nth-of-type(3) {
            color: rgba(0, 0, 0, .5);
            padding-top: 15px;
          }
          ul{
            list-style: none;
            padding: 5px 15px;
            li{
              font-size: .4rem;
              margin-bottom: 20px;
              cursor: pointer;
              i{
                display:inline-block;
                width: 20px;
                height: 20px;
                margin-right:4px;
                vertical-align: text-bottom;
              }
              
            }
          }
        }
      }
    }

</style>
