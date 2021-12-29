<template>
  <div>
    <div class="main">
      <div class="container">
        <header class="header"></header>
        <div class="body">
          <Selector :width="width > 400 ? 400 * .094 : (width < 330 ? 330 * 0.94 : width)"></Selector>
          <p class="warning" v-if="isInEvilBrowser()">温馨提示：你当前在APP内置浏览器中，若想保存图片请点击下载按钮后长按上方预览区保存</p>
          <p class="warning" v-else>{{ footer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Selector from '@/components/Selector'
// import {isInEvilBrowser} from "@/common/util";
export default {
  name: 'main1',
  components: {
    Selector
  },
  data() {
    return {
      width: 0,
      config: {},
      metadata: {}
    }
  },
  computed: {
    footer() {
      return this.$store.getters.config.info.interface.footerText
    }
  },
  methods: {
    isInEvilBrowser() {
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
  },
  created () {
    this.width = document.body.clientWidth * 0.7 * 0.4
  }
}
</script>

<style>
.main {
  width: 100%
}
.container {
  margin: 0 auto;
  width: 70%;
  max-width: 400px;
  min-width: 33px;
  padding: 4%
}
</style>
