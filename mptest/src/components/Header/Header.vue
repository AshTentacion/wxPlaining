<template>
  <view class="navigation-bar" :style="{paddingTop: paddingTop + 'px', height: height + 'px', backgroundColor: background||barStyle.background}">
    <div v-if="leftShow" class="back-home" :style="{minWidth:menuSettings.width + 'px',height: menuSettings.height + 'px',borderRadius: (menuSettings.height/2) + 'px',marginTop:marginTop + 'px', transform:'scale('+scale+')'}">
      <div class="back" :style="{height: menuSettings.height + 'px'}"><img src="/static/img/2.4_back_icon.png" alt=""></div>
      <div class="line"></div>
      <div class="home" :style="{height: menuSettings.height + 'px'}"><img src="/static/img/2.4_home_icon.png" alt=""></div>
    </div>
    <div v-else class="back-home2" :style="{minWidth:menuSettings.width + 'px',height: barStyle.height + 'px'}">
      <van-icon v-if="type" name="label-o" size="1.5rem" @click="showAsideMenu"></van-icon> 
      <van-icon v-else name="arrow-left" size="1.5rem" @click="showIndexPage"></van-icon>
    </div>
    <div class="title" :style="{textAlign: barStyle.textAlign, color: color||barStyle.color,fontSize: barStyle.fontSize + 'px',lineHeight: barStyle.fontSize + 'px', lineHeight:barStyle.height + 'px'}">{{title}}</div>
    <div class="back-home1" :style="{minWidth:menuSettings.width + 'px',height: menuSettings.height + 'px'}"></div>
  </view>
</template>

<script>
  import {statusBar, navigationBar, navBarStyle} from '@/utils/systemSetting'
  export default {
    props: {
      title: {type: String, default: ''},
      type: {type: Boolean, default: true}
    },
    data () {
      return {
        paddingTop: statusBar.android, // 默认为android大部分普通机型高度
        height: navigationBar.default + statusBar.android,
        barStyle: {},
        currentPage: '',
        leftShow: false,
        marginTop: 0,
        scale: 1
      }
    },
    computed: {
      // showBackIcon () {
      //   const pages = global.getCurrentPages()
      //   this.currentPage = pages[pages.length - 1].route
      //   if (pages.length > 1) {
      //     this.leftShow = true
      //     return true
      //   } else {
      //     if (this.currentPage !== 'pages/index/main') {
      //       this.leftShow = true
      //     }
      //     return false
      //   }
      // },
      menuSettings () {
        return this.$store.state.basicStore.menuSettings
      }
    },
    mounted () {
      const systemInfo = wx.getSystemInfoSync()
      if (this.menuSettings.height === 0) {
        this.getMenuSettings(1, 3)
      }
      this.scale = 1 - (0.5 / this.menuSettings.height)
      this.marginTop = this.menuSettings.top - systemInfo.statusBarHeight
      const ratio = systemInfo.screenHeight / systemInfo.screenWidth // 高宽比例
      const isNewModel = ratio >= 2
      const isIPhone = systemInfo.model.indexOf('iPhone') >= 0
      const barHeight = systemInfo.statusBarHeight || (isNewModel ? statusBar.newModel : isIPhone ? statusBar.iPhone : statusBar.android)
      this.paddingTop = barHeight
      this.height = barHeight + navigationBar.default
      let barStyle = {...navBarStyle}
      barStyle.height = navigationBar.default
      this.barStyle = barStyle
    },
    methods: {
      getMenuSettings (current, count) {
        let menuSettings = wx.getMenuButtonBoundingClientRect()
        if (menuSettings.height === 0) {
          if (current > 3) {
            return
          }
          setTimeout(() => {
            this.getMenuSettings(current + 1, count)
          }, 200)
        } else {
          this.$store.commit('setMenuSettings', menuSettings)
        }
      },
      showAsideMenu () {
        this.$store.commit('changeShowAsideMenu', true)
      },
      showIndexPage () {
        this.$store.commit('showIndexPage')
      }
      // goBack () {
      //   if (this.showBackIcon) {
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   } else {
      //     if (this.currentPage !== 'pages/index/main') {
      //       wx.reLaunch({
      //         url: '/pages/index/main'
      //       })
      //     }
      //   }
      // },
      // goHome () {
      //   if (this.currentPage !== 'pages/index/main') {
      //     wx.reLaunch({
      //       url: '/pages/index/main'
      //     })
      //   }
      // }
    }
  
  /**
 * 组件的方法列表
 */
  
  }
</script>

<style scoped>
.navigation-bar{
  width: 100vw;
  height: 60px;
  background-color: rgba(255, 255, 255, 0);
  color: #000;
  display: flex;
  justify-content: space-between;
  
  box-sizing: border-box;
  z-index: 1000;
}
.back-home{
  display: flex;
  align-items: center;
  background: rgba(255,255,255, 0.6);
  border-radius: 16px;
  margin-left: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 1px rgb(207, 207, 207);
  overflow: hidden;
}
.back-home2{
  margin-left: 10px;
  display: flex;
  align-items: center;
}


.back-home1{
  margin-right: 10px;
}
.back, .home{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.back img{
  width: 9px;
  height: 16px;
}
.home img{
  width: 17px;
  height: 17px;
}
.line{
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0,0.2);
  transform: scaleX(0.5);
}
.title{
  flex: 1;
  box-sizing: border-box;
  padding: 0 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* font-weight: bold; */
}
</style>