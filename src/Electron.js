import * as THREE from 'three';
import { getSorbitalPath, getPorbitalPath, getDorbitalPath, getForbitalPath } from './OrbitalShapes.js';

export class Electron {
    constructor(radius = 0.2, orbitalType = 's', orbitalAxis = 0, shellRadius = 5, speed = 1, color = 0x00ffff, orbitColor = 0x333333) {
        this.radius = radius;
        this.orbitalType = orbitalType;
        this.orbitalAxis = orbitalAxis;
        this.shellRadius = shellRadius;
        this.speed = speed;
        this.pathIndex = Math.random() * 100; // Random starting position on path

        const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 4.0, // Super bright
            toneMapped: false
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.raycast = () => { }; // Disable raycasting so clicks pass through

        this.group = new THREE.Group();

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
        this.glowSprite.scale.set(radius * 12, radius * 12, 1);
        this.glowSprite.raycast = () => { };
        this.mesh.add(this.glowSprite);

        // Trail Setup
        this.trailContainer = new THREE.Group();
        this.group.add(this.trailContainer);
        this.group.add(this.mesh);

        // Generate orbital path based on type
        this.generateOrbitalPath(orbitColor);
    }

    generateOrbitalPath(orbitColor) {
        let pathPoints;

        switch (this.orbitalType) {
            case 's':
                pathPoints = getSorbitalPath(this.shellRadius);
                break;
            case 'p':
                // orbitalAxis: 0=x, 1=y, 2=z
                const axis = ['x', 'y', 'z'][this.orbitalAxis % 3];
                pathPoints = getPorbitalPath(this.shellRadius, axis);
                break;
            case 'd':
                pathPoints = getDorbitalPath(this.shellRadius, this.orbitalAxis % 5);
                break;
            case 'f':
                pathPoints = getForbitalPath(this.shellRadius, this.orbitalAxis % 7);
                break;
            default:
                pathPoints = getSorbitalPath(this.shellRadius);
        }

        // Store path points for animation
        this.pathPoints = pathPoints;

        // Create visual orbit line
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: orbitColor,
            transparent: true,
            opacity: 0.15
        });
        this.orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        this.orbitLine.raycast = () => { };
        this.group.add(this.orbitLine);
    }

    update(time) {
        // Move along the orbital path
        this.pathIndex += this.speed * 0.5;

        if (this.pathPoints && this.pathPoints.length > 0) {
            const index = Math.floor(this.pathIndex) % this.pathPoints.length;
            const nextIndex = (index + 1) % this.pathPoints.length;
            const t = this.pathIndex % 1;

            // Interpolate between points for smooth movement
            const currentPoint = this.pathPoints[index];
            const nextPoint = this.pathPoints[nextIndex];

            this.mesh.position.lerpVectors(currentPoint, nextPoint, t);
        }

        // Spawn trail particle
        if (Math.random() > 0.5) {
            const trailSprite = this.glowSprite.clone();
            trailSprite.scale.set(2.0, 2.0, 1);
            trailSprite.material = this.glowSprite.material.clone();
            trailSprite.material.opacity = 0.3;
            trailSprite.position.copy(this.mesh.position);
            trailSprite.raycast = () => { };
            this.trailContainer.add(trailSprite);
        }

        // Update trail particles
        for (let i = this.trailContainer.children.length - 1; i >= 0; i--) {
            const p = this.trailContainer.children[i];
            p.material.opacity -= 0.01;
            p.scale.multiplyScalar(0.95);
            if (p.material.opacity <= 0) {
                this.trailContainer.remove(p);
                if (p.material) p.material.dispose();
            }
        }
    }
}
