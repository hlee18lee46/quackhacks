"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { 
  Snowflake, 
  TrendingUp, 
  Target, 
  Heart, 
  AlertTriangle,
  Sparkles,
  Activity,
  Footprints,
  Gauge,
  Dog
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InsightData {
  userId: string
  totalDistance: string
  numberOfWalks: string
  averagePace: string
  petMood: string
}

interface InsightResult {
  weeklySummary: string
  fitnessRecommendation: string
  petMotivation: string
  riskAlert: string | null
}

const mockInsights: InsightResult = {
  weeklySummary: "Great week! You completed 12 walks totaling 18.5 miles. That's 25% more than last week! Your consistency has improved, with walks on 6 out of 7 days. Average session length was 22 minutes.",
  fitnessRecommendation: "Based on your pace analysis, try incorporating interval walking: alternate between brisk walking (3.5 mph) for 3 minutes and normal pace (2.5 mph) for 2 minutes. This can boost calorie burn by 20% and improve cardiovascular health.",
  petMotivation: "Buddy is thriving! His energy level is at 92% and he's unlocked the 'Marathon Pup' achievement. He's excited about exploring new routes - consider trying the riverside path this weekend for bonus XP!",
  riskAlert: null
}

const mockLowActivityInsights: InsightResult = {
  weeklySummary: "This week you completed 3 walks totaling 2.1 miles. Activity is down 60% from your usual pattern. We noticed most walks were shorter than 10 minutes.",
  fitnessRecommendation: "Start small! Even a 10-minute walk can make a difference. Try setting a reminder for a short morning walk - it's a great way to energize your day and keep Buddy happy.",
  petMotivation: "Buddy misses your adventures together! His energy has dropped to 45%. A quick walk around the block would really cheer him up and start rebuilding your streak.",
  riskAlert: "Low activity detected. Extended periods of reduced walking can affect both your health and Buddy's virtual well-being. Consider setting daily walking reminders."
}

export default function InsightsPage() {
  const [formData, setFormData] = useState<InsightData>({
    userId: "user_12345",
    totalDistance: "18.5",
    numberOfWalks: "12",
    averagePace: "3.2",
    petMood: "happy"
  })
  const [insights, setInsights] = useState<InsightResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return different insights based on activity level
    const distance = parseFloat(formData.totalDistance)
    if (distance < 5) {
      setInsights(mockLowActivityInsights)
    } else {
      setInsights(mockInsights)
    }
    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Snowflake Cortex Insights"
        description="Get AI-powered walking analytics and personalized fitness recommendations"
        badge="Analytics"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Snowflake className="h-5 w-5 text-accent-foreground" />
            </div>
            <CardTitle className="mt-3">Activity Data Input</CardTitle>
            <CardDescription>
              Enter your walking stats to generate personalized insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="user_12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDistance">Total Distance (miles)</Label>
                <div className="relative">
                  <Footprints className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="totalDistance"
                    type="number"
                    step="0.1"
                    value={formData.totalDistance}
                    onChange={(e) => setFormData({ ...formData, totalDistance: e.target.value })}
                    className="pl-10"
                    placeholder="18.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfWalks">Number of Walks</Label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="numberOfWalks"
                    type="number"
                    value={formData.numberOfWalks}
                    onChange={(e) => setFormData({ ...formData, numberOfWalks: e.target.value })}
                    className="pl-10"
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="averagePace">Average Pace (mph)</Label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="averagePace"
                    type="number"
                    step="0.1"
                    value={formData.averagePace}
                    onChange={(e) => setFormData({ ...formData, averagePace: e.target.value })}
                    className="pl-10"
                    placeholder="3.2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="petMood">Pet Mood</Label>
                <Select
                  value={formData.petMood}
                  onValueChange={(value) => setFormData({ ...formData, petMood: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecstatic">Ecstatic</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 rounded-lg border border-dashed p-3">
              <p className="text-xs font-medium text-muted-foreground">API Endpoint</p>
              <code className="mt-1 block text-xs font-mono">POST /api/insights/cortex</code>
            </div>
          </CardContent>
        </Card>

        {/* Insights Display */}
        <div className="space-y-6 lg:col-span-2">
          {!insights && !isLoading && (
            <Card className="flex h-[400px] items-center justify-center">
              <CardContent className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Snowflake className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Insights Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your activity data and click &quot;Generate Insights&quot; to see AI-powered recommendations
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card className="flex h-[400px] items-center justify-center">
              <CardContent className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Snowflake className="h-8 w-8 animate-spin text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Analyzing Your Data</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Snowflake Cortex is processing your walking patterns...
                </p>
              </CardContent>
            </Card>
          )}

          {insights && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Weekly Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                      <TrendingUp className="h-4 w-4 text-chart-1" />
                    </div>
                    <CardTitle className="text-base">Weekly Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insights.weeklySummary}</p>
                </CardContent>
              </Card>

              {/* Fitness Recommendation */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                      <Target className="h-4 w-4 text-chart-2" />
                    </div>
                    <CardTitle className="text-base">Fitness Recommendation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insights.fitnessRecommendation}</p>
                </CardContent>
              </Card>

              {/* Pet Motivation */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                      <Dog className="h-4 w-4 text-chart-3" />
                    </div>
                    <CardTitle className="text-base">Pet Motivation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insights.petMotivation}</p>
                </CardContent>
              </Card>

              {/* Risk Alert */}
              <Card className={insights.riskAlert ? "border-destructive/50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${insights.riskAlert ? "bg-destructive/10" : "bg-green-500/10"}`}>
                      {insights.riskAlert ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Heart className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-base">
                      {insights.riskAlert ? "Activity Alert" : "Health Status"}
                    </CardTitle>
                    {!insights.riskAlert && (
                      <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                        All Good
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {insights.riskAlert || "No concerns detected! Your activity levels are healthy and consistent. Keep up the great work!"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
