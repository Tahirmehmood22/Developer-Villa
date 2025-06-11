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

let isDoorOpen = false;
let isVRMode = false;

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
        console.log('Next scene:', scenes[currentScene].name);
    }
}

function prevScene() {
    if (currentScene > 0) {
        currentScene--;
        updateScene();
        console.log('Previous scene:', scenes[currentScene].name);
    }
}

// Improved door interaction with realistic opening animation
function toggleDoor() {
    const door = document.querySelector('#villa-door');
    if (!door) return;

    isDoorOpen = !isDoorOpen;
    
    if (isDoorOpen) {
        // Open door - realistic swing with pivot point on the left side
        door.setAttribute('animation', 'property: rotation; to: 0 -85 0; dur: 2000; easing: easeInOutQuad');
        door.setAttribute('animation__move', 'property: position; to: 0.6 1.5 -5.2; dur: 2000; easing: easeInOutQuad');
        // Move camera back
        document.querySelector('#cameraRig').setAttribute('animation__camback', 'property: position; to: 0 1.6 6; dur: 1500; easing: easeInOutQuad');

        console.log('Door opened!');
        showPopup('🚪 Welcome to the Developer Villa!\n\nStep through this door to begin your journey into web development. Each room represents a skill you\'ll master at Hyper Island - from HTML foundations to advanced React development.');
    } else {
        // Close door
        door.setAttribute('animation', 'property: rotation; to: 0 0 0; dur: 2000; easing: easeInOutQuad');
        door.setAttribute('animation__move', 'property: position; to: 0 1.5 -5.8; dur: 2000; easing: easeInOutQuad');
        // Reset camera forward
        document.querySelector('#cameraRig').setAttribute('animation__camback', 'property: position; to: 0 1.6 3; dur: 1500; easing: easeInOutQuad');

        console.log('Door closed!');
    }
}

// Popup functions with improved VR handling
function showPopup(message) {
    const popup = document.getElementById('infoPopup');
    const popupText = document.getElementById('popupText');
    
    popupText.textContent = message;
    popup.style.display = 'block';
    console.log('Popup shown:', message);
    
    // Auto-close after 8 seconds in VR mode for better UX
    if (isVRMode) {
        setTimeout(() => {
            closePopup();
        }, 8000);
    }
}

function closePopup() {
    const popup = document.getElementById('infoPopup');
    popup.style.display = 'none';
    console.log('Popup closed');
}

// Enhanced object click handling
function handleObjectClick(event) {
    const target = event.target;
    console.log('Object clicked:', target.id, target.className);
    
    if (target.id === 'villa-door') {
        toggleDoor();
    } else if (target.id === 'tree-plaque') {
        showPopup('🌳 Project Tree of Growth\n\nThis tree represents your portfolio development! Each fruit symbolizes a project you\'ll create:\n\n🍎 HTML/CSS Static Sites\n🍊 JavaScript Interactive Apps\n🍇 React Components & SPAs\n🍌 Full-Stack Applications\n🥝 Advanced Frameworks\n\nWatch your skills grow with each project!');
    } else if (target.classList.contains('clickable')) {
        // Generic clickable object
        showPopup('🎯 Interactive Element\n\nThis object is part of your learning journey. Explore and discover more!');
    }
}

// Enhanced VR mode detection and controls
function setupVRTriggers() {
    const sceneEl = document.querySelector('a-scene');
    
    // Check VR mode status more frequently for better responsiveness
    setInterval(() => {
        const wasVRMode = isVRMode;
        isVRMode = sceneEl && sceneEl.is('vr-mode');
        
        if (isVRMode && !wasVRMode) {
            console.log('Entered VR mode - Enhanced triggers activated');
            enhanceVRInteraction();
            setupVRControllers();
        } else if (!isVRMode && wasVRMode) {
            console.log('Exited VR mode');
        }
    }, 100);
}

