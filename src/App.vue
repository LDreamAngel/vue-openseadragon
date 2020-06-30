<template>
<div id="app">
  <el-container style="height: 100%;">
    <Side />
    <div style="width:100%;">
      <HeadBar />
      <el-main>
        <router-view />
      </el-main>
    </div>
  </el-container>
</div>
</template>
<script>
import HeadBar from "@/components/HeadBar.vue";
import Side from "@/components/Side.vue";

export default {
  components: {
    HeadBar,
    Side
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
