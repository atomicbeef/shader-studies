uniform sampler2D diffuse;
uniform sampler2D overlay;
uniform vec4 tint;

varying vec2 vUvs;

void main() {
    vec2 flippedUv = vec2(vUvs.x, 1.0 - vUvs.y) * 4.0;
    vec4 carSample = texture2D(diffuse, flippedUv);

    vec4 overlaySample = texture2D(overlay, vUvs);

    gl_FragColor = mix(carSample * tint, overlaySample, overlaySample.w);
}