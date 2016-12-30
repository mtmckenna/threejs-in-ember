// http://codepen.io/lejeunerenard/pen/MyMLWP
// https://threejs.org/docs/#Developer_Reference/WebGLRenderer/WebGLProgram
// https://csantosbh.wordpress.com/2014/01/09/custom-shaders-with-three-js-uniforms-textures-and-lighting/

uniform sampler2D texture;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec4 texelColor = texture2D(texture, vUv);
  gl_FragColor = vec4(texelColor.rgb * vNormal, texelColor.a);
}

