'use strict';

import _ from 'lodash';


import * as THREE from '../build/threeBuild.js';
// import * as THREE from 'three-examples/threeBuild.js';

import { FBXLoader } from '../build/fbxLoader.js';
// import { FBXLoader } from 'three-examples/fbxLoader.js';
import { OrbitControls } from '../build/orbitControls.js';
// import { OrbitControls } from 'three-examples/orbitControls.js';
// import { Service } from './service';
var _keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    shift: false,
    enter: false,
    b: false,
    p: false
};
var playSound = false;
var hitSound, danceSound;
var pause_music = false;
var mensaje = false;
var paramsGral;
hitSound = new Audio('./assets/music2.mp3');
hitSound.loop = true;
hitSound.volume = 0.5;
hitSound.currentTime = 0;
danceSound = new Audio('./assets/music.mp3');
danceSound.loop = true;
danceSound.volume = 0.5;
danceSound.currentTime = 0;
setTimeout(() => {

    if (!sessionStorage.getItem('token')) {
        $('#pasoLogin').show();
        $('#login').show();
    } else {
        $('#pasoLogin').hide();
        $("#padre").show();
    }

}, 1000);

setTimeout(() => {
    $("#over").html('<img style="z-index:120" src="models/Instrucciones-Jugabilidad-FINAL-3.png" width="50%"></img>')
}, 1000);
setInterval(() => {
    if (mensaje) {
        alertify.alert('Aviso', 'Te invitamos asistir a los clusters.', function() { alertify.success('Disfruta tu experiencía.'); });
    }
}, 240000);

$("#musica").click(function() {
    if (pause_music) {
        if (hitSound) {
            hitSound.play();
            hitSound.currentTime = 0;
            pause_music = false;
        }

    } else {
        if (hitSound) {
            hitSound.pause();
            hitSound.currentTime = 0;
            pause_music = true;
        }
    }
});


$("#enter").click(function() {
    _onKeyDown({ keyCode: 13 });
});

$("#correr").on("touchstart", function() {
    _onKeyDown({ keyCode: 16 });
});

$("#correr").on("touchend", function() {
    _onKeyUp({ keyCode: 16 })
});

$("#bailar").on("touchstart", function() {
    _onKeyDown({ keyCode: 66 });
});

$("#bailar").on("touchend", function() {
    _onKeyUp({ keyCode: 66 })
});

$("#brincar").on("touchstart", function() {
    _onKeyDown({ keyCode: 32 });
});

$("#brincar").on("touchend", function() {
    _onKeyUp({ keyCode: 32 })
});




class Services{
    constructor(){
    }

    
};



class BasicCharacterControllerProxy {
    constructor(animations, camera) {
        this._animations = animations;
        this._camera = camera;
    }

    get animations() {
        return this._animations;
    }
    get camera() {
        return this._camera;
    }
};


class BasicCharacterControllerProxyLeon {
    constructor(animations, camera) {
        this._animations = animations;
        this._camera = camera;
        this.mobile = isTouchscreenDevice();
    }

