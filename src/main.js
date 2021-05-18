import * as THREE from 'three';

import '@/styles/style.css';

function init() {
    const container = document.querySelector('#container');

    /* Create and add a renderer */
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    /* Create a camera */
    camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 200);
    camera.position.set(10, 5, 20);

    /* Create a scene */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001230);

    /* Create and add a light */
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    /* Create and add axes */
    axes = new THREE.AxesHelper(5);
    scene.add(axes);

    /* Create Earth */
    const earthGeometry = new THREE.SphereGeometry( 1, 16, 16 );
    const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

let camera, scene, renderer;
let light, axes;

let earth;

init();
animate();



