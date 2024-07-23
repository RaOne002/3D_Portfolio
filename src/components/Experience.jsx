import { motion } from 'framer-motion-3d';
import { Office } from './Office';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, useScroll } from '@react-three/drei';
import { Avatar } from './Avatar';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';
import { framerMotionConfig } from '../config';
import * as THREE from 'three';
import { Projects } from './Projects';
import { Background } from './Background';

// const euler = new THREE.Euler();

export const Experience = (props) => {
  const { menuOpened } = props;
  const { viewport } = useThree();
  const data = useScroll();

  const isMobile = window.innerWidth < 768;
  const responsiveRatio = viewport.width / 12;
  const OfficeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

  const cameraPositionX = useMotionValue();
  const cameraLookAtX = useMotionValue();

  const [section, setSection] = useState(0);
  const [characterAnimation, setCharacterAnimation] = useState("Typing");
  const [isDancing, setIsDancing] = useState(false); // Add this state variable to manage the dancing state

  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig
    });
    animate(cameraLookAtX, menuOpened ? 5 : 0, {
      ...framerMotionConfig
    });
  }, [menuOpened]);

  useEffect(() => {
    setCharacterAnimation("Falling 2");
    setTimeout(() => {
      setCharacterAnimation(section === 0 ? "Typing" : "Standing");
    }, 600);
  }, [section]);

  useEffect(() => {
    if (section === 1) {
      const timeout = setTimeout(() => {
        setIsDancing(true); // Set dancing state to true after 3 seconds
        setCharacterAnimation("Dancing 2"); // Change character animation to "Dancing"
      }, 3000);
      return () => clearTimeout(timeout); // Clear timeout if the section changes
    } else {
      setIsDancing(false); // Reset dancing state if the section is not 1
    }
  }, [section]); // This useEffect depends on the section state

  useEffect(() => {
    if (section === 3) {
      const timeout = setTimeout(() => {
        setCharacterAnimation("Talking"); // Change character animation to "Talking" after 1 second in section 3
      }, 2000);
      return () => clearTimeout(timeout); // Clear timeout if the section changes
    }
  }, [section]); // This useEffect depends on the section state

  const characterContainerAboutRef = useRef();
  const characterGroup = useRef();

  useFrame((state) => {
    let curSection = Math.floor(data.scroll.current * data.pages);

    if (curSection > 3) {
      curSection = 3;
    }

    if (curSection !== section) {
      setSection(curSection);
    }

    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);

    // const position = new THREE.Vector3();
    if (section === 0) {
      characterContainerAboutRef.current.getWorldPosition(characterGroup.current.position);
    }
    // console.log([position.x, position.y, position.z]);

    // const quaternion = new THREE.Quaternion();
    // characterContainerAboutRef.current.getWorldQuaternion(quaternion);
    // euler.setFromQuaternion(quaternion, "XYZ");
    // console.log([euler.x, euler.y, euler.z]);
  });

  return (
    <>
      <Background />
      <motion.group
        ref={characterGroup}
        rotation={[-3.141592653589793, 1.2053981633974482, 3.141592653589793]}
        scale={[OfficeScaleRatio, OfficeScaleRatio, OfficeScaleRatio]}
        animate={"" + section}
        transition={{
          duration: 0.6,
        }}
        variants={{
          0: {
            scaleX: OfficeScaleRatio,
            scaleY: OfficeScaleRatio,
            scaleZ: OfficeScaleRatio,
          },
          1: {
            y: -viewport.height + 0.5,
            x: isMobile ? 0.3 : 0,
            z: 7,
            rotateX: 0,
            rotateY: isMobile ? -Math.PI / 2 : 0,
            rotateZ: 0,
            scaleX: isMobile ? 1.5 : 1,
            scaleY: isMobile ? 1.5 : 1,
            scaleZ: isMobile ? 1.5 : 1,
          },
          2: {
            x: isMobile ? -1.4 : -2,
            y: -viewport.height * 2 + 0.5,
            z: 0,
            rotateX: 0,
            rotateY: Math.PI / 2,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          3: {
            y: -viewport.height * 3 + 1,
            x: 0.24,
            z: 8.5,
            rotateX: 0,
            rotateY: -Math.PI / 4,
            rotateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
        }}
      >
        <Avatar animation={isDancing ? "Dancing 2" : characterAnimation} /> {/* Update Avatar to use the dancing state for animation */}
      </motion.group>
      <ambientLight intensity={1} />
      <motion.group
        position={[isMobile ? 0 : 1.5 * OfficeScaleRatio, isMobile ? -viewport.height / 6 : 2, 3]}
        scale={[
          OfficeScaleRatio,
          OfficeScaleRatio,
          OfficeScaleRatio
        ]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height / 6 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <Office section={section} />
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[0.07, 0.24, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]} >
        </group>
      </motion.group>
      {/* {Skills} */}
      <motion.group position={[0, isMobile ? -viewport.height : -1.5 * OfficeScaleRatio, -10]}
        animate={{
          z: section === 1 ? 0 : -10,
          y: section === 1 ? -viewport.height : (isMobile ? -viewport.height : -1.5 * OfficeScaleRatio),
        }}
      >
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
        <Float>
          <mesh position={[1, -3, -15]} scale={[2, 2, 2]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={0.4}
              speed={4}
              color={"red"}
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[3, 3, 3]} position={[3, 1, -18]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={1}
              speed={5}
              color="yellow"
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[1.4, 1.4, 1.4]} position={[-3, 1, -11]}>
            <boxGeometry />
            <MeshWobbleMaterial
              opacity={0.8}
              transparent
              factor={1}
              speed={5}
              color="blue"
            />
          </mesh>
        </Float>
      </motion.group>
      <Projects />
    </>
  );
}
