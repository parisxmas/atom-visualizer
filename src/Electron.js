import * as THREE from 'three';

export class Electron {
    constructor(radius = 0.2, orbitRadiusX = 2, orbitRadiusY = 2, speed = 1, color = 0x00ffff, orbitColor = 0x333333) {
        this.radius = radius;
        this.orbitRadiusX = orbitRadiusX;
        this.orbitRadiusY = orbitRadiusY;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();

        const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 4.0, // Super bright
            toneMapped: false
        });
        this.mesh = new THREE.Mesh(geometry, material);

        this.group = new THREE.Group(); // Initialize group early

        // Add Glow Sprite
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);

        const glowTexture = new THREE.CanvasTexture(canvas);
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: color,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 1.0
        });
        this.glowSprite = new THREE.Sprite(glowMaterial);
        this.glowSprite.scale.set(radius * 12, radius * 12, 1); // Much bigger glow
        this.glowSprite.raycast = () => { }; // Disable raycast
        this.mesh.add(this.glowSprite);

        // Trail Setup (Particle System)
        this.trailContainer = new THREE.Group();
        this.group.add(this.trailContainer);
        this.group.add(this.mesh);

        // Orbit Path (Visual ring)
        const orbitCurve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            orbitRadiusX, orbitRadiusY, // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        const points = orbitCurve.getPoints(50);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor, transparent: true, opacity: 0.15 }); // More transparent orbit lines
        this.orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        this.orbitLine.raycast = () => { }; // Disable raycast

        // Rotate orbit line to match axis
        // This is a bit tricky with EllipseCurve which is 2D. 
        // Easier to just rotate the container group.

        this.group.add(this.orbitLine); // Add orbit line to group

        // Random orientation for the orbit
        this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.orbitAxis);
    }

    update(time) {
        this.angle += this.speed * 0.02;

        // Update position
        const x = Math.cos(this.angle) * this.orbitRadiusX;
        const y = Math.sin(this.angle) * this.orbitRadiusY;
        const z = 0;

        this.mesh.position.set(x, y, z);

        // Spawn trail particle
        if (Math.random() > 0.5) { // Don't spawn every frame to save perf
            // Let's use the same glow texture for trail particles but smaller
            const trailSprite = this.glowSprite.clone();
            trailSprite.scale.set(2.0, 2.0, 1);

            // We need to clone material to have independent opacity
            trailSprite.material = this.glowSprite.material.clone();
            trailSprite.material.opacity = 0.3;

            trailSprite.position.copy(this.mesh.position);
            trailSprite.raycast = () => { }; // Disable raycast
            this.trailContainer.add(trailSprite);
        }

        // Update trail particles
        for (let i = this.trailContainer.children.length - 1; i >= 0; i--) {
            const p = this.trailContainer.children[i];
            p.material.opacity -= 0.01;
            p.scale.multiplyScalar(0.95);
            if (p.material.opacity <= 0) {
                this.trailContainer.remove(p);
                if (p.material) p.material.dispose(); // Fix memory leak
            }
        }
    }
}
