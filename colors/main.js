import * as THREE from 'three';

class ShaderApp {
    async initialize() {
        this.threejs = new THREE.WebGLRenderer();
        document.body.appendChild(this.threejs.domElement);

        window.addEventListener('resize', () => {
            this.onWindowResize();
        }, false);

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
        this.camera.position.set(0, 0, 1);

        await this.setupProject();

        this.previousRAFTime = null;
        this.onWindowResize();
        this.raf();
    }

    async setupProject() {
        const vsh = await fetch('./shaders/vertex-shader.glsl');
        const fsh = await fetch('./shaders/fragment-shader.glsl');

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Vector4(1.0, 0.0, 1.0, 1.0) },
                color2: { value: new THREE.Vector4(0.0, 1.0, 0.0, 1.0) }
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text()
        });

        const colors = [
            new THREE.Color(0xFFFFFF),
            new THREE.Color(0x000000),
            new THREE.Color(0xFF00FF),
            new THREE.Color(0x08ACDE),
        ].flatMap((c) => c.toArray());

        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.setAttribute(
            'colors',
            new THREE.Float32BufferAttribute(colors, 3)
        );

        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(0.5, 0.5, 0);
        this.scene.add(plane);
    }

    onWindowResize() {
        this.threejs.setSize(window.innerWidth, window.innerHeight);
    }

    raf() {
        requestAnimationFrame((t) => {
            if (this.previousRAFTime === null) {
                this.previousRAFTime = t;
            }

            this.step(t - this.previousRAFTime);
            this.threejs.render(this.scene, this.camera);
            this.raf();

            this.previousRAFTime = t;
        });
    }

    step(t) {
    }
}

let app = null;

window.addEventListener('DOMContentLoaded', async () => {
    app = new ShaderApp();
    await app.initialize();
});