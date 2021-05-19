import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import '@/styles/style.css';

import t_sun from '@/assets/img/t_sun.jpg';
import t_earth from '@/assets/img/t_earth.jpg';
import t_mercury from '@/assets/img/t_mercury.jpg';
import t_venus from '@/assets/img/t_venus.jpg';

/* Factory function for create planets */
function Planet(options) {
    let name = options.name || 'Неизвестная планета',
        texture = options.texture,
        distance = options.distance || 10,
        radius = options.radius,
        t = 0;

    const planetGeometry = new THREE.SphereGeometry(DEFAULT_SIZE * radius, 16, 16);
    const planetMaterial = new THREE.MeshPhongMaterial({
        map: loaderTexture.load(texture)
    });
    const mesh = new THREE.Mesh(planetGeometry, planetMaterial);

    function updatePosition() {
        t += Math.PI / 180;

        mesh.position.x = Math.sin(t * 0.1) * DEFAULT_DISTANCE * distance;
        mesh.position.z = Math.cos(t * 0.1) * DEFAULT_DISTANCE * distance;
    }

    function setDistance(value) {
        distance = value;
    }

    function getDistance() {
        return distance;
    }

    function setName(value) {
        name = value;
    }

    function getName() {
        return name;
    }

    return {
        mesh,
        updatePosition,
        setName, getName,
        setDistance, getDistance
    }
}

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
    camera.position.set(10, 10, DEFAULT_DISTANCE + 20);

    /* Create and add OrbitControls */
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 20;
    controls.maxDistance = 2000;

    /* Create a loader for texture */
    loaderTexture = new THREE.TextureLoader();

    /* Create Sun */
    planets.push(
        new Planet({
            name: 'Солнце',
            radius: 20,
            texture: t_sun
        })
    )
    scene.add(planets[0].mesh);

    /* Create Earth */
    planets.push(
        new Planet({
            name: 'Земля',
            radius: 1,
            texture: t_earth,
            distance: 1
        })
    );
    scene.add(planets[1].mesh);

    /* Create Mercury */
    planets.push(
        new Planet({
            name: 'Меркурий',
            radius: 0.38,
            texture: t_mercury,
            distance: 0.3871
        })
    );
    scene.add(planets[2].mesh);

    /* Create Venus */
    planets.push(
        new Planet({
            name: 'Меркурий',
            radius: 0.95,
            texture: t_venus,
            distance:0.7231
        })
    );
    scene.add(planets[3].mesh);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    planets[1].updatePosition();
    planets[2].updatePosition();
    planets[3].updatePosition();

    controls.update();

    renderer.render(scene, camera);
}

/* Main scene variables */
let camera, scene, renderer;

/* More set variables */
let axes, controls, pointLight, light, loaderTexture;

/* Planets */
let sun, earth, mercury, venus;
let planets = [];

let t = 0;

const DEFAULT_SIZE = 1,
      DEFAULT_DISTANCE = 100;

init();
animate();



