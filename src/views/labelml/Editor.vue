<template>
  <div>
    <h1>fabricjs</h1>
    <ul>
      <li v-for="i in tools" :key="i.type" @click="getType(i.type)">{{i.name}}</li>
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
        type:'present',
        name:'当前选项'
      },{
        type:'rectangle',
        name:'矩形'
      },{
        type:'pen',
        name:'画笔'
      },{
        type:'Polygone',
        name:'多边形'
      },{
        type:'text',
        name:'文字'
      },{
        type:'remove',
        name:'删除'
      }],
      canvas:null,
      mouseFrom:{},
      mouseTo:{},
      drawType:null,
      // canvasObjectIndex:0,
      textbox:null,
      drawWidth:2, //笔触宽度
      color:"#E34F51", //画笔颜色
      drawingObject:null, //当前绘制对象
      moveCount:1, //绘制移动计数器
      doDrawing:false, // 绘制状态
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
      this.canvas = new fabric.Canvas("canvas",{
        isDrawingMode: true,
        skipTargetFind: true,
        selectable: false,
        selection: false
      });
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
          this.doDrawing = true;
        },
        "mouse:up": options => {
          let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
          this.mouseTo.x = xy.x;
          this.mouseTo.y = xy.y;
          // this.drawing();
          this.drawingObject = null;
          this.moveCount = 1;
          this.doDrawing = false;
        },
        'mouse:move': options => {
          if (this.moveCount % 2 && !this.doDrawing) {
            //减少绘制频率
            return;
          }
          this.moveCount++;
          var xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
          this.mouseTo.x = xy.x;
          this.mouseTo.y = xy.y;
          this.drawing();
        },
        'selection:created': e => {
          //  if (e.target._objects) {
          //     //多选删除
          //     var etCount = e.target._objects.length;
          //     for (var etindex = 0; etindex < etCount; etindex++) {
          //       this.canvas.remove(e.target._objects[etindex]);
          //     }
          //   } else {
          //     //单选删除
          //     this.canvas.remove(e.target);
          //   }
            // this.canvas.discardActiveObject(); //清楚选中框
        },
      });
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    },
    drawing(){
       if (this.drawingObject) {
          this.canvas.remove(this.drawingObject);
        }
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
          case "text":
            this.textbox = new fabric.Textbox("", {
              left: this.mouseFrom.x - 60,
              top: this.mouseFrom.y - 20,
              width: 150,
              fontSize: 18,
              borderColor: "#2c2c2c",
              fill: this.color,
              hasControls: false
            });
            this.canvas.add(this.textbox);
            this.textbox.enterEditing();
            this.textbox.hiddenTextarea.focus();
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
      this.canvas.isDrawingMode = false;
      this.drawType = type;
        if (this.textbox) {
          //退出文本编辑状态
          this.textbox.exitEditing();
          this.textbox = null;
        }
        if (this.drawType == "pen") {
          this.canvas.isDrawingMode = true;
        } else if (this.drawType == "remove") {
          this.canvas.selection = true;
          this.canvas.skipTargetFind = false;
          // this.canvas.selectable = true;
        } else {
          this.canvas.skipTargetFind = true; //画板元素不能被选中
          this.canvas.selection = false; //画板不显示选中
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
