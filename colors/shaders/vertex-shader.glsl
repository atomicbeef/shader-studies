attribute vec3 colors;

varying vec2 vUvs;
varying vec3 vColor;

void main() {
    vec4 localPosition = vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * localPosition;
    vUvs = uv;
    vColor = colors;
}