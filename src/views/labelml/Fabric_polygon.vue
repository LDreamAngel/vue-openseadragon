<template>
  <div>
    <h1>Fabricjs之用Polyline画多边形</h1>
    <ul>
      <li><el-button size="mini" @click="startDraw()">多边形</el-button></li>
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
      polygonMode:false, // 绘制状态
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

      fabric.Image.fromURL(require('@/assets/image-small.jpg'), function(img) {
        let p2 =  canvas.height/img.height
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas),{
          left: (canvas.width/p2 - img.width)/2,
            top: 0,
        });
        canvas.setZoom(p2) 
      });

      //绑定画板事件
      this.fabricObjAddEvent()
    },
    startDraw() {
        this.polygonMode = true;
        this.pointArray = new Array();
        this.lineArray = new Array();
        this.activeLine;

    },
    fabricObjAddEvent() {
      this.canvas.on({
        "mouse:down": options => {
          console.log('options',options)
          // line多边形
          if(options.target && options.target.id == this.pointArray[0].id){
            this.generatePolygon(this.pointArray);
          }
          if(this.polygonMode){
            this.addPoint(options);
          }
        },
        'mouse:move': options => {
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
        }
      });
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
              strokeWidth: 5,
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
              radius: 10,
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 5,
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
        this.polygonMode = false;
        this.canvas.selection = true;
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
  z-index: 100;
}
ul li{
  width: 100px;
  margin-top: 10px;
  list-style: none;
}
</style>
