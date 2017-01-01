// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

uniform sampler2D uTexture;
uniform int uPartyMode;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

void partyLight(in float startValue, in float time, out float outValue) {
  float speedBoost = 10.0;
  outValue = abs(sin((time + startValue) * speedBoost));
}

void partyLights(in float time, out vec3 outValue) {
  float red, green, blue;
  partyLight(0.1, time, red);
  partyLight(0.5, time, green);
  partyLight(0.9, time, blue);
  outValue = vec3(red, green, blue);
}

void main() {
  vec3 ambientLight = vec3(0.2, 0.2, 0.2);
  vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);
  vec3 lightDirection = vec3(0.0, 1.0, 1.0);
  float directionalLightMagnitude = max(dot(vNormal, lightDirection), 0.0);

  if (uPartyMode == 1) {
    partyLights(uTime, ambientLight);
  }

  vec3 light = ambientLight + directionalLightColor * directionalLightMagnitude;

  vec4 texelColor = texture2D(uTexture, vUv);
  gl_FragColor = vec4(texelColor.rgb * light, texelColor.a);
}

