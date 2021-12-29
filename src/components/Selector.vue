<template>
<!--  popup-->
  <popup :content="outputImage"></popup>
<!--  preview-->
  <div
    class="preview"
    :style="{
    width: '100%',
    position: 'relative',
    paddingTop: '100%'}"
  >
    <div
      v-for="item in userData"
      :key="item.pic.picId"
      :style="{
        zIndex:item.pic.index,
        position:'absolute',
        width: '100%',
        height: '100%',
        top:0,
        left:0}"
    >
      <img
        :src="item.pic.minipath ? item.pic.minipath: item.pic.path"
        :alt="item.pic.title"
        style="width:100%;height:100%"
      />
    </div>
  </div>
<!--  category-->
  <div class="category">
    <template v-for="ctitle in Object.keys(categoryData)" :key="ctitle">
      <div
        :class="(selectedCategory === ctitle? 'selected-category': '') + ' category-item'"
        :style="{width: width / 4 + 'px', height: width / 4 / 1.8 + 'px'}"
      >
        <img v-if="categoryData[ctitle].info.icon" :src="categoryData[ctitle].info.icon" alt=""/>
        <button @click="handleCategoryClick(ctitle)">{{ ctitle }}</button>
      </div>
    </template>
  </div>
<!--  items-->
  <items
    :user-data="userData"
    :selected-category="selectedCategory"
    :selected-item="u ? u.itemTitle: ''"
    :item-size="width / 3"
    @setUserData="setUserData"
  ></items>
<!--  download-->
  <button class="download-btn" @click="downloadOutputImage">下载</button>
</template>

<script>
import { genOutputImage, isInEvilBrowser, saveImg } from '@/common/util';
import Popup from '@/components/Popup'
import Items from '@/components/Items'
import ImageOnCanvas from '@/components/ImageOnCanvas'
export default {
  name: 'selector',
  components: {
    Popup,
    Items
  },
  props: {
    width: Number
  },
  data() {
    return {
      selectedCategory: '',
      userData: [],
      outputImage: null,
      categoryData: {}
    }
  },
  methods: {
    getInitialSelectedCategory() {
      return Object.keys(
        this.$store.getters.config.category
      ).find(title =>
        this.$store.getters.config.category[title].info.index === 1
      )
    },
    initUserData(root, categoryConfig, picsMetadata) {
      const res = {}
      Object.keys(categoryConfig).forEach(title => {
        const cData = categoryConfig[title]
        if (!cData.info.defaultPic) {
          return
        }
        const defaultId = cData.info.defaultPic
        res[title] = this.genSingleUserData(root, categoryConfig, picsMetadata, title, defaultId)
      })
      return res
    },
    setUserData(userData) {
      this.userData = userData
    },
    handleCategoryClick(ctitle) {
      this.selectedCategory = ctitle
    },
    getSelectedItem(title, picId) {
      const c = this.selectedCategory
      if (title === '') {
        delete this.userData[c]
        this.userData = {
          ...this.userData
        }
        return
      }
      if (this.userData[c] && this.userData[c].itemTitle === title) {return}
      this.userData = {
        ...this.userData,
        [c]: this.genSingleUserData(
          this.$store.getters.root,
          this.categoryData,
          this.$store.getters.metadata.data,
          c,
          picId
        )
      }
    },
    downloadOutputImage() {
      const imagep = genOutputImage(this.userData)
        if (isInEvilBrowser()) {
            imagep.then((canvas) => {
                canvas.toBlob((blob) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(blob)
                    reader.onload = (e) => {
                        this.setState({
                            outputImage: e.target?.result
                        })
                    }
                })
            })
        } else {
            imagep.then((canvas) => {
                canvas.toBlob(function (blob) {
                    console.log(blob)
                    saveImg(blob, 'output.png')
                })
            })
        }
    },
    genSingleUserData(root, categoryConfig, picsMetadata, categoryTitle, picId) {
      const _root = root
      const cData = categoryConfig[categoryTitle]
      const m = picsMetadata
      const picInfo = cData.items.find(e => e.pic.picId === picId)
      const d = m[picId]
      return {
        itemId: cData.items.findIndex(e => e.pic.picId === picId),
        itemTitle: picInfo.title,
        pic: {
          picId: picId,
          path: _root + d.path,
          miniPath: _root + (d.miniPath || d.path),
          position: picInfo.pic.defaultPosition,
          size: [100, 100],
          index: cData.info.index
        }
      }
    }
  },
  computed: {
      u() {
        return this.userData[this.selectedCategory]
      }
  },
  created() {
    this.categoryData = this.$store.getters.config.category
    this.selectedCategory = this.getInitialSelectedCategory()
    this.initUserData(
      this.$store.getters.root,
      this.categoryData,
      this.$store.getters.metadata.data
    )
    this.getSelectedItem = this.getSelectedItem.bind() // 我看不懂 但我大受震撼
  }
}
</script>

<style scoped>
.preview::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
