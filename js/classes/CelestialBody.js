import * as THREE from "../three/build/three.module.js";

// options.materialsObjects, an array of three.js materials
// options.shapeData, an object with key->value pairs of relevant data, such as 'radius: 15'
// options.geometry, the bufferGeometry method name to create the shape in three.js, such as icosahedronGeometry()
// options.orbitAround, CelestialBody object, if set, orbits around the given three.js group or shape
class CelestialBody {
	
	shape = null;
	name = `Unknown`; 
	description = `Unknown`;
	parent = null;
	
	static List = new Array();
	static focus = null;
	static focusData = {
		oldVector: new THREE.Vector3(),
		firstFocusFrame: true,
		secondFocusFrame: true,
		updateElements: {
			name: new Array(),
			description: new Array()
		}
	};
	static orbitSpeed = 100;
	static logging = false;
	static orbitsOnOff = true;
	
	constructor( options ) {
		
		const shData = options.shapeData;
		const mData = options.shapeData.mainGroup;
		const geometry = new THREE[ options.type ](
			shData.radius,
			shData.widthSegments,
			shData.heightSegments
		);
		const shape = new THREE.Mesh( geometry, options.materialsObjects[0] );
		const mainGroup = new THREE.Group();
		
		console.log( `Shape faces: ${geometry.attributes.normal.count}` );
		
		this.shape = shape;
		this.materialsObjects = options.materialsObjects;
		this.position = mainGroup.position;
		this.rotation = mainGroup.rotation;
		this.scale = mData.scale;
		this.children = new Array();
		this.mainGroup = mainGroup;
		this.radius = shData.radius;
		this.increments = shData.increments;
		
		mainGroup.add( shape );
		
		CelestialBody.List.push( this );
		
		// This goes before the focus is initialized
		if( options.lore !== undefined )
		{
			this.name = options.lore.name;
			this.description = options.lore.description;
		}
		
		if( options.focus === true )
			this.focusMe();
		
		if( options.lightSource !== undefined )
			mainGroup.add( options.lightSource.light );
		
		if( options.orbitAround !== null )
		{
			const orbitGroup = new THREE.Group();
			
			this.orbitGroup = orbitGroup;
			this.parent = options.orbitAround;
			
			orbitGroup.add( this.mainGroup );
			
			options.orbitAround.mainGroup.add( orbitGroup );
			options.orbitAround.children.push( this );
		}
		
		this.position.copy( mData.position );
		
		// rotation bugs out with this
		// this.rotation.copy( mData.rotation );
		
		shape.scale.set( this.scale, this.scale, this.scale );
	}
	
	nextFrame() {
		
		this.calculateOrbit();
		this.rotate();
		
	}
	
	nextFrameNoParent() {
		
		this.rotate();
		
	}
	
	calculateOrbit() {
		
		const thisPosition = new THREE.Vector3();
		const parentPosition = new THREE.Vector3();
		
		this.shape.getWorldPosition( thisPosition );
		this.parent.shape.getWorldPosition( parentPosition );
		
		let calculationY = (
			2 * Math.PI / (
				thisPosition.distanceTo( parentPosition ) * CelestialBody.orbitSpeed / this.parent.radius
			)
		);
		
		this.rotation.y -= calculationY;
		this.orbitGroup.rotation.y += calculationY;
		
	}
	
	rotate() {
		
		const rotationIncrementY = 2 * Math.PI / this.increments.rotation.y;
		
		this.shape.rotation.y += rotationIncrementY;
		
	}
	
	focusMe() {
		
		CelestialBody.focus = this;
		
		const update = CelestialBody.focusData.updateElements;
		
		for( const updateArrayKey in update )
		{
			for( let i = 0; i < update[ updateArrayKey ].length; i++ )
			{
				const obj = update[ updateArrayKey ][i];
				
				obj.target[ obj.propertyName ] = this[ updateArrayKey ];
			}
		}
		
		
	}
	
	// next/right is true, previous/left is false
	static cycleFocus( nextPrevious ) {
		
		const bodies = CelestialBody.List;
		
		if( bodies.length > 0 )
		{
			const oldIndex = bodies.indexOf( CelestialBody.focus );
			
			let newIndex = null;
			
			if( nextPrevious )
				newIndex = oldIndex+1 > bodies.length-1 ? 0 : oldIndex+1;
			else
				newIndex = oldIndex-1 < 0 ? bodies.length-1 : oldIndex-1;
			
			bodies[newIndex].focusMe();
			
			CelestialBody.focusData.firstFocusFrame = true;
			CelestialBody.focusData.secondFocusFrame = true;
		}
		
	}
	
	static doOrbits( celestialBody, data ) {
	
		const cb = celestialBody;
		const controls = data.controls;
		const camera = data.camera;
		
		for( let i = 0; i < cb.children.length; i++ )
		{
			const child = cb.children[i];
			
			if( CelestialBody.orbitsOnOff === true )
			{
				if( cb.parent === null )
					cb.nextFrameNoParent();
				else
					cb.nextFrame();
			}
			
			CelestialBody.doOrbits( child, data );
		}
		
		if( CelestialBody.focus === cb )
		{
			const focus = CelestialBody.focus;
			const vectorOld = CelestialBody.focusData.oldVector;
			const vectorNew = new THREE.Vector3();
			
			focus.shape.getWorldPosition( vectorNew );
			
			camera.position.set(
				camera.position.x + vectorNew.x - vectorOld.x,
				camera.position.y + vectorNew.y - vectorOld.y,
				camera.position.z + vectorNew.z - vectorOld.z
			);
			
			if( CelestialBody.focusData.firstFocusFrame === true )
			{
				const startDistance = cb.radius * 5 * cb.shape.scale.x;
				
				controls.maxDistance = startDistance;
				controls.minDistance = startDistance;
				
				CelestialBody.focusData.firstFocusFrame = false;
			}
			else if( CelestialBody.focusData.secondFocusFrame === true )
			{
				const zoomMin = 1.5 * cb.shape.scale.x;
				const zoomMax = 100 * cb.shape.scale.x;
				
				controls.maxDistance = cb.radius * zoomMax;
				controls.minDistance = cb.radius * zoomMin;
				
				CelestialBody.focusData.secondFocusFrame = false;
			}
			
			CelestialBody.focusData.oldVector.copy( vectorNew );
			
			controls.target = vectorNew;
		}
		
	}
	
	static toggleOrbitsOnOff() { CelestialBody.orbitsOnOff = !CelestialBody.orbitsOnOff; }
	
}

export { CelestialBody };