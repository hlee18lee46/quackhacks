"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Bot, Send, User, Sparkles, Dog } from "lucide-react"

const quickPrompts = [
  "How far did I walk today?",
  "Encourage me to walk more",
  "How is my puppy feeling?",
  "Give me a fitness goal"
]

const mockResponses: Record<string, string> = {
  "How far did I walk today?": "Based on your activity data, you walked 2.3 miles today! That's 4,600 steps. Your AR puppy Buddy is really happy with all the exercise. Keep it up! 🐕",
  "Encourage me to walk more": "You're doing great! Remember, every step counts. Your puppy Buddy gets more energetic with each walk. Even a short 10-minute walk can boost your mood and make Buddy's tail wag. Let's aim for 5,000 more steps today - you've got this! 💪🐾",
  "How is my puppy feeling?": "Buddy is feeling fantastic today! His happiness level is at 85% thanks to your consistent walking routine. He's been practicing new tricks and is excited for your next adventure together. He especially loved the park visit yesterday! 🌟",
  "Give me a fitness goal": "Based on your recent activity, here's a personalized goal: Walk 3 miles today! That's about 6,000 steps. Try to include a 15-minute continuous walk session. This will level up Buddy's agility stat and unlock a new accessory for him! 🎯"
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your AR Pet AI Companion powered by Mistral. Ask me about your walking progress, get fitness tips, or check on how your virtual puppy is feeling! 🐕✨"
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = mockResponses[text] || 
      "That's a great question! Based on your walking data and Buddy's current state, I'd recommend taking a nice walk in the park today. Your puppy would love the fresh air, and it's perfect weather for some outdoor exercise! 🌳🐾"

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Mistral AI Chatbot"
        description="Interact with your AR Pet AI Companion powered by DigitalOcean-hosted Mistral"
        badge="AI Demo"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Dog className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-3">AR Pet AI Companion</CardTitle>
              <CardDescription>
                Chat with your virtual pet companion and get personalized fitness advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>This AI companion can:</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Track your walking progress</li>
                  <li>Encourage healthy habits</li>
                  <li>Report on your pet&apos;s mood</li>
                  <li>Set personalized fitness goals</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">API Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block rounded bg-muted p-3 text-xs font-mono">
                POST /api/chat/mistral
              </code>
              <div className="mt-3 space-y-2">
                <Badge variant="secondary" className="mr-2">Mistral-7B</Badge>
                <Badge variant="outline">DigitalOcean</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left text-xs"
                  onClick={() => handleSend(prompt)}
                >
                  <Sparkles className="mr-2 h-3 w-3 text-primary" />
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Buddy&apos;s AI Assistant</CardTitle>
                <CardDescription className="text-xs">Powered by Mistral</CardDescription>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                Online
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex h-[500px] flex-col p-0">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-primary"
                          : "bg-gradient-to-br from-primary/20 to-accent/20"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your walking progress..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
