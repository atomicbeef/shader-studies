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
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text()
        });

        const geometry = new THREE.PlaneGeometry(1, 1);
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