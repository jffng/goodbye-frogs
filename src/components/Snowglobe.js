import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import * as Noise from './Noise';

const computeCurl = (x, y, z) => {
	const noise = Noise.noise;
	var eps = 0.0001;

	var curl = new THREE.Vector3();

	//Find rate of change in YZ plane
	var n1 = noise.simplex3(x, y + eps, z); 
	var n2 = noise.simplex3(x, y - eps, z); 
	//Average to find approximate derivative
	var a = (n1 - n2)/(2 * eps);
	n1 = noise.simplex3(x, y, z + eps); 
	n2 = noise.simplex3(x, y, z - eps); 
	//Average to find approximate derivative
	var b = (n1 - n2)/(2 * eps);
	curl.x = a - b;

	//Find rate of change in XZ plane
	n1 = noise.simplex3(x, y, z + eps); 
	n2 = noise.simplex3(x, y, z - eps); 
	//Average to find approximate derivative
	a = (n1 - n2)/(2 * eps);
	n1 = noise.simplex3(x + eps, y, z); 
	n2 = noise.simplex3(x + eps, y, z); 
	//Average to find approximate derivative
	b = (n1 - n2)/(2 * eps);
	curl.y = a - b;

	//Find rate of change in XY plane
	n1 = noise.simplex3(x + eps, y, z); 
	n2 = noise.simplex3(x - eps, y, z); 
	//Average to find approximate derivative
	a = (n1 - n2)/(2 * eps);
	n1 = noise.simplex3(x, y + eps, z); 
	n2 = noise.simplex3(x, y - eps, z); 
	//Average to find approximate derivative
	b = (n1 - n2)/(2 * eps);
	curl.z = a - b;

	return curl;
}
const movementSpeed = 40;
const totalObjects = 1200;
const objectSize = 12;
// const colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];

const Explosion = (scene, x,y) => {
  var geometry = new THREE.Geometry();
  this.dirs = [];
  
  for (var i = 0; i < totalObjects; i ++) 
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = 0;
  
    geometry.vertices.push( vertex );
    this.dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.PointsMaterial( { size: objectSize,  color: 0xeeeeee });
  var particles = new THREE.Points( geometry, material );
  
  this.explodeObject = particles;
  this.explodeStatus = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.explodeObject  ); 
  
  this.updateExplosion = () => {
    if (this.explodeStatus === true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.explodeObject.geometry.vertices[pCount]
        particle.y += this.dirs[pCount].y;
        particle.x += this.dirs[pCount].x;
        particle.z += this.dirs[pCount].z;
      }
      this.explodeObject.geometry.verticesNeedUpdate = true;
    }
  }

  return this
}

