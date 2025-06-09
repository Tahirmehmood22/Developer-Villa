let currentScene = 0;
const scenes = [
    { name: "Welcome", description: "Developer Villa Journey" },
    { name: "HTML Foundation", description: "Building the Ground" },
    { name: "CSS Walls", description: "Structure & Design" },
    { name: "JavaScript Windows", description: "Interactivity & Logic" },
    { name: "Node.js Basement", description: "Backend Knowledge" },
    { name: "React Roof", description: "Advanced Development" },
    { name: "Design Table", description: "Figma & Planning" },
    { name: "Project Tree", description: "Growth from Practice" },
    { name: "Road Ahead", description: "Beyond Hyper Island" }
];

function updateScene() {
    // Hide all scenes
    for (let i = 0; i < scenes.length; i++) {
        const sceneEl = document.querySelector(`#scene${i}`);
        if (sceneEl) {
            sceneEl.setAttribute('visible', false);
        }
    }

    // Show scenes up to current scene
    for (let i = 0; i <= currentScene; i++) {
        const sceneEl = document.querySelector(`#scene${i}`);
        if (sceneEl) {
            sceneEl.setAttribute('visible', true);
        }
    }

    // Update UI
    document.getElementById('sceneInfo').textContent = 
        `${scenes[currentScene].name} (${currentScene + 1}/${scenes.length})`;
    
    document.getElementById('prevBtn').disabled = currentScene === 0;
    document.getElementById('nextBtn').disabled = currentScene === scenes.length - 1;
}

function nextScene() {
    if (currentScene < scenes.length - 1) {
        currentScene++;
        updateScene();
    }
}

function prevScene() {
    if (currentScene > 0) {
        currentScene--;
        updateScene();
    }
}

// VR/AR Functions with proper A-Frame integration
function enterVR() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl && sceneEl.enterVR) {
        sceneEl.enterVR();
    } else {
        console.log('VR not supported or A-Frame not ready');
    }
}

function enterAR() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl && sceneEl.enterAR) {
        sceneEl.enterAR();
    } else {
        console.log('AR not supported or A-Frame not ready');
    }
}

// Initialize when A-Frame is loaded
document.addEventListener('DOMContentLoaded', function() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl.hasLoaded) {
        updateScene();
    } else {
        sceneEl.addEventListener('loaded', function () {
            updateScene();
        });
    }
});

// Keyboard controls
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        nextScene();
    } else if (event.key === 'ArrowLeft') {
        prevScene();
    }
});

// Show loading indicator briefly
document.getElementById('loading').style.display = 'block';
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
}, 2000);