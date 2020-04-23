<template>
  <div style="height: 100%">
    <div id="contentDiv" style="width: 100%;height: 481px"></div>
    <ul class="colorList">
      <li v-for="i in arrayUnique2(lesions, 'label')" :key="i.label">
        <input type="checkbox" checked @change="isLayer($event,lesions)" :value="i.label" />
        <p class="color_box" :style="{backgroundColor:`rgba(${i.color.toString()})`}"></p>
        <p>{{i.label}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import OpenSeadragon from "openseadragon";
import "../js/openseadragon-canvas-overlay";
export default {
  name: "Openseadragon",
  data() {
    return {
      viewer: null,
      overlay: null,
      options: {
        id: "contentDiv",
        constrainDuringPan: true,
        showNavigator: true
      },
      lesions: []
    };
  },
  created() {
    // console.log(222, OpenSeadragon);
    this.getJson();
  },
  mounted() {
    this.viewer = OpenSeadragon(this.options);
    // console.log('mounted')
    this.viewer.addTiledImage({
      prefixUrl: "images/",
      tileSource: {
        type: "image",
        url: require("@/assets/image-small.jpg")
      }
    });

    // console.log(333, this.viewer);

    this.overlay = this.viewer.canvasOverlay({
      onRedraw: this.drawCanvas,
      clearBeforeRedraw: true
    });

    // console.log(444, this.overlay);

    window.onresize = () => {
      this.overlay.resize();
    };
  },
  methods: {
    // 获取数据
    getJson() {
      axios.get("static/image.json").then(res => {
        this.lesions = res.data.lesions;
      });
    },

    // 分层显示
    isLayer(e, data) {
      let label = e.target.value;
      let chekBol = e.target.checked;
      console.log(chekBol);
      // console.log(data);
      if (!chekBol) {
        data.forEach(el => {
          if (el.label == label) {
            el.color[3] = 0;
          }
        });
      } else {
        data.forEach(el => {
          if (el.label == label) {
            el.color[3] = 0.5;
          }
        });
      }
      this.lesions = data;
      this.drawCanvas();
    },

    // 绘制图层
    drawCanvas() {
      let ctx = this.overlay.context2d();
      let lesions = this.lesions;
      // console.log(lesions);
      // console.log('drawCanvas');
      let s = 1 / 3;
      for (let i = 0; i < lesions.length; i++) {
        if (i == 0) continue;
        ctx.beginPath();
        ctx.moveTo(
          (lesions[i].region[0][0] / 2341) * s,
          (lesions[i].region[0][1] / 3238) * s * 0.72
        );
        for (let j = 0; j < lesions[i].region.length; j++) {
          ctx.lineTo(
            (lesions[i].region[j][0] / 2341) * s,
            (lesions[i].region[j][1] / 3238) * s * 0.72
          );
        }
        ctx.closePath();
        // lesions[i].color[3] = 0.5;
        let color = "rgba(" + lesions[i].color + ")";
        ctx.fillStyle = color;
        ctx.fill();
      }
    },

    // 过滤数组
    arrayUnique2(arr, name) {
      var hash = {};
      return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
      }, []);
    }
  }
};
</script>

<style scoped>
.colorList {
  position: absolute;
  left: 20px;
  top: 400px;
  list-style: none;
}
.colorList li {
  display: flex;
  align-items: center;
  height: 35px;
}

.colorList li input,
.color_box {
  width: 15px;
  height: 15px;
}
.color_box {
  margin: 0 7px;
  border: solid 1px;
}
</style>
