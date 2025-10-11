"use client"

import { motion, type MotionProps } from "motion/react"
import { cn } from "@/lib/utils"
import type React from "react"

type MotionFadeProps = React.PropsWithChildren<{ className?: string } & MotionProps>

export function MotionFade({ className, children, ...rest }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type MotionHoverProps = React.PropsWithChildren<{ className?: string }>

export function MotionHover({ className, children }: MotionHoverProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}
