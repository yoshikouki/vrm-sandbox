"use client";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterModel } from "./character-model";
import { loadVRMAnimation } from "./vrm-animation/loadVRMAnimation";

export class CharacterViewer {
  public isReady: boolean;
  public model?: CharacterModel;

  private _clock: THREE.Clock;
  private _scene: THREE.Scene;
  private _renderer?: THREE.WebGLRenderer;
  private _camera?: THREE.PerspectiveCamera;
  private _cameraControls?: OrbitControls;

  constructor() {
    this.isReady = false;

    const scene = new THREE.Scene();
    this._scene = scene;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1.0, 1.0, 1.0).normalize();
    this._scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this._scene.add(ambientLight);

    this._clock = new THREE.Clock();
    this._clock.start();
  }

  public setup(canvas: HTMLCanvasElement) {
    const parentElement = canvas.parentElement;
    const width = parentElement?.clientWidth || canvas.width;
    const height = parentElement?.clientHeight || canvas.height;
    // renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(window.devicePixelRatio);

    // camera
    this._camera = new THREE.PerspectiveCamera(20.0, width / height, 0.1, 20.0);
    this._camera.position.set(0, 1.3, 1.5);
    this._cameraControls?.target.set(0, 1.3, 0);
    this._cameraControls?.update();
    // camera controls
    this._cameraControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._cameraControls.screenSpacePanning = true;
    this._cameraControls.update();

    window.addEventListener("resize", () => {
      this.resize();
    });
    this.isReady = true;
    this.update();
  }

  public resize() {
    if (!this._renderer) return;

    const parentElement = this._renderer.domElement.parentElement;
    if (!parentElement) return;

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(
      parentElement.clientWidth,
      parentElement.clientHeight
    );

    if (!this._camera) return;
    this._camera.aspect =
      parentElement.clientWidth / parentElement.clientHeight;
    this._camera.updateProjectionMatrix();
  }

  public update = () => {
    requestAnimationFrame(this.update);
    const delta = this._clock.getDelta();
    // update vrm components
    if (this.model) {
      this.model.update(delta);
    }

    if (this._renderer && this._camera) {
      this._renderer.render(this._scene, this._camera);
    }
  };

  public loadVrm(url: string) {
    if (this.model?.vrm) {
      this.unloadVRM();
    }

    // gltf and vrm
    this.model = new CharacterModel(this._camera || new THREE.Object3D());
    this.model.loadVRM(url).then(async () => {
      if (!this.model?.vrm) return;

      // Disable frustum culling
      this.model.vrm.scene.traverse((obj) => {
        obj.frustumCulled = false;
      });

      this._scene.add(this.model.vrm.scene);

      const vrma = await loadVRMAnimation("/vrmas/idle_loop.vrma");
      if (vrma) this.model.loadAnimation(vrma);

      // HACK: アニメーションの原点がずれているので再生後にカメラ位置を調整する
      requestAnimationFrame(() => {
        this.resetCamera();
      });
    });
  }

  public unloadVRM(): void {
    if (this.model?.vrm) {
      this._scene.remove(this.model.vrm.scene);
      this.model?.unLoadVrm();
    }
  }

  public resetCamera() {
    const headNode = this.model?.vrm?.humanoid.getNormalizedBoneNode("head");
    if (!headNode) return;

    const headWPos = headNode.getWorldPosition(new THREE.Vector3());
    this._camera?.position.set(
      this._camera.position.x,
      headWPos.y,
      this._camera.position.z
    );
    this._cameraControls?.target.set(headWPos.x, headWPos.y, headWPos.z);
    this._cameraControls?.update();
  }
}
