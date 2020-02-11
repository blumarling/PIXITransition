import './fishEye'
import gsap, { Power1, Power3 } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from 'pixi.js'
PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);
import {fragment} from './fishEye'

class WarpFilter {

  constructor() {
    this.uniforms = {
      dimensions: new Float32Array([0,0]),
      verticals: 1.0
    }
  
    this.warpFilter = new PIXI.Filter(null, fragment, this.uniforms)
    this.warpFilter.autoFit = true
    Object.defineProperties(this.warpFilter, {
      x: {
        get() {
          return this.uniforms.dimensions[0];
        },
        set(value) {
          this.uniforms.dimensions[0] = value;
        }
      },
      y: {
        get() {
          return this.uniforms.dimensions[1];
        },
        set(value) {
          this.uniforms.dimensions[1] = value;
        }
      },
      verticals: {
        get() {
          return this.uniforms.verticals;
        },
        set(value) {
          this.uniforms.verticals = value;
        }
      }
    });
  }

  

};

export default WarpFilter