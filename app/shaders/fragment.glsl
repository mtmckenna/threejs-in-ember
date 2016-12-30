// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

uniform sampler2D texture;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 ambientLight = vec3(0.4, 0.4, 0.4);
  vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);
  vec3 lightDirection = vec3(0.0, 1.0, 0.0);
  float directionalLightMagnitude = max(dot(vNormal, lightDirection), 0.0);
  vec3 light = ambientLight + directionalLightColor * directionalLightMagnitude;

  vec4 texelColor = texture2D(texture, vUv);
  gl_FragColor = vec4(texelColor.rgb * light, texelColor.a);
}

