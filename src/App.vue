<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/openseadragon">Openseadragon</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created(){
    this.initWebpack()
  },
  methods: {
    initWebpack() {
      //初始化websocket
      const wsuri = "https://api.hz.be-yes.com/api/v1/authorizations";
      this.websock = new WebSocket(wsuri); //这里面的this都指向vue
      this.websock.onopen = this.websocketopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
      this.websock.onerror = this.websocketerror;
    },
    websocketopen() {
      //打开
      console.log("WebSocket连接成功");
    },
    websocketonmessage(e) {
      //数据接收
      console.log(e);
      this.productinfos = JSON.parse(e.data);
    },
    websocketclose() {
      //关闭
      console.log("WebSocket关闭");
    },
    websocketerror() {
      //失败
      console.log("WebSocket连接失败");
    }
  }
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

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
