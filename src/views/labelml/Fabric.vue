<template>
  <div>
    <h1>Fabric练习</h1>
    <ul>
      <li v-for="i in tools" :key="i.type" @click="getType(i.type)"><el-button size="mini" style="width:80px;">{{i.name}}</el-button></li>
      <li @click="delTarget()"><el-button size="mini" style="width:80px;" type="danger">删除</el-button></li>
    </ul>
    <canvas id="canvas"></canvas>
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
      drawWidth:2, //笔触宽度
      color:'rgb(211, 118, 146)', //画笔颜色
      fillColor:'rgba(0, 110, 255, 0.5)', // 填充颜色

      doDrawing:false, // 绘制状态
      delIndex:null,//删除目标
      points:[],// 多变形线
      polygonPoint:[],// 多边形
      pointArray:new Array(),
      lineArray:new Array()
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
          this.mouseFrom.x = xy.x;
          this.mouseFrom.y = xy.y;
          // line多边形
          if(this.doDrawing && this.drawType =='polygon'){
            this.canvas.skipTargetFind = true;
            let circle = this.drawCircle(xy)

            this.polygonPoint.push(xy)
            let obj = this.polygonPoint[0];

            if(this.points.length < 4){
              this.points.push(xy.x,xy.y)
              this.canvas.add(circle)
              this.pointArray.push(circle)
              this.drawing()
              this.pointArray[0].set({fill:'red'})
              this.canvas.renderAll();
            }else{
              this.points.splice(0,2)
              if(this.pointInsideCircle(xy,obj,5)){
                this.points.push(obj.x,obj.y)
                let polygon = this.drawPolygon(this.polygonPoint)
                this.canvas.add(polygon)
                this.canvas.skipTargetFind = false;
                this.delCL(this.pointArray,this.lineArray)
              }else{
                 this.points.push(xy.x,xy.y)
                 this.canvas.add(circle)
                 this.pointArray.push(circle)
                 this.drawing()
              }
            }

          }
        },
        "mouse:up": options => {
          let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
          this.mouseTo.x = xy.x;
          this.mouseTo.y = xy.y;
          // 矩形
          // if(this.doDrawing && this.drawType =='rectangle'){
            this.drawing();
          // }
        },
        'mouse:move': options => {},
        'selection:created': e => {
          this.doDrawing = false;
          this.delIndex = e.target;
        },
      });
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    },
    drawing(){
        let fabricObject = null;
         switch (this.drawType) {
            case "rectangle": //矩形
            fabricObject = this.drawRect(this.mouseFrom,this.mouseTo)
            break;
            case "polygon": //多边形的框
            if(this.points.length>3){
              fabricObject = this.drawLine(this.points)
              this.lineArray.push(fabricObject)
            }
            break;
          case "text":
            fabricObject = this.drawText(this.mouseFrom)
            fabricObject.enterEditing();
            fabricObject.hiddenTextarea.focus();
            break;
          case "remove":
            break;
          default:
            break;
         }
      if(fabricObject){
        this.canvas.add(fabricObject)
      }
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
            })
    },
    // 直线
    drawLine(arr){
      return new fabric.Line(arr,{
              id:new Date().getTime(),
              fill: this.color,
              stroke: this.color,
              strokeWidth: 1,
              selectable: false,
              hasBorders: false,
              hasControls: false,
            })
    },
    // 圆
    drawCircle(point){
      return new fabric.Circle({
                radius: 5,
                strokeWidth: 3,
                left: point.x-6,
                top: point.y-6,
                fill: "green",
                stroke: 'blick',
              selectable: false,
              hasBorders: false,
              hasControls: false,
            });
    },
    // 文字
    drawText(point){
      return new fabric.Textbox("",{
            left: point.x - 60,
            top: point.y - 20,
            width: 150,
            fontSize: 18,
            borderColor: "#2c2c2c",
            fill: this.color,
            hasControls: false
            });
    },
    // 获取要画的类型
    getType(type){
      this.doDrawing = true;
      this.drawType = type;
      this.points = [];
      this.polygonPoint = [];
      this.polygonPoint = new Array();
      this.pointArray = new Array();
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
    // 绘制完成多边形后删除多余的点和线
    delCL(arr1,arr2){
      arr1.forEach(point => {
        this.canvas.remove(point);
      });
      arr2.forEach(line => {
        this.canvas.remove(line);
      });
      this.polygonPoint = new Array();
      this.pointArray = new Array();
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
