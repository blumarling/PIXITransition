import AttrPlugin from 'gsap/AttrPlugin';
import TimelineMax from 'gsap/TimelineMax'
import './style.scss';

var xlink   = "http://www.w3.org/1999/xlink";
var imgUrl  = "./aaa.png";
var feImage = document.querySelector("feImage");
var realimage = document.querySelector("image");
var displacement = document.querySelector("#displacement-map");

toBase64(imgUrl, function(data) {

  feImage.setAttributeNS(xlink, "xlink:href", data);

  var tl = new TimelineMax({ repeat: -1, repeatDelay: 1 });
  tl.to(displacement, 1, { attr: { scale: 100 }}, 0)
    .to(realimage, 1.5, { scale: 400 }, 0)


});
  

function toBase64(url, callback){
  
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function(){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    
    var dataURL = canvas.toDataURL("image/png");
    callback(dataURL);
    canvas = null; 
  };
  
  img.src = url;
}