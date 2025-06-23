'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { techStacks } from '../../../data'
import Image from 'next/image'



const Stack = () => {
  return (
    <div className="py-20 rounded-2xl shadow-md">
      <h1 className="heading pb-20">
        My tech <span className="text-purple">stack</span>
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 items-center">
        {techStacks.map((tech, index) => (
          <motion.div
  key={index}
  className="relative h-32 w-32 flex items-center justify-center cursor-pointer"
  whileHover="hover"
  initial="rest"
  animate="rest"
  variants={{
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  }}
>
  {/* Next.js Image replaces img */}
  <Image
    src={tech.src}
    alt={tech.name}
    fill
    className="object-contain z-10"
    sizes="(max-width: 768px) 100px, 128px"
  />

  {/* Bloom effect */}
  <motion.div
    variants={{
      rest: { scale: 0, opacity: 0 },
      hover: { scale: 1, opacity: 1 },
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="absolute z-20 h-24 w-24 rounded-full bg-purple-600 text-violet-200 flex items-center justify-center text-center text-sm font-semibold"
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