    get animations() {
        return this._animations;
    }
    get camera() {
        return this._camera;
    }
};
class BasicCharacterController {
    constructor(
        params
        ) {
        this._Init(params);
    }
    _Init(params) {
        this._params = params;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._position = new THREE.Vector3();

        this._animations = {};
        this._animationsLeon = {};
        this._input = new BasicCharacterControllerInput(this._params);
        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations, this._params), this._params);
        this._stateMachineLeon = new CharacterFSMLeon(
            new BasicCharacterControllerProxyLeon(this._animationsLeon, this._params), this._params);
        this._LoadModels();
        this._LoadModelsLeon();
    }
    _LoadModels() {
        let genderPath;
        if (this._params.gender == 'M') {
            genderPath = 'girl';
        } else if (this._params.gender == 'H') {
            genderPath = 'man';
        } else if (this._params.gender == 'NA') {
            genderPath = 'robot';
        }
        const loader = new FBXLoader();
        loader.setPath(`./models/${genderPath}/`);
        loader.load('idle.fbx', (fbx) => {
            fbx.position.x = 1250;
            //fbx.position.x = 1000;
            fbx.position.z = 23;
            //fbx.position.z = -300;
            fbx.position.y = 0;
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._target = fbx;
            this._target.name = 'personaje';
            this._params.scene.add(this._target);
            this._mixer = new THREE.AnimationMixer(this._target);
            this._manager = new THREE.LoadingManager();
            this._target.quaternion._w = 0.7440;
            this._target.quaternion._y = -0.668;
            this._target.receiveShadow = true;
            this._target.castShadows = true;
            this._manager.onLoad = () => {
                this._stateMachine.SetState('pose');
            };
            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this._mixer.clipAction(clip);
                this._animations[animName] = {
                    clip,
                    action
                }
            }
            const loader = new FBXLoader(this._manager);
            loader.setPath(`./models/${genderPath}/`);
            loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
            loader.load('idle.fbx', (a) => { _OnLoad('pose', a); });
            loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });
            loader.load('run.fbx', (a) => { _OnLoad('run', a); });
            loader.load('jump.fbx', (a) => { _OnLoad('jump', a); });



        })
    }
    get Position() {
        return this._position;
    }

    get Rotation() {
        if (!this._target) {
            return new THREE.Quaternion();
        }
        return this._target.quaternion;
    }

    Update(timeInSeconds) {
        let scalingFactor = 20;
        // let resultantImpulse;
        if (!this._stateMachine._currentState) {
            return;
        }

        this._stateMachine.Update(timeInSeconds, this._input);
        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));
        velocity.add(frameDecceleration);
        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();
        const acc = this._acceleration.clone();
        //acc=acceleration

        if (_keys.shift) {
            acc.multiplyScalar(3.0);
        }
        if (this._stateMachine._currentState.Name == 'dance') {
            acc.multiplyScalar(0.0);
        }
        if (this._stateMachine._currentState.Name == 'jump' && _keys.shift) {
            acc.multiplyScalar(1.0);
        }
        if (this._stateMachine._currentState.Name == 'jump' && (_keys.backward || _keys.forward)) {
            acc.multiplyScalar(2.5);
        }
        if (_keys.forward && this._stateMachine._currentState.Name != 'dance') {
            velocity.z += acc.z * timeInSeconds + 3;

            //velocity.z -= acc.z * timeInSeconds + 3;

            // this._target.userData.physicsBody.applyCentralImpulse(new THREE.Vector3(0, 1000000, 0));
        }
        if (_keys.backward && this._stateMachine._currentState.Name != 'dance') {
            /* let vel = new Ammo.btVector3(1, 0, 0);
             console.log('vel :>> ', vel);
             vel.op_mul(10);
             console.log('velafeter :>> ', vel);
             this._target.userData.physicsBody.setLinearVelocity(vel);*/
            velocity.z -= acc.z * timeInSeconds + 3;
        }
        /*if (_keys.space) {
            velocity.z += acc.z * timeInSeconds + 10;
        }*/
        if (_keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 1.1 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (_keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 1.1 * -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        controlObject.quaternion.copy(_R);
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
        let colision = this.collisions();
        if (!colision.val) {
            controlObject.position.add(forward);
            controlObject.position.add(sideways);
            if (this._stateMachine._currentState.Name != 'jump') {
                controlObject.position.y = 0;
            }
        } else {
            if (colision.rampa) {
                controlObject.position.add(forward);
                controlObject.position.add(sideways);
                controlObject.position.y = colision.y;
            } else {
                controlObject.position.x = colision.x;
                controlObject.position.z = colision.z;
            }

            //controlObject.position.x=this.oldPosition.x;
            //controlObject.position = this.oldPosition;
        }

        this._position.copy(controlObject.position);




        if (this._mixer) {
            this._mixer.update(timeInSeconds);
        }
        if (this._mixerLeon) {
            this._mixerLeon.update(timeInSeconds);

        }
        if (this._mixerLeon6) {
            this._mixerLeon6.update(timeInSeconds);
        }

        if (!this.mobile) {
            if (this._mixerLeon7) {
                this._mixerLeon7.update(timeInSeconds);
            }
            if (this._mixerh) {
                this._mixerh.update(timeInSeconds);
            }
            if (this._mixerh1) {
                this._mixerh1.update(timeInSeconds);
            }
            if (this._mixerh2) {
                this._mixerh2.update(timeInSeconds);
            }
            if (this._mixerh3) {
                this._mixerh3.update(timeInSeconds);
            }
        }

    }

    /**
     * 
     * @returns retrna true si existe una collision
     */
    collisions() {
        let position = this._target.position;
        const response = {
            val: false,
            x: 0,
            y: 0,
            z: 0,
            rampa: false
        }

        let juegoDisco = {
            xn: 380,
            xm: 471,
            zn: -15,
            zm: 79
        }
        let juegoRampa = {
            xn: -110,
            xm: 29,
            zn: -92,
            zm: 193
        }
        if (((position.x >= juegoDisco.xn && position.x <= juegoDisco.xm) && (position.z >= juegoDisco.zn && position.z <= juegoDisco.zm)) ||
            ((position.x >= juegoRampa.xn && position.x <= juegoRampa.xm) && (position.z >= juegoRampa.zn && position.z <= juegoRampa.zm))) {
            mensaje = true;
        } else {
            mensaje = false;
        }

        let paredRoja = {
                xn: 860,
                xm: 893,
                zn: -21,
                zm: 94
            }
            //Collision con pared Roja

        if ((position.x >= paredRoja.xn && position.x <= paredRoja.xm) && (position.z >= paredRoja.zn && position.z <= paredRoja.zm)) {
            this.oldPosition = position;
            response.val = true;
            response.y = 0;
            let mitad = (paredRoja.xm - paredRoja.xn) / 2;
            if (position.x < paredRoja.xn + mitad) {

                response.x = position.x - 1;
                response.z = position.z;
                return response;

            }
            if (position.x > paredRoja.xm - mitad) {
                response.x = position.x + 1;
                response.z = position.z;
                return response;
            }
            return response;


        }


        //WellBeing
        let wellBeing = {
            xn: 680,
            xm: 695,
            zn: -48,
            zm: 85
        }
        if ((position.x >= wellBeing.xn && position.x <= wellBeing.xm) && (position.z >= wellBeing.zn && position.z <= wellBeing.zm)) {
            this.oldPosition = position;
            response.val = true;
            response.y = 0;
            let mitad = (wellBeing.xm - wellBeing.xn) / 2;
            if (position.x < wellBeing.xn + mitad) {

                response.x = position.x - 1;
                response.z = position.z;
                return response;

            }
            if (position.x > wellBeing.xm - mitad) {
                response.x = position.x + 1;
                response.z = position.z;
                return response;
            }
            return response;


        }

        //Tarima1Subir
        let tarima1Rampa = {
            xn: -42,
            xm: -17,
            zn: -7,
            zm: 18
        }
        if ((position.x >= tarima1Rampa.xn && position.x <= tarima1Rampa.xm) && (position.z >= tarima1Rampa.zn && position.z < tarima1Rampa.zm)) {
            response.val = true;
            response.x = position.x;
            response.z = position.z;
            response.rampa = true;
            response.y = this.calculateY(position.z, tarima1Rampa);
            return response;
        }

        //Tarima1Atras
        let rampa1Atras = {
            xn: -42,
            xm: -17,
            zn: 18.1,
            zm: 22
        }
        if ((position.x >= rampa1Atras.xn && position.x <= rampa1Atras.xm) && (position.z >= rampa1Atras.zn && position.z < rampa1Atras.zm) && (position.y == 0)) {
            response.val = true;
            response.y = 0;
            response.x = position.x;
            if (position.x > rampa1Atras.zn && position.x < rampa1Atras.zm - 1) {
                response.z = position.z + 2;
            } else {
                response.z = position.z + 1;
            }

            return response;
        }


        /**
         * ObstaculoRampa
         */
        let obRampa = {
            xn: -43,
            xm: -18,
            zn: 27,
            zm: 35
        }

        if ((position.x >= obRampa.xn && position.x <= obRampa.xm) && (position.z >= obRampa.zn && position.z <= obRampa.zm) && (position.y == 0)) {
            this.oldPosition = position;
            response.val = true;
            response.y = 0;
            let mitad = (obRampa.zm - obRampa.zn) / 2; //4
            if (position.z < obRampa.zn + mitad) { //31
                response.x = position.x;
                response.z = position.z - 1;
                return response;
            }
            if (position.z > obRampa.zm - mitad) {
                response.x = position.x;
                response.z = position.z + 1;
                return response;
            }
            return response;


        }

        //Tarima2Subir
        let tarima2Rampa = {
            xn: -42,
            xm: -17,
            zn: 57,
            zm: 78
        }
        if ((position.x >= tarima2Rampa.xn && position.x <= tarima2Rampa.xm) && (position.z >= tarima2Rampa.zn && position.z < tarima2Rampa.zm)) {
            response.val = true;
            response.x = position.x;
            response.z = position.z;
            response.rampa = true;
            response.y = this.calculateY2(position.z, tarima2Rampa);
            return response;
        }
        //Tarima2Atras
        let rampa2Atras = {
            xn: -42,
            xm: -17,
            zn: 45,
            zm: 55
        }
        if ((position.x >= rampa2Atras.xn && position.x <= rampa2Atras.xm) && (position.z >= rampa2Atras.zn && position.z < rampa2Atras.zm) && (position.y == 0)) {
            response.val = true;
            response.y = 0;
            response.x = position.x;
            if (position.x > rampa2Atras.zn && position.x < rampa2Atras.zm - 1) {
                response.z = position.z - 2;
            } else {
                response.z = position.z - 1;
            }

            return response;
        }


        //IGLUS

        let igluBp1 = {
                xn: 401,
                xm: 465,
                zn: 394,
                zm: 420
            }
            //Collision con pared Roja

        if ((position.x >= igluBp1.xn && position.x <= igluBp1.xm) && (position.z >= igluBp1.zn && position.z <= igluBp1.zm)) {
            response.val = true;
            response.y = 0;
            response.x = position.x - 2;
            response.z = position.z + 2;
            return response;

        }
        return response
    }


    calculateY(z, tarima) {
        let y = ((z * 0.396) + 2.872)
        return y;
    }
    calculateY2(z, tarima) {
        let y = (((-10 / 21) * z) + (260 / 7))
        return y;
    }
    _LoadModelsLeon() {
        const loader = new FBXLoader();
        loader.setPath('./models/leon/LEONCIO TEX/');
        /* loader.setPath('./models/');
         loader.load('HSBC Entorno_10_CAPAS_BOTONES ENTER.fbx', (fbx) => {
             fbx.position.y = 3;
             fbx.scale.setScalar(0.1);
             fbx.traverse((c) => {
                 c.castShadow = true;
             });
             this._targetT1 = fbx;
             this._targetT1.name = 't1';
             this._targetT1.receiveShadow = false;
             this._targetT1.castShadows = true;
             this._params.scene.add(this._targetT1);
         });*/
        loader.load('HSBC_Leon_Cheering_1.fbx', (fbx) => {
            fbx.position.x = 1100;
            fbx.position.z = -0;
            fbx.position.y = 0.9;
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targetLeon = fbx;
            this._targetLeon.name = 'leon';
            this._targetLeon.quaternion._w = 0.7440;
            this._targetLeon.quaternion._y = 0.568;
            this._targetLeon.receiveShadow = true;
            this._targetLeon.castShadows = true
            this._params.scene.add(this._targetLeon);
            this._mixerLeon = new THREE.AnimationMixer(this._targetLeon);
            this._managerLeon = new THREE.LoadingManager();
            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this._mixerLeon.clipAction(clip);
                this._animationsLeon[animName] = {
                    clip,
                    action
                }
            }
            this._managerLeon.onLoad = () => {
                this._stateMachineLeon.SetState('dance1');
            };

            const loader = new FBXLoader(this._managerLeon);
            loader.setPath('./models/leon/LEONCIO TEX/');
            loader.load('HSBC_Leon_Victory idle_1.fbx', (a) => { _OnLoad('dance1', a); });

        });
        loader.load('HSBC_Leon_Hip Hop Dancing_1 (1).fbx', (fbx) => {
            fbx.position.x = 455;
            fbx.position.z = 42;
            fbx.position.y = 0.5;
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targetLeon6 = fbx;
            this._targetLeon6.name = 'pistaBaile';
            this._targetLeon6.quaternion._w = 0.7440;
            this._targetLeon6.quaternion._y = 0.800;
            this._targetLeon6.receiveShadow = true;
            this._targetLeon6.castShadows = true;
            this._params.scene.add(this._targetLeon6);
            this._mixerLeon6 = new THREE.AnimationMixer(this._targetLeon6);
            const action = this._mixerLeon6.clipAction(this._targetLeon6.animations[0]);
            action.play();
        });
        if (!isTouchscreenDevice()) {
            /* loader.load('HSBC_Leon_Robot Hip Hop Dance_1.fbx', (fbx) => {
                 fbx.position.x = 427;
                 fbx.position.y = -0.5;
                 fbx.position.z = 449;
                 fbx.scale.setScalar(0.01);
                 fbx.traverse((c) => {
                     c.castShadow = true;
                 });
                 this._targetLeon1 = fbx;
                 this._targetLeon1.name = 'leonHipHop';
                 this._targetLeon1.quaternion._w = 0.7440;
                 this._targetLeon1.quaternion._y = 0.568;
                 this._targetLeon1.receiveShadow = true;
                 this._targetLeon1.castShadows = true
                 this._params.scene.add(this._targetLeon1);
                 this._mixerLeon1 = new THREE.AnimationMixer(this._targetLeon1);
                 const action = this._mixerLeon1.clipAction(this._targetLeon1.animations[0]);
                 action.play();

             });

             loader.load('HSBC_Leon_Blowing Kiss_1.fbx', (fbx) => {
                 fbx.position.x = 74;
                 fbx.position.y = -0.5;
                 fbx.position.z = -393;
                 fbx.scale.setScalar(0.1);
                 fbx.traverse((c) => {
                     c.castShadow = true;
                 });
                 this._targetLeon2 = fbx;
                 this._targetLeon2.name = 'leonKiss';
                 this._targetLeon2.quaternion._w = 0.7440;
                 this._targetLeon2.quaternion._y = -0.400;
                 this._targetLeon2.receiveShadow = true;
                 this._targetLeon2.castShadows = true
                 this._params.scene.add(this._targetLeon2);
                 this._mixerLeon2 = new THREE.AnimationMixer(this._targetLeon2);
                 const action = this._mixerLeon2.clipAction(this._targetLeon2.animations[0]);
                 action.play();

             });

             loader.load('HSBC_Leon_Burpee_1.fbx', (fbx) => {
                 fbx.position.x = -89;
                 fbx.position.y = -0.5;
                 fbx.position.z = 457;
                 fbx.scale.setScalar(0.1);
                 fbx.traverse((c) => {
                     c.castShadow = true;
                 });
                 this._targetLeon3 = fbx;
                 this._targetLeon3.name = 'salud';
                 this._targetLeon3.quaternion._w = 0.7440;
                 this._targetLeon3.quaternion._y = 0.568;
                 this._targetLeon3.receiveShadow = true;
                 this._targetLeon3.castShadows = true
                 this._params.scene.add(this._targetLeon3);
                 this._mixerLeon3 = new THREE.AnimationMixer(this._targetLeon3);
                 const action = this._mixerLeon3.clipAction(this._targetLeon3.animations[0]);
                 action.play();

             });


             loader.load('HSBC_Leon_Cheering (Chiquito)_1.fbx', (fbx) => {
                 fbx.position.x = -378;
                 fbx.position.y = -0.5;
                 fbx.position.z = -53;
                 fbx.scale.setScalar(0.1);
                 fbx.traverse((c) => {
                     c.castShadow = true;
                 });
                 this._targetLeon4 = fbx;
                 this._targetLeon4.name = 'culturaValores';
                 this._targetLeon4.quaternion._w = 0.7440;
                 this._targetLeon4.quaternion._y = 0.568;
                 this._targetLeon4.receiveShadow = true;
                 this._targetLeon4.castShadows = true
                 this._params.scene.add(this._targetLeon4);
                 this._mixerLeon4 = new THREE.AnimationMixer(this._targetLeon4);
                 const action = this._mixerLeon4.clipAction(this._targetLeon4.animations[0]);
                 action.play();
             });

             loader.load('HSBC_Leon_Shuffling_1.fbx', (fbx) => {
                 fbx.position.x = 548;
                 fbx.position.y = -0.5;
                 fbx.position.z = -396;
                 fbx.scale.setScalar(0.1);
                 fbx.traverse((c) => {
                     c.castShadow = true;
                 });
                 this._targetLeon5 = fbx;
                 this._targetLeon5.name = 'Finanzas';
                 this._targetLeon5.quaternion._w = 0.7440;
                 this._targetLeon5.quaternion._y = -0.300;
                 this._targetLeon5.receiveShadow = true;
                 this._targetLeon5.castShadows = true;
                 this._params.scene.add(this._targetLeon5);
                 this._mixerLeon5 = new THREE.AnimationMixer(this._targetLeon5);
                 const action = this._mixerLeon5.clipAction(this._targetLeon5.animations[0]);
                 action.play();
             });*/



            loader.load('HSBC_Leon_Air Squats Bend Arms_1.fbx', (fbx) => {
                fbx.position.x = -50;
                fbx.position.z = -10;
                fbx.position.y = 0.5;
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    c.castShadow = true;
                });
                this._targetLeon7 = fbx;
                this._targetLeon7.name = 'rampa';
                this._targetLeon7.quaternion._w = 0.7440;
                this._targetLeon7.quaternion._y = 0.800;
                this._targetLeon7.receiveShadow = true;
                this._targetLeon7.castShadows = true;
                this._params.scene.add(this._targetLeon7);
                this._mixerLeon7 = new THREE.AnimationMixer(this._targetLeon7);
                const action = this._mixerLeon7.clipAction(this._targetLeon7.animations[0]);
                action.play();
            });
        }


        loader.setPath('./models/grises/');
        /*loader.load('HSBC_Chicas Grises_iDLE Quieto.fbx', (fbx) => {

            fbx.scale.setScalar(0.1);
            fbx.position.x = -38.23;
            fbx.position.y = 1;
            fbx.position.z = 521;
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targeth = fbx;
            this._targeth.name = 'gris2';
            this._targeth.receiveShadow = false;
            this._targeth.castShadows = true;
            this._params.scene.add(this._targeth);
            this._mixerh = new THREE.AnimationMixer(this._targeth);
            const action = this._mixerh.clipAction(this._targeth.animations[0]);
            action.play();
        });*/



        loader.load('HSBC_Hombres Grises_Sentado idle.fbx', (fbx) => {

            fbx.scale.setScalar(0.1);

            fbx.position.x = 498.995;
            fbx.position.y = 1;
            fbx.position.z = -441.66;
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targeth1 = fbx;
            this._targeth1.name = 'gris3';
            this._targeth1.receiveShadow = false;
            this._targeth1.castShadows = true;
            this._params.scene.add(this._targeth1);
            this._mixerh1 = new THREE.AnimationMixer(this._targeth1);
            const action = this._mixerh1.clipAction(this._targeth1.animations[0]);
            action.play();
        });
        loader.load('HSBC_Hombres Grises_Hablando 1.fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.position.x = 470;
            fbx.position.y = 0.5;
            fbx.position.z = 523.5;
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targeth2 = fbx;
            this._targeth2.name = 'gris3';
            this._targeth2.receiveShadow = false;
            this._targeth2.castShadows = true;
            this._params.scene.add(this._targeth2);
            this._mixerh2 = new THREE.AnimationMixer(this._targeth2);
            const action = this._mixerh2.clipAction(this._targeth2.animations[0]);
            action.play();
        });
        loader.load('HSBC_Chicas Grises_iDLE Quieto.fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.position.x = -423.66;
            fbx.position.y = 0.5;
            fbx.position.z = 7.5;
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targeth3 = fbx;
            this._targeth3.name = 'gris3';
            this._targeth3.receiveShadow = false;
            this._targeth3.castShadows = true;
            this._params.scene.add(this._targeth3);
            this._mixerh3 = new THREE.AnimationMixer(this._targeth3);
            const action = this._mixerh3.clipAction(this._targeth3.animations[0]);
            action.play();
        });
    }



};

