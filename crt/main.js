import * as THREE from 'three';

const WARP_FACTOR = 1.05;

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

        const loader = new THREE.TextureLoader();
        
        const landscapeTexture = await loader.loadAsync('./textures/landscape.jpg');

        this.textureWidth = landscapeTexture.image.width;
        this.textureHeight = landscapeTexture.image.height;
        this.textureAspectRatio = landscapeTexture.image.width / landscapeTexture.image.height;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                diffuse: { value: landscapeTexture },
                time: { value: 0.0 },
                warpFactor: { value: WARP_FACTOR },
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text()
        });

        const geometry = new THREE.PlaneGeometry(1, 1);
        const plane = new THREE.Mesh(geometry, this.material);
        plane.position.set(0.5, 0.5, 0);
        this.scene.add(plane);

        window.addEventListener('keydown', this.onToggleWarpPressed);
    }

    onWindowResize() {
        const windowAspectRatio = window.innerWidth / window.innerHeight;

        const width = windowAspectRatio > this.textureAspectRatio
            ? this.textureWidth * window.innerHeight / this.textureHeight
            : window.innerWidth;
        const height = windowAspectRatio > this.textureAspectRatio
            ? window.innerHeight
            : this.textureHeight * window.innerWidth / this.textureWidth;

        this.threejs.setSize(width, height);
    }

    onToggleWarpPressed(event) {
        if (event.key === 'f') {
            app.material.uniforms.warpFactor.value = app.material.uniforms.warpFactor.value !== 1.0 
                ? 1.0
                : WARP_FACTOR;
        }
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
        this.material.uniforms.time.value = this.previousRAFTime * 0.001;
    }
}

let app = null;

window.addEventListener('DOMContentLoaded', async () => {
    app = new ShaderApp();
    await app.initialize();
});