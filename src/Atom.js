/**
 * Author: Baris AKIN
 */
import * as THREE from 'three';
import { Nucleon } from './Nucleon.js';
import { Electron } from './Electron.js';
import i18n from './i18n.js';
import { getOrbitalGeometry } from './OrbitalGeometries.js';
// import { getElementName, getDescription, getUses } from './translations.js'; // Removed legacy imports

export class Atom {
    constructor(data) {
        this.data = data;
        this.group = new THREE.Group();
        this.electrons = [];

        this.createNucleus();
        this.createElectrons();
        this.createOrbitals();
        this.createLabel();
    }

    createNucleus() {
        const nucleusGroup = new THREE.Group();
        nucleusGroup.name = 'nucleus';
        const protonCount = this.data.protons;
        const neutronCount = this.data.neutrons;
        const totalNucleons = protonCount + neutronCount;

        // Simple packing algorithm: random sphere packing near center
        // or just random points inside a sphere
        // Ensure minimum radius for single nucleons
        const nucleusRadius = Math.max(0.8, Math.pow(totalNucleons, 1 / 3) * 0.6);

        // Hit Sphere (Invisible, for easier raycasting)
        const hitGeo = new THREE.SphereGeometry(Math.max(1.5, nucleusRadius * 3), 16, 16); // 3x radius for easier clicking
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitSphere = new THREE.Mesh(hitGeo, hitMat);
        nucleusGroup.add(hitSphere);

        // Special case: if only 1 nucleon, position it at center
        if (totalNucleons === 1) {
            if (protonCount === 1) {
                const proton = new Nucleon('proton');
                proton.mesh.position.set(0, 0, 0);
                nucleusGroup.add(proton.mesh);
            } else {
                const neutron = new Nucleon('neutron');
                neutron.mesh.position.set(0, 0, 0);
                nucleusGroup.add(neutron.mesh);
            }
        } else {
            for (let i = 0; i < protonCount; i++) {
                const proton = new Nucleon('proton');
                this.positionNucleon(proton.mesh, nucleusRadius, totalNucleons);
                nucleusGroup.add(proton.mesh);
            }

            for (let i = 0; i < neutronCount; i++) {
                const neutron = new Nucleon('neutron');
                this.positionNucleon(neutron.mesh, nucleusRadius, totalNucleons);
                nucleusGroup.add(neutron.mesh);
            }
        }

        this.group.add(nucleusGroup);
    }

    positionNucleon(mesh, radius, totalNucleons) {
        // Random position within sphere
        // Better: use a force-directed graph layout or pre-calculated positions
        // For now: random with some rejection sampling to avoid overlap (simplified)

        // For small numbers of nucleons, spread them out more
        const spreadFactor = totalNucleons <= 3 ? 0.5 : 0.8;
        const r = Math.random() * radius * spreadFactor;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        mesh.position.x = r * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = r * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = r * Math.cos(phi);
    }

