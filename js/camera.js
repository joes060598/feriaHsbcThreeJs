export let camera = () => {
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.01;
    const far = 2600.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
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
}