
// script.js

// Example: Mouse hover effect
document.getElementById('content').addEventListener('mouseover', function() {
    this.style.backgroundColor = '#ffeb3b';
});

document.getElementById('content').addEventListener('mouseout', function() {
    this.style.backgroundColor = '';
});

// Example: Click effect
document.getElementById('content').addEventListener('click', function() {
    alert('Content clicked!');
});

// 鼠标跟随效果
const follower = document.getElementById('follower');
document.addEventListener('mousemove', function(e) {
    follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// 点击生成随机颜色方块
document.addEventListener('click', function(e) {
    const box = document.createElement('div');
    box.className = 'random-box';
    box.style.left = `${e.clientX - 25}px`; // Center the box at click position
    box.style.top = `${e.clientY - 25}px`; // Center the box at click position
    box.style.backgroundColor = getRandomColor();
    document.body.appendChild(box);
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 页面滚动动画
document.addEventListener('scroll', function() {
    const content = document.getElementById('content');
    const scrollPosition = window.scrollY;
    content.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});

// 鼠标拖尾雾化线条效果
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

let mouseX = 0;
let mouseY = 0;
const trail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function drawTrail() {
    ctx.clearRect(0, 0, width, height);
    
    trail.push({ x: mouseX, y: mouseY });

    if (trail.length > 100) {
        trail.shift();
    }

    ctx.beginPath();
    for (let i = 0; i < trail.length; i++) {
        const opacity = i / trail.length;
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = 5;
        if (i === 0) {
            ctx.moveTo(trail[i].x, trail[i].y);
        } else {
            ctx.lineTo(trail[i].x, trail[i].y);
        }
    }
    ctx.stroke();
}

function animate() {
    drawTrail();
    requestAnimationFrame(animate);
}

animate();
