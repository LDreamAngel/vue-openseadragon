// 画圈
let Circle = airglass.extend(airglass.Renderable, {
    _constructor: function (params) {
      this.path = null;
      this.x = params.x || 0;
      this.y = params.y || 0;
      this.size = params.size || 100;
    },
    updatePath: function () {
      let path = new Path2D;
      path.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
      this.path = path;
    },
    draw: function (ctx) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.line;
      ctx.fillStyle = this.fill;
      ctx.fill(this.path);
      ctx.stroke(this.path);
    }
  });
  
  // 画多边形
  let Polygon = airglass.extend(airglass.Renderable, {
    _constructor: function (params) {
      this.path = null;
      this.points = params.points || [];
    },
    updatePath: function () {
      let path = new Path2D;
      for (let i = 0; i < this.points.length; i++) {
        let point = this.points[i];
        if (i == 0) {
          path.moveTo(point.x, point.y);
          continue;
        }
        path.lineTo(point.x, point.y);
      }
      this.path = path;
    },
    addPoint: function (point) {
      this.points.push(point);
    },
    draw: function (ctx) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.line;
      ctx.fillStyle = this.fill;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fill(this.path);
      ctx.stroke(this.path);
    }
  });