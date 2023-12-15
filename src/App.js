import { useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const canvas = canvasRef.current;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.3, -1);
  camera.rotation.set(0, Math.PI, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x7fbfff, 1.0);
  canvas.appendChild(renderer.domElement);

  // ライトの生成
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1, 1, -1).normalize();
  scene.add(light);

  // VRMの読み込み
  const loader = new GLTFLoader();
  loader.load("./alicia.vrm", (gltf) => {
    VRM.from(gltf).then((vrm) => {
      // シーンへの追加
      scene.add(vrm.scene);
    });
  });

  // フレーム毎に呼ばれる
  const update = () => {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  };
  update();


  return <div id="canvas" ref={canvasRef} />;
}

export default App;
