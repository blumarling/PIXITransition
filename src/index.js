import './fishEye'
import gsap, { Power1, Power3 } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import './style.scss';
import * as PIXI from 'pixi.js'
import {ZoomBlurFilter} from '@pixi/filter-zoom-blur';
PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);
import {fragment} from './fishEye'

// PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

window.addEventListener('DOMContentLoaded', () => {
  
  setTimeout(() => document.body.classList.add('render'), 60);
  
  var spriteImages 	= document.querySelectorAll( '.slide-item__image' );
  var spriteImagesSrc = [];

  for ( var i = 0; i < spriteImages.length; i++ ) {
    var img = spriteImages[i];
    spriteImagesSrc.push( img.getAttribute('src' ) );
  }

  var initCanvasSlideshow = new canvasSlideshow({
    sprites: spriteImagesSrc,
    autoPlay: true,
    centerSprites: true,
    stageHeight: window.innerHeight,
    stageWidth: window.innerWidth,
  });

})

function canvasSlideshow( options ) {

  //  SCOPE
  /// ---------------------------      
  var that  =   this;

  //  OPTIONS
  /// ---------------------------      
  options                     = options || {};
  options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 1920;
  options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1080;
  options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
  options.centerSprites       = options.hasOwnProperty('centerSprites') ? options.centerSprites : false;
  options.texts               = options.hasOwnProperty('texts') ? options.texts : [];
  options.autoPlay            = options.hasOwnProperty('autoPlay') ? options.autoPlay : true;
  options.autoPlaySpeed       = options.hasOwnProperty('autoPlaySpeed') ? options.autoPlaySpeed : [10, 3];
  options.fullScreen          = options.hasOwnProperty('fullScreen') ? options.fullScreen : true;
  options.navElement          = options.hasOwnProperty('navElement')  ?  options.navElement : document.querySelectorAll( '.scene-nav' ); 
  options.wacky               = options.hasOwnProperty('wacky') ? options.wacky : false;
  options.interactive         = options.hasOwnProperty('interactive') ? options.interactive : false;
  options.interactionEvent    = options.hasOwnProperty('interactionEvent') ? options.interactionEvent : '';
  options.textColor           = options.hasOwnProperty('textColor') ? options.textColor : '#fff';
  options.dispatchPointerOver = options.hasOwnProperty('dispatchPointerOver') ? options.dispatchPointerOver : false;
  
  //  PIXI VARIABLES
  /// ---------------------------    
  var renderer            = new PIXI.autoDetectRenderer( options.stageWidth, options.stageHeight, {
    transparent: true,
    autoDensity: true,
    antialias: true
  });
  renderer.view.width = window.innerWidth
  renderer.view.height = window.innerHeight
  renderer.autoDensity = true
  renderer.antialias = true

  // console.log({renderer})
  var stage               = new PIXI.Container();
  var slidesContainer     = new PIXI.Container();
  slidesContainer.sortableChildren = true;

  // var twistFilter  = new TwistFilter(0,0,0);

  var uniforms = {
    dimensions: new Float32Array([0,0]),
    verticals: 1.0
  };

  var warpFilter = new PIXI.Filter(null, fragment, uniforms);
  warpFilter.autoFit = true

  Object.defineProperties(warpFilter, {
    x: {
      get: function() {
        return this.uniforms.dimensions[0];
      },
      set: function(value) {
        this.uniforms.dimensions[0] = value;
      }
    },
    y: {
      get: function() {
        return this.uniforms.dimensions[1];
      },
      set: function(value) {
        this.uniforms.dimensions[1] = value;
      }
    },
    verticals: {
      get: function() {
        return this.uniforms.verticals;
      },
      set: function(value) {
        this.uniforms.verticals = value;
      }
    }
  });
  var zoomFilter = new ZoomBlurFilter(0,[window.innerWidth/2, window.innerHeight/2], 150)

  //  TEXTS
  /// ---------------------------    
  var style = new PIXI.TextStyle({
    fill: options.textColor,
    wordWrap: true,
    wordWrapWidth: 400,
    letterSpacing: 20,
    fontSize: 14
  });

  
  //  SLIDES ARRAY INDEX
  /// ---------------------------    
  this.currentIndex = 0;

  /// ---------------------------
  //  INITIALISE PIXI
  /// ---------------------------      
  this.initPixi = function() {

    // Add canvas to the HTML
    document.body.appendChild( renderer.view );

    // Add child container to the main container 
    stage.addChild( slidesContainer );
    // Enable Interactions
    stage.interactive = true;
    // console.log(renderer.view.style);

    // displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    // Set the filter to stage and set some default values for the animation
    stage.filters = [
      warpFilter,
      zoomFilter
    ];        
    

  };



  /// ---------------------------
  //  LOAD SLIDES TO CANVAS
  /// ---------------------------          
  this.loadPixiSprites = function( sprites ) {
    

    var rSprites = options.sprites;
    var rTexts   = options.texts;


    for ( var i = 0; i < rSprites.length; i++ ) {
      
      var texture   = new PIXI.Texture.from( sprites[i] );
      texture.baseTexture.mipmap = true
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      var image     = new PIXI.Sprite( texture );

      const maske    = new PIXI.Sprite.from( './img/maschera.png' );
      maske.anchor.x = 0.5;
      maske.anchor.y = 0.5;
      image.addChild(maske)
      

      if ( rTexts ) {
        var richText = new PIXI.Text( rTexts[i], style);
        image.addChild(richText);

        richText.anchor.set(0.5);
        richText.x = image.width / 2;
        richText.y = image.height / 2;                     
      }
      
      image.anchor.set(0.5);
      // console.log({image})
      image.x = renderer.width / 2;
      image.y = renderer.height / 2;
      // image.zIndex = rSprites.length - i;
      image.zIndex = 99 - i

      if(renderer.width/renderer.height > 4096/2048) {
        image.height = (renderer.width * 2048) / 4096;
        image.width = renderer.width;
      } else {
        image.height = renderer.height;
        image.width = (renderer.height * 4096) / 2046;
      }
      
      // console.log(renderer.height)
      
      gsap.set( image, { alpha: 1 } );
      image.mask = maske
      slidesContainer.addChild( image );
    } 

  };
  


  /// ---------------------------
  //  DEFAULT RENDER/ANIMATION
  /// ---------------------------        
  var ticker = PIXI.Ticker.shared;
  ticker.autoStart = true;
  ticker.add(function( delta ) {
    renderer.render( stage );
  });  
  

  /// ---------------------------
  //  TRANSITION BETWEEN SLIDES
  /// ---------------------------    
  let isPlaying   = false;  
  const slideImages = slidesContainer.children;    

  this.moveSlider = ( newIndex, oldIndex ) => {
    
    console.log({newIndex, oldIndex})

    isPlaying = true;
    
    const baseTimeline = gsap.timeline( {
      onComplete: function () {
        console.log('finito')
        isPlaying = false;          
      },
      onUpdate: function() {
        
      }
    });
    
    baseTimeline.clear();

    if ( baseTimeline.isActive() ) {
      return;
    }
    
    const clonedInstance = {...slideImages[0].scale}
    const startingScaleX = new Number(clonedInstance._x)
    const startingScaleY = new Number(clonedInstance._y)

    const zoomedX = startingScaleX + 0.4
    const zoomedY = startingScaleY + 0.4
    
    const zoomedXout = startingScaleX - 0.3
    const zoomedYout = startingScaleY - 0.3

    const zoomedXInitial = startingScaleX - 0.3
    const zoomedYInitial = startingScaleY - 0.3

    const underPic = slideImages[newIndex]
    const overPic = slideImages[oldIndex]
    
    // console.log({slideImages})

    // console.log({underPic})
    // console.log({overPic})

    slideImages.forEach((item, index) => {
      gsap.set(item, { zIndex: 0, alpha: 0})
    })

    // console.log({newIndex})

    baseTimeline
      .set(overPic.mask, { pixi: {scaleX:10, scaleY:10}})
      .set(underPic.mask, { pixi: {scaleX:10, scaleY:10}})
      .set(underPic, { zIndex: 2, alpha: 1, pixi: {zIndex: 20}})
      .set(overPic, { zIndex: 20, alpha: 1, pixi: {zIndex: 20}})

      .set(underPic.mask, { zIndex: 2, alpha: 1})
      .set(overPic.mask, { zIndex: 20, alpha: 1})
      // andata
      .to(overPic, 1.4, { ease: Power1.easeOut, pixi: {scaleX:zoomedX, scaleY:zoomedY, rotation: -14}})
      .to(warpFilter, 1.4, { ease: Power1.easeInOut, x: -0.8, y:-0.8, verticals: 1.1 }, '-=3')
      .to(overPic.mask, 1.4, { alpha: 0.95, ease: Power3.easeOut, pixi: {scaleX:2, scaleY:2, rotation: -10} }, '-=1.2')
      .to(zoomFilter, 1, { ease: Power1.easeInOut, strength: 0.19 }, '-=1')
      // ritorno
      .to(overPic, 1.3, { ease: Power1.easeOut, pixi: {scaleX:zoomedXout, scaleY:zoomedYout, rotation: -20}}, '-=0.3')
      .to(overPic.mask, 1.2, { alpha: 0, ease: Power3.easeOut, pixi: {scaleX:1.9, scaleY:1.9, rotation: -80}}, '-=1')
      .to(zoomFilter, 1.3, { ease: Power1.easeOut, strength: 0 }, '-=0.9')
      .to(warpFilter, 1.3, { ease: Power1.easeOut, x: 0, y:0, verticals: 1 }, '-=0.9')

      .set(overPic, { zIndex: 0, pixi: {scaleX:zoomedXInitial, scaleY:zoomedYInitial, rotation: 0}})
      .set(overPic.mask, { zIndex: 0, alpha: 1, pixi: {scaleX:10, scaleY:10, rotation: 0}})

  };

  /// ---------------------------
  //  INIT FUNCTIONS
  /// ---------------------------    

  this.init = function() {

    that.initPixi();
    that.loadPixiSprites( options.pixiSprites );
  

    slideImages.forEach((item, index) => {
      gsap.set( item.mask, { pixi: {scaleX:10, scaleY:10}} )
    })

    setTimeout(() => {
      this.moveSlider(1,2)
    }, 4000)
    setTimeout(() => {
      this.moveSlider(2,1)
    }, 9000)

  };

  
  /// ---------------------------
  //  START 
  /// ---------------------------           
  this.init();

};