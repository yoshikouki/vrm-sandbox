"use client";

import { useCallback, useMemo } from "react";
import { CharacterViewer } from "./character-viewer";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";


export const useCharacterViewer = () => {
  const viewer = useMemo(() => new CharacterViewer(), []);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!canvas) return;

      viewer.setup(canvas);
      viewer.loadVrm("/vrms/AvatarSample_A.vrm");
    },
    [viewer]
  );

  return {
    canvasRef,
    viewer,
  };
};
