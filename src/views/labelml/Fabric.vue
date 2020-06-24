<template>
  <div>
    <h1 id="h1"></h1>
    <h2 @click="aaa()">1111</h2>
    <div id="wrap"></div>
    <!-- <canvas id="canvas"></canvas> -->
  </div>
</template>

<script>
import { fabric } from "fabric";
// import { Circle, Polygon } from "./airglass";
// import "./airglass";
// 画圈
let Circle = airglass.extend(airglass.Renderable, {
    _constructor: function (params) {
      this.path = null;
      this.x = params.x || 0;
      this.y = params.y || 0;
      this.size = params.size || 100;
    },
    updatePath: function () {
      let path = new Path2D;
      path.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
      this.path = path;
    },
    draw: function (ctx) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.line;
      ctx.fillStyle = this.fill;
      ctx.fill(this.path);
      ctx.stroke(this.path);
    }
  });
  
  // 画多边形
  let Polygon = airglass.extend(airglass.Renderable, {
    _constructor: function (params) {
      this.path = null;
      this.points = params.points || [];
    },
    updatePath: function () {
      let path = new Path2D;
      for (let i = 0; i < this.points.length; i++) {
        let point = this.points[i];
        if (i == 0) {
          path.moveTo(point.x, point.y);
          continue;
        }
        path.lineTo(point.x, point.y);
      }
      this.path = path;
    },
    addPoint: function (point) {
      this.points.push(point);
    },
    draw: function (ctx) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.line;
      ctx.fillStyle = this.fill;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fill(this.path);
      ctx.stroke(this.path);
    }
  });
   let ccc = {
     a:function () {
       console.log(222)
     }
    }
