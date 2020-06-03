<template>
  <div style="height: 100%">
    <div id="contentDiv" style="width: 100%;" :style="{height: winHeight-78+'px'}">
      <!-- 工具栏 -->
      <div class="tool-box">
          <div class="btn" id="viewZoomIn" style="padding: 8px 9px;">
              <div class="el-icon-plus" style="margin: 0;"></div>
          </div>
          <div class="btn" id="viewZoomOut" style="padding: 8px 9px; margin-bottom: 20px;">
              <div class="el-icon-minus" style="margin: 0;"></div>
          </div>
          <div class="btn" id="full-page" style="padding: 8px 9px; margin-bottom: 20px;">
              <div class="el-icon-full-screen" style="margin: 0;"></div>
          </div>
          <div class="btn" id="previous" style="padding: 8px 9px; margin-bottom: 20px;">
              <div class="el-icon-arrow-up" style="margin: 0;"></div>
          </div>
          <div class="btn" id="next" style="padding: 8px 9px; margin-bottom: 20px;">
              <div class="el-icon-arrow-down" style="margin: 0;"></div>
          </div>
          <div>
            <p>zoom:{{zoom}}</p>
            <p>imageZoom:{{imageZoom}}</p>
          </div>
          <div class="block">
            <el-slider
              v-model="zoom"
              :step="0.000001"
              :min="0.000001"
              :max="5"
              @input="changeZoom()"
              vertical
              height="200px">
            </el-slider>
          </div>
           <!-- @click="saveImage" -->
          <div class="btn">
              <div class="el-icon-crop"></div>
              <div>截图</div>
          </div>
          <div class="btn" @click="toggleMark()">
              <div class="el-icon-view"></div>
              <div>{{ isShowMark ? '隐藏':'显示' }}AI标注</div>
          </div>
      </div>

      <!-- 分层显示 -->
      <ul class="colorList" v-show="isShowMark">
        <li v-for="i in arrayUnique2(lesions, 'label')" :key="i.label">
          <input type="checkbox" checked @change="isLayer($event,lesions)" :value="i.label" />
          <p class="color_box" :style="{backgroundColor:`rgba(${i.color.toString()})`}"></p>
          <p>{{i.label}}</p>
        </li>
      </ul>

       <!-- 截图 -->
        <!-- <vueCropper
            ref="cropper"
            :img="cropperOption.img"
            :outputType="cropperOption.outputType"
            :autoCrop="cropperOption.autoCrop"
            :autoCropWidth="cropperOption.autoCropWidth"
            :autoCropHeight="cropperOption.autoCropHeight">
        </vueCropper> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OpenSeadragon from "openseadragon";
// import "../js/openseadragon-paperjs-overlay";
import "../js/openseadragon-canvas-overlay";
// import "../js/openseadragon-smartScrollZoom";
import { VueCropper }  from 'vue-cropper' 
export default {
  name: "Openseadragon",
  components: {
      VueCropper
  },
  data() {
    return {
      winHeight: null,
      viewer: null,
      overlay: null,
      options: {
        id: "contentDiv",
        constrainDuringPan: true,
        showNavigator: true,
        crossOriginPolicy: 'Anonymous',
        zoomInButton: 'viewZoomIn',
        zoomOutButton: 'viewZoomOut',
        fullPageButton: "full-page",
        nextButton:     "next",
        previousButton: "previous",
        // homeButton:     "home",
        // debugMode : true, //开启调试模式
      },
      curAiLink:'',
      isShowMark:false,
      lesions: [],
      lesionsData: [],
      zoom:1,
      imageZoom:0,
      num:0.5,
      cropperOption: {
          img: require("@/assets/image-small.jpg"),
          outputType: 'png',
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200
      }
    };
  },
  created() {
    this.getJson();
  },
  mounted() {
    this.winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.init()
  },
  updated() {},
  methods: {
    // 获取数据
    getJson() {
      axios.get("static/image.json").then(res => {
        this.lesionsData = res.data.lesions;
      });
    },
    init() {
      
      this.viewer = OpenSeadragon(this.options);
      // console.log('mounted')
      this.viewer.addTiledImage({
        prefixUrl: "./images/",
        tileSource: {
          type: "image",
          url: require("@/assets/image-small.jpg")
        }
      });

      var _this = this
      var  updateZoom = function() {
            var zoom = _this.viewer.viewport.getZoom(true);
            var imageZoom = _this.viewer.viewport.viewportToImageZoom(zoom);

            _this.zoom = Math.round(zoom * 100) / 100;
            _this.imageZoom = Math.round(imageZoom * 100) / 100;
        }
     this.viewer.addHandler('animation', updateZoom);

      this.overlay = this.viewer.canvasOverlay({
        onRedraw: this.drawCanvas,
        clearBeforeRedraw: true
      });
      
      window.onresize = () => {
        this.overlay.resize();
      };

    },
    // 控制画布缩放
    changeZoom(){
      this.viewer.viewport.zoomTo(this.zoom)
    },
    // 显示隐藏AI标注
    toggleMark() {
        this.isShowMark = !this.isShowMark;
        if (this.isShowMark) {
            this.lesions = this.lesionsData;
            this.overlay._updateCanvas();
        } else {
            this.overlay.clear();
            this.lesions = [];
        }
    },
    // 分层显示
    isLayer(e, data) {
      let label = e.target.value;
      let chekBol = e.target.checked;
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
      this.overlay._updateCanvas();
    },

    // 绘制图层
    drawCanvas() {
      let ctx = this.overlay.context2d();
      let lesions = this.lesions;
      let sourceWidth = this.viewer.source.width
      let sourceHeight = this.viewer.source.height
      let s = sourceHeight / sourceWidth;
      let d = 1/3 // 图与数据不匹配，所以需要取三分之一

      for (let i = 0; i < lesions.length; i++) {
        if (i == 0) continue;
        ctx.beginPath();
        ctx.moveTo((lesions[i].region[0][0] / sourceHeight) * d,(lesions[i].region[0][1] / sourceWidth) * d * s);
        for (let j = 0; j < lesions[i].region.length; j++) {
          ctx.lineTo((lesions[i].region[j][0] / sourceHeight) * d,(lesions[i].region[j][1] / sourceWidth) * d * s);
        }
        ctx.closePath();
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

<style lang="scss" rel="stylesheet/scss" scoped>
    .tool-box {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 10px;
        z-index: 1;

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, .2);
            margin-top: 10px;
            padding: 8px 15px;
            border-radius: 1.8em;
            font-size: 14px;
            color: #ffffff;
            cursor: pointer;

            div {
                margin-left: 5px;
            }

            &:hover {
                background-color: rgba(0, 0, 0, .5);
            }
        }
    }
.colorList {
  position: absolute;
  left: 20px;
  // top: 400px;
  bottom:0;
  z-index: 10;
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
