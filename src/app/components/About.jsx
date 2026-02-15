"use client";

import { motion } from "framer-motion";

// Container for staggered children
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Fade in from left
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Fade in from right
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Fade up animation
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Scale up animation
const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Paragraph stagger
const paragraphContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const paragraphItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* LEFT COLUMN */}
          <motion.div variants={fadeLeft}>
            <motion.h2 
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold mb-6 text-black"
            >
              HOW WE BEGAN
            </motion.h2>
            <motion.div
              variants={paragraphContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
              className="space-y-4 text-gray-600"
            >
              <motion.p variants={paragraphItem}>
                Our story began with a spark of trust. A single call from our landlord entrusting us with their property, 
                ignited a fire in our hearts.
              </motion.p>
              <motion.p variants={paragraphItem}>
                We saw it as more than just bricks and mortar. It was a chance to turn dreams into reality for both 
                landlords and clients. With that we embarked on a journey to become Dubai's trusted partner unlocking 
                the full potential of every property and empowering a vibrant real estate community.
              </motion.p>
              <motion.p variants={paragraphItem} className="font-medium">
                Let's turn your vision into your next chapter.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div variants={fadeRight}>
            <motion.h2 
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              OUR MISSION & VISION
            </motion.h2>
            <div className="space-y-6">
              <motion.div 
                variants={scaleUp}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="p-6 bg-gray-50 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">OUR MISSION</h3>
                <p className="text-gray-600">
                  Fueled by a passion and commitment for connecting people with their dream properties, we strive to 
                  be Dubai's most trusted Real Estate partners through exceptional service and a dedication to excellence.
                </p>
              </motion.div>
              <motion.div 
                variants={scaleUp}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="p-6 bg-gray-50 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">OUR VISION</h3>
                <p className="text-gray-600">
                  To be Dubai's most trusted Real Estate partner delivering seamless property management and 
                  exceptional service that empowers landlords to relax and enjoy the peace of mind their investments deserve.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}