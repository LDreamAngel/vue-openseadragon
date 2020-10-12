<template>
  <div>
    <div class="content">
      <div class="box" v-for="item in rgbArray" :style="item.style" :key="item[0]"></div>
      <hr />
    </div>
    <div class="content">
      <div class="box" v-for="(item,index) in colorArray" :style="item" :key="index"></div>
      <hr />
    </div>
    <div class="content">
      <div class="box" v-for="(item,index) in colorArray1" :style="item" :key="index"></div>
      <hr />
    </div>
    <div class="content">
      <div class="box" v-for="(item,index) in colorArray2" :style="item" :key="index"></div>
      <hr />
    </div>
    <div class="content">
      <div class="box" v-for="(item,index) in colorArray3" :style="item" :key="index"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hslArray: new Array(),
      colorArray: new Array(),
      colorArray1: new Array(),
      colorArray2: new Array(),
      colorArray3: new Array(),
    };
  },
  created: function () {
    this.hslArray = this.getHslArray();
    console.log(this.hslArray);
    this.random();
    this.bg1();
    this.bg2();
    this.bg3();
    console.log(111,this.fun())
  },
  mounted() {
    console.log("1");
    console.log(this.rgbArray);
  },
  computed: {
    rgbArray: function () {
      var self = this;
      if (!self.hslArray.length) return [];

      var rgbArray = self.hslArray.map(function (item) {
        return self.hslToRgb.apply(this, item);
      });

      return rgbArray.map(function (item) {
        return {
          value: item,
          style: { background: "rgb(" + item.toString() + ")" },
        };
      });
    },
  },

  methods: {
    /**
     * HSL颜色值转换为RGB
     * H，S，L 设定在 [0, 1] 之间
     * R，G，B 返回在 [0, 255] 之间
     *
     * @param H 色相
     * @param S 饱和度
     * @param L 亮度
     * @returns Array RGB色值
     */
    hslToRgb: function (H, S, L) {
      var R, G, B;
      if (+S === 0) {
        R = G = B = L; // 饱和度为0 为灰色
      } else {
        var hue2Rgb = function (p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        var P = 2 * L - Q;
        R = hue2Rgb(P, Q, H + 1 / 3);
        G = hue2Rgb(P, Q, H);
        B = hue2Rgb(P, Q, H - 1 / 3);
      }
      return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
    },

    // 获取随机HSL
    randomHsl: function () {
      var H = Math.random();
      var S = Math.random();
      var L = Math.random();
      return [H, S, L];
    },

    // 获取HSL数组
    getHslArray: function () {
      var HSL = [];
      var hslLength = 7; // 获取数量
      for (var i = 0; i < hslLength; i++) {
        var ret = this.randomHsl();

        // 颜色相邻颜色差异须大于 0.25
        if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
          i--;
          continue; // 重新获取随机色
        }
        ret[1] = 0.7 + ret[1] * 0.2; // [0.7 - 0.9] 排除过灰颜色
        ret[2] = 0.4 + ret[2] * 0.4; // [0.4 - 0.8] 排除过亮过暗色

        // 数据转化到小数点后两位
        ret = ret.map(function (item) {
          return parseFloat(item.toFixed(2));
        });

        HSL.push(ret);
      }
      return HSL;
    },
    random() {
      for (let i = 0; i < 7; i++) {
        var h = Math.floor(Math.random() * 255);
        var s = Math.floor(Math.random() * 100);
        var l = Math.floor(Math.random() * 100);
        this.colorArray.push({
          "background-color": "hsl(" + h + ", " + s + "%," + l + "%)",
        });
      }
      return this.colorArray;
    },
    bg1() {
      for (let i = 0; i < 7; i++) {
        this.colorArray1.push({
          "background-color":
            "#" + Math.floor(Math.random() * 256).toString(10),
        });
      }
      return this.colorArray1;
    },
    bg2() {
      for (let i = 0; i < 7; i++) {
        this.colorArray2.push({
          "background-color":
            "#" + Math.floor(Math.random() * 0xffffff).toString(16),
        });
      }
      return this.colorArray2;
    },
    bg3() {
      for (let i = 0; i < 7; i++) {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        this.colorArray3.push({
          "background-color": "rgb(" + r + "," + g + "," + b + ")",
        });
      }
      return this.colorArray3;
    },
    fun(){
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
    
       return {
            fill_color: `rgba(${r}, ${g}, ${b}, 0.3)`,
            line_color: `rgb(${r}, ${g}, ${b})`
          }
    }
  },
};
</script>

<style lang="scss" scope>
.content {
  width: 100%;
  height: 150px;
}
.box {
  width: 50px;
  height: 50px;
  float: left;
  // background: rgb(231, 50, 71);
  
}
</style>