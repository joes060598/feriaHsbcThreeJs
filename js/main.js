'use strict';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Octree } from '../tools/jsm/math/Octree.js';
import { Capsule } from '../tools/jsm/math/Capsule.js';



setTimeout(() => {
    if (!sessionStorage.getItem('token')) {
        console.log('entro :>> ');
        $('#registro').modal('toggle');
    }
}, 1000);


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
    }

    get animations() {
        return this._animations;
    }
    get camera() {
        return this._camera;
    }
};
class BasicCharacterController {
    constructor(params) {
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
        }
        const loader = new FBXLoader();
        loader.setPath(`./models/${genderPath}/`);
        loader.load('idle.fbx', (fbx) => {
            fbx.position.x = 1740;
            fbx.position.z = 35;
            fbx.position.y = 0.5;
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

            loader.load('runJump.fbx', (a) => { _OnLoad('jump', a); });

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


    _LoadModelsLeon() {
        const loader = new FBXLoader();
        loader.setPath('./models/leon/LEONCIO TEX/');
        loader.load('HSBC_Leon_Cheering_1.fbx', (fbx) => {
            fbx.position.x = 1600;
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
        loader.load('HSBC_Leon_Robot Hip Hop Dance_1.fbx', (fbx) => {
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
        });

        loader.load('HSBC_Leon_Hip Hop Dancing_1 (1).fbx', (fbx) => {
            fbx.position.x = 400;
            fbx.position.z = 35;
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


    Update(timeInSeconds) {
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
        if (this._input._keys.shift) {
            acc.multiplyScalar(3.0);
        }
        if (this._stateMachine._currentState.Name == 'dance') {
            acc.multiplyScalar(0.0);
        }
        if (this._input._keys.forward && this._stateMachine._currentState.Name != 'dance') {
            velocity.z += acc.z * timeInSeconds + 3;
        }
        if (this._input._keys.backward && this._stateMachine._currentState.Name != 'dance') {
            velocity.z -= acc.z * timeInSeconds + 3;
        }
        /*if (this._input._keys.space) {
            velocity.z += acc.z * timeInSeconds + 10;
        }*/
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
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
        controlObject.position.add(forward);
        controlObject.position.add(sideways);
        this._position.copy(controlObject.position);
        if (this._mixer) {
            this._mixer.update(timeInSeconds);
        }
        if (this._mixerLeon) {
            this._mixerLeon.update(timeInSeconds);
        }
        if (this._mixerLeon1) {
            this._mixerLeon1.update(timeInSeconds);
        }
        if (this._mixerLeon2) {
            this._mixerLeon2.update(timeInSeconds);
        }
        if (this._mixerLeon3) {
            this._mixerLeon3.update(timeInSeconds);
        }
        if (this._mixerLeon4) {
            this._mixerLeon4.update(timeInSeconds);
        }
        if (this._mixerLeon5) {
            this._mixerLeon5.update(timeInSeconds);
        }

        if (this._mixerLeon6) {
            this._mixerLeon6.update(timeInSeconds);
        }
        if (this._mixerLeon7) {
            this._mixerLeon7.update(timeInSeconds);
        }

    }
};
class BasicCharacterControllerInput {
    constructor(params) {
        this._params = params;
        this._Init();
    }
    _Init() {
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            enter: false,
            b: false
        }
        document.addEventListener('keydown', (e) => { this._onKeyDown(e), false });
        document.addEventListener('keyup', (e) => { this._onKeyUp(e), false });
    }
    _onKeyDown(event) {
        console.log('event.keyCode :>> ', event.keyCode);
        switch (event.keyCode) {
            //case 87: //W: FORWARD
            case 38: //up arrow
                this._keys.forward = true;
                break;
                //case 65: //A: LEFT
            case 37: //left arrow
                this._keys.left = true;
                break;

                //case 83: //S: BACK
            case 40: //down arrow
                this._keys.backward = true;
                break;
                //case 68: //D: RIGHT
            case 39: //right arrow
                this._keys.right = true;
                break;
            case 32: //space
                this._keys.space = true;
                break;
            case 66: //b
                this._keys.b = true;
                break;
            case 16: //shift
                this._keys.shift = true;
                break;
            case 13: //enter
                this._keys.enter = true;

                let balance = {
                    xn: 611,
                    xm: 619,
                    y: 0.9,
                    z: 325.8824197480127,
                }
                let finanzas = {
                    xn: 620,
                    xm: 628,
                    y: 0.9,
                    z: -318.35156937411085
                }

                let desarrollo = {
                    xn: 140,
                    xm: 150,
                    y: 0.9,
                    z: -318.35156937411085
                }

                let valores = {
                    xn: -120,
                    xm: -130,
                    y: 0.9,
                    z: -318.35156937411085
                }
                let salud = {
                    xn: 102,
                    xm: 112,
                    y: 0.9,
                    z: -318.35156937411085
                }

                let position = this._params.scene.children[4].position;


                if (position.x >= balance.xn && position.x <= balance.xm) {
                    $('#balance').modal('toggle');
                    //$('#bodyAgenda').html("<img src='./assets/img/build.png' width='500px' height='500px' class='image'>");
                }

                if (position.x >= finanzas.xn && position.x <= finanzas.xm) {
                    $('#balance').modal('toggle');
                    //$('#bodyAgenda').html("<img src='./assets/img/build.png' width='500px' height='500px' class='image'>");
                }
                if (position.x >= desarrollo.xn && position.x <= desarrollo.xm) {
                    $('#balance').modal('toggle');
                    //$('#bodyAgenda').html("<img src='./assets/img/build.png' width='500px' height='500px' class='image'>");
                }
                if (position.x >= valores.xn && position.x <= valores.xm) {
                    $('#balance').modal('toggle');
                    //$('#bodyAgenda').html("<img src='./assets/img/build.png' width='500px' height='500px' class='image'>");
                }
                if (position.x >= salud.xn && position.x <= salud.xm) {
                    $('#balance').modal('toggle');
                    //$('#bodyAgenda').html("<img src='./assets/img/build.png' width='500px' height='500px' class='image'>");
                }
                break;
        }
    }

    _onKeyUp(event) {
        switch (event.keyCode) {
            //case 87: //W: FORWARD
            case 38: //up arrow
                this._keys.forward = false;
                break;
                //case 65: //A: LEFT
            case 37: //left arrow
                this._keys.left = false;
                break;

                //case 83: //S: BACK
            case 40: //down arrow
                this._keys.backward = false;
                break;
                //case 68: //D: RIGHT
            case 39: //right arrow
                this._keys.right = false;
                break;
            case 32: //space
                this._keys.space = false;
                break;
            case 16: //shift
                this._keys.shift = false;
                break;
            case 13: //shift
                this._keys.enter = false;
                break;
            case 66: //b
                this._keys.b = false;
                break;
        }
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
        console.log('namesetState :>> ', name);
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
        /*this._AddState('dance2', DanceState);
        this._AddState('dance3', DanceState);
        this._AddState('dance4', DanceState);
        this._AddState('dance5', DanceState);*/


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
        if (input._keys.forward || input._keys.backward) {
            if (!input._keys.shift) {
                this._parent.SetState('walk');
            }
            return;
        }

        this._parent.SetState('pose');
    }
};



class JumpState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'jump';
    }

    Enter(prevState) {

        const curAction = this._parent._proxy._animations['jump'].action;
        const mixer = curAction.getMixer();
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
        //this._parent.SetState('pose');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['jump'].action;

        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        //this._Cleanup();
    }

    Update(timeElapsed, input) {
        console.log('timeElapsed :>> ', timeElapsed);

        this._parent.SetState('pose');

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
        console.log('this._parent._proxy._animations :>> ', this._parent._proxy._animations);
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
            console.log('play :>> ');
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
        if (input._keys.forward || input._keys.backward) {
            this._parent.SetState('walk');
        } else if (input._keys.b) {
            this._parent.SetState('dance');
        } else if (input._keys.space) {
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
        console.log('this._camera', this._parent._camera)
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
        if (input._keys.forward || input._keys.backward) {
            if (input._keys.shift) {
                this._parent.SetState('run');
            }
            if (input._keys.space) {
                this._parent.SetState('jump');
            }
            return;
        }
        this._parent.SetState('pose');
    }
}

export class CharacterControllerDemo {
    constructor(gender) {
        this.gender = gender;
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'low-power',
            precision: 'lowp',
            premultipliedAlpha: false,
            logarithmicDepthBuffer: true,

        });
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.shadowMap.needsUpdate = true;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.01;
        const far = 2600.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this._scene = new THREE.Scene();
        console.log('this._threejs :>> ', this._threejs);
        let light = new THREE.HemisphereLight(0xAEF0FF, 0xB78E79, 0.6);

        /*light.position.set(100, 300, 300);
        light.target.position.set(0, 0, 0);
        
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.left = 500;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 500;
        light.shadow.camera.bottom = -50;*/
        console.log("light", light)
        this._scene.add(light);

        const spotLight = new THREE.SpotLight(0xffffff, 0.8);
        spotLight.castShadow = true;
        spotLight.receiveShadow = true;
        spotLight.position.set(2500, 5000, 800)
        this._scene.add(spotLight);

        let light2 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
        light2.position.set(800, 700, 0);
        light2.target.position.set(0, 0, 0);
        light2.castShadow = true;
        light2.shadow.bias = -0.001;
        //verificar 
        light2.shadow.mapSize.width = 4096;
        light2.shadow.mapSize.height = 4096;
        light2.shadow.camera.far = 500.0;
        light2.shadow.camera.near = 0.5;
        light2.shadow.camera.far = 500.0;
        light2.shadow.camera.left = 50;
        light2.shadow.camera.right = -50;
        light2.shadow.camera.top = 50;
        light2.shadow.camera.bottom = -50;

        //this._scene.add(light2);
        let light3 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        light3.position.set(-300, 300, 0);
        light3.target.position.set(0, 0, 0);
        light3.castShadow = true;
        light3.shadow.bias = -0.001;
        light3.shadow.mapSize.width = 4096;
        light3.shadow.mapSize.height = 4096;
        light3.shadow.camera.near = 0.1;
        light3.shadow.camera.far = 500.0;
        light3.shadow.camera.near = 0.5;
        light3.shadow.camera.far = 500.0;
        light3.shadow.camera.left = 50;
        light3.shadow.camera.right = -50;
        light3.shadow.camera.top = 50;
        light3.shadow.camera.bottom = -50;
        //this._scene.add(light3);
        const width = 1500;
        const height = 1000;
        const intensity = 0.1;
        const rectLight = new THREE.RectAreaLight(0xFFFFFF, intensity, width, height);
        rectLight.position.set(2500, 5, 0);
        rectLight.lookAt(0, 0, 0);
        //this._scene.add(rectLight)
        const width2 = 1500;
        const height2 = 1000;
        const intensity2 = 1;
        const rectLight2 = new THREE.RectAreaLight(0xFFFFFF, intensity2, width2, height2);
        rectLight2.position.set(-2000, 5, 0);
        rectLight2.lookAt(0, 0, 0);
        //this._scene.add(rectLight2)


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
        const listener = new THREE.AudioListener();
        this._camera.add(listener)


        // create a global audio source
        this.sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        console.log('this.sound :>> ', this.sound);
        audioLoader.load('resources/casio.ogg', (buffer) => {
            console.log('this :>> ', this);
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(0.5);
            //
        });

        this._LoadAnimatedModel();
        this._LoadModel();


        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        this._camera.position.set(1770, 18, 40);
        this._camera.castShadow = true;
        this._camera.receiveShadow = true;
        controls.target.set(0, 10, 0);
        controls.keys = {
            LEFT: 1, //left arrow
            UP: 1, // up arrow
            RIGHT: 1, // right arrow
            BOTTOM: 1 // down arrow
        }
        controls.update();
        console.log('this._camera :>> ', this._camera);
        this._RAF();
    }

    _LoadAnimatedModel() {
        const params = {
            camera: this._camera,
            scene: this._scene,
            gender: this.gender
        }
        this.sound.play();
        this._controls = new BasicCharacterController(params);
        if (isTouchscreenDevice()) {
            createJoystick(document.getElementById("joystick-wrapper"));
            document.getElementById("joystick-wrapper").style.visibility = "visible";
            document.getElementById("joystick").style.visibility = "visible";
        }
        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            target: this._controls,
        });
    }



    _LoadModel() {


        const loader = new FBXLoader();
        loader.setPath('./models/');
        loader.load('HSBC Entorno_MASTER 9 (ConP).fbx', (fbx) => {
            console.log('fbx :>> ', fbx);
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._target = fbx;
            this._target.name = 'entorno';
            this._target.receiveShadow = true;
            this._target.castShadows = true
            this._scene.add(this._target);


        })



    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
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
        this._thirdPersonCamera.Update(timeElapsedS);

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
        const idealOffset = new THREE.Vector3(10, 15, -30);
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
            _APP = new CharacterControllerDemo(sessionStorage.getItem('gender'));
        }

    }, 1000)

});


export function createJoystick(parent) {
    const maxDiff = 62; //how far drag can go
    const stick = document.createElement("div");
    //stick.classList.add("joystick");
    stick.setAttribute("id", "joystick");

    stick.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    stick.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);

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
    }

    parent.appendChild(stick);
    return {
        getPosition: () => currentPos,
    };
}

export function touchEvent(coordinates) {
    if (coordinates.x > 30) {
        moveDirection.right = 1;
        moveDirection.left = 0;
    } else if (coordinates.x < -30) {
        moveDirection.left = 1;
        moveDirection.right = 0;
    } else {
        moveDirection.right = 0;
        moveDirection.left = 0;
    }

    if (coordinates.y > 30) {
        moveDirection.back = 1;
        moveDirection.forward = 0;
    } else if (coordinates.y < -30) {
        moveDirection.forward = 1;
        moveDirection.back = 0;
    } else {
        moveDirection.forward = 0;
        moveDirection.back = 0;
    }
}