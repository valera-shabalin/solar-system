import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import '@/styles/style.css';

import t_sun from '@/assets/img/t_sun.jpg';
import t_earth from '@/assets/img/t_earth.jpg';

function init() {
    const EARTH_SIZE = 1;

    const container = document.querySelector('#container');

    /* Create and add a renderer */
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    /* Create a scene */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001230);

    /* Create and add a light */
    pointLight = new THREE.PointLight(0xFFFFFF, 1.5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    light = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 1);
    scene.add(light);

    /* Create and add axes */
    axes = new THREE.AxesHelper(5000);
    scene.add(axes);

    /* Create a camera */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 1000, 600);

    /* Create and add OrbitControls */
    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = true;
    controls.minDistance = 100;
    controls.maxDistance = 2000;

    const textureLoader = new THREE.TextureLoader();

    /* Create Sun */
    const sunGeometry = new THREE.SphereGeometry(EARTH_SIZE * 109, 16, 16 );
    const sunMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load(t_sun),
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    /* Create Sun */
    const earthGeometry = new THREE.SphereGeometry(EARTH_SIZE * 30, 16, 16 );
    const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load(t_earth),
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(500, 0, 0);
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

    t += Math.PI / 180 * 2;

    earth.position.x = Math.sin(t * 0.1) * 500;
    earth.position.z = Math.cos(t * 0.1) * 400;
    
    controls.update();

    renderer.render(scene, camera);
}

let camera, scene, renderer;
let axes, controls;

let pointLight, light;

let sun, earth;

let t = 0;

init();
animate();



