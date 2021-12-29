<template>
  <div :style="{width: size + 'px', height: size + 'px'}">
    <!-- <image-on-canvas :image-objs="[imageObj]" :canvas-size="[size,size]" :borde="5"/> -->
    <img :src="path" :width="size" :height="size" />
  </div>
</template>

<script>
import {getAnPic} from "@/common/util";
import ImageOnCanvas from './ImageOnCanvas'

export default {
  name: 'item',
  // components: {
  //   ImageOnCanvas
  // },
  props: {
    path: String,
    size: Number,
    picId: String
  },
  data() {
    return {
      imageObj: null
    }
  },
  created() {
    this.imageObj = getAnPic(this.picId, this.path)
  }
}
</script>

<style scoped>
</style>