function _onKeyDown(event) {

    switch (event.keyCode) {
        case 87: //W: FORWARD
        case 38: //up arrow
            if (!botones) {
                return;
            }
            if (!playSound && pause_music == false) {
                playSound = true;
                hitSound.play();
            }
            _keys.forward = true;

            break;
        case 65: //A: LEFT
        case 37: //left arrow
            if (!botones) {
                return;
            }
            _keys.left = true;
            break;

        case 83: //S: BACK
        case 40: //down arrow
            if (!botones) {
                return;
            }
            _keys.backward = true;
            break;
        case 68: //D: RIGHT
        case 39: //right arrow
            if (!botones) {
                return;
            }
            _keys.right = true;
            break;
        case 32: //space
            if (!botones) {
                return;
            }
            _keys.space = true;
            break;

            /*case 66: //b
                if (!botones) {
                    return;
                }
                _keys.b = true;
                break;*/
        case 66: //b

            _keys.b = true;
            break;
        case 16: //shift
            if (!botones) {
                return;
            }
            _keys.shift = true;
            break;
        case 49: //shift
            if (pause_music) {
                if (hitSound) {
                    hitSound.play();
                    hitSound.currentTime = 0;
                    pause_music = false;
                }

            } else {
                if (hitSound) {
                    hitSound.pause();
                    hitSound.currentTime = 0;
                    pause_music = true;
                }
            }

            break;
        case 13: //enter

            _keys.enter = true;

            let balance = {
                xn: 474,
                xm: 500,
                zn: 450,
                zm: 482
            }
            let finanzas = {
                zm: -370,
                zn: -399.5,
                xm: 524.5,
                xn: 494
            }

            let desarrollo = {
                zm: -369.6,
                zn: -399.5,
                xm: 24.5,
                xn: -10
            }

            let valores = {
                xm: -349,
                xn: -379,
                zn: 7.7,
                zm: 38.1
            }
            let salud = {
                xm: -15.5,
                xn: -46,
                zm: 483,
                zn: 454.5

            }
            let juegoLadrillosJson = {
                xm: -174,
                xn: -209,
                zm: 111,
                zn: 82
            }
            let juegoFutJson = {
                xm: -188,
                xn: -216,
                zm: -70.6,
                zn: -94
            }

            let character = paramsGral.scene.children.find((a) => { return a.name == 'personaje' });
            let position = character.position;

            if ((position.x >= balance.xn && position.x <= balance.xm) && (position.z >= balance.zn && position.z <= balance.zm)) {
                // let serv = new Services;
                // serv.guardarEstadistica({typeSchedule: 'Balance',type: 'entrarSchundle',});

                    $.ajax({
                        url: url + "statistics/create2",
                        type: 'post',
                        data: {
                            typeSchedule: 'Balance',type: 'entrarSchundle',
                            token: sessionStorage.getItem('token')
                        },
                        dataType: 'json',
                        success: function(data) {
                            // alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
                            // pregunta.val('');
                            // cajaHide.hide();
                            console.log(data);
                        },
                        error: function(err) {
                            console.log('err :>> ', err);
                            alertify.error(err.message);
                
                        }
                    });
                

                $('#agenda').show();
                $("#nameGral").hide();

                $("#classCluster").removeClass();
                $("#classCluster").addClass("cajacluster balance");
                $("#icon").html(`<img src="img/balance.svg" height="130"></img>`);

                $("#classCluster2").addClass(" balance");
                $("#icon2").html(`<img src="img/balance.svg" height="130"></img>`);
                $("#icon3").html(`<img src="img/balance.svg" height="130"></img>`);
                $("#tituloCluster").html(`<h1>Balance entre Trabajo y Tiempo Libre</h1>`);
                let textInfo = `<h2>Balance entre Trabajo y Tiempo Libre</h2>
                <div class="space2"></div>
                <p style="text-align: justify;">
                    Lograr un balance entre tu vida personal, profesional y social es importante.
                    HSBC te ofrece una gran variedad de actividades, herramietnas y opciones para lograrlo.
                </p>`
                $("#textInfo").html(textInfo);
                //$("#buttonAgenda").html(`<a onclick="agenda('Balance')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>`);
                //$("#buttonAgendaAnterior").html(`<a onclick="agendaAnterior('Balance')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#botonesAgenda").html(`<div class="space5 visible-xs"></div>
                <a onclick="agenda('Balance')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>
                <a onclick="agendaAnterior('Balance')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#divP1").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta1','cajacomments1','Balance')" value="Enviar">`);
                $("#divP").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta','cajacomments','Balance')" value="Enviar">`);
            }

            if ((position.x >= salud.xn && position.x <= salud.xm) && (position.z >= salud.zn && position.z <= salud.zm)) {
                // let serv = new Services;
                // serv.guardarEstadistica({typeSchedule: 'SaludBienestar',type: 'entrarSchundle',});
                $.ajax({
                    url: url + "statistics/create2",
                    type: 'post',
                    data: {
                        typeSchedule: 'SaludBienestar',type: 'entrarSchundle',
                        token: sessionStorage.getItem('token')
                    },
                    dataType: 'json',
                    success: function(data) {
                        // alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
                        // pregunta.val('');
                        // cajaHide.hide();
                        console.log(data);
                    },
                    error: function(err) {
                        console.log('err :>> ', err);
                        alertify.error(err.message);
            
                    }
                });
                $("#nameGral").hide();
                $('#agenda').show();
                $("#classCluster").removeClass();
                $("#classCluster2").removeClass();
                $("#classCluster").addClass("cajacluster salud");
                $("#icon").html(`<img src="img/salud-y-bienestar.svg" height="130"></img>`);
                $("#classCluster2").addClass("cajacluster salud");
                $("#icon2").html(`<img src="img/salud-y-bienestar.svg" height="130"></img>`);

                $("#icon3").html(`<img src="img/salud-y-bienestar.svg" height="130"></img>`);
                $("#tituloCluster").html(`<h1>Salud y Bienestar</h1>`);
                let textInfo = `<h2>Salud y Bienestar</h2>
                <div class="space2"></div>
                <p style="text-align: justify;">
                    Tu salud y bienestar son importantes para ser la mejor versión de ti.
                    HSBC te ofrece una variedad de beneficios que te ayudarán a sentirte bien física y emocionalmente.
                </p>`
                $("#textInfo").html(textInfo);
                $("#buttonAgenda").html(`<a onclick="agenda('SaludBienestar')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>`);
                $("#buttonAgendaAnterior").html(`<a onclick="agendaAnterior('SaludBienestar')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#botonesAgenda").html(`<div class="space5 visible-xs"></div>
                <a onclick="agenda('SaludBienestar')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>
                <a onclick="agendaAnterior('SaludBienestar')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#divP1").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta1','cajacomments1','SaludBienestar')" value="Enviar">`);
                $("#divP").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta','cajacomments','SaludBienestar')" value="Enviar">`);
            }
            if ((position.x >= valores.xn && position.x <= valores.xm) && (position.z >= valores.zn && position.z <= valores.zm)) {
                // let serv = new Services;
                // serv.guardarEstadistica({typeSchedule: 'Cultura',type: 'entrarSchundle',});
                $.ajax({
                    url: url + "statistics/create2",
                    type: 'post',
                    data: {
                        typeSchedule: 'Cultura',type: 'entrarSchundle',
                        token: sessionStorage.getItem('token')
                    },
                    dataType: 'json',
                    success: function(data) {
                        // alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
                        // pregunta.val('');
                        // cajaHide.hide();
                        console.log(data);
                    },
                    error: function(err) {
                        console.log('err :>> ', err);
                        alertify.error(err.message);
            
                    }
                });
                $('#agenda').show();
                $("#nameGral").hide();
                $("#classCluster").removeClass();
                $("#classCluster2").removeClass();
                $("#classCluster").addClass("cajacluster cultura");
                $("#classCluster2").addClass("cajacluster cultura");
                $("#icon").html(`<img src="img/cultura-y-valores.svg" height="130"></img>`);
                $("#icon2").html(`<img src="img/cultura-y-valores.svg" height="130"></img>`);

                $("#icon3").html(`<img src="img/cultura-y-valores.svg" height="130"></img>`);
                $("#tituloCluster").html(`<h1>Cultura y Valores</h1>`);
                let textInfo = `<h2>Cultura y Valores</h2>
                <div class="space2"></div>
                <p style="text-align: justify;">
                    HSBC es una empresa internacional sólida y sustentable, comprometida en ser una influencia positiva en la
                    comunidad, haciendo lo correcto en todo momento. ¡Siéntete orgulloso de pertenecer a una institución como ésta!
                    Para conocer más sobre la cultura y los programas ingresa al siguiente apartado.
                </p>`
                $("#textInfo").html(textInfo);
                $("#buttonAgenda").html(`<a onclick="agenda('Cultura')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>`);
                $("#buttonAgendaAnterior").html(`<a onclick="agendaAnterior('Cultura')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#botonesAgenda").html(`<div class="space5 visible-xs"></div>
                <a onclick="agenda('Cultura')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>
                <a onclick="agendaAnterior('Cultura')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#divP1").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta1','cajacomments1','Cultura')" value="Enviar">`);
                $("#divP").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta','cajacomments','Cultura')" value="Enviar">`);
            }
            if ((position.x >= finanzas.xn && position.x <= finanzas.xm) && (position.z >= finanzas.zn && position.z <= finanzas.zm)) {
                // let serv = new Services;
                // serv.guardarEstadistica({typeSchedule: 'Finanzas',type: 'entrarSchundle'});
                $.ajax({
                    url: url + "statistics/create2",
                    type: 'post',
                    data: {
                        typeSchedule: 'Finanzas',type: 'entrarSchundle',
                        token: sessionStorage.getItem('token')
                    },
                    dataType: 'json',
                    success: function(data) {
                        // alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
                        // pregunta.val('');
                        // cajaHide.hide();
                        console.log(data);
                    },
                    error: function(err) {
                        console.log('err :>> ', err);
                        alertify.error(err.message);
            
                    }
                });
                $('#agenda').show();
                $("#nameGral").hide();
                $("#classCluster").removeClass();
                $("#classCluster2").removeClass();
                $("#classCluster").addClass("cajacluster finanzas");
                $("#classCluster2").addClass("cajacluster finanzas");
                $("#icon").html(`<img src="img/finanzas.svg" height="130"></img>`);
                $("#icon2").html(`<img src="img/finanzas.svg" height="130"></img>`);
                $("#icon3").html(`<img src="img/finanzas.svg" height="130"></img>`);

                $("#tituloCluster").html(`<h1>Finanzas</h1>`);
                let textInfo = `<h2>Finanzas</h2>
                <div class="space2"></div>
                <p style="text-align: justify;">
                En HSBC apoyamos a nuestros colegas a cumplir sus sueños, conectando sus ambiciones con oportunidades. 
                ¡HSBC te ayuda a cumplir tus sueños! Ingresa al siguiente apartado para conocer  cómo puedes incrementar tus ahorros
                y/o ingresos para alcanzar todo lo que habías soñado.
                </p>`
                $("#textInfo").html(textInfo);
                $("#buttonAgenda").html(`<a onclick="agenda('Finanzas')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>`);
                $("#buttonAgendaAnterior").html(`<a onclick="agendaAnterior('Finanzas')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#botonesAgenda").html(`<div class="space5 visible-xs"></div>
                <a onclick="agenda('Finanzas')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>
                <a onclick="agendaAnterior('Finanzas')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);

                $("#divP1").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta1','cajacomments1','Finanzas')" value="Enviar">`);
                $("#divP").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta','cajacomments','Finanzas')" value="Enviar">`);

            }
            if ((position.x >= desarrollo.xn && position.x <= desarrollo.xm) && (position.z >= desarrollo.zn && position.z <= desarrollo.zm)) {
                // let serv = new Services;
                // serv.guardarEstadistica({typeSchedule: 'DesarrolloCarrera',type: 'entrarSchundle',});
                $.ajax({
                    url: url + "statistics/create2",
                    type: 'post',
                    data: {
                        typeSchedule: 'DesarrolloCarrera',type: 'entrarSchundle',
                        token: sessionStorage.getItem('token')
                    },
                    dataType: 'json',
                    success: function(data) {
                        // alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
                        // pregunta.val('');
                        // cajaHide.hide();
                        console.log(data);
                    },
                    error: function(err) {
                        console.log('err :>> ', err);
                        alertify.error(err.message);
            
                    }
                });
                $('#agenda').show();
                $("#nameGral").hide();
                $("#classCluster").removeClass();
                $("#classCluster2").removeClass();
                $("#classCluster").addClass("cajacluster desarrollo");
                $("#classCluster2").addClass("cajacluster desarrollo");
                $("#icon").html(`<img src="img/desarrollo.svg" height="130"></img>`);

                $("#icon2").html(`<img src="img/desarrollo.svg" height="130"></img>`);
                $("#icon3").html(`<img src="img/desarrollo.svg" height="130"></img>`);

                $("#tituloCluster").html(`<h1>Desarrollo y Carrera</h1>`);
                let textInfo = `<h2>Desarrollo y Carrera</h2>
                <div class="space2"></div>
                <p style="text-align: justify;">
                HSBC brinda oportunidades de desarrollo de carrera y aprendizaje continuo en un ambiente retador
                 e inclusivo en donde el talento es el único diferenciador, con oportunidades de desarrollo nacionales e internacionales. 
                 Tú, que buscas retos y cambios constantes, ingresa a la siguiente sección para conocer cuál será tu siguiente paso y cómo darlo. 
                </p>`
                $("#textInfo").html(textInfo);
                $("#buttonAgenda").html(`<a onclick="agenda('DesarrolloCarrera')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>`);
                $("#buttonAgendaAnterior").html(`<a onclick="agendaAnterior('DesarrolloCarrera')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);
                $("#botonesAgenda").html(`<div class="space5 visible-xs"></div>
                <a onclick="agenda('DesarrolloCarrera')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de eventos</a>
                <a onclick="agendaAnterior('DesarrolloCarrera')" class="agendaicon"><img src="img/agenda.svg" width="100%"><br> Agenda de días anteriores</a>`);

                $("#divP1").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta1','cajacomments1','DesarrolloCarrera')" value="Enviar">`);
                $("#divP").html(`<input type="button" class="btngocomm" onclick="enviarPregunta('pregunta','cajacomments','DesarrolloCarrera')" value="Enviar">`);

            }
            break;
    }
}

