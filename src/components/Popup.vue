<template>
  <div style="position: relative">
    <div class="popup" :class="content===null?'hidden':'visible'">
      <img v-if="content" style="width: 100%" :src="content" alt=""/>
      <div v-else></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popup',
  props: {
    content: {
      type: String,
      default: null
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.popup {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}
.hidden {
  visibility: hidden;
}
.visible {
  visibility: visible;
}
</style>
