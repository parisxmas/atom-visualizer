import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import TWEEN from '@tweenjs/tween.js';
import { atoms } from './src/data.js';
import { Atom } from './src/Atom.js'; // Keeping this as it's used later in the code
import './style.css';

// Create TWEEN group for managing tweens
const tweenGroup = new TWEEN.Group();


// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510); // Dark blueish black

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(60, 60, 100); // Isometric-ish view

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false; // Disabled for debugging

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.5);
scene.add(hemisphereLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Add a light attached to the camera so the object is always lit from the front
const cameraLight = new THREE.PointLight(0xffffff, 1);
camera.add(cameraLight);
scene.add(camera); // Important: add camera to scene so its children are rendered

// Atoms
// Atoms
const atomObjects = [];
const gridSpacing = 40; // Increased spacing for better visibility
const gridSize = 3;

atoms.forEach((atomData, index) => {
    const atom = new Atom(atomData);

    // 3x3x3 Grid Logic
    const xIndex = index % gridSize;
    const yIndex = Math.floor(index / gridSize) % gridSize;
    const zIndex = Math.floor(index / (gridSize * gridSize));

    // Center the grid
    // Indices are 0, 1, 2. Center is 1.
    // (0-1)*S = -S, (1-1)*S = 0, (2-1)*S = S

    const x = (xIndex - 1) * gridSpacing;
    const y = -(yIndex - 1) * gridSpacing; // Invert Y for top-down feel
    const z = (zIndex - 1) * gridSpacing;

    atom.group.position.set(x, y, z);
    scene.add(atom.group);
    atomObjects.push(atom);
});

// Create Atom List UI
const atomListContainer = document.getElementById('atom-list');
const listTitle = document.createElement('h3');
listTitle.textContent = 'Atoms';
atomListContainer.appendChild(listTitle);

atomObjects.forEach((atom) => {
    const listItem = document.createElement('div');
    listItem.className = 'atom-list-item';
    listItem.textContent = `${atom.data.symbol} - ${atom.data.name}`;
    listItem.dataset.atomName = atom.data.name;

    listItem.addEventListener('click', () => {
        // Remove selected class from all items
        document.querySelectorAll('.atom-list-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Add selected class to clicked item
        listItem.classList.add('selected');

        // Zoom to atom
        selectAtom(atom);
    });

    atomListContainer.appendChild(listItem);
});

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



function zoomToAtom(targetGroup) {
    const targetPosition = targetGroup.position.clone();
    console.log('Main: Zooming to', targetPosition);

    // Calculate offset based on a fixed distance for now
    // We could calculate bounding box but fixed is safer for now
    const offset = new THREE.Vector3(0, 2, 20);
    const newCameraPosition = targetPosition.clone().add(offset);

    console.log('Main: New camera pos', newCameraPosition);

    console.log('Creating camera tween from', camera.position, 'to', newCameraPosition);

    const cameraTween = new TWEEN.Tween(camera.position, tweenGroup)
        .to({ x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onStart(() => console.log('Main: Tween started'))
        .onUpdate(() => console.log('Main: Tween update', camera.position))
        .onComplete(() => console.log('Main: Tween complete'))
        .start();

    console.log('Camera tween created:', cameraTween);

    const targetTween = new TWEEN.Tween(controls.target, tweenGroup)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    console.log('Target tween created:', targetTween);
}



// Hover Interaction
// Hover Interaction
let hoveredAtom = null;
let selectedAtom = null; // New state for clicked atom
const hoverScale = 1.5;
const normalScale = 1.0;

function setHoverAtom(atom) {
    // If we have a selected atom, we generally want to keep it scaled up.
    // If we hover over ANOTHER atom, maybe we scale that one up too?
    // Or maybe we only allow one scaled atom at a time?
    // Let's say: Selected atom stays scaled. Hovered atom scales up.
    // If hovered == selected, nothing changes.

    const targetAtom = atom || selectedAtom; // Default to selected if no hover

    if (hoveredAtom !== targetAtom) {
        // Reset previous hovered atom IF it's not the selected one
        if (hoveredAtom && hoveredAtom !== selectedAtom) {
            new TWEEN.Tween(hoveredAtom.group.scale, tweenGroup)
                .to({ x: normalScale, y: normalScale, z: normalScale }, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }

        // Set new
        if (targetAtom) {
            new TWEEN.Tween(targetAtom.group.scale, tweenGroup)
                .to({ x: hoverScale, y: hoverScale, z: hoverScale }, 300)
                .easing(TWEEN.Easing.Back.Out)
                .start();
        }

        hoveredAtom = targetAtom;
    }
}

function onMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    let foundAtom = null;

    if (intersects.length > 0) {
        let object = intersects[0].object;
        if (object.parent && object.parent.name === 'nucleus') {
            const atomGroup = object.parent.parent;
            if (atomObjects.some(a => a.group === atomGroup)) {
                foundAtom = atomObjects.find(a => a.group === atomGroup);
            }
        }
    }

    setHoverAtom(foundAtom);
}

function selectAtom(atom) {
    if (!atom) return;

    // Deselect previous if different
    if (selectedAtom && selectedAtom !== atom) {
        new TWEEN.Tween(selectedAtom.group.scale, tweenGroup)
            .to({ x: normalScale, y: normalScale, z: normalScale }, 300)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    selectedAtom = atom;
    console.log('Main: selected atom', atom.data.name);

    // Force scale up
    new TWEEN.Tween(atom.group.scale, tweenGroup)
        .to({ x: hoverScale, y: hoverScale, z: hoverScale }, 300)
        .easing(TWEEN.Easing.Back.Out)
        .start();

    zoomToAtom(atom.group);
    setHoverAtom(atom);
}

// Global Click Listener using Raycasting
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        // Check if clicked on a label sprite
        if (object.name === 'label' && object.userData.atomName) {
            const atom = atomObjects.find(a => a.data.name === object.userData.atomName);
            if (atom) {
                selectAtom(atom);
                return;
            }
        }

        // Otherwise check for atom nucleus click
        let clickedObject = object;
        let atomGroup = null;

        while (clickedObject.parent && clickedObject.parent !== scene) {
            clickedObject = clickedObject.parent;
        }

        if (clickedObject.parent === scene) {
            atomGroup = clickedObject;
        }

        if (atomGroup) {
            const atom = atomObjects.find(a => a.group === atomGroup);
            if (atom) selectAtom(atom);
        }
    }
});



// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let frameCount = 0;
function animate(time) {
    requestAnimationFrame(animate);

    const updateResult = tweenGroup.update(performance.now());

    // Log every 60 frames to avoid spam
    if (frameCount % 60 === 0) {
        console.log('TWEEN update result:', updateResult, 'TWEEN object:', TWEEN);
    }
    frameCount++;

    controls.update();

    atomObjects.forEach(atom => atom.update(time));

    renderer.render(scene, camera);
}

animate();