function _onKeyUp(event) {
    if (!botones) {
        return;
    }
    switch (event.keyCode) {
        case 87: //W: FORWARD
        case 38: //up arrow
            if (!botones) {
                return;
            }
            _keys.forward = false;

            break;
        case 65: //A: LEFT
        case 37: //left arrow
            if (!botones) {
                return;
            }
            _keys.left = false;
            break;

        case 83: //S: BACK
        case 40: //down arrow
            if (!botones) {
                return;
            }
            _keys.backward = false;
            break;
        case 68: //D: RIGHT
        case 39: //right arrow
            if (!botones) {
                return;
            }
            _keys.right = false;
            break;
        case 32: //space
            if (!botones) {
                return;
            }
            _keys.space = false;
            break;
        case 16: //shift
            if (!botones) {
                return;
            }
            _keys.shift = false;
            break;

        case 13: //shift
            if (!botones) {
                return;
            }
            _keys.enter = false;
            break;
        case 66: //b
            if (!botones) {
                return;
            }
            _keys.b = false;
            break;
    }
}
class BasicCharacterControllerInput {
    constructor(params) {
        this._params = params;
        this._Init();
        paramsGral = params
    }
    _Init() {

        document.addEventListener('keydown', (e) => { _onKeyDown(e), false });
        document.addEventListener('keyup', (e) => { _onKeyUp(e), false });
    }

}
class FiniteStateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;

    }
    _AddState(name, type) {
        this._states[name] = type;
    }
    SetState(name) {
        const prevState = this._currentState;
        if (prevState) {

            if (prevState.Name == name) {
                return;
            }

            prevState.Exit();
        }
        const state = new this._states[name](this);
        this._currentState = state;
        state.Enter(prevState);
    }
    Update(timeElapsed, input) {
        if (this._currentState) {
            this._currentState.Update(timeElapsed, input);
        }
    }
}

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy, camera) {
        super();
        this._proxy = proxy;
        this._camera = camera;
        this._Init();
    }
    _Init() {
        this._AddState('pose', PoseState);
        this._AddState('walk', WalkState);
        this._AddState('dance', DanceState);
        this._AddState('run', RunState);
        this._AddState('jump', JumpState);


    }
}


