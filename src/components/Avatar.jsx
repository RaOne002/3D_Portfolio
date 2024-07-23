import React, { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFBX } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

export function Avatar(props) {
  const { animation } = props;
  const { headFollow, cursorFollow, wireframe } = useControls({
    headFollow: false,
    cursorFollow: false,
    wireframe: false,
  });

  const group = useRef();
  const { nodes, materials } = useGLTF('models/667a37800f0bc383f8cff903.glb');
  const typingAnimation = useFBX('animations/Typing.fbx');
  const fallingAnimation = useFBX('animations/Falling To Landing.fbx');
  const standingAnimation = useFBX('animations/Standing Idle.fbx');
  const runningBackwardAnimation = useFBX('animations/Running Backward.fbx');
  const runningForwardAnimation = useFBX('animations/Sneaking Forward.fbx');
  const talkingAnimation = useFBX('animations/Talking On A Cell Phone.fbx');
  const leftSideWalkingAnimation = useFBX('animations/Left Strafe Walk.fbx');
  const rightSideWalkingAnimation = useFBX('animations/Right Strafe Walk.fbx');
  const dancingAnimation = useFBX('animations/Wave Hip Hop Dance.fbx');
  const dancingAnimation2 = useFBX('animations/Bboy Hip Hop Move.fbx');
  const fallingAnimation2 = useFBX('animations/Falling.fbx');

  // Ensure the animations have names
  typingAnimation.animations[0].name = 'Typing';
  standingAnimation.animations[0].name = 'Standing';
  fallingAnimation.animations[0].name = 'Falling';
  fallingAnimation2.animations[0].name = 'Falling 2';
  runningBackwardAnimation.animations[0].name = 'Running Backward';
  runningForwardAnimation.animations[0].name = 'Running Forward';
  talkingAnimation.animations[0].name = 'Talking';
  leftSideWalkingAnimation.animations[0].name = 'Left walk';
  rightSideWalkingAnimation.animations[0].name = 'Right walk';
  dancingAnimation.animations[0].name = 'Dancing';
  dancingAnimation2.animations[0].name = 'Dancing 2';

  const { actions } = useAnimations(
    [
      typingAnimation.animations[0],
      standingAnimation.animations[0],
      fallingAnimation.animations[0],
      runningBackwardAnimation.animations[0],
      runningForwardAnimation.animations[0],
      talkingAnimation.animations[0],
      leftSideWalkingAnimation.animations[0],
      rightSideWalkingAnimation.animations[0],
      dancingAnimation.animations[0],
      dancingAnimation2.animations[0],
      fallingAnimation2.animations[0],
    ],
    group
  );

  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName('Head').lookAt(state.camera.position);
    }
    if (cursorFollow) {
      const target = new THREE.Vector3(state.mouse.x, state.mouse.y, 1);
      group.current.getObjectByName('Spine2').lookAt(target);
    }
  });

  useEffect(() => {
    if (actions && actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
      return () => {
        actions[animation].reset().fadeOut(0.5);
      };
    }
  }, [animation, actions]);

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.wireframe = wireframe;
    });
  }, [wireframe]);

  return (
    <group {...props} ref={group} dispose={null}>
      <group rotation-x={-Math.PI / 2}>
        <primitive object={nodes?.Hips} />
        <skinnedMesh
          frustumCulled={false}
          geometry={nodes?.Wolf3D_Hair.geometry}
          material={materials?.Wolf3D_Hair}
          skeleton={nodes?.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
          frustumCulled={false}
          geometry={nodes?.Wolf3D_Glasses.geometry}
          material={materials?.Wolf3D_Glasses}
          skeleton={nodes?.Wolf3D_Glasses.skeleton}
        />
        <skinnedMesh
          frustumCulled={false}
          geometry={nodes?.Wolf3D_Body.geometry}
          material={materials?.Wolf3D_Body}
          skeleton={nodes?.Wolf3D_Body.skeleton}
        />
        <skinnedMesh
          frustumCulled={false}
          geometry={nodes?.Wolf3D_Outfit_Bottom.geometry}
          material={materials?.Wolf3D_Outfit_Bottom}
          skeleton={nodes?.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
          frustumCulled={false}
          geometry={nodes?.Wolf3D_Outfit_Footwear.geometry}
          material={materials?.Wolf3D_Outfit_Footwear}
          skeleton={nodes?.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
          frustumCulled={false}
          geometry={nodes?.Wolf3D_Outfit_Top.geometry}
          material={materials?.Wolf3D_Outfit_Top}
          skeleton={nodes?.Wolf3D_Outfit_Top.skeleton}
        />
        <skinnedMesh
          frustumCulled={false}
          name="EyeLeft"
          geometry={nodes?.EyeLeft.geometry}
          material={materials?.Wolf3D_Eye}
          skeleton={nodes?.EyeLeft.skeleton}
          morphTargetDictionary={nodes?.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes?.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
          frustumCulled={false}
          name="EyeRight"
          geometry={nodes?.EyeRight.geometry}
          material={materials?.Wolf3D_Eye}
          skeleton={nodes?.EyeRight.skeleton}
          morphTargetDictionary={nodes?.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes?.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
          frustumCulled={false}
          name="Wolf3D_Head"
          geometry={nodes?.Wolf3D_Head.geometry}
          material={materials?.Wolf3D_Skin}
          skeleton={nodes?.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes?.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes?.Wolf3D_Head.morphTargetInfluences}
        />
        <skinnedMesh
          frustumCulled={false}
          name="Wolf3D_Teeth"
          geometry={nodes?.Wolf3D_Teeth.geometry}
          material={materials?.Wolf3D_Teeth}
          skeleton={nodes?.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes?.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes?.Wolf3D_Teeth.morphTargetInfluences}
        />
      </group>
    </group>
  );
}

useGLTF.preload('models/667a37800f0bc383f8cff903.glb');