function enhanceVRInteraction() {
    // Enhance glowing effects for VR visibility
    const clickableElements = document.querySelectorAll('.clickable');
    clickableElements.forEach(element => {
        if (isVRMode) {
            // Stronger glow in VR for better visibility
            element.setAttribute('animation__glow', 'property: material.emissiveIntensity; to: 1.5; dur: 800; dir: alternate; loop: true');
        } else {
            // Normal glow for desktop
            element.setAttribute('animation__glow', 'property: material.emissiveIntensity; to: 0.8; dur: 1000; dir: alternate; loop: true');
        }
    });
}

function setupVRControllers() {
    if (!isVRMode) return;
    
    const sceneEl = document.querySelector('a-scene');
    
    // Enhanced controller support for navigation
    sceneEl.addEventListener('triggerdown', (evt) => {
        console.log('VR Trigger pressed:', evt.detail.hand);
        if (evt.detail.hand === 'right') {
            nextScene();
        } else if (evt.detail.hand === 'left') {
            prevScene();
        }
    });
    
    sceneEl.addEventListener('gripdown', (evt) => {
        console.log('VR Grip pressed:', evt.detail.hand);
        if (evt.detail.hand === 'right') {
            nextScene();
        } else if (evt.detail.hand === 'left') {
            prevScene();
        }
    });
    
    // Controller button interactions
    sceneEl.addEventListener('abuttondown', (evt) => {
        closePopup();
        console.log('VR A button: Close popup');
    });
    
    sceneEl.addEventListener('bbuttondown', (evt) => {
        toggleDoor();
        console.log('VR B button: Toggle door');
    });
    
    // X and Y button support
    sceneEl.addEventListener('xbuttondown', (evt) => {
        nextScene();
        console.log('VR X button: Next scene');
    });
    
    sceneEl.addEventListener('ybuttondown', (evt) => {
        prevScene();
        console.log('VR Y button: Previous scene');
    });
}

// VR/AR Functions with improved error handling
function enterVR() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl && sceneEl.enterVR) {
        sceneEl.enterVR().then(() => {
            console.log('VR mode activated successfully');
            setupVRTriggers();
        }).catch((error) => {
            console.log('VR not available:', error.message);
        });
    } else {
        console.log('VR not supported or A-Frame not ready');
    }
}

function enterAR() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl && sceneEl.enterAR) {
        sceneEl.enterAR().then(() => {
            console.log('AR mode activated successfully');
        }).catch((error) => {
            console.log('AR not available:', error.message);
        });
    } else {
        console.log('AR not supported or A-Frame not ready');
    }
}

// Initialize when A-Frame is loaded
document.addEventListener('DOMContentLoaded', function() {
    const sceneEl = document.querySelector('a-scene');
    
    console.log('DOM loaded, initializing...');
    
    // Enhanced click handler setup
    sceneEl.addEventListener('click', handleObjectClick);
    
    // Raycast hit events for better VR interaction
    sceneEl.addEventListener('raycaster-intersected', function (evt) {
        if (evt.detail.el.classList.contains('clickable')) {
            console.log('Raycaster hit clickable object:', evt.detail.el.id);
        }
    });
    
    if (sceneEl.hasLoaded) {
        console.log('Scene already loaded');
        updateScene();
        setupVRTriggers();
    } else {
        sceneEl.addEventListener('loaded', function () {
            console.log('Scene loaded event fired');
            updateScene();
            setupVRTriggers();
        });
    }
});

// Enhanced keyboard controls
document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
    
    if (event.key === 'ArrowRight' || event.key === ' ') {
        nextScene();
    } else if (event.key === 'ArrowLeft') {
        prevScene();
    } else if (event.key === 'Enter' || event.key === 'o' || event.key === 'O') {
        toggleDoor();
    } else if (event.key === 'Escape') {
        closePopup();
    } else if (event.key === 't' || event.key === 'T') {
        // Tree interaction shortcut
        const treePlaque = document.querySelector('#tree-plaque');
        if (treePlaque) {
            handleObjectClick({ target: treePlaque });
        }
    }
});

// Show loading indicator briefly
document.getElementById('loading').style.display = 'block';
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    console.log('Loading complete');
}, 2000);