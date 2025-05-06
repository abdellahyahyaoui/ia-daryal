import React, { useEffect, useRef } from 'react';
import { motion } from "framer-motion";

import './Lamp.scss';

const Lamp = () => {
  const leftLampRef = useRef(null);
  const rightLampRef = useRef(null);
  const lampLightRef = useRef(null);
  const lampLineRef = useRef(null);

  useEffect(() => {
    const animateElements = (elements, initialWidthPercentage, finalWidthPercentage) => {
      elements.forEach(el => {
        if (el.current) {
          el.current.animate([
            { opacity: 0.5, width: `${initialWidthPercentage}%` },
            { opacity: 1, width: `${finalWidthPercentage}%` }
          ], {
            duration: 800,
            delay: 300,
            fill: 'forwards',
            easing: 'ease-in-out'
          });
        }
      });
    };

    animateElements([leftLampRef, rightLampRef], 25, 50);
    animateElements([lampLightRef], 20, 40);
    animateElements([lampLineRef], 25, 50);
  }, []);

  return (
    <div className="lamp-wrapper">
      <div className="lamp-container">
        <motion.div
          initial={{ opacity: 0.5, width: "25%" }}
          whileInView={{ opacity: 1, width: "50%" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="lamp-left"
          ref={leftLampRef}
        >
          <div className="lamp-left-mask-1" />
          <div className="lamp-left-mask-2" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "25%" }}
          whileInView={{ opacity: 1, width: "50%" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="lamp-right"
          ref={rightLampRef}
        >
          <div className="lamp-right-mask-1" />
          <div className="lamp-right-mask-2" />
        </motion.div>
        <div className="lamp-backdrop"></div>
        <div className="lamp-glow"></div>
        <motion.div
          initial={{ width: "20%" }}
          whileInView={{ width: "40%" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="lamp-light"
          ref={lampLightRef}
        ></motion.div>
        <motion.div
          initial={{ width: "25%" }}
          whileInView={{ width: "50%" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="lamp-line"
          ref={lampLineRef}
        ></motion.div>
      </div>
      
    </div>
  );
};

export default Lamp;

