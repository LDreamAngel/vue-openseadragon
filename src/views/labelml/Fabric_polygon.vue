<template>
  <div>
    <h1>fabricjs</h1>
    <ul>
      <li v-for="i in tools" :key="i.type" @click="getType(i.type)">{{i.name}}</li>
      <li @click="delTarget()">删除</li>
    </ul>
    <canvas id="canvas" width="1000" height="600"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";

export default {
  name: "FabricBox",
  data() {
    return {
      tools:[{
        type:'rectangle',
        name:'矩形'
      },{
        type:'pen',
        name:'画笔'
      },{
        type:'polygon',
        name:'多边形'
      },{
        type:'text',
        name:'文字'
      }],
      canvas:null,
      mouseFrom:{},
      mouseTo:{},
      drawType:'rectangle',
      // canvasObjectIndex:0,
      textbox:null,
      drawWidth:2, //笔触宽度
      color:'rgb(211, 118, 146)', //画笔颜色
      fillColor:'rgba(0, 110, 255, 0.5)',
      drawingObject:null, //当前绘制对象
      moveCount:1, //绘制移动计数器
      doDrawing:false, // 绘制状态
      delIndex:null,//删除目标
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
          this.mouseFrom.x = xy.x;
          this.mouseFrom.y = xy.y;
          // line多边形
          if(this.doDrawing && this.drawType =='polygon'){
            if(options.target && options.target.id == this.pointArray[0].id){
                this.generatePolygon(this.pointArray);
            }
            if(this.doDrawing){
              this.addPoint(options);
            }
          }
        },
        "mouse:up": options => {
          let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
          this.mouseTo.x = xy.x;
          this.mouseTo.y = xy.y;
          // 矩形
          if(this.doDrawing && this.drawType =='rectangle'){
            this.canvas.add(this.drawRect(this.mouseFrom,this.mouseTo))
          }

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
          // if (e.target._objects) {
          //   //多选删除
          //   var etCount = e.target._objects.length;
          //   for (var etindex = 0; etindex < etCount; etindex++) {
          //     this.canvas.remove(e.target._objects[etindex]);
          //   }
          // } else {
          //   //单选删除
          //   this.canvas.remove(e.target);
          // }
          this.doDrawing = false;
          this.delIndex = e.target;
        },
      });
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    },
    // 矩形
    drawRect(from,to){
      let path = `M ${from.x} ${from.y} L ${to.x} ${from.y} L ${to.x} ${to.y} L ${from.x} ${to.y} z`
      return new fabric.Path(path,{
              stroke: this.color,
              fill: this.fillColor,
              strokeWidth: this.drawWidth
            });
    },
    // 折线
    drawPolyline(arr){
      return new fabric.Polyline(arr, {
              stroke: this.color,
              fill: this.fillColor,
            })
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


    // 获取要画的类型
    getType(type){
      this.doDrawing = true;
      this.drawType = type;

      this.polygonMode = null;
      this.pointArray = new Array();
      this.lineArray = new Array();
      this.activeLine = null;
    },
    // 删除选中的图像
    delTarget(){
      if(this.delIndex){
        this.canvas.remove(this.delIndex);
      }else{
        this.$message.warning('请先选择要删除的图像');
      }
    },
    // 判断是否闭合成了一个多边形
    pointInsideCircle(point, circle, r) {
        if (r===0) return false
        var dx = circle.x - point.x
        var dy = circle.y- point.y
        return dx * dx + dy * dy <= r * r
    },
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
ul li{
  cursor: pointer;
}
</style>
