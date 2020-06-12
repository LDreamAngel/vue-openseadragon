<template>
  <div>
    <h1>fabricjs</h1>
    <ul>
      <li v-for="i in tools" :key="i.type" @click="getType(i.type)">{{i.name}}</li>
      <li @click="delTarget()">删除</li>
    </ul>
    <canvas id="canvas" width="1000" height="600"></canvas>
    <!-- <img src="@/assets/logo.png" alt="" id="img"> -->
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
      color:"#E34F51", //画笔颜色
      drawingObject:null, //当前绘制对象
      moveCount:1, //绘制移动计数器
      doDrawing:false, // 绘制状态
      delIndex:null,//删除目标
      points:[]
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
        },
        "mouse:up": options => {
          let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
          this.mouseTo.x = xy.x;
          this.mouseTo.y = xy.y;
          if(this.doDrawing && this.drawType =='rectangle'){
            this.drawing();
          }
          if(this.doDrawing && this.drawType =='polygon'){
            this.points.push(xy.x,xy.y)
            this.drawing()
          }
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
            case "rectangle": //长方形
            let path =  "M " +
                    this.mouseFrom.x +
                    " " +
                    this.mouseFrom.y +
                    " L " +
                    this.mouseTo.x +
                    " " +
                    this.mouseFrom.y +
                    " L " +
                    this.mouseTo.x +
                    " " +
                    this.mouseTo.y +
                    " L " +
                    this.mouseFrom.x +
                    " " +
                    this.mouseTo.y +
                    " L " +
                    this.mouseFrom.x +
                    " " +
                    this.mouseFrom.y +
                    " z";
            fabricObject =  new fabric.Path(path,{
              left: this.mouseFrom.x,
              top: this.mouseFrom.y,
              stroke: this.color,
              strokeWidth: this.drawWidth,
              fill: "rgba(255, 255, 255, 0)"
            });
            break;
            case "polygon": //多边形
              let points = this.points;
              console.log(points)
              // points.push(this.mouseTo)
           this.canvas.add(new fabric.Polyline(points,{
              fill: this.color,
              stroke: this.color,
              strokeWidth: 1,
              selectable: false,
              hasControls: false,
              score: 1.0,
              //https://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=context-menu
              hoverCursor: "default"
            }));
            break;
          case "remove":
            break;
          default:
            break;
         }
      if(fabricObject){
        this.canvas.add(fabricObject)
        this.drawingObject = fabricObject;
      }
    },
    getType(type){
      this.doDrawing = true;
      this.drawType = type;
      this.points = [];
      console.log()
    },
    delTarget(){
      if(this.delIndex){
        this.canvas.remove(this.delIndex);
      }else{
        this.$message.warning('请先选择要删除的图像');
      }
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
