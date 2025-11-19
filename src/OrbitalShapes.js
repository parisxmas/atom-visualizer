import * as THREE from 'three';

/**
 * Generate path points for s orbital (spherical)
 * s orbitals are spherical probability clouds
 */
export function getSorbitalPath(radius, pointCount = 50) {
    const points = [];

    // Create a smooth spherical spiral path
    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        // Spherical spiral
        const theta = t * 2; // 2 loops around
        const phi = Math.sin(t) * Math.PI / 2; // Up and down

        const x = radius * Math.cos(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.cos(phi);
        const z = radius * Math.sin(phi);

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

/**
 * Generate path points for p orbital (dumbbell shape)
 * p orbitals have three orientations: px, py, pz
 */
export function getPorbitalPath(radius, axis = 'x', pointCount = 50) {
    const points = [];

    // p orbitals are figure-8 or dumbbell shaped
    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        // Smooth figure-8 (Lemniscate of Bernoulli or similar)
        // x = a * sin(t)
        // y = a * sin(t) * cos(t)
        // This creates a smooth continuous loop without jumps

        const scale = radius * 1.2;

        if (axis === 'x') {
            // Aligned along X
            x = scale * Math.sin(t);
            y = scale * Math.sin(t) * Math.cos(t);
            z = radius * 0.3 * Math.cos(t); // Slight 3D depth
        } else if (axis === 'y') {
            // Aligned along Y
            x = scale * Math.sin(t) * Math.cos(t);
            y = scale * Math.sin(t);
            z = radius * 0.3 * Math.cos(t);
        } else { // 'z'
            // Aligned along Z
            x = radius * 0.3 * Math.cos(t);
            y = scale * Math.sin(t) * Math.cos(t);
            z = scale * Math.sin(t);
        }

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

/**
 * Generate path points for d orbital (cloverleaf shape)
 * d orbitals have 5 different orientations
 */
export function getDorbitalPath(radius, type = 0, pointCount = 60) {
    const points = [];

    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        let x, y, z;
        const r = radius * (0.7 + 0.3 * Math.abs(Math.cos(2 * t)));

        switch (type) {
            case 0: // dxy
                x = r * Math.cos(t);
                y = r * Math.sin(t);
                z = radius * 0.3 * Math.sin(4 * t);
                break;
            case 1: // dxz
                x = r * Math.cos(t);
                y = radius * 0.3 * Math.sin(4 * t);
                z = r * Math.sin(t);
                break;
            case 2: // dyz
                x = radius * 0.3 * Math.sin(4 * t);
                y = r * Math.cos(t);
                z = r * Math.sin(t);
                break;
            case 3: // dx2-y2
                x = r * Math.cos(t) * Math.cos(2 * t);
                y = r * Math.sin(t) * Math.cos(2 * t);
                z = radius * 0.3 * Math.sin(3 * t);
                break;
            case 4: // dz2
                const theta = t;
                const phi = Math.PI * 0.3 * Math.sin(3 * t);
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
                break;
            default:
                x = y = z = 0;
        }

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

/**
 * Generate path points for f orbital (complex shape)
 * f orbitals have 7 different orientations - simplified version
 */
export function getForbitalPath(radius, type = 0, pointCount = 70) {
    const points = [];

    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        let x, y, z;
        const r = radius * (0.6 + 0.4 * Math.abs(Math.cos(3 * t)));

        // Simplified f orbital shapes (actual f orbitals are very complex)
        const offset = type * Math.PI / 7;

        x = r * Math.cos(t + offset) * (1 + 0.3 * Math.sin(5 * t));
        y = r * Math.sin(t + offset) * (1 + 0.3 * Math.cos(5 * t));
        z = radius * 0.5 * Math.sin(7 * t + offset);

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}
