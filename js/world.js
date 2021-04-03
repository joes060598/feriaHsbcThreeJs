export let world = () => {


}


export let around = () => {
    const loader = new FBXLoader();
    loader.setPath('./models/');
    loader.load('HSBC Entorno_MASTER 8.6 (ConP).fbx', (fbx) => {
            console.log('fbx :>> ', fbx);
            //worldOctree.fromGraphNode(gltf.scene);
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
        /* loader.load('./models/HSBC_Entorno C_1.glb', (gltf) => {
             //gltf.scene.position.x=50;
             //gltf.scene.position.y=90;
             //gltf.scene.position.x=30;
             console.log('gltf', gltf)
             gltf.scene.traverse(c => {
                 c.castShadow = true;
             });
             console.log('gltf.scene :>> ', gltf.scene);
             this._scene.add(gltf.scene);
             worldOctree.fromGraphNode(gltf.scene);

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