    createElectrons() {
        const electronCount = this.data.electrons;

        // Define orbital filling order (Aufbau principle)
        // Format: { type, shell, suborbital, capacity, radius }
        const orbitalOrder = [
            { type: 's', shell: 1, suborbital: 0, capacity: 2, radius: 5 },
            { type: 's', shell: 2, suborbital: 0, capacity: 2, radius: 7 },
            { type: 'p', shell: 2, suborbital: 0, capacity: 2, radius: 7 },
            { type: 'p', shell: 2, suborbital: 1, capacity: 2, radius: 7 },
            { type: 'p', shell: 2, suborbital: 2, capacity: 2, radius: 7 },
            { type: 's', shell: 3, suborbital: 0, capacity: 2, radius: 9 },
            { type: 'p', shell: 3, suborbital: 0, capacity: 2, radius: 9 },
            { type: 'p', shell: 3, suborbital: 1, capacity: 2, radius: 9 },
            { type: 'p', shell: 3, suborbital: 2, capacity: 2, radius: 9 },
            { type: 's', shell: 4, suborbital: 0, capacity: 2, radius: 11 },
            { type: 'd', shell: 3, suborbital: 0, capacity: 2, radius: 9.5 },
            { type: 'd', shell: 3, suborbital: 1, capacity: 2, radius: 9.5 },
            { type: 'd', shell: 3, suborbital: 2, capacity: 2, radius: 9.5 },
            { type: 'd', shell: 3, suborbital: 3, capacity: 2, radius: 9.5 },
            { type: 'd', shell: 3, suborbital: 4, capacity: 2, radius: 9.5 },
            { type: 'p', shell: 4, suborbital: 0, capacity: 2, radius: 11 },
            { type: 'p', shell: 4, suborbital: 1, capacity: 2, radius: 11 },
            { type: 'p', shell: 4, suborbital: 2, capacity: 2, radius: 11 },
            { type: 's', shell: 5, suborbital: 0, capacity: 2, radius: 13 },
            { type: 'd', shell: 4, suborbital: 0, capacity: 2, radius: 11.5 },
            { type: 'd', shell: 4, suborbital: 1, capacity: 2, radius: 11.5 },
            { type: 'd', shell: 4, suborbital: 2, capacity: 2, radius: 11.5 },
            { type: 'd', shell: 4, suborbital: 3, capacity: 2, radius: 11.5 },
            { type: 'd', shell: 4, suborbital: 4, capacity: 2, radius: 11.5 },
            { type: 'p', shell: 5, suborbital: 0, capacity: 2, radius: 13 },
            { type: 'p', shell: 5, suborbital: 1, capacity: 2, radius: 13 },
            { type: 'p', shell: 5, suborbital: 2, capacity: 2, radius: 13 },
            { type: 's', shell: 6, suborbital: 0, capacity: 2, radius: 15 },
            { type: 'f', shell: 4, suborbital: 0, capacity: 2, radius: 11.2 },
            { type: 'f', shell: 4, suborbital: 1, capacity: 2, radius: 11.2 },
            { type: 'f', shell: 4, suborbital: 2, capacity: 2, radius: 11.2 },
            { type: 'f', shell: 4, suborbital: 3, capacity: 2, radius: 11.2 },
            { type: 'f', shell: 4, suborbital: 4, capacity: 2, radius: 11.2 },
            { type: 'f', shell: 4, suborbital: 5, capacity: 2, radius: 11.2 },
            { type: 'f', shell: 4, suborbital: 6, capacity: 2, radius: 11.2 },
            { type: 'd', shell: 5, suborbital: 0, capacity: 2, radius: 13.5 },
            { type: 'd', shell: 5, suborbital: 1, capacity: 2, radius: 13.5 },
            { type: 'd', shell: 5, suborbital: 2, capacity: 2, radius: 13.5 },
            { type: 'd', shell: 5, suborbital: 3, capacity: 2, radius: 13.5 },
            { type: 'd', shell: 5, suborbital: 4, capacity: 2, radius: 13.5 },
            { type: 'p', shell: 6, suborbital: 0, capacity: 2, radius: 15 },
            { type: 'p', shell: 6, suborbital: 1, capacity: 2, radius: 15 },
            { type: 'p', shell: 6, suborbital: 2, capacity: 2, radius: 15 },
            { type: 's', shell: 7, suborbital: 0, capacity: 2, radius: 17 },
            { type: 'f', shell: 5, suborbital: 0, capacity: 2, radius: 13.2 },
            { type: 'f', shell: 5, suborbital: 1, capacity: 2, radius: 13.2 },
            { type: 'f', shell: 5, suborbital: 2, capacity: 2, radius: 13.2 },
            { type: 'f', shell: 5, suborbital: 3, capacity: 2, radius: 13.2 },
            { type: 'f', shell: 5, suborbital: 4, capacity: 2, radius: 13.2 },
            { type: 'f', shell: 5, suborbital: 5, capacity: 2, radius: 13.2 },
            { type: 'f', shell: 5, suborbital: 6, capacity: 2, radius: 13.2 },
            { type: 'd', shell: 6, suborbital: 0, capacity: 2, radius: 15.5 },
            { type: 'd', shell: 6, suborbital: 1, capacity: 2, radius: 15.5 },
            { type: 'd', shell: 6, suborbital: 2, capacity: 2, radius: 15.5 },
            { type: 'd', shell: 6, suborbital: 3, capacity: 2, radius: 15.5 },
            { type: 'd', shell: 6, suborbital: 4, capacity: 2, radius: 15.5 },
            { type: 'p', shell: 7, suborbital: 0, capacity: 2, radius: 17 },
            { type: 'p', shell: 7, suborbital: 1, capacity: 2, radius: 17 },
            { type: 'p', shell: 7, suborbital: 2, capacity: 2, radius: 17 },
        ];

        // Orbital colors
        const orbitalColors = {
            's': 0x2b65ec,  // Blue
            'p': 0xff3333,  // Red
            'd': 0x33ff33,  // Green
            'f': 0xffaa00   // Gold
        };

        let remainingElectrons = electronCount;

        for (const orbital of orbitalOrder) {
            if (remainingElectrons <= 0) break;

            const electronsInOrbital = Math.min(remainingElectrons, orbital.capacity);
            const orbitColor = orbitalColors[orbital.type];

            // Create electrons for this orbital
            for (let i = 0; i < electronsInOrbital; i++) {
                const electron = new Electron(
                    0.2,                    // radius
                    orbital.type,           // orbitalType (s, p, d, f)
                    orbital.suborbital,     // orbitalAxis/orientation
                    orbital.radius,         // shellRadius
                    0.15,                   // speed (uniform for all electrons - quantum mechanics uses probability distributions, not classical orbits)
                    this.data.electronColor, // electron color
                    orbitColor,             // orbit line color
                    orbital.shell           // shellNumber
                );

                this.electrons.push(electron);
                this.group.add(electron.group);
            }

            remainingElectrons -= electronsInOrbital;
        }
    }