class CharacterFSMLeon extends FiniteStateMachine {
    constructor(proxy, camera) {
        super();
        this._proxy = proxy;
        this._camera = camera;
        this._Init();
    }
    _Init() {
        this._AddState('dance1', DanceStateLeon);



    }
}

class State {
    constructor(parent, camera) {
        this._parent = parent;
        this._camera = camera;
    }

    Enter() {}
    Exit() {}
    Update() {}
};
class RunState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'run';
    }

    Enter(prevState) {

        const curAction = this._parent._proxy._animations['run'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.enabled = true;

            if (prevState.Name == 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {}

    Update(timeElapsed, input) {
        if (_keys.forward || _keys.backward) {
            if (!_keys.shift) {
                this._parent.SetState('walk');
            }
            if (_keys.space) {
                this._parent.SetState('jump');
            }
            return;
        }

        this._parent.SetState('pose');
    }
};



class JumpState extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'jump';
    }

    Enter(prevState) {

        const curAction = this._parent._proxy._animations['jump'].action;
        const mixer = curAction.getMixer();
        let pos = this._parent._camera.scene.children.find((a) => { return a.name == 'personaje' });
        mixer.addEventListener('finished', this._FinishedCallback);
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();

        this._parent.SetState('pose');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['jump'].action;

        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(timeElapsed, input) {

        //this._parent.SetState('pose');

    }
};

class DanceStateLeon extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'dance1';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['dance1'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('dance1');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['dance1'].action;

        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {}
};
class DanceState extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'dance';
    }

    Enter(prevState) {
        if (hitSound) {
            hitSound.pause();
            hitSound.currentTime = 0;
        }
        if (danceSound) {

            danceSound.play();
        }
        /*else {
                   var danceSound = new Audio('./assets/music.mp3');
                   danceSound.loop = true;
                   danceSound.volume = 0.5;
                   danceSound.currentTime = 0;
                   danceSound.play();
               }*/
        const curAction = this._parent._proxy._animations['dance'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('pose');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['dance'].action;

        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {}
};
class PoseState extends State {
    constructor(parent) {
        super(parent);
    }
    get Name() {
        return 'pose';
    }
    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['pose'].action;
        if (prevState) {
            if (prevState.Name == 'dance') {
                if (danceSound) {
                    danceSound.pause();
                }
                if (hitSound) {
                    hitSound.play();
                    pause_music = false;
                }
            }
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }
    Exit() {

    }
    Update(_, input) {
        if (_keys.forward || _keys.backward) {
            this._parent.SetState('walk');
        } else if (_keys.b) {
            this._parent.SetState('dance');
        } else if (_keys.space) {
            this._parent.SetState('jump');
        }

    }
}


class WalkState extends State {
    constructor(parent) {
        super(parent);
    }
    get Name() {
        return 'walk';
    }
    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk'].action;
        let pos = this._parent._camera.scene.children.find((a) => { return a.name == 'personaje' });
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.time = 0.0;
            curAction.enabled = true;

            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
            curAction.crossFadeFrom(prevAction, 0.5, true);

            curAction.play();

            //this._params.camera.lookAt(mesh.position);
        } else {


            curAction.play();
        }
    }
    Exit() {

    }
    Update(_, input) {
        if (_keys.forward || _keys.backward) {
            if (_keys.shift) {
                this._parent.SetState('run');
            }
            if (_keys.space) {
                this._parent.SetState('jump');
            }
            return;
        }
        this._parent.SetState('pose');
    }
}
export let moveDirection = { left: 0, right: 0, forward: 0, back: 0, enter: 0 };
export let moveDirectionFut = { left: 0, right: 0, forward: 0, back: 0, enter: 0 };

