"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description: string
  badge?: string
}

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {badge}
        </span>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </motion.div>
  )
}
