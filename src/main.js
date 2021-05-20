import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import '@/styles/style.css';

import t_sun from '@/assets/img/t_sun.jpg';
import t_mercury from '@/assets/img/t_mercury.jpg';
import t_venus from '@/assets/img/t_venus.jpg';
import t_earth from '@/assets/img/t_earth.jpg';
import t_mars from '@/assets/img/t_mars.jpg';

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
        map: loaderTexture.load(texture),
        flatShading: true
    });
    const mesh = new THREE.Mesh(planetGeometry, planetMaterial);
    mesh.position.set(DEFAULT_DISTANCE * distance, 0, DEFAULT_DISTANCE * distance);

    function updatePosition() {
        t += Math.PI / 180;

        mesh.position.x = Math.sin(t * 0.1) * DEFAULT_DISTANCE * distance;
        mesh.position.z = Math.cos(t * 0.1) * DEFAULT_DISTANCE * distance;
    }

    function updateRotation() {
        mesh.rotation.y += Math.PI * 2 / rotationTime * 30;
    }

    return {
        mesh,
        updatePosition,
        updateRotation,
    }
}

/* Function for add planets */
function addPlanets() {
    /* Create Sun */
    planets.push(
        new Planet({
            name: 'Солнце',
            radius: 20,
            texture: t_sun
        })
    )
    scene.add(planets[0].mesh);

    /* Create Mercury */
    planets.push(
        new Planet({
            name: 'Меркурий',
            radius: 0.38,
            texture: t_mercury,
            distance: 0.3871
        })
    );
    scene.add(planets[1].mesh);

    /* Create Venus */
    planets.push(
        new Planet({
            name: 'Меркурий',
            radius: 0.95,
            texture: t_venus,
            distance: 0.7231
        })
    );
    scene.add(planets[2].mesh);

    /* Create Earth */
    planets.push(
        new Planet({
            name: 'Земля',
            radius: 1,
            texture: t_earth,
            distance: 1,
            rotationTime: 86344
        })
    );
    scene.add(planets[3].mesh);

    /* Create Mars */
    planets.push(
        new Planet({
            name: 'Марс',
            radius: 0.53,
            texture: t_mars,
            distance: 1.5236
        })
    );
    scene.add(planets[4].mesh);

    return true
}

function addStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.ParticleBasicMaterial({
        color: 0xE6E6FA
    });

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();

    for (let i = 0; i < 5000; i ++) {
        positions.push((Math.random() * 2 - 1 ) * 10000);
        positions.push((Math.random() * 2 - 1 ) * 10000);
        positions.push((Math.random() * 2 - 1 ) * 10000);

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

function init() {
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

    /* Create and add OrbitControls */
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 20;
    controls.maxDistance = 2000;

    /* Create a loader for texture */
    loaderTexture = new THREE.TextureLoader();

    addPlanets();
    addStars();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    for (let i = 1; i < planets.length; i++) {
        planets[i].updatePosition();
        planets[i].updateRotation();
    }

    controls.update();

    renderer.render(scene, camera);
}

/* Main scene variables */
let camera, scene, renderer;

/* More set variables */
let axes, controls, pointLight, light, loaderTexture;

/* Planets */
let planets = [];

const DEFAULT_SIZE = 1,
      DEFAULT_DISTANCE = 100;

init();
animate();



