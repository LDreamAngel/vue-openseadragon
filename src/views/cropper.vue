<template>
    <div>
        <div class="cropper-content">
            <div class="cropper" style="width:200px;height:200px;">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    @realTime="realTime"
                    @imgLoad="imgLoad">
                </vueCropper>
            </div>
            <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
                <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </div>
        <div class="footer-btn">
            <div class="scope-btn">
                <label class="btn" for="uploads">更换图片</label>
                <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
 
                <button  @click="changeScale(1)">+</button>
                <button  @click="changeScale(-1)">-</button>
                <button  @click="rotateLeft">↺</button>
                <button  @click="rotateRight">↻</button>
            </div>
            <div class="upload-btn">
                <button  @click="down('blob')">下载</button>
            </div>
        </div>
    </div>
</template>
<script>
    import { VueCropper }  from 'vue-cropper' 
    export default {
        name: 'Cropper',
        components: {
            VueCropper,
        },
        data() {
            return {
                crap: false,
                previews: {},
                option: {
                img: 'https://bpic.588ku.com/element_water_img/18/06/12/b2887846cb19ff36a5502401ac918809.jpg',
                size: 1,
                full: false,
                outputType: 'png',
                canMove: true,
                original: false,
                canMoveBox: true,
                autoCrop: true,
                autoCropWidth: 200,
                autoCropHeight: 200,
                fixedBox: true,
 
                downImg: '#'
            }
        }
    },
    methods: {
        changeScale (num) {
            num = num || 1
            this.$refs.cropper.changeScale(num)
        },
        rotateLeft () {
            this.$refs.cropper.rotateLeft()
        },
        rotateRight () {
            this.$refs.cropper.rotateRight()
        },
        finish (type) {  // 输出
            var test = window.open('about:blank')
            test.document.body.innerHTML = '图片生成中..'
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    var img = window.URL.createObjectURL(data)
                    this.model = true
                    this.modelSrc = img
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    this.model = true
                    this.modelSrc = data
                })
            }
        },
        realTime (data) {  // 实时预览函数
            this.previews = data
        },
        down (type) {
            // event.preventDefault()
            var aLink = document.createElement('a')
            aLink.download = 'author-img' // 输出
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    console.log(data)
                    this.downImg = window.URL.createObjectURL(data)
                    // aLink.download = this.downImg;
                    console.log(this.downImg)
                    aLink.href = window.URL.createObjectURL(data)
                    aLink.click()
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    this.downImg = data
                    aLink.href = data
                    aLink.click()
                })
            }
        },
        uploadImg (e, num) { //上传图片
            this.option.img
            var file = e.target.files[0]
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                return false
            };
            var reader = new FileReader()
            reader.onload = (e) => {
                let data
                if (typeof e.target.result === 'object') { // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                } else {
                    data = e.target.result
                }
                if (num === 1) {
                    this.option.img = data
                } else if (num === 2) {
                    this.example2.img = data
                }
            } // 转化为base64
            reader.readAsDataURL(file) // 转化为blob reader.readAsArrayBuffer(file)
        }, 
        imgLoad (msg) {
            console.log(msg)
        }
    }
}
</script>