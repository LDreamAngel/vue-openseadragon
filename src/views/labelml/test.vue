<template>
  <div>
    <h1>初识Fabricjs</h1>
    <canvas id="canvas"></canvas>
    <!-- <img src="@/assets/logo.png" alt="" id="img"> -->
  </div>
</template>

<script>
import { fabric } from "fabric";

var LabeledRect = fabric.util.createClass(fabric.Rect, {
  type: "labeledRect",

  initialize: function(options) {
    options || (options = {});
    this.callSuper("initialize", options);
    this.set("label", options.label || "");
    // this.set("score", options.score || 1.0);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      label: this.get("label")
      // score: this.get("score")
    });
  },

  _render: function(ctx) {
    this.callSuper("_render", ctx);
    // let score = Math.round(this.score * 100) / 100;
    // let text = this.label + " (" + score + ")";
    // let text = this.label;
    ctx.font = "14px Helvetica";
    ctx.fillStyle = "#ffffff";
    // ctx.fillText(this.label, -this.width / 2+10, -this.height / 2 + 20);
    ctx.fillText(this.label, 0, 0);
  }
});

var LabeledPath = fabric.util.createClass(fabric.Path, {
  type: "labeledPath",

  initialize: function(path,options) {
    console.log(1111,options)
    options || (options = {});
    this.callSuper("initialize", path, options);
    this.set("label", options.label || "");
    // this.set("score", options.score || 1.0);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      label: this.get("label")
      // score: this.get("score")
    });
  },

  _render: function(ctx) {
    this.callSuper("_render", ctx);
    // let score = Math.round(this.score * 100) / 100;
    // let text = this.label + " (" + score + ")";
    // let text = this.label;
    console.log('label',this.label)
    console.log(-this.width / 2+10, -this.height / 2 + 20)
    ctx.font = "14px Helvetica";
    ctx.fillStyle = "#000000";
    // ctx.fillText(this.label, -this.width / 2+10, this.height / 2 + 20);
    ctx.fillText(this.label, 0, 0);
  }
});

export default {
  name: "FabricBox",
  data() {
    return {
      canvas:null,
      mouseFrom:{
        x:null,
        y:null
      },
      mouseTo:{
        x:null,
        y:null
      }
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
      //var staticCanvas = new fabric.StaticCanvas('canvas');// 无交互的画布
      let cWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 250;
      let cheight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 100;
      this.canvas.setWidth(cWidth);
      this.canvas.setHeight(cheight);

      // 创建一个矩形对象
      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 20,
        height: 20,
        angle: 45
      });
      // 圆
      var circle = new fabric.Circle({
        radius: 20,
        fill: "green",
        left: 100,
        top: 100
      });
      // 三角
      var triangle = new fabric.Triangle({
        width: 20,
        height: 30,
        fill: "blue",
        left: 50,
        top: 50
      });

      // 添加图片一
      // var imgElement = document.getElementById('img');
      // var imgInstance = new fabric.Image(imgElement, {
      //   left: 100,
      //   top: 100,
      //   angle: 30,
      //   opacity: 0.85
      // });
      // this.canvas.add(imgInstance);

      let _this = this

      // 添加图片二
      fabric.Image.fromURL(require("@/assets/logo.png"), function(oImg) {
        // 将其缩小，然后将其翻转，然后再将其添加到画布上
        oImg.scale(0.5).set("flipX", true);
        // 添加滤镜
        oImg.filters.push(
          // new fabric.Image.filters.Grayscale(),
          new fabric.Image.filters.Sepia(),
          new fabric.Image.filters.Brightness({ brightness: 50 })
        );
        // 图片加载完成之后，应用滤镜效果
        oImg.applyFilters();
        _this.canvas.add(oImg);
      });

      // 自定义路线
      var path = new LabeledPath("M 0 0 L 200 100 L 100 200 z",{
        left: 120,
        top: 120,
        fill: "red",
        stroke: "green",
        opacity: 0.5
      });

      var arrow = new fabric.Path(
        "M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
          c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
          0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
          c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
          -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
          12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
          -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z"
      );

      // 将矩形添加到canvas画布上
      this.canvas.add(rect, triangle, circle, path, arrow);

      // 移动图片
      // rect.set({ left: 200, top: 500 });
      // this.canvas.renderAll();

      // 修改图形样式
      rect.set("fill", "red");
      rect.set({ strokeWidth: 5, stroke: "rgba(100,200,200,0.5)" });
      rect.set("angle", 15).set("flipY", true);

      // 是否可以对图片进行操作
      // this.canvas.selection = false; // 禁止所有选中
      // rect.set('selectable', false); // 只是禁止这个矩形选中

      // 动画：参数2可以为绝对值也可以为相对值；+=num:顺时针；-=num:逆时针；
      /*from 允许指定动画属性的起始值（如果我们不希望使用当前值）。
      duration 默认为500ms。可以用来改变动画的持续时间。
      onComplete 动画结束之后的回调。
      easing 动效函数。*/
      rect.animate("left", "+=100", {
        onChange: this.canvas.renderAll.bind(this.canvas),
        duration: 1000,
        easing: fabric.util.ease.easeOutBounce //easeInCubic，easeOutCubic，easeInElastic，easeOutElastic，easeInBounce和easeOutExpo。
      });

      var aaa = new LabeledRect({
        left: 300,
        top: 300,
        fill: "green",
        width: 100,
        height: 100
      })
      this.canvas.add(aaa)
      aaa.set({label:'重绘标签'})
      path.set({label:'重绘标签66666'})
      
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#canvas {
  border: solid 1px;
}
</style>
