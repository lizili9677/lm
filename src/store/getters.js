const getters = {
  config: state => JSON.parse(state.global.config),
  metadata: state => JSON.parse(state.global.metadata),
  root: state => state.global.root,
  imageCache: state => JSON.parse(state.global.imageCache)
}

export default getters
