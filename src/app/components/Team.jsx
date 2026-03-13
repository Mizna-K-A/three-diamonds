"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Title animations
const titleVariant = {
  hidden: { opacity: 0, y: -30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const subtitleVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, delay: 0.2 }
  }
};

// Label animation
const labelVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Card container
const cardVariant = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Avatar animation
const avatarVariant = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

// Name/role slide in from left
const nameVariant = {
  hidden: {
    opacity: 0,
    x: -30
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Badge scale in
const badgeVariant = {
  hidden: {
    opacity: 0,
    scale: 0
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Description fade in
const descriptionVariant = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Specialties stagger
const specialtiesContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const specialtyVariant = {
  hidden: {
    opacity: 0,
    scale: 0
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

// Bottom section
const bottomSectionVariant = {
  hidden: {
    opacity: 0,
    y: 40
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Failed to fetch team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return null; // Or a skeleton
  if (teamMembers.length === 0) return null;


  return (
    <section id="team" className="section-padding bg-white p-5">
      <div className="container-custom">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          {/* LABEL */}
          <motion.div
            variants={labelVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Leadership</span>
            <div className="w-16 h-0.5 bg-black mt-2 mx-auto"></div>
          </motion.div>

          {/* TITLE */}
          <motion.h2
            variants={titleVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            MEET OUR LEADERS
          </motion.h2>

          {/* SUBTITLE */}
          <motion.p
            variants={subtitleVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Guided by visionaries with decades of experience in Dubai&apos;s dynamic real estate market.
          </motion.p>
        </div>

        {/* TEAM CARDS */}
        <div className="grid lg:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* AVATAR - with actual image */}
                <div className="flex-shrink-0">
                  <motion.div
                    variants={avatarVariant}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.5 }}
                    className="relative w-32 h-32 rounded-full overflow-hidden"
                  >
                    <Image
                      src={member.image}
                      alt={member.alt}
                      fill
                      // sizes="(max-width: 768px) 128px, 128px"
                      className="object-cover"
                      priority={index === 0} // Load first image with priority
                    />

                    {/* Optional overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                    />
                  </motion.div>
                </div>

                {/* CONTENT */}
                <div className="flex-grow">
                  {/* NAME & EXPERIENCE */}
                  <div className="flex justify-between items-start mb-4">
                    <motion.div
                      variants={nameVariant}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold">{member.name}</h3>
                      <p className="text-gray-500 font-medium">{member.role}</p>
                    </motion.div>

                    <motion.span
                      variants={badgeVariant}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.5 }}
                      className="bg-black text-white px-3 py-1 text-sm rounded-full whitespace-nowrap"
                    >
                      {member.experience}
                    </motion.span>
                  </div>

                  {/* DESCRIPTION */}
                  <motion.p
                    variants={descriptionVariant}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.5 }}
                    className="text-gray-600 mb-6"
                  >
                    {member.description}
                  </motion.p>

                  {/* SPECIALTIES */}
                  <div>
                    <motion.h4
                      variants={descriptionVariant}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.5 }}
                      className="font-bold mb-3 text-gray-700"
                    >
                      Areas of Expertise
                    </motion.h4>

                    <motion.div
                      variants={specialtiesContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.5 }}
                      className="flex flex-wrap gap-2"
                    >
                      {member.specialties.map((specialty, idx) => (
                        <motion.span
                          key={idx}
                          variants={specialtyVariant}
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#000",
                            color: "#fff",
                            transition: { duration: 0.2 }
                          }}
                          className="bg-white px-3 py-1 text-sm rounded-full border border-gray-200 cursor-default"
                        >
                          {specialty}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA SECTION */}
        <motion.div
          variants={bottomSectionVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gray-50 rounded-xl p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">Our Dedicated Team</h3>
            <p className="text-gray-600 max-w-2xl mb-6">
              Backed by a team of passionate professionals including property consultants, legal experts,
              and customer service specialists committed to your success.
            </p>
            <a href="#contact" className="btn-primary">
              Meet Our Full Team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}