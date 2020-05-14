
    var positionEl = document.querySelectorAll('.info .position')[0];
    var zoomEl = document.querySelectorAll('.info .zoom')[0];

    var highsmith = {
        Image: {
            xmlns: "http://schemas.microsoft.com/deepzoom/2008",
            Url: "http://openseadragon.github.io/example-images/highsmith/highsmith_files/",
            Format: "jpg",
            Overlap: "2",
            TileSize: "256",
            Size: {
                Height: "9221",
                Width:  "7026"
            }
        }
    };

    var viewer = OpenSeadragon({
        id: "openseadragon1",
        prefixUrl: "/openseadragon/images/",
        tileSources: highsmith
    });

    var updateZoom = function() {
        var zoom = viewer.viewport.getZoom(true);
        var imageZoom = viewer.viewport.viewportToImageZoom(zoom);

        zoomEl.innerHTML = 'Zoom:<br>' + (Math.round(zoom * 100) / 100) + 
            '<br><br>Image Zoom:<br>' + (Math.round(imageZoom * 100) / 100);
    }

    viewer.addHandler('open', function() {

        var tracker = new OpenSeadragon.MouseTracker({
            element: viewer.container,
            moveHandler: function(event) {
                var webPoint = event.position;
                var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
                var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
                var zoom = viewer.viewport.getZoom(true);
                var imageZoom = viewer.viewport.viewportToImageZoom(zoom);

                positionEl.innerHTML = 'Web:<br>' + webPoint.toString() + 
                    '<br><br>Viewport:<br>' + viewportPoint.toString() +
                    '<br><br>Image:<br>' + imagePoint.toString();
                
                updateZoom();     
            }
        });  

        tracker.setTracking(true);  

        viewer.addHandler('animation', updateZoom);   
    });