let ballObject = null;
let ballObjectFut = null;
let juegoLadrillos = false;
let juegoFut = false;
let botones = true;
let camara = {
    third: true,
    ladrillos: false,
    fut: false
}
export class CharacterControllerDemo {
    constructor(gender) {
        this.gender = gender;
        //this.rigidBodies = [];

        //this.tmpTrans = new Ammo.btTransform();
        this.manager = new THREE.LoadingManager();
        //this.setupPhysicsWorld();
        this._Initialize();


    }
    setupPhysicsWorld() {

        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache = new Ammo.btDbvtBroadphase(),
            solver = new Ammo.btSequentialImpulseConstraintSolver();

        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    }
    createBall() {


        let pos = { x: -200, y: 0, z: 140 };
        let radius = 2;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 1;
        let manager = new THREE.LoadingManager();
        var marble_loader = new THREE.TextureLoader(manager);
        /*var marbleTexture = marble_loader.load("./resources/earth.jpg");
        marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
        marbleTexture.repeat.set(1, 1);
        marbleTexture.anisotropy = 1;
        marbleTexture.encoding = THREE.sRGBEncoding;*/

        //threeJS Section
        let ball = (ballObject = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            //new THREE.MeshLambertMaterial({ map: marbleTexture })
            new THREE.MeshLambertMaterial()
        ));



        ball.geometry.computeBoundingSphere();
        ball.geometry.computeBoundingBox();

        ball.position.set(pos.x, pos.y, pos.z);
        ball.castShadow = true;
        ball.receiveShadow = true;

        this._scene.add(ball);

        //Ammojs Section
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(
            new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
        );
        let motionState = new Ammo.btDefaultMotionState(transform);

