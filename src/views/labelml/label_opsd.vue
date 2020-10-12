<template>
  <div id="app">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside
        width="80px"
        style="height: 100%; background-color: rgb(238, 241, 246)"
      >
        <el-menu>
          <el-menu-item index="1">
            <template slot="title">
              <i
                class="el-icon-folder-opened"
                title="我是鼠标悬停时显示的内容"
              ></i>
            </template>
          </el-menu-item>
          <el-menu-item index="2">
            <template slot="title">
              <i class="el-icon-arrow-right"></i>
            </template>
          </el-menu-item>
          <el-menu-item index="3">
            <template slot="title">
              <i class="el-icon-arrow-left"></i>
            </template>
          </el-menu-item>
          <el-menu-item index="4">
            <template slot="title">
              <i class="el-icon-zoom-in" />
            </template>
          </el-menu-item>
          <el-menu-item index="5">保存</el-menu-item>
          <el-menu-item index="6" @click="drawPolygon()">创建</el-menu-item>
          <el-menu-item index="7">编辑</el-menu-item>
          <el-menu-item index="8" @click="delTarget()">删除</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <section id="appMain" ref="appMain" :style="{ height: cheight + 'px' }">
            <div id="toolbarDiv"></div>
          </section>

          <context-menu
            class="right-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            @update:show="(show) => (contextMenuVisible = show)"
          >
            <a href="javascript:void(0);" @click="copyMsg">复制</a>
            <a href="javascript:void(0);" @click="delTarget">删除</a>
          </context-menu>
        </el-main>
      </el-container>
    </el-container>
    <!-- <right-panel /> -->
  </div>
</template>

<script>
// import RightPanel from "@/components/RightPanel";
// 鼠标右键事件（局部注入）
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import OpenSeadragon from "openseadragon";
import "@/utils/openseadragon-fabricjs-overlay";
import { fabric } from "fabric";

let overlay;
var min = 99;
var max = 999999;
var polygonMode = false;
// 点的数组
var pointArray = new Array();
// 线的数组
var lineArray = new Array();
var arr = new Array();
var activeLine;
var activeShape = false;

