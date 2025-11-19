import * as THREE from 'three';

export class Nucleon {
    constructor(type, radius = 0.5) {
        this.type = type; // 'proton' or 'neutron'
        this.radius = radius;

        const color = type === 'proton' ? 0xff0000 : 0x888888;
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }
}
