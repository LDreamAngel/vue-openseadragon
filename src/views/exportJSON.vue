<template>
  <div class="exportJSON">
      <div @click="exportJSON()">
        导出JSON文件
      </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'

export default {
  name: 'ExportJSON',
  data() {
      return {
       obj:{ 
           "shapes":[{
                    "fill_color": null,
                    "id": 289467,
                    "label": "\u771f\u76ae\u6d45\u5c42\u8840\u7ba1\u5468\u56f4\u708e\u75c7\u7ec6\u80de\u6d78\u6da6",
                    "line_color": null,
                    "points": [
                        [395.30842745438747, 218.1798436142485],
                        [306.25543006081665, 356.1033883579496],
                        [319.2875760208514, 530.9513466550825],
                        [279.1051259774109, 597.1980886185925],
                        [331.23370981754994, 608.0582102519547],
                        [400.73848827106866, 469.0486533449175],
                        [452.8670721112076, 359.3614248479583],
                        [456.1251086012163, 260.53431798436145],
                        [431.1468288444831, 208.40573414422244]
                    ]
                }, {
                    "fill_color": null,
                    "id": 297432,
                    "label": "\u771f\u76ae\u6d45\u5c42\u8840\u7ba1\u5468\u56f4\u708e\u75c7\u7ec6\u80de\u6d78\u6da6",
                    "line_color": null,
                    "points": [
                        [201.5167930660887, 638.136511375948],
                        [241.6034669555795, 721.5601300108342],
                        [157.0964247020584, 717.2264355362947]
                    ]
                }]
            }
      }
  },
  mounted(){

  },
  methods:{
   exportJSON () {
      // 将json转换成字符串
      const data = JSON.stringify(this.obj)
      const blob = new Blob([data], {type: ''})
      FileSaver.saveAs(blob, 'label.json')
    }
  }
}
</script>
