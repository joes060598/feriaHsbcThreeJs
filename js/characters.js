export let Cman = () => {

}

export let CGirl = () => {

}
export let CNan = () => {

}

export let CLion = () => {

}
export let CAnimatedCharacter = (path, model, position, scalar, name, actions) => {
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
    //export let