        let colShape = new Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            colShape,
            localInertia
        );
        let body = new Ammo.btRigidBody(rbInfo);
        //body.setFriction(4);
        body.setRollingFriction(10);

        //set ball friction

        //once state is set to disable, dynamic interaction no longer calculated
        body.setActivationState(4);

        this.physicsWorld.addRigidBody(
            body //collisionGroupRedBall, collisionGroupGreenBall | collisionGroupPlane
        );

        ball.userData.physicsBody = body;
        ballObject.userData.physicsBody = body;


        this.rigidBodies.push(ballObject);
        this.rigidBodies.push(ball);

    }


    createBallFut() {


        let pos = { x: -190, y: 0, z: -130 };
        let radius = 4;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 1;
        let manager = new THREE.LoadingManager();
        var marble_loader = new THREE.TextureLoader(manager);
        var marbleTexture = marble_loader.load("./resources/earth.jpg");
        marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
        marbleTexture.repeat.set(1, 1);
        marbleTexture.anisotropy = 1;
        marbleTexture.encoding = THREE.sRGBEncoding;

        //threeJS Section
        let ball = (ballObjectFut = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            //new THREE.MeshLambertMaterial({ map: marbleTexture })
            new THREE.MeshLambertMaterial()
        ));



        ball.geometry.computeBoundingSphere();
        ball.geometry.computeBoundingBox();

        ball.position.set(pos.x, pos.y, pos.z);
        ball.castShadow = true;
        ball.receiveShadow = true;

        this._scene.add(ball);

        //Ammojs Section
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(
            new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
        );
        let motionState = new Ammo.btDefaultMotionState(transform);

        let colShape = new Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            colShape,
            localInertia
        );
        let body = new Ammo.btRigidBody(rbInfo);
        //body.setFriction(4);
        body.setRollingFriction(10);

        //set ball friction

        //once state is set to disable, dynamic interaction no longer calculated
        body.setActivationState(4);

        this.physicsWorld.addRigidBody(
            body //collisionGroupRedBall, collisionGroupGreenBall | collisionGroupPlane
        );

        ball.userData.physicsBody = body;
        ballObjectFut.userData.physicsBody = body;


        this.rigidBodies.push(ballObjectFut);
        this.rigidBodies.push(ball);

    }
    createGridPlane() {
        // block properties
        let pos = { x: -194, y: -0.25, z: 263 };
        let scale = { x: 28, y: 0.5, z: 280 };
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 0; //mass of zero = infinite mass

        //create grid overlay on plane
        var grid = new THREE.GridHelper(175, 20, 0xffffff, 0xffffff);
        grid.material.opacity = 0.15;
        grid.material.transparent = true;
        grid.position.y = 0.005;
        //this._scene.add(grid);

        //Create Threejs Plane
        let blockPlane = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.1,
            })
        );
        blockPlane.position.set(pos.x, pos.y, pos.z);
        blockPlane.scale.set(scale.x, scale.y, scale.z);
        blockPlane.receiveShadow = true;
        this._scene.add(blockPlane);



        //Ammo.js Physics
        let transform = new Ammo.btTransform();
        transform.setIdentity(); // sets safe default values
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(
            new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
        );
        let motionState = new Ammo.btDefaultMotionState(transform);

        //setup collision box
        let colShape = new Ammo.btBoxShape(
            new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
        );
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        //  provides information to create a rigid body
        let rigidBodyStruct = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            colShape,
            localInertia
        );
        let body = new Ammo.btRigidBody(rigidBodyStruct);
        body.setFriction(10);
        body.setRollingFriction(10);

        // add to world
        this.physicsWorld.addRigidBody(body);
    }

    createGridPlaneFut() {
            // block properties
            let pos = { x: -194, y: -0.25, z: -240 };
            let scale = { x: 63, y: 0.5, z: 270 };
            let quat = { x: 0, y: 0, z: 0, w: 1 };
            let mass = 0; //mass of zero = infinite mass

            //create grid overlay on plane
            var grid = new THREE.GridHelper(175, 20, 0xffffff, 0xffffff);
            grid.material.opacity = 0.15;
            grid.material.transparent = true;
            grid.position.y = 0.005;
            //this._scene.add(grid);

            //Create Threejs Plane
            let blockPlane = new THREE.Mesh(
                new THREE.BoxBufferGeometry(),
                new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.1,
                })
            );
            blockPlane.position.set(pos.x, pos.y, pos.z);
            blockPlane.scale.set(scale.x, scale.y, scale.z);
            blockPlane.receiveShadow = true;
            this._scene.add(blockPlane);



            //Ammo.js Physics
            let transform = new Ammo.btTransform();
            transform.setIdentity(); // sets safe default values
            transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
            transform.setRotation(
                new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
            );
            let motionState = new Ammo.btDefaultMotionState(transform);

            //setup collision box
            let colShape = new Ammo.btBoxShape(
                new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
            );
            colShape.setMargin(0.05);

            let localInertia = new Ammo.btVector3(0, 0, 0);
            colShape.calculateLocalInertia(mass, localInertia);

            //  provides information to create a rigid body
            let rigidBodyStruct = new Ammo.btRigidBodyConstructionInfo(
                mass,
                motionState,
                colShape,
                localInertia
            );
            let body = new Ammo.btRigidBody(rigidBodyStruct);
            body.setFriction(10);
            body.setRollingFriction(10);

            // add to world
            this.physicsWorld.addRigidBody(body);
        }
        //create X axis wall around entire plane
    createWallX(x, y, z, size) {

        const wallScale = { x: 0.125, y: 9, z: size };

        const wall = new THREE.Mesh(
            new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                opacity: 0.1,
                transparent: true,
            })
        );

        wall.position.x = x;
        wall.position.y = y;
        wall.position.z = z;

        wall.receiveShadow = true;

        this._scene.add(wall);

        this.addRigidPhysics(wall, wallScale);
    }

    //create Z axis wall around entire plane
    createWallZ(x, y, z, size) {
        const wallScale = { x: size, y: 9, z: 0.125 };

        const wall = new THREE.Mesh(
            new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                opacity: 0.1,
                transparent: true,
            })
        );

        wall.position.x = x;
        wall.position.y = y;
        wall.position.z = z;

        wall.receiveShadow = true;

        this._scene.add(wall);

        this.addRigidPhysics(wall, wallScale);
    }

    addRigidPhysics(item, itemScale) {
        let pos = { x: item.position.x, y: item.position.y, z: item.position.z };
        let scale = { x: itemScale.x, y: itemScale.y, z: itemScale.z };
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 0;
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(
            new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
        );

        var localInertia = new Ammo.btVector3(0, 0, 0);
        var motionState = new Ammo.btDefaultMotionState(transform);
        let colShape = new Ammo.btBoxShape(
            new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
        );
        colShape.setMargin(0.05);
        colShape.calculateLocalInertia(mass, localInertia);
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            colShape,
            localInertia
        );
        let body = new Ammo.btRigidBody(rbInfo);
        body.setActivationState(4);
        body.setCollisionFlags(2);
        this.physicsWorld.addRigidBody(body);
    }
    _Initialize() {

        //Physijs.scripts.worker = '../physijs_worker.js';
        //|Physijs.scripts.ammo = 'examples/js/ammo.js';
        this.clock = new THREE.Clock();

        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'low-power',
            precision: 'lowp',
            premultipliedAlpha: false,
            logarithmicDepthBuffer: true,

        });


        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = new THREE.SpotLight();
        this._threejs.shadowMap.needsUpdate = true;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._threejs.domElement);
        $("canvas").hide();
        $("#padre").show();
        setTimeout(() => {
            $("#padre").hide();
            $("canvas").show();
            if (!isTouchscreenDevice()) {
                $("#over").show();
            } else {
                $("#btnJoy").show();
            }


        }, 20000);
        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.01;
        const far = 2600.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.castShadow = true;
        this._camera.receiveShadow = true;
        this._scene = new THREE.Scene();
        this._scene.castShadow = true;
        this._scene.receiveShadow = true;
        let light = new THREE.HemisphereLight(0xAEF0FF, 0xB78E79, 0.6);
        this._scene.add(light);
        const spotLight = new THREE.SpotLight(0xffffff, 0.55);
        spotLight.castShadow = true;
        spotLight.shadow.camera.castShadow = true;
        spotLight.shadow.camera.focus = 1;

        //spotLight.receiveShadow = true;
        spotLight.shadow.bias = 1;
        spotLight.position.set(2500, 5000, 400);
        this._scene.add(spotLight);
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
            './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
            './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
            './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
            './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
            './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
        ]);
        texture.encoding = THREE.sRGBEncoding;
        this._scene.background = texture;
        this._mixers = [];
        this._previousRAF = null;
        this._LoadAnimatedModel();

        // add to world
        /*this.physicsWorld.addRigidBody(body);

        this.createGridPlane();
        this.createBall();
        this.createWallX(-179, 1.75, 263, 280);
        this.createWallX(-207, 1.75, 263, 280);
        this.createWallZ(-193, 1.75, 123, 28);
        this.createWallZ(-193, 1.75, 402, 28);
        this.wallOfBricks(200);
        this.wallOfBricks(250);

        this.wallOfBricks(300);



        this.createGridPlaneFut();
        this.createWallX(-162, 1.75, -240, 270);
        this.createWallX(-225, 1.75, -240, 270);
        this.createWallZ(-194, 1.75, -105, 64);
        this.createWallZ(-194, 1.75, -375, 64);
        this.createBallFut();



        this.createBeachBall();
        */
        this._LoadModel();
        this.setupEventHandlers();
        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        this._camera.position.set(1770, 18, 40);

        controls.target.set(0, 10, 0);
        controls.keys = {
            LEFT: 1, //left arrow
            UP: 1, // up arrow
            RIGHT: 1, // right arrow
            BOTTOM: 1 // down arrow
        }
        controls.update();
        this._RAF();
    }
    setupEventHandlers() {
        window.addEventListener("keydown", this.handleKeyDown, false);
        window.addEventListener("keyup", this.handleKeyUp, false);
    }

    handleKeyDown(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case 87: //W: FORWARD
            case 38: //up arrow
                moveDirection.forward = 1;
                moveDirectionFut.forward = 1;
                break;

            case 83: //S: BACK
            case 40: //down arrow
                moveDirection.back = 1;
                moveDirectionFut.back = 1;
                break;

            case 65: //A: LEFT
            case 37: //left arrow
                moveDirection.left = 1;
                moveDirectionFut.left = 1;

                break;

            case 68: //D: RIGHT
            case 39: //right arrow
                moveDirection.right = 1;
                moveDirectionFut.right = 1;

                break;
        }
    }

    handleKeyUp(event) {
        let keyCode = event.keyCode;

        switch (keyCode) {


            case 13: //shift
                moveDirection.enter = 0;
                break;
            case 87: //FORWARD
            case 38:
                moveDirectionFut.forward = 0;
                moveDirection.forward = 0;
                break;

            case 83: //BACK
            case 40:
                moveDirection.back = 0;
                moveDirectionFut.back = 0;
                break;

            case 65: //LEFT
            case 37:
                moveDirection.left = 0;
                moveDirectionFut.left = 0;
                break;

            case 68: //RIGHT
            case 39:
                moveDirectionFut.right = 0;
                moveDirection.right = 0;
                break;
        }
    }

    moveBall() {
        let scalingFactor = 20;
        let moveX = moveDirection.left - moveDirection.right; //1
        let moveZ = moveDirection.forward - moveDirection.back;
        let moveY = 0;

        if (ballObject.position.y < 2.01) {
            moveX = moveDirection.left - moveDirection.right;
            moveZ = moveDirection.forward - moveDirection.back;
            moveY = 0;
        } else {
            moveX = moveDirection.left - moveDirection.right;
            moveZ = moveDirection.forward - moveDirection.back;
            moveY = -0.25;
        }

        // no movement
        if (moveX == 0 && moveY == 0 && moveZ == 0) return;
        let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
        resultantImpulse.op_mul(scalingFactor);
        let physicsBody = ballObject.userData.physicsBody;
        physicsBody.setLinearVelocity(resultantImpulse);
    }


    moveBallFut() {
        let scalingFactor = 20;
        let moveX = moveDirection.right - moveDirection.left; //1
        let moveZ = moveDirection.back - moveDirection.forward;
        let moveY = 0;

        if (ballObjectFut.position.y < 2.01) {
            moveX = moveDirection.right - moveDirection.left;
            moveZ = moveDirection.back - moveDirection.forward;
            moveY = 0;
        } else {
            moveX = moveDirection.right - moveDirection.left;
            moveZ = moveDirection.back - moveDirection.forward;
            moveY = -0.25;
        }

        // no movement
        if (moveX == 0 && moveY == 0 && moveZ == 0) return;
        let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
        resultantImpulse.op_mul(scalingFactor);
        let physicsBody = ballObjectFut.userData.physicsBody;
        physicsBody.setLinearVelocity(resultantImpulse);
    }
    createBeachBall() {
        let pos = { x: -190, y: 0, z: -200 };

        let radius = 5;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 2;

        //import beach ball texture
        var texture_loader = new THREE.TextureLoader(this.manager);
        var beachTexture = texture_loader.load("./assets/img/BeachBallColor.jpg");
        beachTexture.wrapS = beachTexture.wrapT = THREE.RepeatWrapping;
        beachTexture.repeat.set(1, 1);
        beachTexture.anisotropy = 1;
        beachTexture.encoding = THREE.sRGBEncoding;

        //threeJS Section
        let ball = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshLambertMaterial({ map: beachTexture })
        );

        ball.position.set(pos.x, pos.y, pos.z);
        ball.castShadow = true;
        ball.receiveShadow = true;
        this._scene.add(ball);

        //Ammojs Section
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(
            new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
        );
        let motionState = new Ammo.btDefaultMotionState(transform);

        let colShape = new Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            colShape,
            localInertia
        );
        let body = new Ammo.btRigidBody(rbInfo);

        body.setRollingFriction(1);
        this.physicsWorld.addRigidBody(body);

        ball.userData.physicsBody = body;
        this.rigidBodies.push(ball);
    }


    wallOfBricks(distance) {
        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        var brickMass = 0.1;
        var brickLength = 3;
        var brickDepth = 3;
        var brickHeight = 1.5;
        var numberOfBricksAcross = 6;
        var numberOfRowsHigh = 6;

        pos.set(-70, brickHeight * 0.5, distance);
        quat.set(0, 0, 0, 1);

        for (var j = 0; j < numberOfRowsHigh; j++) {
            var oddRow = j % 2 == 1;

            pos.x = -200;

            if (oddRow) {
                pos.x += 0.25 * brickLength;
            }

            var currentRow = oddRow ? numberOfBricksAcross + 1 : numberOfBricksAcross;
            for (let i = 0; i < currentRow; i++) {
                var brickLengthCurrent = brickLength;
                var brickMassCurrent = brickMass;
                if (oddRow && (i == 0 || i == currentRow - 1)) {
                    //first or last brick
                    brickLengthCurrent *= 0.5;
                    brickMassCurrent *= 0.5;
                }
                var brick = this.createBrick(
                    brickLengthCurrent,
                    brickHeight,
                    brickDepth,
                    brickMassCurrent,
                    pos,
                    quat,
                    new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                    })
                );
                brick.castShadow = true;
                brick.receiveShadow = true;

                if (oddRow && (i == 0 || i == currentRow - 2)) {
                    //first or last brick
                    pos.x += brickLength * 0.25;
                } else {
                    pos.x += brickLength;
                }
                pos.z += 0.0001;
            }
            pos.y += brickHeight;
        }
    }
    createBrick(sx, sy, sz, mass, pos, quat, material) {
        var threeObject = new THREE.Mesh(
            new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1),
            material
        );
        var shape = new Ammo.btBoxShape(
            new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
        );
        shape.setMargin(0.05);

        this.createBrickBody(threeObject, shape, mass, pos, quat);

        return threeObject;
    }
    createBrickBody(threeObject, physicsShape, mass, pos, quat) {
        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(
            new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
        );
        var motionState = new Ammo.btDefaultMotionState(transform);

        var localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        var rbInfo = new Ammo.btRigidBodyConstructionInfo(
            mass,
            motionState,
            physicsShape,
            localInertia
        );
        var body = new Ammo.btRigidBody(rbInfo);

        threeObject.userData.physicsBody = body;

        this._scene.add(threeObject);

        if (mass > 0) {
            this.rigidBodies.push(threeObject);

            // Disable deactivation
            body.setActivationState(4);
        }

        this.physicsWorld.addRigidBody(body);
    }
    _LoadAnimatedModel() {
        const params = {
            camera: this._camera,
            scene: this._scene,
            gender: this.gender,
            rigidBodies: this.rigidBodies,
            physicsWorld: this.physicsWorld
        }

        this._controls = new BasicCharacterController(params);
        if (isTouchscreenDevice()) {
            createJoystick(document.getElementById("joystick-wrapper"));
            document.getElementById("joystick-wrapper").style.visibility = "visible";
            document.getElementById("joystick").style.visibility = "visible";
            document.getElementById("joystick").style.position = "absolut";
        }
        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            target: this._controls,
        });
    }



    _LoadModel() {


        const loader = new FBXLoader();
        loader.setPath('./models/');

        if (!isTouchscreenDevice()) {
            loader.load('HSBC Entorno_MASTER 11.2.fbx', (fbx) => {
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    c.castShadow = true;
                });
                this._target = fbx;
                this._target.name = 'entorno';
                this._target.receiveShadow = false;
                this._target.castShadows = true;
                this._scene.add(this._target);
            });
        } else {
            loader.load('HSBC Entorno_MASTER 11_movil.fbx', (fbx) => {
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    c.castShadow = true;
                });
                this._target = fbx;
                this._target.name = 'entorno';
                this._target.receiveShadow = false;
                this._target.castShadows = true;
                this._scene.add(this._target);
            });
        }


        /*loader.load('HSBC Entorno_MASTER 9 (ConP).fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._target = fbx;
            this._target.name = 'entorno';
            this._target.receiveShadow = false;
            this._target.castShadows = true;
            this._scene.add(this._target);
        })*/
        /*
                loader.load('HSBC Entorno_10_CAPAS_EXTRAS.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_Lounge y Alrededores.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });


                loader.load('HSBC Entorno_10_CAPAS_LETRAS.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_Entrada.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });


                loader.load('HSBC Entorno_10_CAPAS_IGLUS.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_COMERCIAL.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_DISCO.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_PISO.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_BOLICHE.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_PATIO fUTBOL.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_porteRIA fUTBOL.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_BOTONES ROJOS.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_BOTONES Nuevos.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_RAMPA.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_Cluster Balance.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_Cluster Cultura.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_Cluster Desarrollo.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });
                loader.load('HSBC Entorno_10_CAPAS_Cluster Finanzas.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });

                loader.load('HSBC Entorno_10_CAPAS_Cluster Salud.fbx', (fbx) => {
                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);
                });




                loader.load('HSBC Entorno_10_CAPAS_TECLAS INICIO.fbx', (fbx) => {

                    fbx.scale.setScalar(0.1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'entorno';
                    this._target.receiveShadow = false;
                    this._target.castShadows = true;
                    this._scene.add(this._target);

                });

        */
        if (!isTouchscreenDevice()) {
            loader.setPath('./models/grises/');

            loader.load('HSBC_Chicas Grises_Sentada Idle.fbx', (fbx) => {

                fbx.scale.setScalar(0.1);
                fbx.position.x = -38.23;
                fbx.position.y = 1;
                fbx.position.z = 521;
                fbx.traverse((c) => {
                    c.castShadow = true;
                });
                this._target = fbx;
                this._target.name = 'gris1';
                this._target.receiveShadow = false;
                this._target.castShadows = true;
                this._scene.add(this._target);

            });
        }





    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    updatePhysics(deltaTime) {
        // Step world
        this.physicsWorld.stepSimulation(deltaTime, 10);

        // Update rigid bodies
        for (let i = 0; i < this.rigidBodies.length; i++) {
            let objThree = this.rigidBodies[i];
            let objAmmo = objThree.userData.physicsBody;
            let ms = objAmmo.getMotionState();
            if (ms) {
                ms.getWorldTransform(this.tmpTrans);
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
        if (ballObject.position.y < -50) {
            this._scene.remove(ballObject);
            this.createBall();
        }
    }


    _RAF() {

        requestAnimationFrame((t) => {
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            this._RAF();
            this._threejs.render(this._scene, this._camera);
            this._Step(t - this._previousRAF);
            this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }

        if (this._controls) {
            this._controls.Update(timeElapsedS);
        }
        if (camara.third) {
            this._thirdPersonCamera.Update(timeElapsedS);
        }


    }
}


class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }

    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(0, 15, -30);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Position);
        return idealOffset;
    }

    _CalculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 10, 50);
        idealLookat.applyQuaternion(this._params.target.Rotation);
        idealLookat.add(this._params.target.Position);
        return idealLookat;
    }

    Update(timeElapsed) {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookat = this._CalculateIdealLookat();

        // const t = 0.05;
        // const t = 4.0 * timeElapsed;
        const t = 1.0 - Math.pow(0.001, timeElapsed);

        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}
