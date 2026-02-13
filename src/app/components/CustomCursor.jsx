"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const mouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY, id: Date.now() };
      setMousePosition(newPosition);
      
      setTrail((prev) => [...prev, newPosition].slice(-10)); // Keep last 10 positions
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-black rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Trail dots */}
      {trail.map((pos, index) => (
        <motion.div
          key={pos.id}
          className="fixed top-0 left-0 w-2 h-2 bg-gray-400 rounded-full pointer-events-none z-[9998]"
          initial={{
            x: pos.x - 4,
            y: pos.y - 4,
            opacity: 1,
          }}
          animate={{
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}