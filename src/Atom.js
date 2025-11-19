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
        // Shell configuration (simplified: 2, 8, 18...)
        // Shell 1: 2
        // Shell 2: 8
        // Shell 3: 18

        // Define colors for each shell
        const shellColors = [
            0x00ffff, // Shell 1: Cyan
            0xff00ff, // Shell 2: Magenta
            0xffff00, // Shell 3: Yellow
            0x00ff00, // Shell 4: Green
            0xff8800, // Shell 5: Orange
        ];

        let remainingElectrons = electronCount;
        let shellIndex = 1;

        while (remainingElectrons > 0) {
            const shellCapacity = 2 * shellIndex * shellIndex;
            const electronsInThisShell = Math.min(remainingElectrons, shellCapacity);

            const orbitRadius = 3 + shellIndex * 2; // Base radius + spacing
            const orbitColor = shellColors[(shellIndex - 1) % shellColors.length]; // Get color for this shell

            for (let i = 0; i < electronsInThisShell; i++) {
                // Add some randomness to the orbit radius to make them distinct
                const radiusVariation = (Math.random() - 0.5) * 1.0; // +/- 0.5
                const baseRadius = orbitRadius + radiusVariation;

                // Elliptical factor
                const eccentricity = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 ratio
                const radiusX = baseRadius;
                const radiusY = baseRadius * eccentricity;

                const electron = new Electron(0.2, radiusX, radiusY, 1.0 / shellIndex, this.data.electronColor, orbitColor);
                this.electrons.push(electron);
                this.group.add(electron.group);
            }

            remainingElectrons -= electronsInThisShell;
            shellIndex++;
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
