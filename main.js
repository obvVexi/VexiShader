import * as THREE from 'three';

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Clock
const clock = new THREE.Clock();

// Shader Material
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader')?.textContent || `
        varying vec3 vPos;
        void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: document.getElementById('fragmentShader')?.textContent || `
        uniform float uTime;
        varying vec3 vPos;

        void main() {
            vec3 color = 0.5 + 0.5*cos(uTime + vPos*10.0 + vec3(0,2,4));
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    uniforms: {
        uTime: { value: 0 }
    }
});

// Geometry
const geometry = new THREE.IcosahedronGeometry(1, 128);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value = clock.getElapsedTime();
    mesh.rotation.y += 0.002;
    mesh.rotation.x += 0.001;
    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
