<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script>
import {ref} from "vue";
import {getImageValidRegion} from "@/common/util";
export default {
  name: 'imageOnCanvas',
  props: {
    imageObjs: Array, // HtmlImageElement[]
    canvasSize: Array, // [Number, Number]
    border: Number
  },
  setup() {
    let canvas = ref(null)
    return {canvas}
  },
  data() {
    return {
      canvasObj: null
    }
  },
  methods: {
    draw(imageObj) {
      const imageW = imageObj.width
      const imageH = imageObj.height
      const [canvasW, canvasH] = this.canvasSize
      const border = this.border
      this.canvasObj.width = canvasW
      this.canvasObj.height = canvasH
      let ctx
      ctx = this.canvasObj.getContext('2d')
      ctx.drawImage(imageObj, 0, 0, canvasW, canvasH)
      const [sx, sy, sWidth, sHeight] = getImageValidRegion(ctx.getImageData(0, 0, canvasW, canvasH))
      ctx.clearRect(0, 0, canvasW, canvasH)
      let canvasRegion
      if (sWidth > sHeight) {
        canvasRegion = [
          border,
          (canvasH - (canvasW - 2 * border) / sWidth * sHeight) / 2,
          canvasW - 2 * border,
          (canvasW - 2 * border) / sWidth * sHeight
        ]
      } else {
        canvasRegion = [
          (canvasW - (canvasH - 2 * border) / sHeight * sWidth) / 2,
          border,
          (canvasH - 2 * border) / sHeight * sWidth,
          canvasH - 2 * border
        ]
      }
      ctx.drawImage(
        imageObj,
        sx / canvasW * imageW,
        sy / canvasH * imageH,
        sWidth / canvasW * imageW,
        sHeight / canvasH * imageH,
        ...canvasRegion
      )
    }
  },
  mounted() {
    this.canvasObj = this.$refs.canvasRef
    this.imageObjs.forEach(o => {
      try {
        this.draw(o)
      } catch (err) {
        console.error(err)
      }
    })
  }
}
</script>
