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
let isARMode = false;

function updateScene() {
    // Hide all scenes except scene0 and builder (builder always visible)
    for (let i = 1; i < scenes.length; i++) {
        const sceneEl = document.querySelector(`#scene${i}`);
        if (sceneEl) {
            sceneEl.setAttribute('visible', false);
        }
    }

    // Welcome board (scene0) always visible
    const welcomeEl = document.querySelector('#scene0');
    if (welcomeEl) {
        welcomeEl.setAttribute('visible', true);
    }

    // Show scenes up to currentScene
    for (let i = 1; i <= currentScene; i++) {
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

// Scene navigation
function nextScene() {
    if (currentScene < scenes.length - 1) {
        currentScene++;
        updateScene();
        console.log('Next scene:', scenes[currentScene].name);
        
        // Start background music when reaching Scene 1
        if (currentScene === 1) {
            const bgMusic = document.querySelector('#background-music-entity');
            if (bgMusic && bgMusic.components && bgMusic.components.sound) {
                bgMusic.components.sound.playSound();
                console.log('Starting background music from Scene 1');
            }
        }
    }
}

function prevScene() {
    if (currentScene > 0) {
        currentScene--;
        updateScene();
        console.log('Previous scene:', scenes[currentScene].name);
        
        // Stop background music if going back to Scene 0
        if (currentScene === 0) {
            const bgMusic = document.querySelector('#background-music-entity');
            if (bgMusic && bgMusic.components && bgMusic.components.sound) {
                bgMusic.components.sound.stopSound();
                console.log('Stopping background music at Scene 0');
            }
        }
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
        showPopup('🚪 Welcome to the Developer Villa!\n\n' +
                 'This is your learning space where you\'ll build your skills.\n\n' +
                 'Explore the room to discover:\n' +
                 '• Interactive project canvas\n' +
                 '• Decorative wall art\n' +
                 '• Modern furniture setup\n' +
                 '• Learning resources\n\n' +
                 'Click on glowing objects to learn more!');
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
    popup.style.opacity = '1'; // Ensure visible
    console.log('Popup shown:', message);
    // Auto-close after 5 seconds for all modes
    setTimeout(() => {
        closePopup();
    }, 5000);
}

function closePopup() {
    const popup = document.getElementById('infoPopup');
    popup.style.opacity = '0'; // Fade out
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300); // Wait for fade-out animation
    console.log('Popup closed');
}

// Sound handling functions
function playDoorSound() {
    const clickSound = document.querySelector('#click-sound-entity');
    if (clickSound && clickSound.components && clickSound.components.sound) {
        try {
            clickSound.components.sound.stopSound();
            clickSound.components.sound.playSound();
            console.log('Playing door sound.');
        } catch (error) {
            console.error('Error playing door sound:', error);
        }
    }
}

function playTreeSound() {
    const treeSound = document.querySelector('#tree-sound-entity');
    if (treeSound && treeSound.components && treeSound.components.sound) {
        try {
            treeSound.components.sound.stopSound();
            treeSound.components.sound.playSound();
            console.log('Playing tree sound.');
        } catch (error) {
            console.error('Error playing tree sound:', error);
        }
    }
}

// Enhanced object click handling
function handleObjectClick(event) {
    const clickedObject = event.target;
    const objectId = clickedObject.id;

    // Get camera position
    const camera = document.querySelector('a-camera');
    const cameraPosition = camera.getAttribute('position');

    // Handle door click
    if (objectId === 'villa-door') {
        playDoorSound();
        toggleDoor();
        showPopup('🚪 Welcome to the Developer Villa!\n\n' +
                 'This is your learning space where you\'ll build your skills.\n\n' +
                 'Explore the room to discover:\n' +
                 '• Interactive project canvas\n' +
                 '• Modern furniture setup\n' +
                 '• Learning resources\n\n' +
                 'Click on glowing objects to learn more!');
    }
    // Handle tree click
    else if (objectId === 'tree-plaque') {
        playTreeSound();
        showPopup('🌳 Project Tree of Growth\n\nThis tree represents your portfolio development! Each fruit symbolizes a project you\'ll create:\n\n🍎 HTML/CSS Static Sites\n🍊 JavaScript Interactive Apps\n🍇 React Components & SPAs\n🍌 Full-Stack Applications\n🥝 Advanced Frameworks\n\nWatch your skills grow with each project!');
    }
    // Handle project canvas click
    else if (objectId === 'project-canvas') {
        // Check if user is inside the villa (z position less than -6)
        if (cameraPosition.z < -6 || isARMode) { // Allow AR mode to always access
            // Create two popups side by side
            const leftPopup = document.createElement('div');
            leftPopup.className = 'info-popup left-popup';
            leftPopup.innerHTML = `
                <div class="popup-content">
                    <span class="popup-text">
                        🎓 HYPER ISLAND MODULES (Part 1)
                        <br><br>
                        01. 🎯 Leadership & Team Excellence
                        <br>    - Team dynamics and leadership
                        <br>    - Project management
                        <br><br>
                        02. 💻 HTML, CSS & JavaScript
                        <br>    - Core web development
                        <br>    - Frontend basics
                        <br><br>
                        03. 🤝 Code & Collaborate 1
                        <br>    - Agile Development
                        <br>    - Team projects
                        <br><br>
                        04. ⚛️ JavaScript & React
                        <br>    - Modern frontend
                        <br>    - Component architecture
                    </span>
                    <button onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

            const rightPopup = document.createElement('div');
            rightPopup.className = 'info-popup right-popup';
            rightPopup.innerHTML = `
                <div class="popup-content">
                    <span class="popup-text">
                        🎓 HYPER ISLAND MODULES (Part 2)
                        <br><br>
                        05. 🎨 Code & Collaborate 2
                        <br>    - Figma design
                        <br>    - UX/UI principles
                        <br><br>
                        06. 🔧 Backend & Standards
                        <br>    - Server development
                        <br>    - Accessibility & SEO
                        <br><br>
                        07. 🌟 Code & Collaborate 3
                        <br>    - Client projects
                        <br>    - Professional work
                        <br><br>
                        08. 🎮 WebXR & Immersive
                        <br>    - 3D and VR
                        <br>    - Interactive experiences
                    </span>
                    <button onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

            document.body.appendChild(leftPopup);
            document.body.appendChild(rightPopup);

            // Auto-close popups after 8 seconds
            setTimeout(() => {
                if (leftPopup.parentNode) {
                    leftPopup.style.animation = 'popupFadeOut 0.5s ease-out forwards';
                    setTimeout(() => leftPopup.remove(), 500);
                }
                if (rightPopup.parentNode) {
                    rightPopup.style.animation = 'popupFadeOut 0.5s ease-out forwards';
                    setTimeout(() => rightPopup.remove(), 500);
                }
            }, 8000);
        } else {
            showPopup('🚫 Please enter the villa first to view the modules!');
        }
    }
    else if (clickedObject.classList.contains('clickable')) {
        // Generic clickable object
        showPopup('🎯 Interactive Element\n\nThis object is part of your learning journey. Explore and discover more!');
    }
}

// VR/AR Mode Handling
function showDebugInfo(message) {
    console.log(`[AR Debug] ${message}`);
    // Create or update debug overlay
    let debugOverlay = document.querySelector('.debug-overlay');
    if (!debugOverlay) {
        debugOverlay = document.createElement('div');
        debugOverlay.className = 'debug-overlay';
        document.body.appendChild(debugOverlay);
    }
    debugOverlay.innerHTML += `<div>${message}</div>`;
}

function showARInstructions() {
    showDebugInfo('Showing AR instructions...');
    // Remove any existing instructions first
    const existingInstructions = document.querySelector('.ar-instructions');
    if (existingInstructions) {
        existingInstructions.remove();
    }

    const instructions = document.createElement('div');
    instructions.className = 'ar-instructions';
    instructions.innerHTML = `
        <div class="ar-instructions-content">
            <h2>🎯 AR Mode Instructions</h2>
            <div class="instruction-steps">
                <p>1. 📱 Point your camera at a flat surface</p>
                <p>2. 👆 Tap to place the villa in your space</p>
                <p>3. 🎮 Use WASD to move around</p>
                <p>4. 👀 Look around with your device</p>
                <p>5. ✨ Click on glowing objects to interact</p>
                <p>6. 🚪 Enter through the door to explore</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
        </div>
    `;
    document.body.appendChild(instructions);
}

function enterVR() {
    const scene = document.querySelector('a-scene');
    if (scene) {
        isVRMode = true;
        isARMode = false;
        scene.enterVR();
        // Show VR instructions
        const vrInstructions = document.querySelector('#vr-instructions');
        if (vrInstructions) {
            vrInstructions.setAttribute('visible', 'true');
            vrInstructions.setAttribute('value', 'VR Controls:\nRight trigger = Next Scene\nLeft trigger = Previous Scene\nWASD = Move\nMouse = Look around');
        }
        // Enable VR controls
        setupControls(true);
    }
}

function enterAR() {
    const scene = document.querySelector('a-scene');
    if (scene) {
        isARMode = true;
        isVRMode = false;
        scene.enterAR();
        // Show AR instructions
        const vrInstructions = document.querySelector('#vr-instructions');
        if (vrInstructions) {
            vrInstructions.setAttribute('visible', 'true');
            vrInstructions.setAttribute('value', 'AR Controls:\nRight trigger = Next Scene\nLeft trigger = Previous Scene\nWASD = Move\nMouse = Look around');
        }
        // Enable AR controls
        setupControls(true);
    }
}

// Setup controls for both VR and AR
function setupControls(isImmersive) {
    const camera = document.querySelector('a-camera');
    if (camera) {
        // Enable WASD controls
        camera.setAttribute('wasd-controls', {
            enabled: true,
            acceleration: 65,
            fly: false,
            adEnabled: true,
            wsEnabled: true
        });

        // Enable look controls
        camera.setAttribute('look-controls', {
            enabled: true,
            pointerLockEnabled: isImmersive,
            reverseMouseDrag: false
        });

        // Enable cursor
        const cursor = document.querySelector('a-cursor');
        if (cursor) {
            cursor.setAttribute('raycaster', {
                objects: '.clickable',
                enabled: true
            });
        }
    }
}

// VR/AR Controller Event Handling
document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    
    // Initial setup for desktop controls
    setupControls(false);
    
    scene.addEventListener('controllerconnected', function(event) {
        const controller = event.detail;
        
        // Right trigger for next scene
        controller.addEventListener('triggerdown', function() {
            if (isVRMode || isARMode) {
                nextScene();
            }
        });
        
        // Left trigger for previous scene
        controller.addEventListener('gripdown', function() {
            if (isVRMode || isARMode) {
                prevScene();
            }
        });
    });

    // Handle mode changes
    scene.addEventListener('enter-vr', function() {
        isVRMode = true;
        isARMode = false;
        setupControls(true);
    });

    scene.addEventListener('exit-vr', function() {
        isVRMode = false;
        setupControls(false);
    });

    scene.addEventListener('enter-ar', function() {
        isARMode = true;
        isVRMode = false;
        setupControls(true);
    });

    scene.addEventListener('exit-ar', function() {
        isARMode = false;
        setupControls(false);
    });
});

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
        playTreeSound();
        showPopup('🌳 Project Tree of Growth\n\nThis tree represents your portfolio development! Each fruit symbolizes a project you\'ll create:\n\n🍎 HTML/CSS Static Sites\n🍊 JavaScript Interactive Apps\n🍇 React Components & SPAs\n🍌 Full-Stack Applications\n🥝 Advanced Frameworks\n\nWatch your skills grow with each project!');
    }
});

// Show loading indicator briefly
document.getElementById('loading').style.display = 'block';
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    console.log('Loading complete');
}, 2000);

// Attach click handler for all clickable objects in the scene
if (document.querySelector('a-scene')) {
  document.querySelector('a-scene').addEventListener('click', handleObjectClick);
}

// Check WebXR support
function checkWebXRSupport() {
    if (navigator.xr) {
        showDebugInfo('WebXR is available');
        navigator.xr.isSessionSupported('immersive-ar')
            .then((supported) => {
                if (supported) {
                    showDebugInfo('AR is supported on this device');
                } else {
                    showDebugInfo('AR is not supported on this device');
                    showPopup('⚠️ AR is not supported on your device. Please try a different browser or device.');
                }
            })
            .catch((error) => {
                showDebugInfo('Error checking AR support: ' + error);
                showPopup('⚠️ Error checking AR support. Please make sure WebXR is enabled in Chrome flags.');
            });
    } else {
        showDebugInfo('WebXR is not available');
        showPopup('⚠️ WebXR is not available. Please enable WebXR in Chrome flags.');
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkWebXRSupport();
    // ... rest of your existing DOMContentLoaded code ...
});