import './fishEye'
import AttrPlugin from 'gsap/AttrPlugin';
import TimelineMax from 'gsap/TimelineMax'
import './style.scss';

window.addEventListener('DOMContentLoaded', () => {
  var distorter = FisheyeGl({
    image: './img/02.png',
    width: window.innerWidth,
    height: window.innerHeight,
    selector: '#canvas', // a canvas element to work with
    lens: {
      // a: 2.739,    // 0 to 4;  default 1
      // b: 1.214,    // 0 to 4;  default 1
      // Fx: 1.58, // 0 to 4;  default 0.0
      // Fy: 0.14, // 0 to 4;  default 0.0
      // scale: 2.273 // 0 to 20; default 1.5
      a: 1,    // 0 to 4;  default 1
      b: 1,    // 0 to 4;  default 1
      Fx: 0.0, // 0 to 4;  default 0.0
      Fy: 0.0, // 0 to 4;  default 0.0
      scale: 1.5 // 0 to 20; default 1.5
    },
    fov: {
      x: 1.599, // 0 to 2; default 1
      y: 1.236  // 0 to 2; default 1
    },
    // fragmentSrc: "path/to/fragment.glfs", // optional, defaults to an inbuilt fragment shader 
    // vertexSrc:   "path/to/vertex.glvs" // optional, defaults to an inbuilt vertex shader
  });

  const a = distorter; // <= returns a native JavaScript Image object based on the DOM element
  // a.lens.a = 1
  // distorter.getImage('image/png'); // <= format can be specified
  
  // distorter.setImage('path/to/image.jpg'); // <= load a new image with the same distortion settings

})


