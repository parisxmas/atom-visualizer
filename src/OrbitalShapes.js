import * as THREE from 'three';

/**
 * Generate path points for s orbital (spherical)
 * s orbitals are spherical probability clouds
 * Creates a smooth continuous spiral path around the sphere
 */
export function getSorbitalPath(radius, pointCount = 120) {
    const points = [];

    // Create a smooth continuous spherical spiral for elliptical movement
    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 4; // 2 full loops

        // Spherical spiral with smooth continuous path
        const theta = t; // Azimuthal angle (around equator)
        const phi = Math.sin(t * 0.5) * Math.PI * 0.8; // Polar angle (up and down)

        const x = radius * Math.cos(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi) * Math.sin(theta);
        const z = radius * Math.sin(phi);

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

/**
 * Generate path points for p orbital (dumbbell shape)
 * p orbitals have three orientations: px, py, pz
 * Creates a smooth figure-8 pattern through both lobes
 */
export function getPorbitalPath(radius, axis = 'x', pointCount = 120) {
    const points = [];

    // p orbitals are dumbbell-shaped with two lobes
    // Create a smooth continuous figure-8 path
    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        // Create a smooth figure-8 (lemniscate) 
        const angle = t;
        const lobeRadius = radius * 1.3 * Math.sqrt(Math.abs(Math.cos(2 * angle)));

        // Add smooth variation in perpendicular directions
        const perpVar1 = radius * 0.2 * Math.sin(3 * t);
        const perpVar2 = radius * 0.2 * Math.cos(3 * t);

        let x, y, z;

        if (axis === 'x') {
            // Aligned along X axis
            x = lobeRadius * Math.cos(angle);
            y = perpVar1;
            z = perpVar2;
        } else if (axis === 'y') {
            // Aligned along Y axis
            x = perpVar1;
            y = lobeRadius * Math.cos(angle);
            z = perpVar2;
        } else { // 'z'
            // Aligned along Z axis
            x = perpVar1;
            y = perpVar2;
            z = lobeRadius * Math.cos(angle);
        }

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

/**
 * Generate path points for d orbital (cloverleaf shape)
 * d orbitals have 5 different orientations
 * Creates smooth 4-lobed cloverleaf patterns
 */
export function getDorbitalPath(radius, type = 0, pointCount = 150) {
    const points = [];

    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        let x, y, z;

        // Create 4-lobed cloverleaf pattern using cos(2*theta)
        // This creates the characteristic d-orbital shape
        const lobeRadius = radius * Math.abs(Math.cos(2 * t));

        switch (type) {
            case 0: // dxy - lobes between x and y axes
                x = lobeRadius * Math.cos(t);
                y = lobeRadius * Math.sin(t);
                z = radius * 0.2 * Math.sin(4 * t); // Small z variation
                break;

            case 1: // dxz - lobes between x and z axes
                x = lobeRadius * Math.cos(t);
                y = radius * 0.2 * Math.sin(4 * t); // Small y variation
                z = lobeRadius * Math.sin(t);
                break;

            case 2: // dyz - lobes between y and z axes
                x = radius * 0.2 * Math.sin(4 * t); // Small x variation
                y = lobeRadius * Math.cos(t);
                z = lobeRadius * Math.sin(t);
                break;

            case 3: // dx²-y² - lobes along x and y axes
                const r3 = radius * Math.abs(Math.cos(2 * t));
                x = r3 * Math.cos(t);
                y = r3 * Math.sin(t);
                z = radius * 0.15 * Math.sin(4 * t);
                break;

            case 4: // dz² - donut + dumbbell shape along z
                // This orbital has a unique shape: donut in xy plane + lobes on z
                const ringRadius = radius * 0.5;
                const angle = t * 2; // Two loops
                if (t < Math.PI) {
                    // Donut part in xy plane
                    x = ringRadius * Math.cos(angle);
                    y = ringRadius * Math.sin(angle);
                    z = radius * 0.3;
                } else {
                    // Lobes along z axis
                    const tNorm = (t - Math.PI) / Math.PI;
                    x = radius * 0.3 * Math.cos(angle);
                    y = radius * 0.3 * Math.sin(angle);
                    z = radius * (tNorm < 0.5 ? 0.8 : -0.8);
                }
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
 * f orbitals have 7 different orientations
 * Creates complex multi-lobed patterns
 */
export function getForbitalPath(radius, type = 0, pointCount = 180) {
    const points = [];

    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;

        let x, y, z;

        // f orbitals have complex shapes with multiple lobes
        // Use higher-order harmonics to create complex patterns
        const lobeRadius = radius * (0.7 + 0.3 * Math.abs(Math.cos(3 * t)));
        const offset = type * Math.PI / 7;

        // Create different patterns for each of the 7 f-orbital types
        switch (type % 7) {
            case 0: // fz³ type
                x = lobeRadius * Math.cos(t + offset) * Math.abs(Math.sin(3 * t));
                y = lobeRadius * Math.sin(t + offset) * Math.abs(Math.sin(3 * t));
                z = radius * 0.6 * Math.cos(3 * t);
                break;

            case 1: // fxz² type
                x = lobeRadius * Math.cos(t) * Math.abs(Math.cos(3 * t));
                y = radius * 0.4 * Math.sin(5 * t);
                z = lobeRadius * Math.sin(t) * Math.abs(Math.cos(3 * t));
                break;

            case 2: // fyz² type
                x = radius * 0.4 * Math.sin(5 * t);
                y = lobeRadius * Math.cos(t) * Math.abs(Math.cos(3 * t));
                z = lobeRadius * Math.sin(t) * Math.abs(Math.cos(3 * t));
                break;

            case 3: // fxyz type
                x = lobeRadius * Math.cos(t) * (1 + 0.3 * Math.sin(4 * t));
                y = lobeRadius * Math.sin(t) * (1 + 0.3 * Math.cos(4 * t));
                z = radius * 0.5 * Math.sin(6 * t);
                break;

            case 4: // fz(x²-y²) type
                const r4 = radius * Math.abs(Math.cos(2 * t));
                x = r4 * Math.cos(t);
                y = r4 * Math.sin(t);
                z = radius * 0.6 * Math.sin(3 * t);
                break;

            case 5: // fx(x²-3y²) type
                x = lobeRadius * Math.cos(t) * (1 + 0.4 * Math.cos(3 * t));
                y = lobeRadius * Math.sin(t) * (1 - 0.4 * Math.cos(3 * t));
                z = radius * 0.4 * Math.sin(5 * t);
                break;

            case 6: // fy(3x²-y²) type
                x = lobeRadius * Math.cos(t) * (1 - 0.4 * Math.sin(3 * t));
                y = lobeRadius * Math.sin(t) * (1 + 0.4 * Math.sin(3 * t));
                z = radius * 0.4 * Math.cos(5 * t);
                break;

            default:
                x = y = z = 0;
        }

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}
