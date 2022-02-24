import * as THREE from "./three/build/three.module.js";
import { OrbitControls, MapControls } from "./three/examples/jsm/controls/OrbitControls.js";

import { CelestialBody } from "./classes/CelestialBody.js";
import { ThreeHelper } from "./classes/ThreeHelper.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.01;
const far = 500000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const scene = new THREE.Scene();
const caster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const loader = new THREE.TextureLoader();
const bgIntensity = 0.5;
const bgLight = new THREE.AmbientLight( 0xffffff, bgIntensity );
const controls = new OrbitControls(camera, renderer.domElement );
const orbitTime = 365 * 10;

CelestialBody.focusData.updateElements.name.push({ propertyName: `innerText`, target: document.querySelector( `#interface-name` ) });
CelestialBody.logging = true;

// Celestial bodies
const mainSolarSystemCenter = new CelestialBody({
	type: `SphereGeometry`,
	orbitAround: null,
	lightSource: {
		light: new THREE.PointLight( 0xffffff, 1 - bgIntensity )
	},
	materialsObjects: [
		new THREE.MeshStandardMaterial({
			emissiveMap: loader.load( `images/sun.jpg` ),
			map: loader.load( `images/sun.jpg` ),
			emissive: 0xffffff,
			emissiveIntensity: 1 - bgIntensity
		})
	],
	shapeData: {
		radius: 109,
		detail: 15,
		widthSegments: 24,
		heightSegments: 12,
		mainGroup: {
			position: new THREE.Vector3( 0,0,0 ),
			rotation: new THREE.Vector3( 0,0,0 ),
			scale: 10
		},
		increments: {
			rotation: { x: 0, y: orbitTime * 24, z: 0 }
		}
	},
	lore: {
		name: `Sun`,
		description: `Blep.`
	}
	
});
const mainPlanet = new CelestialBody({
	focus: true,
	type: `SphereGeometry`,
	orbitAround: mainSolarSystemCenter,
	materialsObjects: [
		new THREE.MeshStandardMaterial({ map: loader.load( `images/biomes100.png` ) }),
		// new THREE.MeshStandardMaterial({ map: loader.load( `images/topographic100.png` ) }),
		// new THREE.MeshStandardMaterial({ map: loader.load( `images/creb.png` ) })
	],
	shapeData: {
		radius: 2.47,
		detail: 75,
		widthSegments: 32,
		heightSegments: 16,
		mainGroup: {
			position: new THREE.Vector3( 23135,0,0 ),
			rotation: new THREE.Vector3( 0,0,0 ),
			scale: 1
		},
		increments: {
			rotation: { x: 0, y: orbitTime, z: 0 }
		}
	}
	
});
const moon = new CelestialBody({
	type: `SphereGeometry`,
	orbitAround: mainPlanet,
	materialsObjects: [
		new THREE.MeshStandardMaterial({ map: loader.load( `images/moon.jpg` ) }),
		new THREE.MeshStandardMaterial({ map: loader.load( `images/creb.png` ) })
	],
	shapeData: {
		radius: 0.27,
		detail: 15,
		widthSegments: 24,
		heightSegments: 12,
		mainGroup: {
			position: new THREE.Vector3( 60,0,0 ),
			rotation: new THREE.Vector3( 0,0,0 ),
			scale: 10
		},
		increments: {
			rotation: { x: 0, y: orbitTime * 10, z: 0 }
		}
	},
	lore: {
		name: `Moon`,
		description: `Blep.`
	}
	
});
const mars = new CelestialBody({
	type: `SphereGeometry`,
	orbitAround: moon,
	materialsObjects: [
		new THREE.MeshStandardMaterial({ map: loader.load( `images/mars.jpg` ) }),
		new THREE.MeshStandardMaterial({ map: loader.load( `images/creb.png` ) })
	],
	shapeData: {
		radius: 0.16,
		detail: 15,
		widthSegments: 24,
		heightSegments: 12,
		mainGroup: {
			position: new THREE.Vector3( 25,0,0 ),
			rotation: new THREE.Vector3( 0,0,0 ),
			scale: 10
		},
		increments: {
			rotation: { x: 0, y: orbitTime * 1.05, z: 0 }
		}
	},
	lore: {
		name: `Mars`,
		description: `Blep.`
	}
	
});

// Camera starting angle, looking at 0,0,0
camera.position.x = -9;
camera.position.y = 4;
camera.position.z = 10;

document.querySelector( `body` ).insertAdjacentElement( `beforeend`, renderer.domElement );

scene.add( bgLight );
scene.add( mainSolarSystemCenter.mainGroup );
scene.add( new THREE.Mesh(
	new THREE.SphereGeometry( far * (2 * 0.9), 12, 6 ),
	new THREE.MeshStandardMaterial({ map: loader.load(`images/stars4.jpg`), side: THREE.BackSide, opacity: 0.5, transparent: true })
) );

ThreeHelper.setPerspective( renderer, camera );

window.onresize = ()=> ThreeHelper.setPerspective( renderer, camera );

document.querySelector( `#interface-left` ).addEventListener( `click`, ()=> CelestialBody.cycleFocus( false ) );
document.querySelector( `#interface-right` ).addEventListener( `click`, ()=> CelestialBody.cycleFocus( true ) );
document.addEventListener( `keydown`, function(e) {
	
	if( e.code === `ArrowRight` || e.code === `KeyD` )
	{
		e.preventDefault();
		
		CelestialBody.cycleFocus( true );
	}
	else if( e.code === `ArrowLeft` || e.code === `KeyA` )
	{
		e.preventDefault();
		
		CelestialBody.cycleFocus( false );
	}
	else if( e.code === `Space` )
	{
		e.preventDefault();
		
		document.querySelector( `#interface-pause` ).click();
		document.querySelector( `#interface-pause` ).focus();
	}
	
} );
document.querySelector( `#interface-pause` ).addEventListener( `click`, function() {
	
	CelestialBody.toggleOrbitsOnOff();
	
	this.classList.toggle( `toggle` );
	
} );

render();

function render() {
	
	requestAnimationFrame(render);
	
	CelestialBody.doOrbits( mainSolarSystemCenter, { controls: controls, camera: camera } );
	
	controls.update();
	
	renderer.render(scene, camera);
	
}