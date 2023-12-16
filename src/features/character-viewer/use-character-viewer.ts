"use client";

import { useCallback, useMemo } from "react";
import { CharacterViewer } from "./character-viewer";

export const useCharacterViewer = () => {
  const viewer = useMemo(() => new CharacterViewer(), []);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
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
