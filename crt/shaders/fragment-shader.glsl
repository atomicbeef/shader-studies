uniform sampler2D diffuse;
uniform float warpFactor;
uniform float time;

varying vec2 vUvs;

float inverseLerp(float x, float minimum, float maximum) {
    return (x - minimum) / (maximum - minimum);
}

float remap(float x, float oldMin, float oldMax, float newMin, float newMax) {
    float t = inverseLerp(x, oldMin, oldMax);
    return mix(newMin, newMax, t);
}

void main() {
    vec2 offsetUvs = vUvs - 0.5;
    
    // Convert UVs to polar coordinates
    float theta = atan(offsetUvs.y, offsetUvs.x);
    float radius = length(offsetUvs);

    radius = pow(radius, warpFactor);
    
    vec2 warpedUvs = radius * vec2(cos(theta), sin(theta)) + 0.5;

    vec4 diffuseSample = texture2D(diffuse, warpedUvs);
    
    float crtDown = remap(
        sin(warpedUvs.y * 100.0 + time * 10.0),
        -1.0,
        1.0,
        0.0,
        0.15
    );

    float crtUp = remap(
        sin(warpedUvs.y * 25.0 - time * 2.0),
        -1.0,
        1.0,
        0.0,
        0.15
    );

    vec3 color = mix(diffuseSample.rgb, vec3(0.0), crtDown);
    color = mix(color, vec3(0.0), crtUp);

    gl_FragColor = vec4(color, 1.0);
}