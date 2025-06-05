import { Image, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";

import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";

export const projects = [
  {
    title: "SuperStar-Academy",
    url: "https://www.youtube.com/watch?v=beskIs6sWAA",
    image: "projects/SuperStar_CricketAcademy.png",
    description: "",
  },
  {
    title: "VectraCraft",
    url: "https://vecrta-craft.vercel.app/",
    image: "projects/VectraCraft.jpg",
    description: "Let your imagination run wild with VectraCraft.",
  },
  {
    title: "3D Portfolio",
    url: "https://3d-portfolio-chi-indol.vercel.app/",
    image: "projects/baking.jpg",
    description: "This is my 3D Portfolio",
  },
  {
    title: "Aarogya",
    url: "https://aarogya-three.vercel.app/",
    image: "projects/Aarogya2.png",
    description: "Aarogya is a patient management system .",
  },
  {
    title: "Ignite Business Loans",
    url: "https://ignitebusinessloans.com/",
    image: "projects/IgniteBL.jpg",
    description: "",
  },
  {
    title: "Prosperity BUSINESS FINANCE",
    url: "https://prosperitybusinessfinance.com/",
    image: "projects/ProsperityBL.png",
    description: "",
  },
];

const Project = (props) => {
  const { project, highlighted } = props;

  const background = useRef();
  const bgOpacity = useMotionValue(0.4);

  useEffect(() => {
    animate(bgOpacity, highlighted ? 0.7 : 0.4);
  }, [highlighted]);

  useFrame(() => {
    background.current.material.opacity = bgOpacity.get();
  });

  return (
    <group {...props}>
      <mesh
        position-z={-0.001}
        onClick={() => window.open(project.url, "_blank")}
        ref={background}
      >
        <planeGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
      <Image
        scale={[2, 1.2, 1]}
        url={project.image}
        toneMapped={false}
        position-y={0.3}
      />
      <Text
        maxWidth={2}
        anchorX={"left"}
        anchorY={"top"}
        fontSize={0.2}
        position={[-1, -0.4, 0]}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        maxWidth={2}
        anchorX="left"
        anchorY="top"
        fontSize={0.1}
        position={[-1, -0.6, 0]}
      >
        {project.description}
      </Text>
    </group>
  );
};

export const currentProjectAtom = atom(Math.floor(projects.length / 2));

export const Projects = () => {
  const { viewport } = useThree();
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

  // Detect mobile screen
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Touch handling for mobile swipe
  const touchStartX = useRef(null);

  // Auto-swap projects on mobile every 2 seconds
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentProject((prev) =>
        prev < projects.length - 1 ? prev + 1 : 0
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [setCurrentProject, currentProject]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentProject < projects.length - 1) {
        setCurrentProject(currentProject + 1); // Swipe left, next project
      } else if (diff > 0 && currentProject > 0) {
        setCurrentProject(currentProject - 1); // Swipe right, previous project
      }
    }
    touchStartX.current = null;
  };

  // --- RING LAYOUT FOR MOBILE ---
  const radius = 5;
  const angleStep = (2 * Math.PI) / projects.length;

  return (
    <group
      position-y={-viewport.height * 2 + 1}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {isMobile
        ? // RING LAYOUT FOR MOBILE
          projects.map((project, index) => {
            const angle = angleStep * (index - currentProject);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - 2;
            return (
              <motion.group
                key={"project_" + index}
                position={[x, 0, z]}
                animate={{
                  x,
                  y: 0,
                  z,
                  rotateY: angle,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <Project project={project} highlighted={index === currentProject} />
              </motion.group>
            );
          })
        : // OLD LINEAR/SLIDE LAYOUT FOR DESKTOP
          projects.map((project, index) => (
            <motion.group
              key={"project_" + index}
              position={[index * 2.5, 0, -3]}
              animate={{
                x: 0 + (index - currentProject) * 2.5,
                y: currentProject === index ? 0 : -0.1,
                z: currentProject === index ? -2 : -3,
                rotateX: currentProject === index ? 0 : -Math.PI / 3,
                rotateZ: currentProject === index ? 0 : -0.1 * Math.PI,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <Project project={project} highlighted={index === currentProject} />
            </motion.group>
          ))}
    </group>
  );
};