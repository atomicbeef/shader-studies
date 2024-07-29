uniform vec4 color1;
uniform vec4 color2;

varying vec2 vUvs;
varying vec3 vColor;

void main() {
    gl_FragColor = mix(vec4(vColor, 1.0), mix(color1, color2, vUvs.x), vUvs.x);
}