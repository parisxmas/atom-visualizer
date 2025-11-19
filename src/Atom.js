/**
 * Author: Baris AKIN
 */
import * as THREE from 'three';
import { Nucleon } from './Nucleon.js';
import { Electron } from './Electron.js';
import i18n from './i18n.js';
// import { getElementName, getDescription, getUses } from './translations.js'; // Removed legacy imports

export class Atom {
    constructor(data) {
        this.data = data;
        this.group = new THREE.Group();
        this.electrons = [];

        this.createNucleus();
        this.createElectrons();
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
        const nucleusRadius = Math.pow(totalNucleons, 1 / 3) * 0.6; // Approximate radius

        // Hit Sphere (Invisible, for easier raycasting)
        const hitGeo = new THREE.SphereGeometry(nucleusRadius * 3, 16, 16); // 3x radius for easier clicking
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitSphere = new THREE.Mesh(hitGeo, hitMat);
        nucleusGroup.add(hitSphere);

        for (let i = 0; i < protonCount; i++) {
            const proton = new Nucleon('proton');
            this.positionNucleon(proton.mesh, nucleusRadius);
            nucleusGroup.add(proton.mesh);
        }

        for (let i = 0; i < neutronCount; i++) {
            const neutron = new Nucleon('neutron');
            this.positionNucleon(neutron.mesh, nucleusRadius);
            nucleusGroup.add(neutron.mesh);
        }

        this.group.add(nucleusGroup);
    }

    positionNucleon(mesh, radius) {
        // Random position within sphere
        // Better: use a force-directed graph layout or pre-calculated positions
        // For now: random with some rejection sampling to avoid overlap (simplified)

        // Just random for now, maybe improve later if it looks bad
        const r = Math.random() * radius * 0.8;
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
            's': 0x00ffff,  // Cyan
            'p': 0xff00ff,  // Magenta
            'd': 0xffff00,  // Yellow
            'f': 0x00ff00   // Green
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
                    1.0 / orbital.shell,    // speed (slower for outer shells)
                    this.data.electronColor, // electron color
                    orbitColor              // orbit line color
                );

                this.electrons.push(electron);
                this.group.add(electron.group);
            }

            remainingElectrons -= electronsInOrbital;
        }
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
        const width = 512;
        const height = 380; // Reduced height to fit content without extra space
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
        context.font = 'bold 32px Arial';
        context.fillStyle = '#00ccff';
        context.fillText(`${translatedName} (${this.data.symbol})`, 30, 50);

        // Separator
        context.beginPath();
        context.moveTo(30, 70);
        context.lineTo(width - 30, 70);
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 2;
        context.stroke();

        // Description
        context.font = '16px Arial';
        context.fillStyle = '#dddddd';
        const text = i18n.t('infoPanel.description_template', {
            name: i18n.t(`element.${this.data.name}.name`),
            symbol: this.data.symbol,
            atomicNumber: this.data.atomicNumber,
            reactivity: i18n.t(`reactivity.${this.data.reactivity}`)
        });

        // Text wrapping for description
        const maxWidth = width - 60;
        const lineHeight = 22;
        const words = text.split(' ');
        let line = '';
        let y = 95;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, 30, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, 30, y);
        y += lineHeight + 8;

        // Physical Properties Section
        if (this.data.melting !== null || this.data.boiling !== null || this.data.density !== null) {
            context.font = 'bold 18px Arial';
            context.fillStyle = '#00ccff';
            context.fillText(i18n.t('infoPanel.headers.Physical Properties') + ':', 30, y);
            y += 24;

            context.font = '15px Arial';
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
            context.font = 'bold 18px Arial';
            context.fillStyle = '#00ccff';
            context.fillText(i18n.t('infoPanel.headers.Discovery') + ':', 30, y);
            y += 24;

            context.font = '15px Arial';
            context.fillStyle = '#dddddd';
            const yearText = this.data.yearDiscovered < 0 ?
                `${i18n.t('infoPanel.headers.Ancient')} (${Math.abs(this.data.yearDiscovered)} BCE)` :
                `${i18n.t('infoPanel.headers.Year')} ${this.data.yearDiscovered}`;
            context.fillText(yearText, 40, y);
            y += 28;
        }

        // Uses Section
        if (this.data.uses) {
            context.font = 'bold 18px Arial';
            context.fillStyle = '#00ccff';
            context.fillText(i18n.t('infoPanel.headers.Common Uses') + ':', 30, y);
            y += 24;

            context.font = '15px Arial';
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
        this.infoPanel.scale.set(12, 9, 1); // Adjusted for 512x380 aspect ratio
        this.infoPanel.renderOrder = 1000; // Render on top of labels (which have renderOrder 999)
        this.infoPanel.name = 'infoPanel';
        this.infoPanel.userData.atomName = this.data.name;

        this.group.add(this.infoPanel);
    }

    update(time) {
        this.electrons.forEach(electron => electron.update(time));
    }
}
