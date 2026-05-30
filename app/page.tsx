"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dog,
  MessageSquare,
  BarChart3,
  FileText,
  Shield,
  User,
  Footprints,
  MapPin,
  Bot,
  Snowflake,
  ArrowRight,
  Sparkles
} from "lucide-react"

const apiCards = [
  {
    title: "Auth API",
    endpoint: "POST /api/auth/login",
    description: "User authentication and session management",
    icon: Shield,
    status: "active"
  },
  {
    title: "User Profile API",
    endpoint: "GET /api/user/:id",
    description: "Manage user profiles and preferences",
    icon: User,
    status: "active"
  },
  {
    title: "Pet State API",
    endpoint: "GET /api/pets/:id",
    description: "Track AR pet mood, health, and stats",
    icon: Dog,
    status: "active"
  },
  {
    title: "Walk Distance Tracker API",
    endpoint: "POST /api/walks",
    description: "Log and retrieve walking sessions",
    icon: Footprints,
    status: "active"
  },
  {
    title: "Chatbot API",
    endpoint: "POST /api/chat/mistral",
    description: "AI companion powered by Mistral",
    icon: Bot,
    status: "active"
  },
  {
    title: "Cortex Insights API",
    endpoint: "POST /api/insights/cortex",
    description: "AI-powered walking analytics",
    icon: Snowflake,
    status: "active"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-6 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,80,200,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(80,200,150,0.1),transparent_50%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">AR Pet Fitness Platform</span>
            </div>
          </div>
          
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Dog className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Walkie Puppie{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              API Hub
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            Backend services, AI chatbot demos, and walking insights for the AR pet fitness app.
            Build engaging experiences for your virtual companions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/chatbot">
                <MessageSquare className="h-4 w-4" />
                Try Mistral Chatbot
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/insights">
                <BarChart3 className="h-4 w-4" />
                View Walking Insights
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/docs">
                <FileText className="h-4 w-4" />
                API Docs
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* API Services Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
              API Services
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Comprehensive backend APIs powering the Walkie Puppie ecosystem
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {apiCards.map((api) => (
              <motion.div key={api.title} variants={itemVariants}>
                <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <api.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {api.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{api.title}</CardTitle>
                    <CardDescription>{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
                      {api.endpoint}
                    </code>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 md:grid-cols-3"
          >
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="mt-4">AI Companion Chat</CardTitle>
                <CardDescription>
                  Engage with your AR pet through natural conversations powered by Mistral AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/chatbot"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80">
                  <Snowflake className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="mt-4">Cortex Analytics</CardTitle>
                <CardDescription>
                  Get personalized fitness insights and recommendations from Snowflake Cortex
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View insights <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-3 to-chart-3/80">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4">Walk Tracking</CardTitle>
                <CardDescription>
                  Log walking sessions, track distance, and monitor your fitness progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Dog className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Walkie Puppie API Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for the AR Pet Fitness Hackathon
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
