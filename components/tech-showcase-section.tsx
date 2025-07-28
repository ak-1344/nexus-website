"use client"

import { motion } from "framer-motion"
import { MarqueeGallery } from "./marquee-gallery"

export function TechShowcaseSection() {
  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-b from-black via-purple-900/10 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore Our Tech Stack
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
            Discover the cutting-edge technologies and frameworks we use to build innovative solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <MarqueeGallery />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 md:mt-12 text-center"
        >
          <p className="text-white/60 text-sm md:text-base">
            Hover over the cards to learn more about each technology
          </p>
        </motion.div>
      </div>
    </section>
  )
} 