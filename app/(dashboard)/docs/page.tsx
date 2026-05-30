"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { Copy, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiEndpoint {
  id: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  requestBody?: object
  responseBody: object
  parameters?: { name: string; type: string; required: boolean; description: string }[]
}

const endpoints: ApiEndpoint[] = [
  {
    id: "post-walks",
    method: "POST",
    path: "/api/walks",
    description: "Log a new walking session for a user. Records distance, duration, route data, and pet interaction metrics.",
    requestBody: {
      userId: "string (required)",
      distance: "number (miles)",
      duration: "number (minutes)",
      startTime: "ISO 8601 timestamp",
      endTime: "ISO 8601 timestamp",
      route: {
        coordinates: "array of [lat, lng]",
        mapProvider: "string"
      },
      petId: "string",
      caloriesBurned: "number"
    },
    responseBody: {
      success: true,
      data: {
        walkId: "walk_abc123",
        userId: "user_12345",
        distance: 2.5,
        duration: 35,
        startTime: "2024-01-15T10:30:00Z",
        endTime: "2024-01-15T11:05:00Z",
        caloriesBurned: 180,
        petXpEarned: 250,
        achievements: ["first_mile", "morning_walker"]
      }
    }
  },
  {
    id: "get-walks",
    method: "GET",
    path: "/api/walks/:userId",
    description: "Retrieve all walking sessions for a specific user. Supports pagination and date filtering.",
    parameters: [
      { name: "userId", type: "string", required: true, description: "The unique identifier of the user" },
      { name: "limit", type: "number", required: false, description: "Number of results per page (default: 20)" },
      { name: "offset", type: "number", required: false, description: "Number of results to skip" },
      { name: "startDate", type: "string", required: false, description: "Filter walks after this date (ISO 8601)" },
      { name: "endDate", type: "string", required: false, description: "Filter walks before this date (ISO 8601)" }
    ],
    responseBody: {
      success: true,
      data: {
        walks: [
          {
            walkId: "walk_abc123",
            distance: 2.5,
            duration: 35,
            startTime: "2024-01-15T10:30:00Z",
            caloriesBurned: 180
          }
        ],
        pagination: {
          total: 45,
          limit: 20,
          offset: 0,
          hasMore: true
        }
      }
    }
  },
  {
    id: "chat-mistral",
    method: "POST",
    path: "/api/chat/mistral",
    description: "Send a message to the Mistral AI chatbot. The chatbot acts as an AR pet companion and can provide fitness advice, encouragement, and pet status updates.",
    requestBody: {
      userId: "string (required)",
      message: "string (required)",
      conversationId: "string (optional)",
      context: {
        petName: "string",
        recentWalks: "number",
        totalDistance: "number"
      }
    },
    responseBody: {
      success: true,
      data: {
        messageId: "msg_xyz789",
        conversationId: "conv_123",
        response: "Great job on your walk today! Buddy is feeling energetic...",
        petReaction: "happy",
        suggestedActions: ["start_walk", "view_stats", "feed_pet"]
      }
    }
  },
  {
    id: "insights-cortex",
    method: "POST",
    path: "/api/insights/cortex",
    description: "Generate AI-powered insights from walking data using Snowflake Cortex. Returns personalized fitness recommendations, weekly summaries, and health alerts.",
    requestBody: {
      userId: "string (required)",
      totalDistance: "number (miles)",
      numberOfWalks: "number",
      averagePace: "number (mph)",
      petMood: "string (enum: ecstatic, happy, content, neutral, sad)",
      dateRange: {
        start: "ISO 8601 timestamp",
        end: "ISO 8601 timestamp"
      }
    },
    responseBody: {
      success: true,
      data: {
        weeklySummary: "Great week! You completed 12 walks totaling 18.5 miles...",
        fitnessRecommendation: "Based on your pace analysis, try incorporating interval walking...",
        petMotivation: "Buddy is thriving! His energy level is at 92%...",
        riskAlert: null,
        metrics: {
          weeklyGoalProgress: 0.85,
          streakDays: 6,
          comparisonToLastWeek: "+25%"
        }
      }
    }
  }
]

const methodColors = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700"
}

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card id={endpoint.id} className="scroll-mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge className={methodColors[endpoint.method]}>{endpoint.method}</Badge>
            <code className="text-sm font-semibold">{endpoint.path}</code>
          </div>
          <CardDescription className="mt-2">{endpoint.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {endpoint.parameters && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Parameters</h4>
              <div className="space-y-2">
                {endpoint.parameters.map((param) => (
                  <div key={param.name} className="flex items-start gap-3 rounded-lg border p-3">
                    <code className="rounded bg-muted px-2 py-0.5 text-xs font-medium">{param.name}</code>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{param.type}</span>
                        {param.required && (
                          <Badge variant="outline" className="text-xs">required</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{param.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {endpoint.requestBody && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Request Body</h4>
              <CodeBlock code={JSON.stringify(endpoint.requestBody, null, 2)} />
            </div>
          )}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Response</h4>
            <CodeBlock code={JSON.stringify(endpoint.responseBody, null, 2)} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="API Documentation"
        description="Complete reference for all Walkie Puppie API endpoints"
        badge="Developer Docs"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="h-fit lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle className="text-sm">Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {endpoints.map((endpoint) => (
              <a
                key={endpoint.id}
                href={`#${endpoint.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <Badge className={`${methodColors[endpoint.method]} text-xs`}>
                  {endpoint.method}
                </Badge>
                <span className="truncate text-muted-foreground">{endpoint.path}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Base URL and authentication information for the Walkie Puppie API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Base URL</h4>
                <code className="rounded bg-muted px-3 py-2 text-sm">https://api.walkiepuppie.com/v1</code>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  All API requests require a Bearer token in the Authorization header:
                </p>
                <CodeBlock code={`Authorization: Bearer YOUR_API_KEY`} language="bash" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Endpoints</TabsTrigger>
              <TabsTrigger value="walks">Walks</TabsTrigger>
              <TabsTrigger value="ai">AI Services</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6 space-y-6">
              {endpoints.map((endpoint) => (
                <EndpointCard key={endpoint.id} endpoint={endpoint} />
              ))}
            </TabsContent>
            <TabsContent value="walks" className="mt-6 space-y-6">
              {endpoints
                .filter((e) => e.path.includes("walks"))
                .map((endpoint) => (
                  <EndpointCard key={endpoint.id} endpoint={endpoint} />
                ))}
            </TabsContent>
            <TabsContent value="ai" className="mt-6 space-y-6">
              {endpoints
                .filter((e) => e.path.includes("chat") || e.path.includes("insights"))
                .map((endpoint) => (
                  <EndpointCard key={endpoint.id} endpoint={endpoint} />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
