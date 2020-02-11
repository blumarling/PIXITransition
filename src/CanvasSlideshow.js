import './fishEye'
import gsap, { Power1, Power3 } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from 'pixi.js'
import {ZoomBlurFilter} from '@pixi/filter-zoom-blur';
PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);
import WarpFilter from './WarpFilter';

class CanvasSlideshow {
  
  constructor(options) {
    const _options = {
      stageWidth          : 1920,
      stageHeight         : 1080,
      pixiSprites         : [],
      centerSprites       : false,
      texts               : [],
      autoPlay            : true,
      autoPlaySpeed       : [10, 3],
      fullScreen          : true,
      navElement          : document.querySelectorAll( '.scene-nav' ), 
      wacky               : false,
      interactive         : false,
      interactionEvent    : '',
      textColor           : '#fff',
      dispatchPointerOver : false,
    }
    this.options = {
      ..._options,
      ...options
    }
    this.isPlaying   = false
    this.initPIXIRenderer(this.options)

  }

  async initPIXIRenderer(options) {
    this.renderer = new PIXI.autoDetectRenderer( options.stageWidth, options.stageHeight)
    this.renderer.view.width  = window.innerWidth
    this.renderer.view.height = window.innerHeight
    this.renderer.autoDensity = true
    this.renderer.antialias   = true
    
    this.renderer.view.width  = window.innerWidth
    this.renderer.view.height = window.innerHeight
    this.renderer.autoDensity = true
    this.renderer.antialias   = true

    // PIXI STAGE
    this.stage                = new PIXI.Container();
    this.slidesContainer      = new PIXI.Container();
    this.slidesContainer.sortableChildren = true;

    // FILTER INIT
    this.warpFilter = new WarpFilter().warpFilter;
    console.log('waaaarp', this.warpFilter)
    this.zoomFilter = new ZoomBlurFilter(0,[window.innerWidth/2, window.innerHeight/2], 150)
    
    await this.renderDom()

    this.loadPixiSprites()

    this.ticker           = PIXI.Ticker.shared;
    this.ticker.autoStart = true;
    this.ticker.add(( delta ) => {
      this.renderer.render( this.stage )
    })

    this.slidesContainer.children.forEach((item, index) => {
      gsap.set( item.mask, { pixi: {scaleX:10, scaleY:10}} )
    })
    this.setCurrentSlide(1)

  }

  async renderDom() {
    return new Promise((resolve, reject) => {
      // Add canvas to the HTML
      document.body.appendChild( this.renderer.view );
      // Add child container to the main container 
      this.stage.addChild( this.slidesContainer );
      // Enable Interactions
      this.stage.interactive = false;
      // Set the filter to stage and set some default values for the animation
      this.stage.filters = [
        this.warpFilter,
        this.zoomFilter
      ];
      resolve()
    })
       
  }

  /// ---------------------------
  //  LOAD SLIDES TO CANVAS
  /// ---------------------------          
  loadPixiSprites() {
    
    const myList = this.options.sprites

    myList.forEach((sprite, i) => {
      console.log({i})
      const texture                 = new PIXI.Texture.from( sprite );
      texture.baseTexture.mipmap    = true
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      const image                   = new PIXI.Sprite( texture );
      const maske                   = new PIXI.Sprite.from( './img/maschera.png' );
      maske.anchor.x = 0.5;
      maske.anchor.y = 0.5;

      image.addChild(maske)
      
      image.anchor.set(0.5);

      image.x = this.renderer.width / 2;
      image.y = this.renderer.height / 2;

      image.zIndex = 99 - i

      if(this.renderer.width/this.renderer.height > 4096/2048) {
        image.height = (this.renderer.width * 2048) / 4096;
        image.width = this.renderer.width;
      } else {
        image.height = this.renderer.height;
        image.width = (this.renderer.height * 4096) / 2046;
      }
            
      gsap.set( image, { alpha: 1 } );
      image.mask = maske
      image.myName = i
      this.slidesContainer.addChild( image );
    })


  }

  moveSlider(newIndex, oldIndex) {

    console.log({newIndex, oldIndex})

    const slideImages = this.slidesContainer.children;    
    this.isPlaying = true;
    
    const baseTimeline = gsap.timeline({
      onComplete: function () {
        console.log('finito')
        this.isPlaying = false;          
      }
    });
    
    baseTimeline.clear();
    if ( baseTimeline.isActive() ) {
      return;
    }
    
    const clonedInstance = {x: JSON.parse(JSON.stringify(slideImages[0].scale._x)), y:JSON.parse(JSON.stringify(slideImages[0].scale._y))}
    const startingScaleX = parseFloat(clonedInstance.x)
    const startingScaleY = parseFloat(clonedInstance.y)

    const zoomedX = startingScaleX + 0.4
    const zoomedY = startingScaleY + 0.4
    
    const zoomedXout = startingScaleX - 0.3
    const zoomedYout = startingScaleY - 0.3

    const zoomedXInitial = startingScaleX - 0.3
    const zoomedYInitial = startingScaleY - 0.3


    const underPic = slideImages.find(i => i.myName === newIndex)
    const overPic = slideImages.find(i => i.myName === oldIndex)
    console.log({underPic})

    slideImages.forEach((item, index) => {
      gsap.set(item, { zIndex: 0, alpha: 0})
    })

    baseTimeline
      .set(overPic.mask, { pixi: {scaleX:10, scaleY:10}})
      .set(underPic.mask, { pixi: {scaleX:10, scaleY:10}})
      .set(underPic, { zIndex: 2, alpha: 1, pixi: {zIndex: 20}})
      .set(overPic, { zIndex: 20, alpha: 1, pixi: {zIndex: 20}})

      .set(underPic.mask, { zIndex: 2, alpha: 1})
      .set(overPic.mask, { zIndex: 20, alpha: 1})
      // andata
      .to(overPic, 1.4, { ease: Power1.easeOut, pixi: {scaleX:zoomedX, scaleY:zoomedY, rotation: -14}})
      .to(this.warpFilter, 1.4, { ease: Power1.easeInOut, x: -0.8, y:-0.8, verticals: 1.1 }, '-=3')
      .to(overPic.mask, 1.4, { alpha: 0.95, ease: Power3.easeOut, pixi: {scaleX:2, scaleY:2, rotation: -10} }, '-=1.2')
      .to(this.zoomFilter, 1, { ease: Power1.easeInOut, strength: 0.19 }, '-=1')
      // ritorno
      .to(overPic, 1.3, { ease: Power1.easeOut, pixi: {scaleX:zoomedXout, scaleY:zoomedYout, rotation: -20}}, '-=0.3')
      .to(overPic.mask, 1.2, { alpha: 0, ease: Power3.easeOut, pixi: {scaleX:1.9, scaleY:1.9, rotation: -80}}, '-=1')
      .to(this.zoomFilter, 1.3, { ease: Power1.easeOut, strength: 0 }, '-=0.9')
      .to(this.warpFilter, 1.3, { ease: Power1.easeOut, x: 0, y:0, verticals: 1 }, '-=0.9')

      .set(overPic, { zIndex: 0, pixi: {scaleX:zoomedXInitial, scaleY:zoomedYInitial, rotation: 0}})
      .set(overPic.mask, { zIndex: 0, alpha: 1, pixi: {scaleX:10, scaleY:10, rotation: 0}})

  }

  setCurrentSlide(newIndex) {
    const currentImage = this.slidesContainer.children.find(i => i.myName === newIndex)
    currentImage.zIndex = 999
    gsap.set(currentImage, {zIndex: 999})
  }

};

export default CanvasSlideshow