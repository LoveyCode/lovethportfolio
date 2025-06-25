'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { techStacks } from '../../../data'
import Image from 'next/image'



const Stack = () => {
  return (
    <div className="py-20 rounded-2xl shadow-md">
      <h1 className="heading pb-20">
     My tech stack
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 items-center">
        {techStacks.map((tech, index) => (
         <motion.div
  key={index}
  className="relative aspect-square w-20 sm:w-24 md:w-28 flex items-center justify-center cursor-pointer"
  whileHover="hover"
  initial="rest"
  animate="rest"
  variants={{
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  }}
>
  {/* Responsive Image */}
  <Image
    src={tech.src}
    alt={tech.name}
    fill
    className="object-contain rounded-full z-10"
    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
  />

  {/* Responsive Hover Bloom */}
  <motion.div
    variants={{
      rest: { scale: 0, opacity: 0 },
      hover: { scale: 1, opacity: 1 },
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="absolute z-20 w-full h-full rounded-full bg-purple text-white flex items-center justify-center text-center text-xs sm:text-sm font-semibold px-1"
  >
    {tech.name}
  </motion.div>
</motion.div>


        ))}
      </div>
    </div>
  )
}

export default Stack
