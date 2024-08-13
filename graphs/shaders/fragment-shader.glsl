varying vec2 vUvs;

void main() {
    float firstDividerLine = smoothstep(0.0, 0.005, abs(vUvs.y - 0.33));
    float secondDividerLine = smoothstep(0.0, 0.005, abs(vUvs.y - 0.66));

    float stepLine = smoothstep(0.0, 0.005, abs(vUvs.y - mix(0.66, 1.0, step(0.5, vUvs.x))));
    float mixLine = smoothstep(0.0, 0.005, abs(vUvs.y - mix(0.33, 0.66, clamp(vUvs.x, 0.25, 0.75))));
    float smoothStepLine = smoothstep(0.0, 0.005, abs(vUvs.y - mix(0.0, 0.33, smoothstep(0.0, 1.0, vUvs.x))));

    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);
    vec3 black = vec3(0.0);
    vec3 green = vec3(0.0, 1.0, 0.0);

    vec3 color = vec3(0.0);

    if (vUvs.y > 0.66) {
        color = mix(red, blue, step(0.5, vUvs.x));
    } else if (vUvs.y > 0.33) {
        color = mix(red, blue, vUvs.x);
    } else {
        color = mix(red, blue, smoothstep(0.0, 1.0, vUvs.x));
    }

    color = mix(black, color, firstDividerLine);
    color = mix(black, color, secondDividerLine);

    color = mix(green, color, stepLine);
    color = mix(green, color, mixLine);
    color = mix(green, color, smoothStepLine);

    gl_FragColor = vec4(color, 1.0);
}