/**
 * Author: Baris AKIN
 */
import * as THREE from 'three';
import { Nucleon } from './Nucleon.js';
import { Electron } from './Electron.js';

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
        canvas.width = 512;
        canvas.height = 128;

        // Draw semi-transparent background for better clickability
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.strokeStyle = 'white';
        context.lineWidth = 3;
        const padding = 10;
        const rectWidth = canvas.width - padding * 2;
        const rectHeight = canvas.height - padding * 2;

        // Rounded rectangle
        const radius = 15;
        context.beginPath();
        context.moveTo(padding + radius, padding);
        context.lineTo(padding + rectWidth - radius, padding);
        context.quadraticCurveTo(padding + rectWidth, padding, padding + rectWidth, padding + radius);
        context.lineTo(padding + rectWidth, padding + rectHeight - radius);
        context.quadraticCurveTo(padding + rectWidth, padding + rectHeight, padding + rectWidth - radius, padding + rectHeight);
        context.lineTo(padding + radius, padding + rectHeight);
        context.quadraticCurveTo(padding, padding + rectHeight, padding, padding + rectHeight - radius);
        context.lineTo(padding, padding + radius);
        context.quadraticCurveTo(padding, padding, padding + radius, padding);
        context.closePath();
        context.fill();
        context.stroke();

        // Draw text
        context.font = 'bold 48px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${this.data.symbol} - ${this.data.name}`, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
        const sprite = new THREE.Sprite(material);

        sprite.position.set(0, -8, 0);
        sprite.scale.set(12, 3, 1); // Increased scale for better visibility and clickability
        sprite.name = 'label';
        sprite.userData.atomName = this.data.name;

        this.label = sprite;
        this.group.add(sprite);
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
        const height = 256;
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
        context.font = 'bold 40px Arial';
        context.fillStyle = '#00ccff';
        context.fillText(`${this.data.name} (${this.data.symbol})`, 30, 60);

        // Separator
        context.beginPath();
        context.moveTo(30, 80);
        context.lineTo(width - 30, 80);
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 2;
        context.stroke();

        // Description
        context.font = '24px Arial';
        context.fillStyle = '#dddddd';
        const text = this.data.description || "No description available.";

        // Text wrapping
        const maxWidth = width - 60;
        const lineHeight = 32;
        const words = text.split(' ');
        let line = '';
        let y = 120;

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
        this.infoPanel.scale.set(15, 7.5, 1);
        this.infoPanel.name = 'infoPanel';
        this.infoPanel.userData.atomName = this.data.name;

        this.group.add(this.infoPanel);
    }

    update(time) {
        this.electrons.forEach(electron => electron.update(time));
    }
}
