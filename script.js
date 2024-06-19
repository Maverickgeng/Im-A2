// Ensure DOM is fully loaded before running script
document.addEventListener('DOMContentLoaded', function() {

     // I tried really hard to put a playable 3d modlie into my website. I think it is really cool to put at the begining of the website, and i use my name so i think i can use it as a tag of my work, and the footer gif as well to develop a strong personal style.   
    // Three.js setup
    let scene, camera, renderer, controls;

    function init3DModel() {
        const container = document.getElementById('model-container');

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 0.8);

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
        renderer.setSize(container.clientWidth / container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // Initialize the 3D model
    init3DModel();

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
    let mouseX = 50;
    let mouseY = 50;
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



    // Video player controls
    const video = document.getElementById('custom-video-player');
    const playPauseButton = document.getElementById('play-pause');
    const muteUnmuteButton = document.getElementById('mute-unmute');
    const volumeDownButton = document.getElementById('volume-down');
    const volumeUpButton = document.getElementById('volume-up');
    const fullscreenButton = document.getElementById('fullscreen');
    const replayButton = document.getElementById('replay');
    const progressBar = document.querySelector('.progress-bar .progress');

    playPauseButton.addEventListener('click', () => {
        console.log('Play/Pause button clicked'); // Debug log
        if (video.paused) {
            video.play();
            playPauseButton.src = 'pause.png';
        } else {
            video.pause();
            playPauseButton.src = 'play.png';
        }
    });

    muteUnmuteButton.addEventListener('click', () => {
        console.log('Mute/Unmute button clicked'); // Debug log
        video.muted = !video.muted;
        muteUnmuteButton.src = video.muted ? 'no-audio.png' : 'audio.png';
    });

    volumeDownButton.addEventListener('click', () => {
        console.log('Volume Down button clicked'); // Debug log
        video.volume = Math.max(video.volume - 0.1, 0);
    });

    volumeUpButton.addEventListener('click', () => {
        console.log('Volume Up button clicked'); // Debug log
        video.volume = Math.min(video.volume + 0.1, 1);
    });

    fullscreenButton.addEventListener('click', () => {
        console.log('Fullscreen button clicked'); // Debug log
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    });

    replayButton.addEventListener('click', () => {
        console.log('Replay button clicked'); // Debug log
        video.currentTime = 0;
        video.play();
    });

    video.addEventListener('play', () => {
        console.log('Video playing'); // Debug log
        playPauseButton.src = 'pause.png';
    });

    video.addEventListener('pause', () => {
        console.log('Video paused'); // Debug log
        playPauseButton.src = 'play.png';
    });

    video.addEventListener('timeupdate', () => {
        const progressPercent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    });

    window.addEventListener('scroll', () => {
        const bottomGifContainer = document.getElementById('bottom-gif-container');
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            bottomGifContainer.style.display = 'flex';
        } else {
            bottomGifContainer.style.display = 'none';
        }
    });
});

 // Iminage controls

 document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.image');
    const details = document.getElementById('details');
    const closeBtn = document.getElementById('close');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    images.forEach(image => {
        image.addEventListener('click', (e) => {
            if (image.dataset.pdf === "true") {
                e.preventDefault();
                // Add animation class to both image and its inner container
                const innerContainer = image.closest('.inner');
                innerContainer.classList.add('expand');
                image.classList.add('expand');
                setTimeout(() => {
                    window.location.href = 'pdf.html';
                }, 1000); // Match this timeout with the animation duration
            } else if (image.dataset.work2 === "true") {
                e.preventDefault();
                // Add animation class to both image and its inner container
                const innerContainer = image.closest('.inner');
                innerContainer.classList.add('expand');
                image.classList.add('expand');
                setTimeout(() => {
                    window.location.href = 'work2.html';
                }, 1000); // Match this timeout with the animation duration
            } else if (image.dataset.work3 === "true") {
                e.preventDefault();
                // Add animation class to both image and its inner container
                const innerContainer = image.closest('.inner');
                innerContainer.classList.add('expand');
                image.classList.add('expand');
                setTimeout(() => {
                    window.location.href = 'work3.html';
                }, 1000); // Match this timeout with the animation duration
            } else if (image.dataset.work4 === "true") {
                e.preventDefault();
                // Add animation class to both image and its inner container
                const innerContainer = image.closest('.inner');
                innerContainer.classList.add('expand');
                image.classList.add('expand');
                setTimeout(() => {
                    window.location.href = 'work4.html';
                }, 1000); // Match this timeout with the animation duration
            } else if (image.dataset.work5 === "true") {
                e.preventDefault();
                // Add animation class to both image and its inner container
                const innerContainer = image.closest('.inner');
                innerContainer.classList.add('expand');
                image.classList.add('expand');
                setTimeout(() => {
                    window.location.href = 'work5.html';
                }, 1000); // Match this timeout with the animation duration
            } else if (image.dataset.work6 === "true") {
                e.preventDefault();
                // Add animation class to both image and its inner container
                const innerContainer = image.closest('.inner');
                innerContainer.classList.add('expand');
                image.classList.add('expand');
                setTimeout(() => {
                    window.location.href = 'work6.html';
                }, 1000); // Match this timeout with the animation duration
            } else {
                details.style.display = 'flex';
                showParticles(image);
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        details.style.display = 'none';
    });

    let mouse = { x: 0, y: 0 };
    let particles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function drawTail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(mouse.x - 50, mouse.y - 50);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
        requestAnimationFrame(drawTail);
    }

    drawTail();
});