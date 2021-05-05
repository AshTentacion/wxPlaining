import VueX from 'vuex'
import Vue from 'vue'
import basicStore from './Basic'
import userStore from './User'
import dataStore from './Data'

Vue.use(VueX)
const store = new VueX.Store({
  modules: {
    basicStore,
    userStore,
    dataStore
  }
})

export default store
