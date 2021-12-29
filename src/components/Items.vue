<template>
  <div class="items">
    <template v-for="item in itemsData" :key="item.pic.picId">
      <div v-if="item.pic.picId" class="item ">
        <div
          @click="onItemClicked(item.title, item.pic.picId)"
          :class="selectedItem === item.title ? 'selected-item': ''"
          >
          <Item
            :size="itemSize"
            :path="_root + (picsMetadata[item.pic.picId].miniPath || picsMetadata[item.pic.picId].path)"
            :picId="item.pic.picId"
          ></Item>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Item from "@/components/Item";
export default {
  name: 'items',
  components: {Item},
  props: {
    userData: Array,
    selectedItem: String,
    selectedCategory: String,
    itemSize: Number
  },
  methods: {
    // onItemClicked(title, id) {
    //   this.handleOutput(title, id)
    // },
    onItemClicked(title, picId) {
      const c = this.selectedCategory
      if (title === '') {
        delete this.userData[c]
        this.$emit('setUserData', ...this.userData)
        return
      }
      if (this.userData[c] && this.userData[c].itemTitle === title) {return}
      this.$emit('setUserData', {
        ...this.userData,
        [c]: this.genSingleUserData(
          this.$store.getters.root,
          this.$store.getters.config.category,
          this.$store.getters.metadata.data,
          c,
          picId
        )
      })
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
    _root() {
      return this.$store.getters.root
    },
    curCateData() {
      return this.$store.getters.config.category[this.selectedCategory]
    },
    picsMetadata() {
      return this.$store.getters.metadata.data
    },
    itemsData() {
      let itemsData = this.curCateData.items.slice()
      if (this.curCateData.info.allowBlank) {
        itemsData.unshift({
          title: '',
          pic: {
            picId: '',
            defaultPosition: [0, 0]
          }
        })
      }
      return itemsData
    }
  }
}
</script>
