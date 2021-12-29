<template>
  <ul class="router-container">
    <router-link to="linmo" class="router-item">
      <li class="link">
        捏脸
      </li>
    </router-link>
    <router-link to="404" class="router-item">
      <li class="link">
        一些没有什么意义的占位符
      </li>
    </router-link>
    <router-link to="404" class="router-item">
      <li class="link">
        一些没有什么意义的占位符
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {

    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.router-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  width: 100%;
  height: 100%;
}
.router-item {
  padding: 10px;
  border-radius: 15px;
  list-style: none;
  background-color: #F0F8EB;
  margin-bottom: 60px;
  font-size: 30px;
  border: 1px solid #67C23A;
  &:hover {
    background-color: #67C23A;
    color: whitesmoke!important;
  }
  &:link {
    text-decoration: none;
    color: #67C23A;
  }
  &:visited {
    text-decoration: none;
    color: #67C23A;
  }
}
</style>
