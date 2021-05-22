import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

import '@/styles/style.css';

import data from '@/assets/json/data';

/* Factory function for create planets */
function Planet(options) {
    let name = options.name || 'Неизвестная планета',
        texture = options.texture,
        distance = options.distance || 0,
        radius = options.radius,
        rotationTime = options.rotationTime || 86344,
        t = 0;

    const planetGeometry = new THREE.SphereGeometry(DEFAULT_SIZE * radius, 16, 16);
    const planetMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture),
        flatShading: true
    });
    const mesh = new THREE.Mesh(planetGeometry, planetMaterial);
    mesh.position.set(DEFAULT_DISTANCE * distance, 0, DEFAULT_DISTANCE * distance);

    const div = document.createElement( 'div' );
    div.className = 'label';
    div.textContent = name;
    div.style.marginTop = '-1em';
    const label = new CSS2DObject(div);
    label.position.set(0, radius, 0);

    function updatePosition() {
        t += Math.PI / 180;

        mesh.position.x = Math.sin(t * 0.1) * DEFAULT_DISTANCE * distance;
        mesh.position.z = Math.cos(t * 0.1) * DEFAULT_DISTANCE * distance;
    }

    function updateRotation() {
        mesh.rotation.y += Math.PI * 2 / rotationTime * 30;
    }

    return {
        mesh, label,
        updatePosition,
        updateRotation,
    }
}

/* Function for add planets */
async function addPlanets() {
    for (let i = 0; i < data.planets.length; i++) {
        const texture = await import(`@/assets/img/${data.planets[i].texture}.jpg`);
        
        planets.push(new Planet({
            name: data.planets[i].name,
            radius: data.planets[i].radius,
            distance: data.planets[i].distance,
            texture: texture.default
        }));

        scene.add(planets[i].mesh);
        planets[i].mesh.add(planets[i].label);
    }
}

function addStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xE6E6FA
    });

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();

    for (let i = 0; i < 5000; i ++) {
        positions.push((Math.random() * 2 - 1 ) * 30000);
        positions.push((Math.random() * 2 - 1 ) * 30000);
        positions.push((Math.random() * 2 - 1 ) * 30000);

        color.setHSL(i / 100, 1.0, 0.5);

        colors.push(0, 0, 0);

        sizes.push(20);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));

    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
}

async function init() {
    const container = document.querySelector('#container');

    /* Create and add a renderer */
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    /* Create a scene */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);

    /* Create and add a light */
    pointLight = new THREE.PointLight(0xFFFFFF, 1.5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    light = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 1);
    scene.add(light);

    /* Create and add axes */
    axes = new THREE.AxesHelper(5000);
    //scene.add(axes);

    /* Create a camera */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(10, 10, DEFAULT_DISTANCE + 20);

    /* Init LabelRenderer */
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    /* Create and add OrbitControls */
    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 20;
    controls.maxDistance = 2000;

    await addPlanets();
    addStars();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    for (let i = 1; i < planets.length; i++) {
        planets[i].updatePosition();
        planets[i].updateRotation();
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

/* Main scene variables */
let camera, scene, renderer;

const textureLoader = new THREE.TextureLoader();

/* More set variables */
let axes, controls, pointLight, light, labelRenderer;

/* Planets */
let planets = [];

const DEFAULT_SIZE = 1,
      DEFAULT_DISTANCE = 100;

init();
animate();