class Snowglobe extends Component{
  componentDidMount(){
		this.width = 2000;
		this.height = 2000;
		this.depth = 2000;
		var centre = [this.width/2,this.height/2, this.depth/2];
		var distance = 200;
		this.flakes = [];
		this.flakeCount = 1000;
		var rotate = true;
    //ADD SCENE
    this.scene = new THREE.Scene();
    this.parts = [];

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
		// this.renderer.setClearColor(0x114457, .1);
    this.mount.appendChild(this.renderer.domElement);
    
    //ADD CAMERA
		const FOV = 2 * Math.atan( window.innerHeight / ( 2 * distance ) ) * 90 / Math.PI;
		this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 20000);
		this.camera.up.set(0,0,1);
		this.camera.position.set(this.width/2, -this.height/2, 500);
		this.camera.lookAt(new THREE.Vector3(centre[0], centre[1], centre[2]));
		this.scene.add(this.camera);
		//Initialise three.js
    const onWindowResize = () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
		}
		window.addEventListener( 'resize', onWindowResize, false );

		//Lights
		var light_1;
		light_1 = new THREE.HemisphereLight( 0x114417, 0xffffff, 0.3);
		light_1.position.set(0, 0, -this.depth);
		light_1.lookAt(0, 0, -1);
		this.scene.add(light_1);

		var light_2 = new THREE.DirectionalLight(0x333333, 1.0);
		light_2.position.set(-1, 1, 1);
		this.scene.add(light_2);

		//Define hexagon shape for flakes
		var geom = new THREE.Geometry();

		//Brackets for purely aesthetic considerations
		geom.vertices.push(
				new THREE.Vector3(   -0.5,  0.86, 0 ),
				new THREE.Vector3(    0.5,  0.86, 0 ),
				new THREE.Vector3(    0.93, 0.0,  0 ),
				new THREE.Vector3(    0.5, -0.86, 0 ),
				new THREE.Vector3(   -0.5, -0.86, 0 ),
				new THREE.Vector3(   -0.93, 0.0, 0 )
				);

		geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geom.faces.push( new THREE.Face3( 0, 2, 3 ) );
		geom.faces.push( new THREE.Face3( 0, 3, 4 ) );
		geom.faces.push( new THREE.Face3( 0, 4, 5 ) );

		geom.scale(7,7,7);

		var colour = 0x939393;

		var material = new THREE.MeshPhongMaterial( {color: colour, specular: 0xffffff, shininess: 100, side: THREE.DoubleSide, shading: THREE.FlatShading} );

		//Generate random flakes
		for(var i = 0; i < this.flakeCount; i++){

			var g_ = new THREE.Mesh(geom, material);

			var x = 0.5 - Math.random();
			var y = 0.5 - Math.random();
			var z = 0.5 - Math.random();

			var flake = {
				vel_x: x,
				vel_y: y,
				vel_z: z,
				geo: g_
			};

			flake.geo.position.x = this.width/2 - Math.random() * this.width;
			flake.geo.position.y = this.height/2 - Math.random() * this.height;
			flake.geo.position.z = this.depth/2 - Math.random() * this.depth;
			
			flake.geo.rotation.x = 2 * (Math.random() - 1.0);
			flake.geo.rotation.y = 2 * (Math.random() - 1.0);
			flake.geo.rotation.z = 2 * (Math.random() - 1.0);

			this.flakes.push(flake);
		}

		for(i = 0; i < this.flakes.length; i++){
			this.scene.add(this.flakes[i].geo);
		}

		this.A = {
			x: 0,
			y: 0,
			z: 0
		};

		this.n = {
			x: 0,
			y: 0,
			z: 0
		};

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.autoRotate = rotate;

    this.move = this.move.bind(this);
    this.explode = this.explode.bind(this);
		this.start();
  }

	move(){
		const fall = 3;
		const step = 100;
		const swirl = 3;

		//USed for flake position
		let A = {
			x: 0,
			y: 0,
			z: 0
		};

		//Vector pointing up
		let B = {
			x: 0,
			y: 0,
			z: 1
		}

		//Vector tangent to A and B to define movement around B
		let n = {
			x: 0,
			y: 0,
			z: 0
		};;

		for(var i = 0; i < this.flakeCount; i++){
			A.x = this.flakes[i].geo.position.x;
			A.y = this.flakes[i].geo.position.y;
			A.z = this.flakes[i].geo.position.z;

			n.x = A.y * B.z - B.y * A.z;
			n.y = A.z * B.x - B.z * A.x;
			n.z = A.x * B.y - B.x * A.y;
			var mag_n = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z);
			this.flakes[i].vel_x = swirl * (n.x/mag_n);
			this.flakes[i].vel_y = swirl * (n.y/mag_n);

			var curl = computeCurl(this.flakes[i].geo.position.x/step, this.flakes[i].geo.position.y/step, this.flakes[i].geo.position.z/step);
			var mag_c = Math.sqrt(curl.x * curl.x + curl.y * curl.y + curl.z * curl.z);

			//Update flake velocity according to curl direction and fall
			this.flakes[i].vel_x -= (fall/4)*(curl.x/mag_c);
			this.flakes[i].vel_y -= (fall/4)*(curl.y/mag_c);

			if(fall > 0){
				this.flakes[i].vel_z -= (fall/60);
				this.flakes[i].vel_z = Math.max(this.flakes[i].vel_z, -fall);
			}else{
				this.flakes[i].vel_z = 0;
			}

			this.flakes[i].geo.rotation.x += this.flakes[i].vel_x/10+this.flakes[i].vel_z/60;
			this.flakes[i].geo.rotation.y += this.flakes[i].vel_y/10+this.flakes[i].vel_z/60;

			var distanceFromCentre = Math.sqrt(A.x * A.x + A.y * A.y + A.z * A.z);  
			if(distanceFromCentre > this.width/2){
				this.flakes[i].geo.visible = false;
			}else{
				this.flakes[i].geo.visible = true;
			}

			if(this.flakes[i].geo.position.z < -(this.depth/2) || Math.sqrt(this.A.x * this.A.x + this.A.y * this.A.y) > this.width){
				//If outside bounding volume, reset to top
				this.flakes[i].geo.position.x = this.width/2 - Math.random() * this.width; 
				this.flakes[i].geo.position.y = this.height/2 - Math.random() * this.height; 
				this.flakes[i].geo.position.z = this.depth/2; 
				this.flakes[i].vel_x = 0;
				this.flakes[i].vel_y = 0;
			}else{
				//Update flake position based on velocity
				this.flakes[i].geo.position.x += this.flakes[i].vel_x ;
				this.flakes[i].geo.position.y += this.flakes[i].vel_y ;
				this.flakes[i].geo.position.z += this.flakes[i].vel_z ;
			}
		}
	}

	componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

	start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

	stop = () => {
    cancelAnimationFrame(this.frameId);
  }

	explode(){
		this.parts.push(new Explosion(this.scene, 0, 0));
	}

	animate = () => {
    this.move();
    this.controls.update();
    this.renderer.render(this.scene, this.camera)
    var pCount = this.parts.length;
      while(pCount--) {
        this.parts[pCount].updateExplosion();
      }
    this.frameId = window.requestAnimationFrame(this.animate);
  }

	render(){
    return(
      <div
        style={{ width: window.innerWidth + 'px', height: window.innerHeight + 'px'}}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
export default Snowglobe
