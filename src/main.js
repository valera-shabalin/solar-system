import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import '@/styles/style.css';

import t_sun from '@/assets/img/t_sun.jpg';
import t_earth from '@/assets/img/t_earth.jpg';
import t_mercury from '@/assets/img/t_mercury.jpg';
import t_venus from '@/assets/img/t_venus.jpg';

function init() {
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
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(10, 10, EARTH_DISTANCE + 20);

    /* Create and add OrbitControls */
    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = true;
    controls.minDistance = 20;
    controls.maxDistance = 2000;

    const textureLoader = new THREE.TextureLoader();

    /* Create Sun */
    const sunGeometry = new THREE.SphereGeometry(EARTH_SIZE * 20, 16, 16 );
    const sunMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load(t_sun),
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    /* Create Earth */
    const earthGeometry = new THREE.SphereGeometry(EARTH_SIZE, 16, 16 );
    const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load(t_earth),
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(EARTH_DISTANCE, 0, 0);
    scene.add(earth);

    /* Create Mercury */
    const mercuryGeometry = new THREE.SphereGeometry(EARTH_SIZE * 0.38, 16, 16 );
    const mercuryMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load(t_mercury),
    });
    mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercury.position.set(EARTH_DISTANCE * 0.3871, 0, 0);
    scene.add(mercury);

    /* Create Venus */
    const venusGeometry = new THREE.SphereGeometry(EARTH_SIZE * 0.95, 16, 16 );
    const venusMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load(t_venus),
    });
    venus = new THREE.Mesh(venusGeometry, venusMaterial);
    venus.position.set(EARTH_DISTANCE * 0.7231, 0, 0);
    scene.add(venus);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    t += Math.PI / 180;

    earth.position.x = Math.sin(t * 0.1) * EARTH_DISTANCE;
    earth.position.z = Math.cos(t * 0.1) * EARTH_DISTANCE - 10;

    mercury.position.x = Math.sin(t * 0.1) * EARTH_DISTANCE * 0.38;
    mercury.position.z = Math.cos(t * 0.1) * EARTH_DISTANCE * 0.38 - 5;

    earth.rotation.y += 2 * Math.PI / 86164 * 20;
    sun.rotation.y += 2 * Math.PI / 91368 * 20;

    console.log(earth.rotation)

    controls.update();

    renderer.render(scene, camera);
}

let camera, scene, renderer;
let axes, controls;

let pointLight, light;

let sun, earth, mercury, venus;

let t = 0;

const EARTH_SIZE = 1, EARTH_DISTANCE = 100;

init();
animate();



