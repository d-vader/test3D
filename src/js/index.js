
if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
let camera, controls, scene, renderer;
init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-170, 170, 40);

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);


    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;


    // world
    let geometryCylinder = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    let geometrySphere = new THREE.SphereGeometry(5, 32, 32);
    let geometryCube = new THREE.CubeGeometry(4, 4, 4);
    // geometryCube.scale(10,10,10);
    let material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});


    let createBtn = document.querySelector(".create");
    let selectInput = document.querySelector("#figure-type");
    let selectOptions = {
        cube: 'cube',
        sphere: 'sphere',
        pyramid: 'pyramid'
    };
    let scaleInput = document.querySelector("#scale");
    let idList = document.querySelector(".list");
    // let listItems = document.querySelectorAll('.list-item');
    class ListItem {
        constructor() {
            // this.mesh = mesh;
        }
        staticElement(mesh){
            let listItem = document.createElement("div");
            listItem.setAttribute('id', mesh.uuid);
            listItem.setAttribute('class', 'list-item');
            idList.appendChild(listItem);
            let listContent = document.createElement("span");
            listContent.innerText = mesh.uuid;
            listItem.appendChild(listContent);
        }
        removableElement(mesh){
            let listItem = document.createElement("div");
            listItem.setAttribute('id', mesh.uuid);
            listItem.setAttribute('class', 'list-item');
            idList.appendChild(listItem);
            let listContent = document.createElement("span");
            listContent.innerText = mesh.uuid;
            listItem.appendChild(listContent);
            let listClose = document.createElement("div");
            listClose.setAttribute('class', 'close');
            listClose.innerText = 'X';
            listClose.addEventListener('click', function () {
                this.parentElement.remove();
                scene.remove(mesh);
            });
            listItem.appendChild(listClose);
        }
    }



    createBtn.addEventListener("click", function (e) {
        e.preventDefault();
        let mesh;

        switch (selectInput.value) {
            case selectOptions.cube:
                if(scaleInput.value) {
                    geometryCube.scale(scaleInput.value,scaleInput.value,scaleInput.value);
                    scaleInput.value=1;
                }
                mesh = new THREE.Mesh(geometryCube, material);
                break;

            case selectOptions.sphere:
                if(scaleInput.value) {
                    geometrySphere.scale(scaleInput.value,scaleInput.value,scaleInput.value);
                    scaleInput.value=1;
                }
                mesh = new THREE.Mesh(geometrySphere, material);
                break;

            case selectOptions.pyramid:
                if(scaleInput.value) {
                    geometryCylinder.scale(scaleInput.value,scaleInput.value,scaleInput.value);
                    scaleInput.value=1;
                }
                mesh = new THREE.Mesh(geometryCylinder, material);
                break;
        }

        mesh.position.x = Math.random() * 300;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 300;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);


        let listItem = new ListItem();
        listItem.removableElement(mesh);

    });




    // lights
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    scene.add(light);
    //
    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render(scene, camera);
}
