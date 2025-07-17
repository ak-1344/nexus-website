"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const images = [
  {
    src: "/images/tech1.jpg",
    alt: "Technology 1",
    title: "AI & Machine Learning"
  },
  {
    src: "/images/tech2.jpg",
    alt: "Technology 2",
    title: "Web Development"
  },
  {
    src: "/images/tech3.jpeg",
    alt: "Technology 3",
    title: "Mobile Apps"
  },
  {
    src: "/images/tech4.jpg",
    alt: "Technology 4",
    title: "Cloud Computing"
  },
  {
    src: "/images/tech5.jpg",
    alt: "Technology 5",
    title: "Cybersecurity"
  },
]

export function MarqueeGallery() {
  return (
    <div className="relative w-full overflow-hidden bg-black/20 backdrop-blur-sm py-8">
      <div className="flex animate-marquee whitespace-wrap">
        {[...images, ...images].map((image, index) => (
          <motion.div
            key={index}
          className="relative mx-2 w-[400px] h-[200px] rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <h3 className="text-white font-semibold text-xs break-words text-base">
                {image.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 