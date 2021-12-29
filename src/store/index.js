import Vuex from 'vuex'
import global from './modules/global'
import getters from './getters'

const store = new Vuex.Store({
  modules: {
    global
  },
  getters
})

export default store
