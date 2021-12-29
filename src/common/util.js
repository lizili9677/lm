import store from '@/store'

export function getImageValidRegion (imageData) {
  const data = imageData.data
  const w = imageData.width, h = imageData.height
  // from 1
  const getIndex = function (row, col) {
    return (row - 1) * w * 4 + (col - 1) * 4
  }
  let sx = -1, sy = -1, sWidth = -1, sHeight = -1
  for (let i = 1; i <= h; i++) {
    for (let j = 1; j < w; j++) {
      if (data[getIndex(i, j) + 3] !== 0) {
        sy = i - 1
        break
      }
    }
    if (sy !== -1) {
      break
    }
  }
  for (let i = 1; i <= w; i++) {
    for (let j = 1; j <= h; j++) {
      if (data[getIndex(j, i) + 3] !== 0) {
        sx = i - 1
        break
      }
    }
    if (sx !== -1) {
      break
    }
  }
  for (let i = h; i >= 1; i--) {
    for (let j = 1; j <= w; j++) {
      if (data[getIndex(i, j) + 3] !== 0) {
        sHeight = i - sy
        break
      }
    }
    if (sHeight !== -1) {
      break
    }
  }
  for (let i = w; i >= 1; i--) {
    for (let j = 1; j <= h; j++) {
      if (data[getIndex(j, i) + 3] !== 0) {
        sWidth = i - sx
        break
      }
    }
    if (sWidth !== -1) {
      break
    }
  }
  return [sx, sy, sWidth, sHeight]
}

export function loadFile (path) {
  const request = new XMLHttpRequest()
  request.open('get', path)
  request.send(null)
  console.log('call loadFile')
  return new Promise((resolve, reject) => {
    request.onload = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          resolve(request.responseText)
        } else {
          reject('Load file ' + path + ' failed.')
        }
      }
    }
  })
}

/**
 * 由于部分图片会先使用 img 标签加载，由于一些（未查证）的机制，浏览器会在后面再次请求该图时服用之前的相应。
 * 由于在后续的使用中要求图片对象携带跨域属性，所以在此处增加一条随机 query 以强制重新请求，确保此处返回的响应携带跨域属性
 */
export function loadImageWithoutCache (path) {
  const img = new Image()
  img.crossOrigin = ''
  img.src = path + '?t=' + Math.random()
  return new Promise((resolve, reject) => {
    img.onload = (e) => {
      resolve(img)
    }
  })
}

export function asyncTest () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('async test')
    }, 1000)
  })
}

export async function genOutputImage (userData) {
  const images = Object.keys(userData).map(cTitle => {
    return {
      imageObj: null,
      index: userData[cTitle].pic.index,
      path: userData[cTitle].pic.path,
      id: userData[cTitle].pic.picId
    }
  })
  /*
  for (const item of images) {
      const imageObj = await loadImage(item.path)
      item.imageObj = imageObj
  }
  */
  // 暂时认为Global中缓存的预览图是正常尺寸的图
  for (const item of images) {
    if (store.getters.imageCache[item.id]) {
      item.imageObj = store.getters.imageCache[item.id]
    } else {
      item.imageObj = await loadImageWithoutCache(item.path)
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = images[0].imageObj.width
  canvas.height = images[0].imageObj.height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx?.fillRect(0, 0, canvas.width, canvas.height)
  images.sort((a, b) => a.index - b.index)
  for (const item of images) {
    if (item.imageObj) {
      ctx?.drawImage(item.imageObj, 0, 0)
    }
  }
  return canvas
}

export function isInEvilBrowser () {
  const ua = navigator.userAgent.toLowerCase()
  if (
    /micromessenger/g.test(ua) ||
    /weibo/g.test(ua) ||
    /qq/g.test(ua)
  ) {
    return true
  }
  return false
}

export function getAnPic (picId, path) {
  if (store.getters.imageCache[picId]) {
    return store.getters.imageCache[picId]
  }
  const imgObj = new Image()
  imgObj.crossOrigin = ''
  imgObj.src = path + '?t=' + Math.random()
  store.dispatch("global/setImageCache", imgObj)
  return imgObj
}

export function imageObjToBase64 (img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg');
}

export function loadCSS (url) {
  const head = document.getElementsByTagName('head')[0]
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  head.appendChild(link)
  return link
}

export function initGlobalState() {
  // 套娃
  return new Promise(resolve => {
    loadFile('/sources/root.json')
      .then(data => {
        const rootData = JSON.parse(data)
        store.dispatch('global/setRoot', rootData.root)
        const root = rootData.root

        loadFile(root + 'config.json?q=' + Math.random())
          .then(data => {
            store.dispatch('global/setConfig', JSON.parse(data))
            loadFile(root + 'metadata.json?q=' + Math.random())
              .then(data => {
                store.dispatch('global/setMetadata', JSON.parse(data))
                resolve()
              })
          })
      })
  })
}

export const saveImg = (blob, filename) => {
  // 兼容IE和EDGE无法打开Blob URL链接方法
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, fileanme)
  } else {
    let URL = window.URL || window.webkitURL;
    // 使用获取到的blob对象创建的blobUrl
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    if (typeof a.download === 'undefined') {
      window.location = blobUrl
    } else {
      document.body.appendChild(a)
      a.style.display = 'none'

      a.href = blobUrl;
      // 指定下载的文件名
      a.download = filename;
      a.click();
      document.body.removeChild(a)
      // 移除blob对象的blobUrl
      URL.revokeObjectURL(blobUrl);
    }
  }
}