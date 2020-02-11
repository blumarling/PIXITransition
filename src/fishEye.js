export const fragment = `precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 dimensions;
uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform float verticals;

vec2 warpAmount = vec2( dimensions.x, dimensions.y );

vec2 warp(vec2 pos)
{
  // warping by the center of filterArea
  pos = pos * 2.0 - 1.0;
  pos *= vec2(
    verticals + (pos.y * pos.y) * warpAmount.x,
    1.0 + (pos.x * pos.x) * warpAmount.y
  );
  return pos * 0.5 + 0.5;;
}
 
void main() {
  vec2 coord = vTextureCoord;
  coord = coord * inputSize.xy / outputFrame.zw;
  coord = warp( coord );
  coord = coord * inputSize.zw * outputFrame.zw;
  gl_FragColor = texture2D( uSampler, coord );
}`  

export const vertex = `
#ifdef GL_ES
precision highp float;
#endif

uniform mat3 projectionMatrix;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;

void main(void){
	vTextureCoord = aTextureCoord;
	gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
}
`