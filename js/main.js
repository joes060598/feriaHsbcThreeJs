'use strict';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
setTimeout(() => {


    if (!sessionStorage.getItem('token')) {
        //$('#registro').modal('toggle');
        //$('#collapseOne').collapse();
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
class BasicCharacterController {
    constructor(params) {
        this._Init(params);
    }
    _Init(params) {
        this._params = params;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);

        this._animations = {};

        this._input = new BasicCharacterControllerInput(this._params);
        this._LoadModels();
        this._LoadModelsLeon();
        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations, this._params), this._params);


    }
    _LoadModels() {
        const loader = new FBXLoader();
        loader.setPath('./models/girl/');
        loader.load('MUJER 2_Idle_1.fbx', (fbx) => {

            fbx.position.x = 1240;
            fbx.position.z = 35;
            //fbx.position.y = 0.9;
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._target = fbx;
            this._target.name = 'personaje';
            this._params.scene.add(this._target);
            this._mixer = new THREE.AnimationMixer(this._target);
            this._manager = new THREE.LoadingManager();
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
            loader.setPath('./models/girl/');
            loader.load('MUJER 2_Walking_1.fbx', (a) => { _OnLoad('walk', a); });
            loader.load('idle.fbx', (a) => { _OnLoad('pose', a); });
            loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });
            loader.load('MUJER 2_Running_1.fbx', (a) => { _OnLoad('run', a); });

        })
    }


    _LoadModelsLeon() {
        const loader = new FBXLoader();
        loader.setPath('./models/leon/LEONCIO TEX/');
        loader.load('HSBC_Leon_RIG & TEXTURE_FINAL UV_1.fbx', (fbx) => {
            fbx.position.x = 550;
            fbx.position.z = -50;
            fbx.position.y = 0.9;
            fbx.scale.setScalar(0.1);
            fbx.traverse((c) => {
                c.castShadow = true;
            });
            this._targetLeon = fbx;
            this._targetLeon.name = 'leon';
            this._params.scene.add(this._targetLeon);
            this._mixerLeon = new THREE.AnimationMixer(this._targetLeon);
            this._managerLeon = new THREE.LoadingManager();
            /*this._managerLeon.onLoad = () => {
                this._stateMachine.SetState('dance');
            };*/

            //const loader = new FBXLoader(this._manager);
            //loader.setPath('./models/leon/');
            // loader.load('HSBC_Leon_Hip hop Dancing_1.fbx', (a) => { _OnLoad('dance', a); });

        })
    }


    Update(timeInSeconds) {
        if (!this._target) {
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
        if (this._stateMachine._currentState) {
            if (this._stateMachine._currentState.Name == 'dance') {
                acc.multiplyScalar(0.0);
            }
        }


        if (this._input._keys.forward) {
            velocity.z += acc.z * timeInSeconds + 2;
        }
        if (this._input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds + 2;
        }
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

        oldPosition.copy(controlObject.position);

        if (this._mixer) {
            this._mixer.update(timeInSeconds);
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
            enter: false
        }
        document.addEventListener('keydown', (e) => { this._onKeyDown(e), false });
        document.addEventListener('keyup', (e) => { this._onKeyUp(e), false });
    }
    _onKeyDown(event) {
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

                let position = this._params.scene.children[5].position;


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
            this._parent._camera.camera.position.set(this._parent._camera.scene.children[5].position.x + 30, 18, this._parent._camera.scene.children[5].position.z + 5);

            if (!input._keys.shift) {
                this._parent.SetState('walk');
            }
            return;
        }

        this._parent.SetState('pose');
    }
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
        } else if (input._keys.space) {
            this._parent.SetState('dance');
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
            console.log('this._parent', this._parent)

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
            this._parent._camera.camera.position.set(this._parent._camera.scene.children[5].position.x + 30, 18, this._parent._camera.scene.children[5].position.z + 5);
            //this._parent._camera.camera.lookAt(this._parent._camera.scene.children[5].position);

            if (input._keys.shift) {
                this._parent.SetState('run');
            }
            //this._parent.SetState('walk');
            return;
        }
        this._parent.SetState('pose');
    }
}

export class CharacterControllerDemo {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        //renderizador


        /**
         * 
         * 
         * vrotateCamera(fbx) {
  // current camera position

}
         */
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
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

        let light = new THREE.DirectionalLight(0xFFFFFF, 0.6);
        light.position.set(100, 300, 300);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.left = 500;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 500;
        light.shadow.camera.bottom = -50;
        console.log("light", light)
        this._scene.add(light);

        let light2 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
        light2.position.set(100, 300, -300);
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

