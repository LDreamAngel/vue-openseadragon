<template>
  <div id="app">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="80px" style="height:100%;background-color: rgb(238, 241, 246)">
        <el-menu>
          <el-menu-item index="1">
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
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
          <el-menu-item index="4" @click="zoom()">
            <template slot="title">
              <i class="el-icon-zoom-in" />
            </template>
          </el-menu-item>
          <el-menu-item index="5">保存</el-menu-item>
          <el-menu-item index="6" @click="select()">选中</el-menu-item>
          <el-menu-item index="7" @click="startDraw()">创建</el-menu-item>
          <el-menu-item index="8" @click="Edit()">编辑</el-menu-item>
          <el-menu-item index="9">删除</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <section id="appMain" :style="{height: cheight+'px'}">
            <div id="toolbarDiv"></div>
          </section>
        </el-main>
      </el-container>
    </el-container>
    <!-- <right-panel /> -->
  </div>
</template>

<script>
// import RightPanel from "@/components/RightPanel";

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
var activeLine;
var activeShape = false;

export default {
  name: "Layout",
  // components: { RightPanel },
  data() {
    return {
      viewer: null,
      options: {
        id: "appMain",
        constrainDuringPan: true,
        showNavigator: false,
        toolbar: "toolbarDiv"
        // debugMode : true, //开启调试模式
      },
      cheight: null,
      scale: 1000
    };
  },
  mounted() {
    this.cheight =
      (window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight) - 44;
    this.init();
  },
  methods: {
    init() {
      this.viewer = OpenSeadragon(this.options);

      this.viewer.addTiledImage({
        prefixUrl: "./images/",
        tileSource: {
          type: "image",
          url: require("@/assets/image-small.jpg")
          // url: require("@/assets/test-l.jpg"),
          // url: require("@/assets/logo.png"),
          // minLevel: 0.125
        }
      });

      overlay = this.viewer.fabricjsOverlay({ scale: this.scale });
      this.fabricObjAddEvent();

      window.onresize = () => {
        overlay.resize();
        overlay.resizecanvas();
      };
    },
    startDraw() {
      polygonMode = true;
      pointArray = new Array();
      lineArray = new Array();
      activeLine;

      this.viewer.setMouseNavEnabled(false);
      this.viewer.outerTracker.setTracking(false);
    },
    zoom() {
      this.viewer.setMouseNavEnabled(true);
      this.viewer.outerTracker.setTracking(true);
    },
    fabricObjAddEvent() {
      overlay.fabricCanvas().on({
        "mouse:down": options => {
          // line多边形
          if (options.target && options.target.id == pointArray[0].id) {
            this.generatePolygon(pointArray);
          }
          if (polygonMode) {
            this.addPoint(options);
          }
        },
        "mouse:move": options => {
          if (activeLine && activeLine.class == "line") {
            var pointer = overlay.fabricCanvas().getPointer(options.e);
            activeLine.set({ x2: pointer.x, y2: pointer.y });

            var points = activeShape.get("points");
            points[pointArray.length] = {
              x: pointer.x,
              y: pointer.y
            };
            activeShape.set({
              points: points
            });
            overlay.fabricCanvas().renderAll();
          }
          overlay.fabricCanvas().renderAll();
        }
      });
    },
    select() {
      this.viewer.setMouseNavEnabled(false);
      this.viewer.outerTracker.setTracking(false);

      overlay.fabricCanvas().on({
        "selection:created": options => {
          console.log("options", options);
        }
      });
    },
    // 多边形
    drawPolygon(arr) {
      return new fabric.Polygon(arr, {
        fill: "rgb(0, 110, 255)",
        stroke: "#333333",
        strokeWidth: 2,
        opacity: 0.3,
        // objectCaching: false,
        // transparentCorners: false,
        // selectable: false,
        // hasBorders: false,
        // hasControls: false,
        evented: false
      });
    },
    // 直线
    drawLine(arr) {
      return new fabric.Line(arr, {
        id: new Date().getTime(),
        stroke: this.color,
        strokeWidth: 2,
        class: "line",
        originX: "center",
        originY: "center",
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false
      });
    },
    // 圆
    drawCircle(point) {
      var brect = overlay._canvasdiv.getBoundingClientRect();
      var zoom = overlay.fabricCanvas().getZoom();
      var vp = this.viewer.viewport.viewportToWindowCoordinates(
        new OpenSeadragon.Point(0, 0)
      );

      return new fabric.Circle({
        id: new Date().getTime(),
        radius: 5,
        fill: "#ffffff",
        stroke: "#333333",
        strokeWidth: 1,
        left: (point.e.layerX + brect.x - vp.x) / zoom,
        top: (point.e.layerY + brect.y - vp.y) / zoom,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: "center",
        originY: "center"
      });
    },

    addPoint(options) {
      var brect = overlay._canvasdiv.getBoundingClientRect();
      var zoom = overlay.fabricCanvas().getZoom();
      var vp = this.viewer.viewport.viewportToWindowCoordinates(
        new OpenSeadragon.Point(0, 0)
      );
      //画圈
      var circle = this.drawCircle(options);
      // 画第一个圈设置不同的颜色
      if (pointArray.length == 0) {
        circle.set({
          fill: "red"
        });
      }
      //画线

      var points = [
        (options.e.layerX + brect.x - vp.x) / zoom,
        (options.e.layerY + brect.y - vp.y) / zoom,
        (options.e.layerX + brect.x - vp.x) / zoom,
        (options.e.layerY + brect.y - vp.y) / zoom
      ];
      var line = this.drawLine(points);

      if (activeShape) {
        var pos = overlay.fabricCanvas().getPointer(options.e);
        var points = activeShape.get("points");
        points.push({
          x: pos.x,
          y: pos.y
        });
        // 画多边形并获取当前的多边形
        var polygon = this.drawPolygon(points);
        overlay.fabricCanvas().remove(activeShape);
        overlay.fabricCanvas().add(polygon);
        activeShape = polygon;
        overlay.fabricCanvas().renderAll();
      } else {
        // 画第一个多变形
        var polyPoint = [
          {
            x: (options.e.layerX + brect.x - vp.x) / zoom,
            y: (options.e.layerY + brect.y - vp.y) / zoom
          }
        ];
        var polygon = this.drawPolygon(polyPoint);
        activeShape = polygon;
        overlay.fabricCanvas().add(polygon);
      }

      activeLine = line;

      pointArray.push(circle);
      lineArray.push(line);

      overlay.fabricCanvas().add(line);
      overlay.fabricCanvas().add(circle);
      overlay.fabricCanvas().selection = false;
    },
    generatePolygon(pointArray) {
      var points = new Array();
      pointArray.forEach(point => {
        points.push({
          x: point.left,
          y: point.top
        });
        overlay.fabricCanvas().remove(point);
      });
      lineArray.forEach(line => {
        overlay.fabricCanvas().remove(line);
      });
      overlay
        .fabricCanvas()
        .remove(activeShape)
        .remove(activeLine);
      // 最终的多边形
      var polygon = this.drawPolygon(points);
      overlay.fabricCanvas().add(polygon);

      activeLine = null;
      activeShape = null;
      polygonMode = false;
      overlay.fabricCanvas().selection = true;
      // this.viewer.setMouseNavEnabled(false);
      // this.viewer.outerTracker.setTracking(false);
    },

    actionHandler(eventData, transform, x, y) {
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(
          new fabric.Point(x, y),
          "center",
          "center"
        ),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x:
            (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
            polygon.pathOffset.x,
          y:
            (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
            polygon.pathOffset.y
        };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      return true;
    },
    anchorWrapper(anchorIndex, fn) {
      return function(eventData, transform, x, y) {
        var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint(
            {
              x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
              y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
            },
            fabricObject.calcTransformMatrix()
          ),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = fabricObject._getNonTransformedDimensions(),
          newX =
            (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
            polygonBaseSize.x,
          newY =
            (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
            polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      };
    },
    Edit() {
      // clone what are you copying since you
      // may want copy and paste on different moment.
      // and you do not want the changes happened
      // later to reflect on the copy.
      var poly = overlay.fabricCanvas().getObjects()[0];
      poly.set({ evented: true });

      var translatedPoints = poly.get("points");
      overlay.fabricCanvas().setActiveObject(poly);
      poly.edit = !poly.edit;
      if (poly.edit) {
        var lastControl = poly.points.length - 1;
        poly.cornerStyle = "circle";
        poly.cornerColor = "rgba(0,0,255,0.5)";
        var _this = this;
        poly.controls = poly.points.reduce(function(acc, point, index) {
          acc["p" + index] = new fabric.Control({
            positionHandler: function(dim, finalMatrix, fabricObject) {
              var x =
                  fabricObject.points[this.pointIndex].x -
                  fabricObject.pathOffset.x,
                y =
                  fabricObject.points[this.pointIndex].y -
                  fabricObject.pathOffset.y;
              return fabric.util.transformPoint(
                { x: x, y: y },
                fabric.util.multiplyTransformMatrices(
                  fabricObject.canvas.viewportTransform,
                  fabricObject.calcTransformMatrix()
                )
              );
            },
            actionHandler: _this.anchorWrapper(
              index > 0 ? index - 1 : lastControl,
              _this.actionHandler
            ),
            actionName: "modifyPolygon",
            pointIndex: index
          });
          return acc;
        }, {});
      } else {
        poly.cornerColor = "blue";
        poly.cornerStyle = "rect";
        poly.controls = fabric.Object.prototype.controls;
      }
      poly.hasBorders = !poly.edit;
      overlay.fabricCanvas().requestRenderAll();
    }
  }
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
</style>
