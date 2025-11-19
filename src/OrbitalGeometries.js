import * as THREE from 'three';

/**
 * Returns the value of the Spherical Harmonic Y(l, m) for a given theta and phi.
 * Using Real Spherical Harmonics form.
 * theta: polar angle [0, PI]
 * phi: azimuthal angle [0, 2PI]
 */
function sphericalHarmonic(l, m, theta, phi) {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    // Normalization constants (simplified for shape visualization, not strict quantum probability)
    // We focus on the angular dependence shape.

    if (l === 0) { // s-orbital
        return 0.282095; // 1/2 * sqrt(1/PI)
    }

    if (l === 1) { // p-orbitals
        if (m === -1) return 0.488603 * sinTheta * sinPhi; // py
        if (m === 0) return 0.488603 * cosTheta;          // pz
        if (m === 1) return 0.488603 * sinTheta * cosPhi; // px
    }

    if (l === 2) { // d-orbitals
        if (m === -2) return 1.092548 * sinTheta * sinTheta * sinPhi * cosPhi; // dxy
        if (m === -1) return 1.092548 * sinTheta * cosTheta * sinPhi;          // dyz
        if (m === 0) return 0.315392 * (3 * cosTheta * cosTheta - 1);          // dz2
        if (m === 1) return 1.092548 * sinTheta * cosTheta * cosPhi;           // dxz
        if (m === 2) return 0.546274 * sinTheta * sinTheta * (cosPhi * cosPhi - sinPhi * sinPhi); // dx2-y2
    }

    if (l === 3) { // f-orbitals
        // Simplified/Representative shapes for f-orbitals (m = -3 to 3)
        // These are complex, using standard real forms
        const C = 0.37; // Scaling factor
        if (m === -3) return C * sinTheta * sinTheta * sinTheta * Math.sin(3 * phi);
        if (m === -2) return C * sinTheta * sinTheta * cosTheta * Math.sin(2 * phi);
        if (m === -1) return C * sinTheta * (5 * cosTheta * cosTheta - 1) * Math.sin(phi);
        if (m === 0) return C * (5 * cosTheta * cosTheta * cosTheta - 3 * cosTheta);
        if (m === 1) return C * sinTheta * (5 * cosTheta * cosTheta - 1) * Math.cos(phi);
        if (m === 2) return C * sinTheta * sinTheta * cosTheta * Math.cos(2 * phi);
        if (m === 3) return C * sinTheta * sinTheta * sinTheta * Math.cos(3 * phi);
    }

    return 0;
}

export function getOrbitalGeometry(orbitalType, orbitalAxis, size = 5) {
    let l = 0;
    let m = 0;

    // Map type/axis to l/m
    switch (orbitalType) {
        case 's':
            l = 0; m = 0;
            break;
        case 'p':
            l = 1;
            // Map 0,1,2 to m=-1,0,1 (py, pz, px)
            // Standard mapping: 0->y(-1), 1->z(0), 2->x(1) to match common visualization axes if needed
            // Let's just map linearly: 0->-1, 1->0, 2->1
            m = (orbitalAxis % 3) - 1;
            break;
        case 'd':
            l = 2;
            // Map 0..4 to m=-2..2
            m = (orbitalAxis % 5) - 2;
            break;
        case 'f':
            l = 3;
            // Map 0..6 to m=-3..3
            m = (orbitalAxis % 7) - 3;
            break;
    }

    // Geometry generation parameters
    const radialSegments = 64;
    const tubularSegments = 64;

    const vertices = [];
    const indices = [];

    // Generate mesh
    for (let y = 0; y <= radialSegments; y++) {
        for (let x = 0; x <= tubularSegments; x++) {
            const u = x / tubularSegments;
            const v = y / radialSegments;

            const theta = v * Math.PI; // 0 to PI
            const phi = u * Math.PI * 2; // 0 to 2PI

            // Get radius from spherical harmonic
            // Take absolute value for probability density shape (or squared)
            // Usually we visualize |Y| or Y^2. Let's use |Y| * size
            let r = Math.abs(sphericalHarmonic(l, m, theta, phi));

            // Enhance contrast for cleaner shapes (optional)
            r = r * size;

            // Convert to Cartesian
            const px = r * Math.sin(theta) * Math.cos(phi);
            const py = r * Math.sin(theta) * Math.sin(phi);
            const pz = r * Math.cos(theta);

            vertices.push(px, py, pz);
        }
    }

    // Generate indices
    for (let y = 0; y < radialSegments; y++) {
        for (let x = 0; x < tubularSegments; x++) {
            const a = (tubularSegments + 1) * y + x;
            const b = (tubularSegments + 1) * y + x + 1;
            const c = (tubularSegments + 1) * (y + 1) + x;
            const d = (tubularSegments + 1) * (y + 1) + x + 1;

            // Two triangles per quad
            indices.push(a, d, b);
            indices.push(a, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
}
