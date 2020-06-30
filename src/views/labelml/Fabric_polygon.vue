<template>
  <div>
    <h1>Fabricjs之用Polyline画多边形</h1>
    <ul>
      <li @click="doDrawing = true"><el-button size="mini">多边形</el-button></li>
    </ul>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";

export default {
  name: "Fabric_Polyline",
  data() {
    return {
      canvas:null,
      drawWidth:2, //笔触宽度
      color:'rgb(211, 118, 146)', //画笔颜色
      fillColor:'rgba(0, 110, 255, 0.5)',

      doDrawing:false, // 绘制状态
      pointArray:new Array(),
      lineArray:new Array(),
      activeLine:null,
      activeShape:null,
    };
  },
  created() {
  },
  mounted() {
    this.initFabric()
  },
  methods: {
    initFabric() {
      // 用原生canvas元素创建一个fabric实例
      this.canvas = new fabric.Canvas("canvas");

      let cWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 250;
      let cheight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 150;
      this.canvas.setWidth(cWidth);
      this.canvas.setHeight(cheight);

      window.canvas = this.canvas;
      window.zoom = window.zoom ? window.zoom : 1;
      this.canvas.freeDrawingBrush.color = this.color; //设置自由绘颜色
      this.canvas.freeDrawingBrush.width = this.drawWidth;
      //绑定画板事件
      this.fabricObjAddEvent()
    },
    fabricObjAddEvent() {
      this.canvas.on({
        "mouse:down": options => {
          let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);

          // line多边形
          if(this.doDrawing){
            this.addPoint(options);
            if(options.target && options.target.id == this.pointArray[0].id){
                this.generatePolygon(this.pointArray);
            }
          }
        },
        "mouse:up": options => {
          let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);

          if(this.activeLine && this.activeLine.class == "line"){
                var pointer = canvas.getPointer(options.e);
                this.activeLine.set({ x2: pointer.x, y2: pointer.y });

                var points = this.activeShape.get("points");
                points[this.pointArray.length] = {
                    x:pointer.x,
                    y:pointer.y
                }
                this.activeShape.set({
                    points: points
                });
                this.canvas.renderAll();
            }
            this.canvas.renderAll();
        },
        'mouse:move': options => {},
        'selection:created': e => {
          this.doDrawing = false;
        },
      });
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    },
    // 多边形
    drawPolygon(arr){
      return new fabric.Polygon(arr, {
              fill: this.fillColor,
              stroke:'#333333',
              strokeWidth:1,
              opacity: 0.3,
              selectable: false,
              hasBorders: false,
              hasControls: false,
              evented: false
            })
    },
    // 直线
    drawLine(arr){
      return new fabric.Line(arr,{
              id:new Date().getTime(),
              fill: this.color,
              stroke: this.color,
              strokeWidth: 1,
              class:'line', 
              originX:'center',
              originY:'center',
              selectable: false,
              hasBorders: false,
              hasControls: false,
              evented: false
            })
    },
    // 圆
    drawCircle(point){
      return new fabric.Circle({
              id:new Date().getTime(),
              radius: 5,
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 0.5,
              left: (point.e.layerX/this.canvas.getZoom()),
              top: (point.e.layerY/this.canvas.getZoom()),
              selectable: false,
              hasBorders: false,
              hasControls: false,
              originX:'center',
              originY:'center'
            });
    },

    addPoint(options){
       //画圈
        var circle = this.drawCircle(options)
        // 画第一个圈设置不同的颜色
        if(this.pointArray.length == 0){
            circle.set({
                fill:'red'
            })
        }
        //画线
        var points = [(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom()),(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom())];
        var line = this.drawLine(points)

        if(this.activeShape){
            var pos = this.canvas.getPointer(options.e);
            var points = this.activeShape.get("points");
            points.push({
                x: pos.x,
                y: pos.y
            });
            // 画多边形并获取当前的多边形
            var polygon = this.drawPolygon(points);
            this.canvas.remove(this.activeShape);
            this.canvas.add(polygon);
            this.activeShape = polygon;
            this.canvas.renderAll();
        } else{
            // 画第一个多变形
            var polyPoint = [{x:(options.e.layerX/canvas.getZoom()),y:(options.e.layerY/canvas.getZoom())}];
            var polygon = this.drawPolygon(polyPoint);
            this.activeShape = polygon;
            canvas.add(polygon);
        }
        this.activeLine = line;

        this.pointArray.push(circle);
        this.lineArray.push(line);

        this.canvas.add(line);
        this.canvas.add(circle);
        this.canvas.selection = false;
    },
    generatePolygon(pointArray){
        var points = new Array();
        pointArray.forEach(point => {
          points.push({
                x:point.left,
                y:point.top
            });
            this.canvas.remove(point);
        });
        this.lineArray.forEach(line => {
            this.canvas.remove(line);
        });
        this.canvas.remove(this.activeShape).remove(this.activeLine);
        // 最终的多边形
        var polygon = this.drawPolygon(points);
        this.canvas.add(polygon);

        this.activeLine = null;
        this.activeShape = null;
        this.doDrawing = false;
        this.canvas.selection = true;
    },
    // 清除多余的组件
    delCL(){
      this.pointArray.forEach(point => {
        this.canvas.remove(point);
      });
      this.lineArray.forEach(line => {
        this.canvas.remove(line);
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#canvas {
  border: solid 1px;
}
ul{
  position: absolute;
  z-index: 10;
}
ul li{
  width: 100px;
  margin-top: 10px;
  list-style: none;
}
</style>
