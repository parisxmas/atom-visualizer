import * as THREE from 'three';
import { getSorbitalPath, getPorbitalPath, getDorbitalPath, getForbitalPath } from './OrbitalShapes.js';

export class Electron {
    constructor(radius = 0.2, orbitalType = 's', orbitalAxis = 0, shellRadius = 5, speed = 1, color = 0x00ffff, orbitColor = 0x333333, shellNumber = 1) {
        this.radius = radius;
        this.orbitalType = orbitalType;
        this.orbitalAxis = orbitalAxis;
        this.shellRadius = shellRadius;
        this.shellNumber = shellNumber;
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
        this.orbitColor = orbitColor;

        // Create dynamic trail instead of static line
        this.trailLength = 300; // Number of points to show in trail (very long for extensive path visibility)
        this.trailPoints = [];

        // Initialize trail with empty points
        for (let i = 0; i < this.trailLength; i++) {
            this.trailPoints.push(new THREE.Vector3(0, 0, 0));
        }

        const trailGeometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);

        // Create gradient colors for fading effect
        const colors = [];
        const color = new THREE.Color(orbitColor);
        for (let i = 0; i < this.trailLength; i++) {
            const alpha = 1 - (i / this.trailLength); // Fade from 1 to 0
            colors.push(color.r * alpha, color.g * alpha, color.b * alpha);
        }
        trailGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const trailMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        this.orbitLine = new THREE.Line(trailGeometry, trailMaterial);
        this.orbitLine.raycast = () => { };
        this.group.add(this.orbitLine);
    }

    update(time) {
        // Move along the orbital path
        this.pathIndex += this.speed * 0.08; // Further reduced for even slower movement

        if (this.pathPoints && this.pathPoints.length > 0) {
            const index = Math.floor(this.pathIndex) % this.pathPoints.length;
            const nextIndex = (index + 1) % this.pathPoints.length;
            const t = this.pathIndex % 1;

            // Interpolate between points for smooth movement
            const currentPoint = this.pathPoints[index];
            const nextPoint = this.pathPoints[nextIndex];

            this.mesh.position.lerpVectors(currentPoint, nextPoint, t);

            // Update trail - show recent path behind electron
            if (this.trailPoints) {
                // Shift trail points back
                for (let i = this.trailPoints.length - 1; i > 0; i--) {
                    this.trailPoints[i].copy(this.trailPoints[i - 1]);
                }

                // Add current position at the front
                this.trailPoints[0].copy(this.mesh.position);

                // Update the trail geometry
                this.orbitLine.geometry.setFromPoints(this.trailPoints);
                this.orbitLine.geometry.attributes.position.needsUpdate = true;

                // Update gradient colors for fading effect
                const colors = this.orbitLine.geometry.attributes.color.array;
                const color = new THREE.Color(this.orbitColor);
                for (let i = 0; i < this.trailLength; i++) {
                    const alpha = 1 - (i / this.trailLength); // Fade from 1 to 0
                    colors[i * 3] = color.r * alpha;
                    colors[i * 3 + 1] = color.g * alpha;
                    colors[i * 3 + 2] = color.b * alpha;
                }
                this.orbitLine.geometry.attributes.color.needsUpdate = true;
            }
        }


    }
}