export default {
  name: "FabricBox",
  data() {
    return {
      tools: [
        {
          type: "rectangle",
          name: "矩形"
        },
        {
          type: "pen",
          name: "画笔"
        },
        {
          type: "polygon",
          name: "多边形"
        },
        {
          type: "text",
          name: "文字"
        }
      ],
      canvas: null,
      imageRenderer:null,
      polygonRenderer:null,
      controllerRenderer:null,

      preventDefault:null,
      lastEventPosition:null,
      lastTouchstartPosition:null,
      activeControllerPoint:null,
      activePolygon:null,
      currentPolygon:null,
      activeControllerPointPositionWhenTouchstart:null,
      currentGroupPoints:[],
      isDrawingPolygon:false,
      currentColor:'hsl(0, 100%, 50%)'
    };
  },
  created() {   },
  mounted() {
     this.getData();
    this.initFabric();

  },
  methods: {
    initFabric() {
      let DPR = window.devicePixelRatio;
      this.canvas = new airglass.Airglass({
        element: document.querySelector("#wrap"),
        width: 1000,
        height: 600,
        DPR: DPR
      });
      console.log('canvas',this.canvas)

      this.polygonRenderer = this.canvas.addRenderer();
      this.controllerRenderer = this.canvas.addRenderer();

      this.canvas.subscribers.push(this.agSubscribe);
      
    },

    agSubscribe(event, originEvent) {
      // console.log(event)
      originEvent.preventDefault();
      let type = event.type;

      let controllersContainPoint = this.controllerRenderer.getElementsContainPoint(event);
      let polygonsContainPoint = this.polygonRenderer.getElementsContainPoint(event);

      if (type == "touchstart") {
        touchstart: {
          this.lastTouchstartPosition = [event.x, event.y];
          // 初始化上次事件位置
          !this.lastEventPosition && (this.lastEventPosition = [event.x, event.y]);

          // 落在任意控制点上
          if (controllersContainPoint.length) {
            // 激活中的控制点 = 最上面的控制点
            this.activeControllerPoint =
              controllersContainPoint[controllersContainPoint.length - 1];
            // 记录下激活中的控制点touchstart时的位置
            this.activeControllerPointPositionWhenTouchstart = [
              this.activeControllerPoint.x,
              this.activeControllerPoint.y
            ];
            // 当前正在绘制多边形，还没有闭合多边形
            if (this.currentPolygon) {
              this.activePolygon = null;
              // 如果该控制点就是当前正在绘制的polygon的第一个控制点
              if (this.activeControllerPoint === this.currentPolygon.points[0]) {
                // 只执行一次
                // 正在绘制多边形的状态设置为false
                this.isDrawingPolygon = false;
                // 从外观上将多边形闭合
                this.currentPolygon.addPoint(this.currentPolygon.points[0]);
                this.currentPolygon.updatePath();
                // 设置一个标志，说明多边形已经闭合
                this.currentPolygon.__isPathClosed = true;
                // 清除激活中的多边形
                this.activePolygon = this.currentPolygon;
                // 结束绘制，清除当前正在绘制的多边形
                this.currentPolygon = null;
                // 重新渲染
                this.polygonRenderer.reRender();
                this.controllerRenderer.reRender();

                // drawClip();
              }
            }
            break touchstart;
          }

          // 落在任意多边形上
          if (polygonsContainPoint.length) {
            // 第一个击中的多边形
            let _activePolygon =
              polygonsContainPoint[polygonsContainPoint.length - 1];

            // 将这个多边形置于渲染器的最顶层
            this.polygonRenderer.scene.children.forEach((child, i) => {
              if (child == _activePolygon) {
                this.polygonRenderer.scene.children.splice(i, 1);
                this.polygonRenderer.scene.children.push(_activePolygon);
                this.polygonRenderer.reRender();

                // 击中的多边形已经完成闭合，即完成了绘制
                if (_activePolygon.__isPathClosed) {
                  this.activePolygon = _activePolygon;
                  this.currentPolygon = null;
                  // 当前没有绘制多边形
                  this.isDrawingPolygon = false;
                } else {
                  // 击中的多边形未闭合，即未完成了绘制
                  this.currentPolygon = _activePolygon;
                  this.activePolygon = null;
                  // 当前在绘制多边形
                  this.isDrawingPolygon = true;
                }
                this.controllerRenderer.scene.children = _activePolygon.points;
              }
            });

            // 渲染
            this.controllerRenderer.reRender();

            // drawClip();
            break touchstart;
          }

          // 既没有落在控制点 && 也没有落在多边形上

          // 激活中的控制点 = 新创建的控制点
          this.activeControllerPoint = new Circle({
            x: event.x,
            y: event.y,
            size: 8 * this.canvas.DPR,
            stroke: "transparent"
          });

          // 记录下激活中的控制点touchstart时的位置
          this.activeControllerPointPositionWhenTouchstart = [
            this.activeControllerPoint.x,
            this.activeControllerPoint.y
          ];

          // 如果存在当前正在绘制的
          if (this.currentPolygon) {
            // 将新创建的控制点添加到当前正在绘制的多边形中
            this.currentPolygon.addPoint(this.activeControllerPoint);
            this.currentPolygon.updatePath();
          } else {
            // 将新创建的激活中的控制点添加到临时的控制点组中
            this.currentGroupPoints.push(this.activeControllerPoint);
            // 控制点渲染器的场景中只显示正在绘制中的多边形的控制点
            this.controllerRenderer.scene.children = this.currentGroupPoints;
          }
          this.activeControllerPoint.updatePath();

          if (this.currentGroupPoints.length == 1) {
            this.isDrawingPolygon = true;
            this.currentGroupPoints[0].fill = this.currentColor;
            this.currentGroupPoints[0].line = 2 * this.canvas.DPR;
          }

          // 已经创建了第3个控制点
          if (this.currentGroupPoints.length == 3) {
            // 当前正在绘制的多边形 = 新创建的多边形
            let _fillStyle = this.currentColor.split("");
            _fillStyle.splice(_fillStyle.length - 1, 0, ", 0.2");
            _fillStyle.splice(3, 0, "a");

            this.currentPolygon = new Polygon({
              points: this.currentGroupPoints,
              fill: _fillStyle.join(""),
              stroke: this.currentColor,
              line: 4 * this.canvas.DPR
            });
            this.currentPolygon.updatePath();
            // 激活中的多边形置为null
            this.activePolygon = null;
            // 清空临时控制点组
            this.currentGroupPoints = [];
            // 向渲染多边形的渲染器场景中添加当前绘制的多边形
            this.polygonRenderer.scene.add(this.currentPolygon);
            // 渲染多边形
          }
          this.controllerRenderer.reRender();
          this.polygonRenderer.reRender();

          // drawClip();
        }
      }

      if (type == "touchmove") {
        touchmove: {
          // 移除重复的拖拽事件
          if (
            this.lastEventPosition[0] == event.x &&
            this.lastEventPosition[1] == event.y
          ) {
            break touchmove;
          }

          // 需要更新绘制激活中状态的多边形，则使用activePolygon
          // 需要更新绘制正在绘制中的多边形，则使用currentPolygon
          let _needUpdatePolygon = this.activePolygon || this.currentPolygon;
          // 优先拖拽控制点
          if (this.activeControllerPoint) {
            // 给激活中的控制点设置新的拖拽后的位置
            this.activeControllerPoint.x =
              this.activeControllerPointPositionWhenTouchstart[0] +
              event.x -
              this.lastTouchstartPosition[0];
            this.activeControllerPoint.y =
              this.activeControllerPointPositionWhenTouchstart[1] +
              event.y -
              this.lastTouchstartPosition[1];
            this.activeControllerPoint.updatePath();
            // 如果存在上方描述的两种多边形
            if (_needUpdatePolygon) {
              // 渲染需要更新绘制路径的多边形
              _needUpdatePolygon.updatePath();
            }
            // 渲染
            this.polygonRenderer.reRender();
            this.controllerRenderer.reRender();

            // drawClip();
            break touchmove;
          }

          // 拖拽多边形
          if (_needUpdatePolygon) {
            let offsetX = event.x - this.lastEventPosition[0];
            let offsetY = event.y - this.lastEventPosition[1];

            let pointsLength = _needUpdatePolygon.__isPathClosed
              ? _needUpdatePolygon.points.length - 1
              : _needUpdatePolygon.points.length;
            for (let i = 0; i < pointsLength; i++) {
              let point = _needUpdatePolygon.points[i];
              point.x = point.x + offsetX;
              point.y = point.y + offsetY;
              point.updatePath();
            }
            this.controllerRenderer.reRender();
            _needUpdatePolygon.updatePath();
            this.polygonRenderer.reRender();

            // drawClip();
          }
        }
      }

      if (type == "touchend") {
        touchend: {
          // 清除激活中的控制点
          this.activeControllerPoint = null;
        }
      }

      this.lastEventPosition = [event.x, event.y];
    },
    getData(){
        let h1 = document.getElementById('h1')
        console.log(h1)
        h1.innerHTML = `<span onclick = 'ccc.a()'>点击点击点击</span>`;

    },
    aaa(){
      console.log(1111)
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#canvas {
  border: solid 1px;
}
ul li {
  cursor: pointer;
}
</style>
