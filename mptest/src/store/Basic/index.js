
const store = {
  state: {
    menuSettings: {height: 0},
    showAsideMenu: false,
    showIndex: false,
    showDeviceAdd: false,
    showDeviceDetail: false,
    showLogin: true,
    headerTitle: '智能草莓',
    headerType: true
  },
  mutations: {
    setMenuSettings (state, settings) {
      state.menuSettings = settings
    },
    changeShowAsideMenu (state, flag) {
      state.showAsideMenu = flag
    },
    showIndexPage (state) {
      state.showIndex = true
      state.showDeviceAdd = false
      state.showDeviceDetail = false
      state.showLogin = false
      state.headerTitle = '智能草莓'
      state.headerType = true
    },
    showAddPage (state) {
      state.showIndex = false
      state.showDeviceAdd = true
      state.showDeviceDetail = false
      state.showLogin = false
      state.headerTitle = '添加设备'
      state.headerType = false
    },
    showDetailPage (state) {
      state.showIndex = false
      state.showDeviceAdd = false
      state.showDeviceDetail = true
      state.showLogin = false
      state.headerTitle = '设备详情'
      state.headerType = false
    },
    showLoginPage (state) {
      state.showIndex = false
      state.showDeviceAdd = false
      state.showDeviceDetail = false
      state.showLogin = true
    }
  }
}

export default store