    createOrbitals() {
        // Track created orbitals to avoid duplicates
        const createdOrbitals = new Set();
        this.orbitalLabels = []; // Store labels for LOD updates
        const orbitalColors = {
            's': 0x2b65ec,  // Blue (Reference)
            'p': 0xff3333,  // Red (Reference)
            'd': 0x33ff33,  // Green (Reference)
            'f': 0xffaa00   // Gold/Orange
        };

        // Iterate through electrons to find unique orbitals
        this.electrons.forEach(electron => {
            const orbitalKey = `${electron.shellRadius}-${electron.orbitalType}-${electron.orbitalAxis}`;

            if (!createdOrbitals.has(orbitalKey)) {
                createdOrbitals.add(orbitalKey);

                const geometry = getOrbitalGeometry(electron.orbitalType, electron.orbitalAxis, electron.shellRadius);
                const material = new THREE.MeshPhongMaterial({
                    color: orbitalColors[electron.orbitalType],
                    transparent: true,
                    opacity: 0.3, // Increased opacity for better visibility
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    blending: THREE.NormalBlending, // Normal blending for solid-looking clouds
                    shininess: 80
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.raycast = () => { }; // Ignore clicks
                this.group.add(mesh);

                // Create Label (e.g., "1s", "2p")
                const labelText = `${electron.shellNumber}${electron.orbitalType}`;
                const labelCanvas = document.createElement('canvas');
                const ctx = labelCanvas.getContext('2d');
                labelCanvas.width = 64;
                labelCanvas.height = 32;
                // No background - transparent
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(labelText, 32, 16);

                const labelTexture = new THREE.CanvasTexture(labelCanvas);
                const labelMaterial = new THREE.SpriteMaterial({
                    map: labelTexture,
                    depthTest: false,
                    depthWrite: false
                });
                const labelSprite = new THREE.Sprite(labelMaterial);

                // Position label based on orbital type and shell radius
                let pos;
                const radius = electron.shellRadius;

                if (electron.orbitalType === 's') {
                    // s-orbitals: spherical, place label to the right and slightly up
                    pos = new THREE.Vector3(radius * 0.8, radius * 0.3, 0);
                } else if (electron.orbitalType === 'p') {
                    // p-orbitals: dumbbell shape along x, y, or z axis
                    const axis = electron.orbitalAxis % 3;
                    if (axis === 0) {
                        // px: along x-axis
                        pos = new THREE.Vector3(radius * 1.2, radius * 0.4, 0);
                    } else if (axis === 1) {
                        // py: along y-axis
                        pos = new THREE.Vector3(radius * 0.4, radius * 1.2, 0);
                    } else {
                        // pz: along z-axis
                        pos = new THREE.Vector3(radius * 0.4, radius * 0.4, radius * 1.0);
                    }
                } else if (electron.orbitalType === 'd') {
                    // d-orbitals: cloverleaf, place at outer edge
                    pos = new THREE.Vector3(radius * 0.9, radius * 0.5, 0);
                } else if (electron.orbitalType === 'f') {
                    // f-orbitals: complex shape, place at outer edge
                    pos = new THREE.Vector3(radius * 1.0, radius * 0.6, 0);
                } else {
                    // Default fallback
                    pos = new THREE.Vector3(radius * 0.7, radius * 0.3, 0);
                }

                labelSprite.position.copy(pos);
                labelSprite.scale.set(2, 1, 1);
                labelSprite.visible = false; // Hidden by default (LOD)

                this.group.add(labelSprite);
                this.orbitalLabels.push(labelSprite);
            }
        });
    }

    updateLabels(camera) {
        if (!this.orbitalLabels) return;

        const distance = camera.position.distanceTo(this.group.position);
        const showLabels = distance < 100; // Increased threshold for better visibility

        this.orbitalLabels.forEach(label => {
            label.visible = showLabels;
            // Optional: scale labels to stay readable? 
            // For now just toggle visibility
        });
    }

    createLabel() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        // Background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        context.strokeStyle = '#00ccff';
        context.lineWidth = 2;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Get translated element name
        const translatedName = i18n.t(`element.${this.data.name}.name`);

        // Text
        context.font = 'bold 24px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${this.data.symbol} - ${translatedName}`, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            depthTest: false,
            depthWrite: false
        });
        this.label = new THREE.Sprite(spriteMaterial);
        this.label.scale.set(8, 2, 1);
        this.label.position.set(0, -3, 0);
        this.label.renderOrder = 999; // Render on top of everything
        this.label.name = 'label';
        this.label.userData.atomName = this.data.name;
        this.group.add(this.label);
    }

    toggleInfoPanel() {
        if (this.infoPanel) {
            this.group.remove(this.infoPanel);
            this.infoPanel = null;
            return;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const width = 320; // Further reduced width
        const height = 550;
        canvas.width = width;
        canvas.height = height;

        // Background
        context.fillStyle = 'rgba(0, 20, 40, 0.9)';
        context.strokeStyle = '#00ccff';
        context.lineWidth = 4;

        // Rounded rectangle
        const radius = 20;
        context.beginPath();
        context.moveTo(radius, 0);
        context.lineTo(width - radius, 0);
        context.quadraticCurveTo(width, 0, width, radius);
        context.lineTo(width, height - radius);
        context.quadraticCurveTo(width, height, width - radius, height);
        context.lineTo(radius, height);
        context.quadraticCurveTo(0, height, 0, height - radius);
        context.lineTo(0, radius);
        context.quadraticCurveTo(0, 0, radius, 0);
        context.closePath();
        context.fill();
        context.stroke();

        // Title
        const lang = i18n.language;
        const translatedName = i18n.t(`element.${this.data.name}.name`);
        context.font = 'bold 26px "Roboto Condensed", sans-serif';
        context.fillStyle = '#00ccff';
        context.fillText(`${translatedName} (${this.data.symbol})`, 30, 50);

        // Separator
        context.beginPath();
        context.moveTo(30, 70);
        context.lineTo(width - 30, 70);
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 2;
        context.stroke();

        // Atom Details Section
        let y = 95;
        const labelX = 30;
        const valueX = 240;
        const lineHeight = 28;

        context.font = '16px "Roboto Condensed", sans-serif';
        context.fillStyle = '#00ccff';

        // Helper to draw row
        const drawRow = (label, value) => {
            context.fillStyle = '#00ccff';
            context.fillText(label, labelX, y);
            context.fillStyle = '#ffffff';
            context.textAlign = 'right';
            context.fillText(value, width - 30, y);
            context.textAlign = 'left';
            y += lineHeight;
        };

        drawRow(i18n.t('ui.atomicNumber'), this.data.atomicNumber);
        drawRow(i18n.t('ui.protons'), this.data.protons);
        drawRow(i18n.t('ui.neutrons'), this.data.neutrons);
        drawRow(i18n.t('ui.electrons'), this.data.electrons);

        const reactivityLabel = i18n.t(`reactivity.${this.data.reactivity}`);
        drawRow(i18n.t('ui.reactivityLabel'), reactivityLabel);

        // Separator 2
        y += 10;
        context.beginPath();
        context.moveTo(30, y);
        context.lineTo(width - 30, y);
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 2;
        context.stroke();
        y += 30;

        // Description
        context.font = '14px "Roboto Condensed", sans-serif';
        context.fillStyle = '#dddddd';
        const text = i18n.t('infoPanel.description_template', {
            name: i18n.t(`element.${this.data.name}.name`),
            symbol: this.data.symbol,
            atomicNumber: this.data.atomicNumber,
            reactivity: i18n.t(`reactivity.${this.data.reactivity}`)
        });

        // Text wrapping for description
        const maxWidth = width - 60;
        const descLineHeight = 22;
        const words = text.split(' ');
        let line = '';
        // y is already updated

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, 30, y);
                line = words[n] + ' ';
                y += descLineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, 30, y);
        y += descLineHeight + 8;

        // Physical Properties Section
        if (this.data.melting !== null || this.data.boiling !== null || this.data.density !== null) {
            context.font = '16px "Roboto Condensed", sans-serif';
            context.fillStyle = '#00ccff';
            context.fillText(i18n.t('infoPanel.headers.Physical Properties') + ':', 30, y);
            y += 24;

            context.font = '14px "Roboto Condensed", sans-serif';
            context.fillStyle = '#dddddd';

            if (this.data.melting !== null) {
                context.fillText(`${i18n.t('infoPanel.headers.Melting Point')}: ${this.data.melting}°C`, 40, y);
                y += 20;
            }
            if (this.data.boiling !== null) {
                context.fillText(`${i18n.t('infoPanel.headers.Boiling Point')}: ${this.data.boiling}°C`, 40, y);
                y += 20;
            }
            if (this.data.density !== null) {
                context.fillText(`${i18n.t('infoPanel.headers.Density')}: ${this.data.density} g/cm³`, 40, y);
                y += 20;
            }
            y += 8;
        }

        // Discovery Section
        if (this.data.yearDiscovered !== null) {
            context.font = '16px "Roboto Condensed", sans-serif';
            context.fillStyle = '#00ccff';
            context.fillText(i18n.t('infoPanel.headers.Discovery') + ':', 30, y);
            y += 24;

            context.font = '14px "Roboto Condensed", sans-serif';
            context.fillStyle = '#dddddd';
            const yearText = this.data.yearDiscovered < 0 ?
                `${i18n.t('infoPanel.headers.Ancient')} (${Math.abs(this.data.yearDiscovered)} BCE)` :
                `${i18n.t('infoPanel.headers.Year')} ${this.data.yearDiscovered}`;
            context.fillText(yearText, 40, y);
            y += 28;
        }

        // Uses Section
        if (this.data.uses) {
            context.font = '16px "Roboto Condensed", sans-serif';
            context.fillStyle = '#00ccff';
            context.fillText(i18n.t('infoPanel.headers.Common Uses') + ':', 30, y);
            y += 24;

            context.font = '14px "Roboto Condensed", sans-serif';
            context.fillStyle = '#dddddd';

            // Get translated uses
            const translatedUses = i18n.t(`element.${this.data.name}.uses`);

            // Wrap uses text
            const usesWords = translatedUses.split(' ');
            let usesLine = '';
            for (let n = 0; n < usesWords.length; n++) {
                const testLine = usesLine + usesWords[n] + ' ';
                const metrics = context.measureText(testLine);
                if (metrics.width > maxWidth - 20 && n > 0) {
                    context.fillText(usesLine, 40, y);
                    usesLine = usesWords[n] + ' ';
                    y += 20;
                } else {
                    usesLine = testLine;
                }
            }
            context.fillText(usesLine, 40, y);
        }

        // Draw X button in top right corner
        const xButtonX = width - 40;
        const xButtonY = 30;
        const xButtonRadius = 20;

        // X button circle background
        context.fillStyle = 'rgba(255, 100, 100, 0.8)';
        context.beginPath();
        context.arc(xButtonX, xButtonY, xButtonRadius, 0, Math.PI * 2);
        context.fill();

        // X text
        context.font = 'bold 28px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('X', xButtonX, xButtonY);


        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            depthTest: false,
            depthWrite: false
        });
        this.infoPanel = new THREE.Sprite(material);

        // Position above the atom (closer to make it visible)
        this.infoPanel.position.set(0, 4, 0);
        // Canvas is 320x550. Aspect ratio is ~0.58
        // Previous height was 9. Let's keep height around 10-11 for visibility
        // Width should be Height * (320/550)
        // If Height = 11, Width = 11 * 0.58 = 6.38
        this.infoPanel.scale.set(6.4, 11, 1);
        this.infoPanel.renderOrder = 1000; // Render on top of labels (which have renderOrder 999)
        this.infoPanel.name = 'infoPanel';
        this.infoPanel.userData.atomName = this.data.name;

        this.group.add(this.infoPanel);
    }

    update(time) {
        this.electrons.forEach(electron => electron.update(time));
    }
}
