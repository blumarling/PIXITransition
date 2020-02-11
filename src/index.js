import './fishEye'
import gsap, { Power1, Power3 } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import './style.scss';
import * as PIXI from 'pixi.js'
import {ZoomBlurFilter} from '@pixi/filter-zoom-blur';
PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);
import {fragment} from './fishEye'
import CanvasSlideshow from './CanvasSlideshow'

window.addEventListener('DOMContentLoaded', () => {
  
  setTimeout(() => document.body.classList.add('render'), 60);
  
  var spriteImages 	= document.querySelectorAll( '.slide-item__image' );
  var spriteImagesSrc = [];

  for ( var i = 0; i < spriteImages.length; i++ ) {
    var img = spriteImages[i];
    spriteImagesSrc.push( img.getAttribute('src' ) );
  }

  const initCanvas = new CanvasSlideshow({
    sprites: spriteImagesSrc,
    stageHeight: window.innerHeight,
    stageWidth: window.innerWidth,
    initialSlider: 0
  })
  // initCanvas.setCurrentSlide(0)
  setTimeout(() => {
    initCanvas.moveSlider(0,1)
  }, 4000)
  setTimeout(() => {
    initCanvas.moveSlider(1,0)
  }, 9000)

})