export default {
  name: "Layout",
  // components: { RightPanel },
  components: {
    'context-menu': VueContextMenu
  },
  data() {
    return {
      // contextMenuTarget: document.body, //绑定的dom
      contextMenuTarget: null, //绑定的dom
      contextMenuVisible: false,
      viewer: null,
      overlay: null,
      options: {
        id: "appMain",
        constrainDuringPan: true,
        showNavigator: true,
        toolbar: "toolbarDiv",
        // debugMode : true, //开启调试模式
      },
      cheight: null,
      scale: 1000,
    };
  },
  mounted() {
    this.cheight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 44;
    this.contextMenuTarget = this.$refs.appMain
    this.init();
  },
  methods: {
    init() {
      this.viewer = OpenSeadragon(this.options);

      this.viewer.addTiledImage({
        prefixUrl: "./images/",
        tileSource: {
          type: "image",
          url: require("@/assets/image-small.jpg"),
          minLevel: 0.125,
        },
      });

      console.log(this.viewer);

      overlay = this.viewer.fabricjsOverlay({ scale: this.scale });

      this.getPoint();

      window.onresize = () => {
        overlay.resize();
        overlay.resizecanvas();
      };
    },
    drawPolygon() {
      this.viewer.gestureSettingsMouse.clickToZoom = false;
      this.viewer.gestureSettingsMouse.scrollToZoom = false;
      this.viewer.panHorizontal = false;
      this.viewer.panVertical = false;

      polygonMode = true;
      pointArray = new Array();
      lineArray = new Array();
      arr = new Array();
      activeLine;
      activeShape;
    },

    getPoint() {
      let p = this.scale / 3238;
      // let sourceWidth = this.viewer.source.width;
      // let p = this.scale / sourceWidth;

      this.viewer.addHandler("canvas-press", (event) => {
        var webPoint = event.position;
        var viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        var imagePoint = this.viewer.viewport.viewportToImageCoordinates(
          viewportPoint
        );
        if (
          arr.length > 1 &&
          this.pointInsideCircle(imagePoint, arr[0], 50 * p)
        ) {
          this.generatePolygon(pointArray);
        }
        if (polygonMode) {
          this.addPoint(imagePoint);
        }
      });

      new OpenSeadragon.MouseTracker({
        element: "appMain",
        moveHandler: (event) => {
          var webPoint = event.position;
          var viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
          var imagePoint = this.viewer.viewport.viewportToImageCoordinates(
            viewportPoint
          );
          if (activeLine && activeLine.class == "line") {
            activeLine.set({
              x2: imagePoint.x * p,
              y2: imagePoint.y * p,
            });

            var points = activeShape.get("points");
            points[pointArray.length] = {
              x: imagePoint.x * p,
              y: imagePoint.y * p,
            };
            activeShape.set({
              points: points,
            });
            overlay.fabricCanvas().renderAll();
          }
          overlay.fabricCanvas().renderAll();
        },
      });
    },

    addPoint(options) {
      //画圈
      var circle = this.creatCircle(options);
      // 画第一个圈设置不同的颜色
      if (pointArray.length == 0) {
        circle.set({
          fill: "red",
        });
      }
      //画线
      let sourceWidth = this.viewer.source.width;
      let p = this.scale / sourceWidth;
      var points = [options.x * p, options.y * p, options.x * p, options.y * p];
      var line = this.creatLine(points);

      if (activeShape) {
        var points = activeShape.get("points");
        points.push({
          x: options.x * p,
          y: options.y * p,
        });
        // 画多边形并获取当前的多边形
        var polygon = this.creatPolygon(points);
        overlay.fabricCanvas().remove(activeShape);
        overlay.fabricCanvas().add(polygon);
        activeShape = polygon;
        overlay.fabricCanvas().renderAll();
      } else {
        // 画第一个多变形
        var polyPoint = [
          {
            x: options.x * p,
            y: options.y * p,
          },
        ];
        var polygon = this.creatPolygon(polyPoint);
        activeShape = polygon;
        overlay.fabricCanvas().add(polygon);
      }
      activeLine = line;

      pointArray.push(circle);
      arr.push(options);
      lineArray.push(line);

      overlay.fabricCanvas().add(line);
      overlay.fabricCanvas().add(circle);
      // overlay.fabricCanvas().selection = false;
    },
    generatePolygon(pointArray) {
      var points = new Array();
      pointArray.forEach((point) => {
        points.push({
          x: point.left,
          y: point.top,
        });
        overlay.fabricCanvas().remove(point);
      });
      lineArray.forEach((line) => {
        overlay.fabricCanvas().remove(line);
      });
      overlay.fabricCanvas().remove(activeShape).remove(activeLine);
      var polygon = this.creatPolygon(points);
      // polygon.set({ selectable: true, evented: true });

      overlay.fabricCanvas().add(polygon);

      activeLine = null;
      activeShape = null;
      polygonMode = false;
      // overlay.fabricCanvas().selection = true;
    },
    creatPolygon(points) {
      return new fabric.Polygon(points, {
        stroke: "#333333",
        strokeWidth: 0.5,
        fill: "rgb(0, 110, 255)",
        opacity: 0.5,
        // selectable: false,
        // hasBorders: false,
        // hasControls: false,
        // evented: false
      });
    },
    creatLine(points) {
      return new fabric.Line(points, {
        strokeWidth: 2,
        fill: "#999999",
        stroke: "#999999",
        class: "line",
        originX: "center",
        originY: "center",
        // selectable: false,
        // hasBorders: false,
        // hasControls: false,
        // evented: false
      });
    },
    creatCircle(options) {
      var random = Math.floor(Math.random() * (max - min + 1)) + min;
      var id = new Date().getTime() + random;
      let sourceWidth = this.viewer.source.width;
      return new fabric.Circle({
        radius: (12 * this.scale) / sourceWidth,
        fill: "green",
        stroke: "#333333",
        strokeWidth: 1,
        left: (options.x * this.scale) / sourceWidth,
        top: (options.y * this.scale) / sourceWidth,
        // selectable: false,
        // hasBorders: false,
        // hasControls: false,
        originX: "center",
        originY: "center",
        id: id,
      });
    },
    // 判断是否闭合成了一个多边形
    pointInsideCircle(point, circle, r) {
      if (r === 0 || circle == undefined) return false;
      var dx = circle.x - point.x;
      var dy = circle.y - point.y;
      return dx * dx + dy * dy <= r * r;
    },
    // 删除选中的图像
    delTarget() {
      console.log(1111);
      overlay.fabricCanvas().on({
        "object:moved": (e) => {
          console.log("created:", e);
          //  overlay.fabricCanvas().remove(e.target);
        },
      });
      // if (this.delIndex) {
      //   this.canvas.remove(this.delIndex);
      // } else {
      //   this.$message.warning("请先选择要删除的图像");
      // }
    },
    copyMsg(){

    }
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#appMain {
  /* 50= navbar  50  */
  // min-height: 100%;
  width: 100%;
  //   overflow: hidden;
  border: solid 1px red;
}
#toolbarDiv {
  display: none;
}

.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  display: block;
  font-family: Microsoft Yahei, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
  a {
    padding: 2px 15px;

    // width: 120px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
    font-size: 14px;
    text-decoration: none;
  }
  user agent stylesheet a:-webkit-any-link {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
  }
  a:hover {
    background: #42b983;
    color: #fff;
  }
}
</style>
