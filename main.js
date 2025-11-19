/**
 * Author: Baris AKIN
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Atom } from './src/Atom.js';
import { atoms } from './src/data.js';
import TWEEN from '@tweenjs/tween.js';
import i18n from './src/i18n.js';
// import { getElementName, getReactivity, getUses } from './src/translations.js'; // Removed legacy imports

// Detect browser language
console.log('Language detected:', i18n.language);

// Scene setuping this as it's used later in the code
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
controls.minDistance = 10; // Minimum zoom in distance
controls.maxDistance = 220; // Maximum zoom out distance (increased for better grid view)

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
const gridSpacing = 60; // Increased spacing for better separation between atoms
const gridSize = 3;

// Loading Screen Logic
const loadingScreen = document.getElementById('loading-screen');

function initAtoms() {
    atoms.slice(0, 27).forEach((atomData, index) => {
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

    // Hide loading screen after atoms are generated
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Defer atom generation to allow loading screen to render
setTimeout(initAtoms, 100);

// Periodic Table Logic
const periodicTableOverlay = document.getElementById('periodic-table-overlay');
const periodicTableGrid = document.getElementById('periodic-table-grid');
const atomsButton = document.getElementById('atoms-button');

// Set translated button text
atomsButton.textContent = i18n.t('ui.periodicTable');

// Electron Speed Control
const speedLabel = document.getElementById('speed-label');
const speedButtons = document.querySelectorAll('.speed-btn');
let currentSpeedMultiplier = 1;

// Set translated speed label
speedLabel.textContent = i18n.t('ui.electronSpeed') + ':';

// Add click handlers for speed buttons
speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        speedButtons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Get speed multiplier from data attribute
        currentSpeedMultiplier = parseFloat(btn.dataset.speed);

        // Update all existing electrons' speed
        atomObjects.forEach(atom => {
            atom.electrons.forEach(electron => {
                // The base speed is already set, we just need to update the multiplier
                // The electron update function will use this multiplier
                electron.speedMultiplier = currentSpeedMultiplier;
            });
        });
    });
});

atomsButton.addEventListener('click', () => {
    updatePeriodicTableHighlights();
    periodicTableOverlay.classList.remove('hidden');
});

periodicTableOverlay.addEventListener('click', (e) => {
    if (e.target === periodicTableOverlay) {
        periodicTableOverlay.classList.add('hidden');
    }
});

function updatePeriodicTableHighlights() {
    // Get all currently active atom names
    const activeAtomNames = new Set(atomObjects.map(a => a.data.name));

    const cells = document.querySelectorAll('.periodic-atom');
    cells.forEach(cell => {
        const atomName = cell.dataset.atomName;
        if (activeAtomNames.has(atomName)) {
            cell.classList.add('active');
        } else {
            cell.classList.remove('active');
        }
    });
}

function createPeriodicTable() {
    atoms.forEach(atomData => {
        const cell = document.createElement('div');
        cell.className = 'periodic-atom';
        cell.dataset.atomName = atomData.name; // Store name for highlighting logic
        if (atomData.isReactive) {
            cell.classList.add('reactive');
        }

        // Display translated element name
        const translatedName = i18n.t(`element.${atomData.name}.name`);
        cell.innerHTML = `
            <div class="periodic-atom-symbol">${atomData.symbol}</div>
            <div class="periodic-atom-number">${atomData.atomicNumber}</div>
            <div class="periodic-atom-name">${translatedName}</div>
        `;

        // Apply grid positioning
        cell.style.gridColumn = atomData.xpos;
        cell.style.gridRow = atomData.ypos;

        const popup = document.getElementById('atom-popup');

        cell.addEventListener('mouseenter', (e) => {
            // Populate popup with translated content
            const translatedName = i18n.t(`element.${atomData.name}.name`);
            const translatedReactivity = i18n.t(`reactivity.${atomData.reactivity}`);

            popup.innerHTML = `
                <h4>${translatedName} (${atomData.symbol})</h4>
                <p><strong>${i18n.t('ui.atomicNumber')}</strong> ${atomData.atomicNumber}</p>
                <p><strong>${i18n.t('ui.protons')}</strong> ${atomData.protons}</p>
                <p><strong>${i18n.t('ui.neutrons')}</strong> ${atomData.neutrons}</p>
                <p><strong>${i18n.t('ui.electrons')}</strong> ${atomData.electrons}</p>
                <p class="${atomData.isReactive ? 'reactive' : ''}"><strong>${i18n.t('ui.reactivityLabel')}</strong> ${translatedReactivity}</p>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.2); margin: 8px 0;">
                <p style="font-size: 0.9em; color: #ddd;">${i18n.t('infoPanel.description_template', {
                name: translatedName,
                symbol: atomData.symbol,
                atomicNumber: atomData.atomicNumber,
                reactivity: translatedReactivity
            })}</p>
                ${atomData.melting !== null ? `<p style="font-size: 0.9em;"><strong>${i18n.t('infoPanel.headers.Melting Point')}:</strong> ${atomData.melting}°C</p>` : ''}
                ${atomData.boiling !== null ? `<p style="font-size: 0.9em;"><strong>${i18n.t('infoPanel.headers.Boiling Point')}:</strong> ${atomData.boiling}°C</p>` : ''}
                ${atomData.density !== null ? `<p style="font-size: 0.9em;"><strong>${i18n.t('infoPanel.headers.Density')}:</strong> ${atomData.density} g/cm³</p>` : ''}
            `;

            // Show popup
            popup.style.display = 'block';

            // Position popup to the right of the cell
            const rect = cell.getBoundingClientRect();
            popup.style.top = `${rect.top}px`;
            popup.style.left = `${rect.right + 10}px`;

            // Adjust if it goes off screen (simple check)
            if (rect.right + 10 + 250 > window.innerWidth) {
                popup.style.left = `${rect.left - 260}px`; // Show on left if no space on right
            }
        });

        cell.addEventListener('mouseleave', () => {
            popup.style.display = 'none';
        });

        cell.addEventListener('click', (e) => {
            // Check if element has isotopes
            if (atomData.isotopes && atomData.isotopes.length > 0) {
                showIsotopeSubmenu(atomData, cell);
            } else {
                handleAtomSelection(atomData);
            }
        });

        periodicTableGrid.appendChild(cell);
    });
}

function showIsotopeSubmenu(atomData, cell) {
    // Remove any existing submenu
    const existingSubmenu = document.getElementById('isotope-submenu');
    if (existingSubmenu) {
        existingSubmenu.remove();
    }

    // Create submenu
    const submenu = document.createElement('div');
    submenu.id = 'isotope-submenu';
    submenu.style.cssText = `
        position: fixed;
        background: rgba(0, 20, 40, 0.95);
        border: 2px solid #00ccff;
        border-radius: 8px;
        padding: 12px;
        z-index: 10001;
        min-width: 180px;
    `;

    // Add title
    const title = document.createElement('div');
    title.textContent = `${i18n.t(`element.${atomData.name}.name`)} Isotopes`;
    title.style.cssText = `
        color: #00ccff;
        font-weight: bold;
        margin-bottom: 8px;
        text-align: center;
        font-size: 14px;
    `;
    submenu.appendChild(title);

    // Add isotope options
    atomData.isotopes.forEach(isotope => {
        const option = document.createElement('div');
        option.style.cssText = `
            padding: 8px;
            margin: 4px 0;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            color: white;
            font-size: 12px;
            transition: background 0.2s;
        `;

        const massNumber = `${atomData.symbol}-${isotope.mass}`;
        const stability = isotope.stable ? '✓' : '☢';
        option.innerHTML = `
            <div style="font-weight: bold;">${massNumber} ${stability}</div>
            <div style="font-size: 10px; color: #aaa;">${isotope.abundance}</div>
        `;

        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(0, 204, 255, 0.3)';
        });

        option.addEventListener('mouseleave', () => {
            option.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        option.addEventListener('click', () => {
            // Create atom data with custom neutron count
            const isotopeData = { ...atomData, neutrons: isotope.neutrons, massNumber: isotope.mass };
            handleAtomSelection(isotopeData);
            submenu.remove();
        });

        submenu.appendChild(option);
    });

    // Position submenu near the cell
    const rect = cell.getBoundingClientRect();
    submenu.style.top = `${rect.bottom + 5}px`;
    submenu.style.left = `${rect.left}px`;

    // Add to body
    document.body.appendChild(submenu);

    // Close submenu when clicking outside
    const closeSubmenu = (e) => {
        if (!submenu.contains(e.target) && e.target !== cell) {
            submenu.remove();
            document.removeEventListener('click', closeSubmenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeSubmenu), 100);
}

function handleAtomSelection(newAtomData) {
    // Hide table
    periodicTableOverlay.classList.add('hidden');

    // Select random atom to remove
    const randomIndex = Math.floor(Math.random() * atomObjects.length);
    const oldAtom = atomObjects[randomIndex];
    const position = oldAtom.group.position.clone();

    // Remove old atom
    scene.remove(oldAtom.group);
    atomObjects.splice(randomIndex, 1);

    // Create new atom
    const newAtom = new Atom(newAtomData);
    newAtom.group.position.copy(position);
    scene.add(newAtom.group);
    atomObjects.push(newAtom);

    // Update labels for the new atom
    newAtom.updateLabels(camera);

    // Zoom to new atom
    selectAtom(newAtom);
}

createPeriodicTable();

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



function zoomToAtom(targetGroup) {
    const targetPosition = targetGroup.position.clone();


    // Calculate offset based on a fixed distance for now
    // We could calculate bounding box but fixed is safer for now
    const offset = new THREE.Vector3(0, 2, 20);
    const newCameraPosition = targetPosition.clone().add(offset);



    const cameraTween = new TWEEN.Tween(camera.position, tweenGroup)
        .to({ x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)

        .start();


    const targetTween = new TWEEN.Tween(controls.target, tweenGroup)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

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
    let foundNucleon = null;

    if (intersects.length > 0) {
        let object = intersects[0].object;

        // Check if hovering over a nucleon (proton or neutron)
        if (object.geometry && object.geometry.type === 'SphereGeometry' && object.parent && object.parent.name === 'nucleus') {
            foundNucleon = object;
        }

        // Check if hovering over nucleus to find atom
        if (object.parent && object.parent.name === 'nucleus') {
            const atomGroup = object.parent.parent;
            if (atomObjects.some(a => a.group === atomGroup)) {
                foundAtom = atomObjects.find(a => a.group === atomGroup);
            }
        }
    }

    // Handle nucleon hover effect
    if (window.hoveredNucleon !== foundNucleon) {
        // Reset previous hovered nucleon
        if (window.hoveredNucleon && window.hoveredNucleon.material) {
            if (!window.hoveredNucleon.material.emissive) {
                window.hoveredNucleon.material.emissive = new THREE.Color(0x000000);
            }
            window.hoveredNucleon.material.emissive.setHex(0x000000);
            window.hoveredNucleon.material.emissiveIntensity = 0;
        }

        // Highlight new hovered nucleon with bright colors
        if (foundNucleon && foundNucleon.material && foundNucleon.material.color) {
            // Create emissive property if it doesn't exist
            if (!foundNucleon.material.emissive) {
                foundNucleon.material.emissive = new THREE.Color(0x000000);
            }

            // Use bright yellow for protons (red base) and bright cyan for neutrons (gray base)
            const isProton = foundNucleon.material.color.r > 0.5; // Red channel high = proton
            const highlightColor = isProton ? 0xffff00 : 0x00ffff; // Yellow for protons, cyan for neutrons

            foundNucleon.material.emissive.setHex(highlightColor);
            foundNucleon.material.emissiveIntensity = 2.0; // Much brighter
        }

        window.hoveredNucleon = foundNucleon;
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
    // Ignore clicks on UI elements (like the periodic table)
    if (event.target !== renderer.domElement) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Filter to only sprites (labels and info panels), ignore meshes (nucleons, electrons)
    const spriteIntersects = intersects.filter(i => i.object instanceof THREE.Sprite);

    if (spriteIntersects.length > 0) {
        const object = spriteIntersects[0].object;
        console.log('Clicked sprite:', object.name, 'userData:', object.userData);

        // Check if clicked on info panel - close it
        if (object.name === 'infoPanel' && object.userData.atomName) {
            const atom = atomObjects.find(a => a.data.name === object.userData.atomName);
            if (atom && atom.infoPanel) {
                atom.toggleInfoPanel();
                return;
            }
        }

        // Check if clicked on a label sprite
        if (object.name === 'label' && object.userData.atomName) {
            const atom = atomObjects.find(a => a.data.name === object.userData.atomName);
            if (atom) {
                // Check distance from camera to atom
                const distance = camera.position.distanceTo(atom.group.position);
                const maxDistanceForInfoPanel = 50; // Only open info panel when close enough

                if (distance > maxDistanceForInfoPanel) {
                    // Too far - just zoom to the atom instead
                    selectAtom(atom);
                    return;
                }

                // Close other panels first
                atomObjects.forEach(a => {
                    if (a !== atom && a.infoPanel) {
                        a.toggleInfoPanel();
                    }
                });
                atom.toggleInfoPanel();
                return;
            }
        }

        // Otherwise check for atom nucleus click
        let clickedObject = object;
        let atomGroup = null;

        // Traverse up to find the atom group
        while (clickedObject && !atomGroup) {
            if (clickedObject.parent && clickedObject.parent.type === 'Group') {
                // Check if this group belongs to an atom
                const foundAtom = atomObjects.find(a => a.group === clickedObject.parent);
                if (foundAtom) {
                    atomGroup = clickedObject.parent;
                    break;
                }
            }
            clickedObject = clickedObject.parent;
        }

        if (atomGroup) {
            const atom = atomObjects.find(a => a.group === atomGroup);
            if (atom) {
                selectAtom(atom);
            }
        }
        return;
    }

    // If no sprites clicked, check for nucleus clicks (for zoom)
    const nucleusIntersects = intersects.filter(i => i.object.parent?.name === 'nucleus');
    if (nucleusIntersects.length > 0) {
        const nucleusObject = nucleusIntersects[0].object;
        let atomGroup = null;
        let current = nucleusObject;

        // Traverse up to find the atom group
        while (current && !atomGroup) {
            if (current.parent && current.parent.type === 'Group') {
                const foundAtom = atomObjects.find(a => a.group === current.parent);
                if (foundAtom) {
                    atomGroup = current.parent;
                    break;
                }
            }
            current = current.parent;
        }

        if (atomGroup) {
            const atom = atomObjects.find(a => a.group === atomGroup);
            if (atom) {
                selectAtom(atom);
            }
        }
    }
});

// Add mousemove event listener for hover effects
window.addEventListener('mousemove', onMouseMove);



// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;
const fpsCounter = document.getElementById('fps-counter');

function animate(time) {
    requestAnimationFrame(animate);

    // Calculate FPS
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    fps = 1000 / deltaTime;
    lastTime = currentTime;

    // Update FPS display every 10 frames
    if (frameCount % 10 === 0) {
        fpsCounter.textContent = `FPS: ${Math.round(fps)}`;
    }

    const updateResult = tweenGroup.update(performance.now());


    frameCount++;

    controls.update();

    atomObjects.forEach(atom => {
        atom.update(time);
        atom.updateLabels(camera);
    });

    renderer.render(scene, camera);
}

animate();
