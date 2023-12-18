import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMAnimation } from "./VRMAnimation";
import { VRMAnimationLoaderPlugin } from "./VRMAnimationLoaderPlugin";

const loader = new GLTFLoader();
loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

export async function loadVRMAnimation(
  url: string
): Promise<VRMAnimation | null> {
  const gltf = await loader.loadAsync(url);

  const vrmAnimations: VRMAnimation[] = gltf.userData.vrmAnimations;
  console.log(vrmAnimations);
  const vrmAnimation: VRMAnimation | undefined = vrmAnimations[0];

  return vrmAnimation ?? null;
}
