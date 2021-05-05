const store = {
  state: {
    userInfo: {}
  },
  mutations: {
    changeUserInfo (state, info) {
      state.userInfo = info
    }
  }
}
export default store
