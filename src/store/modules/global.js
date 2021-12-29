const initDefaultState = () => {
  return {
    config: JSON.stringify({}),
    metadata: JSON.stringify({}),
    root: '',
    imageCache: JSON.stringify({
      pidId: null
    })
  }
}

const state = initDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, initDefaultState())
  },
  SET_CONFIG: (state, config) => {
    state.config = config
  },
  SET_METADATA: (state, metadata) => {
    state.metadata = metadata
  },
  SET_ROOT: (state, root) => {
    state.root = root
  },
  SET_IMAGECACHE: (state, cache) => {
    state.imageCache = cache
  }
}

const actions = {
  setConfig({commit}, config) {
    commit('SET_CONFIG', JSON.stringify(config))
  },
  setMetadata({commit}, metadata) {
    commit('SET_METADATA',JSON.stringify(metadata))
  },
  setRoot({commit}, root) {
    commit('SET_ROOT', root)
  },
  setImageCache({commit}, imageCache) {
    commit('SET_IMAGECACHE', JSON.stringify(imageCache))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