        this._scene.add(light2);
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
        this._scene.add(light3);
        const width = 1500;
        const height = 1000;
        const intensity = 0.1;
        const rectLight = new THREE.RectAreaLight(0xFFFFFF, intensity, width, height);
        rectLight.position.set(2500, 5, 0);
        rectLight.lookAt(0, 0, 0);
        this._scene.add(rectLight)
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

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10000, 10000, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        //this._scene.add(plane);

        this._mixers = [];
        this._previousRAF = null;
        /*const listener = new THREE.AudioListener();
        this._camera.add(listener)
        
        
        // create a global audio source
        /*const sound = new THREE.Audio( listener );
        
        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'resources/music.ogg', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });*/
        this._LoadAnimatedModel();
        this._LoadModel();


        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        console.log('controls :>> ', controls);
        this._camera.position.set(1270, 18, 40);

        controls.target.set(0, 10, 0);
        controls.keys = {
            LEFT: 1, //left arrow
            UP: 1, // up arrow
            RIGHT: 1, // right arrow
            BOTTOM: 1 // down arrow
        }
        controls.update();


        /* this.loadIglues();

         this.loadIglues2();
         this.loadIglues3();
         this.loadIglues4();*/

        this._RAF();
    }

    _LoadAnimatedModel() {
        const params = {
            camera: this._camera,
            scene: this._scene,
        }
        this._controls = new BasicCharacterController(params);

    }

    _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
        const loader = new FBXLoader();
        loader.setPath(path);
        loader.load(modelFile, (fbx) => {
            fbx.scale.setScalar(0.04);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            fbx.position.copy(offset);

            const anim = new FBXLoader();
            anim.setPath(path);
            anim.load(animFile, (anim) => {
                const m = new THREE.AnimationMixer(fbx);
                this._mixers.push(m);
                const idle = m.clipAction(anim.animations[0]);
                idle.play();
            });
            this._scene.add(fbx);
        });
    }

    _LoadModel() {
        //const loader = new GLTFLoader();

        const loader = new FBXLoader();
        loader.setPath('./models/');
        loader.load('HSBC Entorno_MASTER 7.4.1 (ConP).fbx', (fbx) => {
                //fbx.position.x = 1350;
                //fbx.position.z = -5;
                //fbx.position.y = 0.9;
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    c.castShadow = true;
                });
                this._target = fbx;
                this._target.name = 'entorno';
                this._scene.add(this._target);


            })
            /*loader.setPath('./models/');

            loader.load('HSBC Entorno_PISO_4.2.fbx', (fbx) => {

                    //fbx.position.x = 1350;
                    //fbx.position.z = -5;
                    fbx.position.y = -240;
                    //fbx.scale.setScalar(1);
                    fbx.traverse((c) => {
                        c.castShadow = true;
                    });
                    this._target = fbx;
                    this._target.name = 'piso';
                    this._scene.add(this._target);


                })*/
            /*loader.load('./models/HSBC Entorno_MASTER 6 (SinP).glb', (gltf) => {
                //gltf.scene.position.x=50;
                //gltf.scene.position.y=90;
                //gltf.scene.position.x=30;
                console.log('gltf', gltf)
                gltf.scene.traverse(c => {
                    c.castShadow = true;
                });
                this._scene.add(gltf.scene, );
            });*/

        /*loader.load('./models/LUCES AREA_2.glb', (gltf) => {
            //gltf.scene.position.x=50;
            //gltf.scene.position.y=90;
            //gltf.scene.position.x=30;
            console.log('gltf', gltf)
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene, );
        });*/


        loader.load('./models/juegos/DINAMICO_Pino Boliche_1.glb', (gltf) => {
            //gltf.scene.position.x=50;
            //gltf.scene.position.y=90;
            //gltf.scene.position.x=30;

            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene, );
        });

        loader.load('./models/juegos/DINAMICO_Ballon Futbol_1.glb', (gltf) => {
            //gltf.scene.position.x=50;
            //gltf.scene.position.y=90;
            gltf.scene.position.x = 20;

            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene, );
        });

    }

    loadIglues() {
        const loader = new GLTFLoader();
        loader.load('./models/iglu.glb', (gltf) => {
            gltf.scene.position.x = 40;
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    }
    loadIglues2() {
        const loader = new GLTFLoader();
        loader.load('./models/iglu.glb', (gltf) => {
            gltf.scene.position.x = 70;
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    }

    loadIglues3() {
        const loader = new GLTFLoader();
        loader.load('./models/iglu.glb', (gltf) => {
            gltf.scene.position.x = 50;
            gltf.scene.position.z = 60;
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    }


    loadIglues4() {
        const loader = new GLTFLoader();
        loader.load('./models/iglu.glb', (gltf) => {
            gltf.scene.position.x = 70;
            gltf.scene.position.z = 60;
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
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
    }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new CharacterControllerDemo();
});