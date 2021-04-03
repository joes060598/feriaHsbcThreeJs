'use strict';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

export let Cman = () => {

}

export let CGirl = () => {

}
export let CNan = () => {

}

export let CLion = () => {

}

export let CAnimatedCharacter = (path, model, position, scalar, name, actions, scene, animations) => {
    let stateMachine;
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(model, (fbx) => {
        console.log('fbx :>> ', fbx);
        fbx.position.x = position.x;
        fbx.position.y = position.y;
        fbx.position.z = position.z;
        fbx.scale.setScalar(scalar);
        fbx.traverse((c) => {
            c.castShadow = true;
        });
        let target = fbx;
        let mixer = new THREE.AnimationMixer(target);
        let manager = new THREE.LoadingManager();
        target.name = name;
        scene.add(target);
        manager.onLoad = () => {
            _stateMachine.SetState('pose');

        };
        const OnLoad = (animName, anim) => {
            const clip = anim.animations[0];
            const action = mixer.clipAction(clip);
            animations[animName] = {
                clip,
                action
            }
        }
        const loader = new FBXLoader(manager);
        loader.setPath(path);
        for (let index = 0; index < actions.length; index++) {
            const action = actions[index];
            loader.load(action.model, (a) => { OnLoad(action.do, a); });
        }


    })
}