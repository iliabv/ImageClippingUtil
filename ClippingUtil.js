(function(){
    var ieVersion = getInternetExplorerVersion();

    window.clipImage = clipImage;


    if(ieVersion != -1 && getInternetExplorerVersion() < 9){
        document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
        vmlClipImage('image.jpg',259,194);
    }
    else{
        canvasClipImage('image.jpg',259,194);
    }

    function clipImage(imagePath,width,height){
        if(ieVersion != -1 && getInternetExplorerVersion() < 9){
            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
            vmlClipImage(imagePath,width,height);
        }
        else{
            canvasClipImage(imagePath,width,height);
        }
    }

    function canvasClipImage(imagePath,width,height){
        var targetImage;

        var canvas = document.createElement('canvas');
        canvas.setAttribute('width',width+'px');
        canvas.setAttribute('height',height+'px');
        document.body.appendChild(canvas);

        targetImage = new Image();

        targetImage.onload = function(){
            // drawImages() will load the image into the <canvas> element
            // The index of the loop is passed, as well as the image itself
            drawImages(this,canvas);
        };
        targetImage.src = imagePath;
    }

    function drawImages(image,canvas){
        var context = canvas.getContext("2d");

        //M259,0 L0,0 L10,90 L90,130, L259,0
        //M259,23 L100,23 L100,120 L245,131, L259,23
        context.beginPath();
        context.moveTo(259,23);
        context.lineTo(100, 23);
        context.lineTo(79,120);
        context.lineTo(245, 131);
        context.lineTo(259, 23);

        // Now that the path is drawn, the context is clipped:
        context.clip();

        // And the image is used to fill the path
        context.drawImage(image, 0, 0);
        context.closePath();

    }

    function vmlClipImage(imagePath,width,height){
        var shape, div, fill;

        shape = document.createElement("v:shape");

        div = document.createElement('div');
        div.appendChild(shape);

        shape.style.position = "absolute";
        shape.style.width = width +"px";
        shape.style.height = height + "px";

        shape.path = "M259,23 L100,23 79,120 245,131, 259,23 x e";
        shape.coordsize = width+' '+height;

        shape.stroked = false;

        fill = document.createElement("v:fill");
        fill.setAttribute("type", "tile");
        fill.setAttribute("src", imagePath);
        var originX = 79/width;
        var originY = 23/height;
        fill.setAttribute("origin",originX+","+originY);

        shape.appendChild(fill);

        document.body.appendChild(div);

        // This last step forces a re-rendering of the polyline, which is required for the image to show.
        // I had to scour the web to find this solution!
        shape.outerHTML = shape.outerHTML;
    }

    function getInternetExplorerVersion(){
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    }

}());
