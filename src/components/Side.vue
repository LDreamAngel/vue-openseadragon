<template>
  <div>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu>
        <div v-for="(i,index) in routes" :key="index">

          <el-submenu index="1" v-if="i.children">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{i.name}}</span>
            </template>
            <el-menu-item v-for="(el,idx) in i.children" :key="idx" :index="idx+''">
              <router-link :to="el.path" tag="p">{{el.name}}</router-link>
            </el-menu-item>
          </el-submenu> 

          <el-menu-item :index="index+''" v-else>
            <router-link :to="i.path" tag="p">{{i.name}}</router-link>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  name: "Side",
  props: {},
  data() {
    return {
    };
  },
  created() {
  },
  computed: {
    routes() {
      return this.$router.options.routes
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.el-aside {
  color: #333;
}
</style>
