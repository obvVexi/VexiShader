import * as THREE from 'three';

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Clock
const clock = new THREE.Clock();

// Load Shaders
async function loadShader(url) {
    const res = await fetch(url);
    return await res.text();
}

async function init() {
    const vert = await loadShader('shader.vert');
    const frag = await loadShader('shader.frag');

    const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
            uTime: { value: 0 }
        },
        transparent: true,
    });

    const geometry = new THREE.IcosahedronGeometry(1, 128);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function animate() {
        requestAnimationFrame(animate);
        material.uniforms.uTime.value = clock.getElapsedTime();
        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.001;
        renderer.render(scene, camera);
    }
    animate();
}

init();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
