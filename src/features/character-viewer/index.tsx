"use client";

import { useCharacterViewer } from "./use-character-viewer";

export const CharacterViewer = () => {
  const { canvasRef } = useCharacterViewer();
  return (
    <div className={"absolute top-0 left-0 w-screen min-h-[100dvh] -z-10"}>
      <canvas ref={canvasRef} className={"w-screen min-h-[100dvh]"} />
    </div>
  );
}