let _APP = null;
export function isTouchscreenDevice() {
    let supportsTouch = false;
    if ("ontouchstart" in window)
    // iOS & android
        supportsTouch = true;
    else if (window.navigator.msPointerEnabled)
    // Win8
        supportsTouch = true;
    else if ("ontouchstart" in document.documentElement)
    // Controversial way to check touch support
        supportsTouch = true;

    return supportsTouch;
}

window.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        if (_APP == null && sessionStorage.getItem('gender')) {
            $("#namePeople").html(sessionStorage.getItem('name'))
            _APP = new CharacterControllerDemo(sessionStorage.getItem('gender'));
        }

    }, 1000)

});




export function touchEvent(coordinates) {
    if (coordinates.x > 30) {
        _keys.left = false;
        _keys.right = true;
        moveDirection.right = 1;
        moveDirection.left = 0;
    } else if (coordinates.x < -30) {
        moveDirection.left = 1;
        moveDirection.right = 0;
        _keys.left = true;
        _keys.right = false;
    } else {
        _keys.left = false;
        _keys.right = false;

        moveDirection.right = 0;
        moveDirection.left = 0;
    }

    if (coordinates.y > 30) {
        _keys.forward = false;
        _keys.backward = true;
        moveDirection.back = 1;
        moveDirection.forward = 0;
    } else if (coordinates.y < -30) {
        _keys.forward = true;
        _keys.backward = false;
        moveDirection.forward = 1;
        moveDirection.back = 0;
    } else {
        _keys.forward = false;
        _keys.backward = false;
        moveDirection.forward = 0;
        moveDirection.back = 0;
    }
}


// export fuction guardarEstadist(obj:any) {
//     console.log(obj)
//    // obj  {
//        // type:string;
//        // typeSchedule?: eTypesSchedule
//    //  }
//    $.ajax({
//        url: url + "statistics/create2",
//        type: 'post',
//        data: {
//            ...obj,
//            token: sessionStorage.getItem('token')
//        },
//        dataType: 'json',
//        success: function(data) {
//            // alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
//            // pregunta.val('');
//            // cajaHide.hide();
//            console.log(data);
//        },
//        error: function(err) {
//            console.log('err :>> ', err);
//            alertify.error(err.message);

//        }
//    });
// };

export function createJoystick(parent) {
    const maxDiff = 62; //how far drag can go
    const stick = document.createElement("div");
    //stick.classList.add("joystick");
    stick.setAttribute("id", "joystick");

    stick.addEventListener("mousedown", handleMouseDown);
    stick.addEventListener("mousemove", handleMouseMove);
    stick.addEventListener("mouseup", handleMouseUp);
    stick.addEventListener("touchstart", handleMouseDown);
    stick.addEventListener("touchmove", handleMouseMove);
    stick.addEventListener("touchend", handleMouseUp);

    let dragStart = null;
    let currentPos = { x: 0, y: 0 };

    function handleMouseDown(event) {

        event.preventDefault();
        stick.style.transition = "0s";

        if (event.changedTouches) {
            dragStart = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            };

            return;
        }
        dragStart = {
            x: event.clientX,
            y: event.clientY,
        };
    }

    function handleMouseMove(event) {
        if (dragStart === null) return;

        //console.log("entered handleMouseMove");
        if (event.changedTouches) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            //touchEvent(currentPos);
        }

        const xDiff = event.clientX - dragStart.x;
        const yDiff = event.clientY - dragStart.y;
        const angle = Math.atan2(yDiff, xDiff);
        const distance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
        const xNew = distance * Math.cos(angle);
        const yNew = distance * Math.sin(angle);
        stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
        currentPos = { x: xNew, y: yNew };
        touchEvent(currentPos);
    }

    function handleMouseUp(event) {
        if (dragStart === null) return;
        stick.style.transition = ".2s";
        stick.style.transform = `translate3d(0px, 0px, 0px)`;
        dragStart = null;
        currentPos = { x: 0, y: 0 };
        moveDirection.forward = 0;
        moveDirection.left = 0;
        moveDirection.right = 0;
        moveDirection.back = 0;
        _keys.forward = false;
        _keys.left = false;
        _keys.right = false;
        _keys.backward = false;
    }

    parent.appendChild(stick);
    return {
        getPosition: () => currentPos,
    };
}

function start() {
    _APP = new CharacterControllerDemo(sessionStorage.getItem('gender'));

}