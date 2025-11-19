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
        // Create canvas for text rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        // Draw rounded rectangle background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.beginPath();
        context.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 15);
        context.fill();

        // Draw border
        context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        context.lineWidth = 3;
        context.stroke();

        // Draw text
        context.font = 'Bold 56px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.shadowColor = 'black';
        context.shadowBlur = 8;
        context.fillText(`${this.data.symbol} - ${this.data.name}`, canvas.width / 2, canvas.height / 2);

        // Create sprite from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 2.5, 1); // Adjust scale for readability
        sprite.position.set(0, -8, 0); // Position below atom
        sprite.name = 'label'; // For raycasting identification
        sprite.userData.atomName = this.data.name; // Store atom name for lookup

        this.label = sprite;
        this.group.add(sprite);
    }

    update(time) {
        this.electrons.forEach(electron => electron.update(time));
    }
}
