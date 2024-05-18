// script.js

// Three.js setup
let scene, camera, renderer, controls;

function init3DModel() {
    const container = document.getElementById('model-container');

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 1.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xcccccc, 5); // Soft morning light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffeecc, 20); // Morning sunlight color
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load model
    const loader = new THREE.GLTFLoader();
    loader.load('maverick.glb', function (gltf) {
        const model = gltf.scene;

        // Apply metal material
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xaaaaaa,
                    metalness: 1,  // Fully metallic
                    roughness: 0.2  // Slightly rough
                });
            }
        });

        model.position.set(0, 0, 0);
        scene.add(model);
        controls.target.copy(model.position); // Set controls target to model position
    }, undefined, function (error) {
        console.error(error);
    });

    

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    const container = document.getElementById('model-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize the 3D model
init3DModel();

// Existing code for custom cursor and trail effect
// Custom cursor element
const customCursor = document.getElementById('customCursor');

// Canvas setup for mouse trail
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Variables for mouse position and particles
let mouseX = 0;
let mouseY = 0;
const particles = [];
const maxParticles = 10;  // Shorten the trail further

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.top = `${mouseY}px`;
    addParticle(mouseX, mouseY);
});

document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        customCursor.classList.add('hover');
    } else {
        customCursor.classList.remove('hover');
    }
});

function addParticle(x, y) {
    if (particles.length > maxParticles) {
        particles.shift();
    }
    particles.push({ x, y, alpha: 1, size: Math.random() * 0.5 + 0.5 });  // Finer line
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    for (let i = 1; i < particles.length; i++) {
        const p1 = particles[i - 1];
        const p2 = particles[i];
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p1.alpha})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${p1.alpha})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p1.size;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        p1.alpha -= 0.1;  // Faster fade out for shorter trail
        if (p1.alpha <= 0) {
            particles.splice(i - 1, 1);
            i--;
        }
    }
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 8;
    ctx.stroke();
}

function animateParticles() {
    drawParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// 3D perspective effect on video
const videoContainer = document.querySelector('.media-player');
videoContainer.addEventListener('mousemove', (e) => {
    const rect = videoContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * 10;  // Further reduced rotation for effect
    const rotateY = ((x - midX) / midX) * -10;  // Further reduced rotation for effect
    videoContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    videoContainer.style.boxShadow = `${(x - midX) / midX * 10}px ${(y - midY) / midY * 10}px 20px rgba(255, 255, 255, 0.3)`;
});