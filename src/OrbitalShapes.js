import * as THREE from 'three';

/**
 * Generate path points for s orbital (spherical)
 * s orbitals are spherical probability clouds
 */
export function getSorbitalPath(radius, pointCount = 50) {
    const points = [];

    // Create a spherical path by varying theta and phi
    for (let i = 0; i < pointCount; i++) {
        const theta = (i / pointCount) * Math.PI * 2;
        const phi = Math.asin(Math.sin(theta * 3)); // Oscillate up and down

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

        // Create figure-8 pattern
        const r = radius * Math.abs(Math.sin(t));

        let x, y, z;

        if (axis === 'x') {
            x = r * Math.sign(Math.sin(t));
            y = radius * 0.5 * Math.cos(t);
            z = radius * 0.5 * Math.sin(t);
        } else if (axis === 'y') {
            x = radius * 0.5 * Math.cos(t);
            y = r * Math.sign(Math.sin(t));
            z = radius * 0.5 * Math.sin(t);
        } else { // 'z'
            x = radius * 0.5 * Math.cos(t);
            y = radius * 0.5 * Math.sin(t);
            z = r * Math.sign(Math.sin(t));
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
