import React from "react";
import {
  AnimationClip,
  AnimationMixer,
  AnimationMixerEventMap,
  AnimationObjectGroup,
  BooleanKeyframeTrack,
  BoxGeometry,
  Clock,
  Color,
  EdgesGeometry,
  KeyframeTrack,
  LoopOnce,
  Matrix4,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  QuaternionKeyframeTrack,
  Scene,
  Vector3,
  VectorKeyframeTrack,
  WebGLRenderer,
} from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";

import { Cell, CellProps } from "./Cell";

const BOX_SIZE = 0.2;
const BOX_MIN_HEIGHT = 0.2;
const BOX_MAX_HEIGHT = 2.0;
const BOX_GAP = 0.3;

const BOX_COUNT_XY = 20;

const CAMERA_HEIGHT = BOX_MIN_HEIGHT * 0.5;

const ROTATE_DURATION = 1;

export const WireFrame: React.FC<CellProps> = ({ ...cellProps }) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!canvas) {
      return;
    }

    const cnv = canvas;
    const context = canvas.getContext("webgl2");
    if (!context) {
      console.warn("Failed to retrieve gl context for canvas");
      return;
    }
    const gl = context;

    const disposables: { dispose: () => void }[] = [];

    const documentStyle = window.getComputedStyle(document.documentElement);

    const renderer = new WebGLRenderer({ antialias: true, context: gl });
    renderer.setSize(gl.canvas.width, gl.canvas.height);
    disposables.push(renderer);

    const scene: Scene & { blinking?: boolean } = new Scene();
    scene.blinking = false;

    const boxes: { pos: Vector3; mat: LineMaterial }[][] = Array.from(
      { length: BOX_COUNT_XY },
      () => []
    );

    for (let x = 0; x < BOX_COUNT_XY; x++) {
      for (let y = 0; y < BOX_COUNT_XY; y++) {
        const material = new LineMaterial({
          color: 0xffffff,
          linewidth: 1,
        });
        disposables.push(material);

        const height =
          (BOX_MAX_HEIGHT - BOX_MIN_HEIGHT) * Math.random() + BOX_MIN_HEIGHT;
        const geometry = new BoxGeometry(BOX_SIZE, BOX_SIZE, height);
        geometry.translate(BOX_SIZE / 2, BOX_SIZE / 2, height / 2);
        const edges = new EdgesGeometry(geometry);
        const lines = new LineSegmentsGeometry();
        lines.fromEdgesGeometry(edges);
        const box = new LineSegments2(lines, material);
        box.position.set(x * (BOX_SIZE + BOX_GAP), y * (BOX_SIZE + BOX_GAP), 0);

        const boxLookPosition = box.position.clone();
        boxLookPosition.z = CAMERA_HEIGHT;
        boxes[x][y] = {
          pos: boxLookPosition,
          mat: material,
        };

        scene.add(box);
        disposables.push(geometry);
        disposables.push(edges);
      }
    }

    const camera = new PerspectiveCamera(
      75,
      gl.canvas.width / gl.canvas.height,
      0.01,
      3.5
    );
    camera.position.x = BOX_SIZE + BOX_GAP / 2;
    camera.position.y = BOX_SIZE + BOX_GAP / 2;
    camera.position.z = CAMERA_HEIGHT;

    camera.matrix.lookAt(
      camera.position,
      new Vector3(1, 0, 0).add(camera.position),
      new Vector3(0, 0, 1)
    );
    camera.quaternion.setFromRotationMatrix(camera.matrix);

    let nextObjectX = 0;
    let nextObjectY = 0;

    const mixer = new AnimationMixer(scene);

    let movingX = true;
    let lookingMaterial: LineMaterial | null = null;

    function createAnimation(
      name: string,
      root: Object3D | AnimationObjectGroup,
      keyframe: KeyframeTrack
    ) {
      const animationClip = new AnimationClip(name, -1, [keyframe]);
      const animation = mixer.clipAction(animationClip, root);
      animation.setLoop(LoopOnce, 1);
      animation.clampWhenFinished = true;

      return animation;
    }

    function* createMoveAnimations() {
      while (true) {
        const currentPosition = camera.position;
        const nextPosition = currentPosition.clone();

        movingX = !movingX;

        const nextCoordInt = Math.floor((BOX_COUNT_XY - 1) * Math.random());
        const nextCoord =
          (BOX_SIZE + BOX_GAP) * (nextCoordInt + 1) - BOX_GAP / 2;
        if (movingX) {
          nextPosition.x = nextCoord;
          nextObjectX = nextCoordInt;
        } else {
          nextPosition.y = nextCoord;
          nextObjectY = nextCoordInt;
        }

        const { pos: nextObjectPosition, mat: nextObjectMaterial } =
          boxes[nextObjectX][nextObjectY];

        if (lookingMaterial) {
          lookingMaterial.linewidth = 1.0;
        }
        lookingMaterial = nextObjectMaterial;

        const currentCameraQuaternion = camera.quaternion;
        const matrix = new Matrix4();

        matrix.lookAt(currentPosition, nextPosition, new Vector3(0, 0, 1));
        const nextCameraQuaternion = new Quaternion().setFromRotationMatrix(
          matrix
        );

        matrix.lookAt(nextPosition, nextObjectPosition, new Vector3(0, 0, 1));
        const lookCameraQuaternion = new Quaternion().setFromRotationMatrix(
          matrix
        );

        const rotateKeyFrame = new QuaternionKeyframeTrack(
          ".quaternion",
          [0, ROTATE_DURATION],
          [
            ...currentCameraQuaternion.toArray(),
            ...nextCameraQuaternion.toArray(),
          ]
        );
        yield createAnimation("rotate", camera, rotateKeyFrame);

        const moveKeyFrame = new VectorKeyframeTrack(
          ".position",
          [0, currentPosition.distanceTo(nextPosition)],
          [...currentPosition.toArray(), ...nextPosition.toArray()]
        );
        yield createAnimation("move", camera, moveKeyFrame);

        const look1KeyFrame = new QuaternionKeyframeTrack(
          ".quaternion",
          [0, ROTATE_DURATION],
          [...nextCameraQuaternion.toArray(), ...lookCameraQuaternion.toArray()]
        );
        yield createAnimation("look1", camera, look1KeyFrame);

        const blinkFrame = new BooleanKeyframeTrack(
          ".blinking",
          [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
          [true, false, true, false, true, false]
        );
        yield createAnimation("blink", scene, blinkFrame);
      }
    }

    const actions = createMoveAnimations();

    function playNextAction(e?: AnimationMixerEventMap["finished"]) {
      const nextAction = actions.next().value;
      if (!nextAction) {
        throw new Error("No next action.");
      }

      const cameraPosition = camera.position.clone();
      const cameraQuaternion = camera.quaternion.clone();

      const previousAction = e?.action;
      if (previousAction) {
        previousAction.stop();
        mixer.uncacheClip(previousAction.getClip());
      }

      camera.position.copy(cameraPosition);
      camera.quaternion.copy(cameraQuaternion);

      nextAction.play();
    }

    mixer.addEventListener("finished", playNextAction);

    playNextAction();

    const clock = new Clock();

    renderer.setAnimationLoop(() => {
      const color = documentStyle.getPropertyValue("--primary-color");
      const materialColor = new Color(color);
      boxes.forEach((bxs) => bxs.forEach((b) => (b.mat.color = materialColor)));

      if (lookingMaterial) {
        if (scene.blinking) {
          lookingMaterial.color = new Color("lime");
          lookingMaterial.linewidth = 4.0;
        } else {
          lookingMaterial.linewidth = 1.0;
        }
      }

      mixer.update(clock.getDelta());

      renderer.render(scene, camera);
    });

    function onResize() {
      cnv.width = cnv.clientWidth;
      cnv.height = cnv.clientHeight;

      camera.aspect = cnv.width / cnv.height;
      camera.updateProjectionMatrix();

      renderer.setSize(cnv.width, cnv.height);

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      disposables.forEach((d) => d.dispose());

      window.removeEventListener("resize", onResize);
    };
  }, [canvas]);

  return (
    <Cell {...cellProps}>
      <canvas
        ref={setCanvas}
        css={{
          width: "100%",
          height: "100%",
        }}
      />
    </Cell>
  );
};
