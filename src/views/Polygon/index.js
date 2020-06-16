var min = 99;
var max = 999999;
var polygonMode = true;
// 点的数组
var pointArray = new Array();
// 线的数组
var lineArray = new Array();
var activeLine;
var activeShape = false;
var canvas
$(window).load(function(){
    // 初始化画布并计算画布的宽高
    canvas = window._canvas = new fabric.Canvas('c');
    canvas.setWidth($(window).width());
    canvas.setHeight($(window).height()-$('#nav-bar').height());
    //canvas.selection = false;
    prototypefabric.initCanvas();
    $('#create-polygon').click(function() {
        prototypefabric.polygon.drawPolygon(); 
    });
});
var prototypefabric = new function () {
    this.initCanvas = function () {
        canvas.on('mouse:down', function (options) {
            // 当起点和终点重合的时候,清除点和线并绘制成多边形
            if(options.target && options.target.id == pointArray[0].id){
                prototypefabric.polygon.generatePolygon(pointArray);
            }
            if(polygonMode){
                prototypefabric.polygon.addPoint(options);
            }
        });

        canvas.on('mouse:move', function (options) {
            if(activeLine && activeLine.class == "line"){
                var pointer = canvas.getPointer(options.e);
                activeLine.set({ x2: pointer.x, y2: pointer.y });

                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x:pointer.x,
                    y:pointer.y
                }
                activeShape.set({
                    points: points
                });
                canvas.renderAll();
            }
            canvas.renderAll();
        });
    };
};



prototypefabric.polygon = {
    drawPolygon : function() {
        polygonMode = true;
        pointArray = new Array();
        lineArray = new Array();
        activeLine;
    },
    addPoint : function(options) {
        //画圈
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var id = new Date().getTime() + random;
        var circle = new fabric.Circle({
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: (options.e.layerX/canvas.getZoom()),
            top: (options.e.layerY/canvas.getZoom()),
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            id:id
        });
        // 画第一个圈设置不同的颜色
        if(pointArray.length == 0){
            circle.set({
                fill:'red'
            })
        }
        //画线
        var points = [(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom()),(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom())];
        line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: '#999999',
            stroke: '#999999',
            class:'line',
            originX:'center',
            originY:'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
        });
        if(activeShape){
            var pos = canvas.getPointer(options.e);
            var points = activeShape.get("points");
            points.push({
                x: pos.x,
                y: pos.y
            });
            // 画多边形并获取当前的多边形
            var polygon = new fabric.Polygon(points,{
                stroke:'#333333',
                strokeWidth:1,
                fill: '#cccccc',
                opacity: 0.3,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            canvas.remove(activeShape);
            canvas.add(polygon);
            activeShape = polygon;
            canvas.renderAll();
        }
        else{
            // 画第一个多变形
            var polyPoint = [{x:(options.e.layerX/canvas.getZoom()),y:(options.e.layerY/canvas.getZoom())}];
            var polygon = new fabric.Polygon(polyPoint,{
                stroke:'#333333',
                strokeWidth:1,
                fill: '#cccccc',
                opacity: 0.3,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            activeShape = polygon;
            canvas.add(polygon);
        }
        activeLine = line;

        pointArray.push(circle);
        lineArray.push(line);

        canvas.add(line);
        canvas.add(circle);
        canvas.selection = false;
    },
    generatePolygon : function(pointArray){
        var points = new Array();
        console.log(pointArray)
        $.each(pointArray,function(index,point){
            points.push({
                x:point.left,
                y:point.top
            });
            canvas.remove(point);
        });
        $.each(lineArray,function(index,line){
            canvas.remove(line);
        });
        canvas.remove(activeShape).remove(activeLine);
        var polygon = new fabric.Polygon(points,{
            stroke:'#333333',
            strokeWidth:0.5,
            fill: 'red',
            opacity: 1,
            hasBorders: false,
            hasControls: false
        });
        canvas.add(polygon);

        activeLine = null;
        activeShape = null;
        polygonMode = false;
        canvas.selection = true;
    }
};
