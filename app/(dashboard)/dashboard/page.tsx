"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { 
  Users, 
  Footprints, 
  MapPin, 
  MessageSquare, 
  Snowflake, 
  Dog,
  TrendingUp,
  Activity
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"

const statsCards = [
  { title: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-chart-1" },
  { title: "Total Walks", value: "89,432", change: "+8%", icon: Footprints, color: "text-chart-2" },
  { title: "Total Miles", value: "234,567", change: "+15%", icon: MapPin, color: "text-chart-3" },
  { title: "Chatbot Requests", value: "45,231", change: "+23%", icon: MessageSquare, color: "text-chart-4" },
  { title: "Cortex Insights", value: "18,923", change: "+18%", icon: Snowflake, color: "text-chart-5" },
  { title: "Active AR Pets", value: "9,876", change: "+5%", icon: Dog, color: "text-primary" },
]

const weeklyData = [
  { name: "Mon", walks: 4200, miles: 8400, chatbot: 1200 },
  { name: "Tue", walks: 3800, miles: 7600, chatbot: 1100 },
  { name: "Wed", walks: 5100, miles: 10200, chatbot: 1400 },
  { name: "Thu", walks: 4700, miles: 9400, chatbot: 1300 },
  { name: "Fri", walks: 5800, miles: 11600, chatbot: 1600 },
  { name: "Sat", walks: 7200, miles: 14400, chatbot: 2100 },
  { name: "Sun", walks: 6500, miles: 13000, chatbot: 1800 },
]

const recentActivity = [
  { user: "sarah_walker", action: "Completed 5-mile walk", time: "2 min ago", type: "walk" },
  { user: "mike_fitness", action: "Asked chatbot for motivation", time: "5 min ago", type: "chat" },
  { user: "emma_runner", action: "Generated weekly insights", time: "8 min ago", type: "insight" },
  { user: "john_hiker", action: "Unlocked Marathon Pup achievement", time: "12 min ago", type: "achievement" },
  { user: "lisa_active", action: "Started morning walk", time: "15 min ago", type: "walk" },
  { user: "david_pet", action: "Fed AR pet Buddy", time: "18 min ago", type: "pet" },
]

const activityIcons: Record<string, typeof Users> = {
  walk: Footprints,
  chat: MessageSquare,
  insight: Snowflake,
  achievement: TrendingUp,
  pet: Dog,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="Monitor app analytics and system health"
        badge="Overview"
      />

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stat.change}</span>
                  <span>from last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Walks and miles tracked this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorWalks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.2 280)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.2 280)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.75 0.15 160)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.75 0.15 160)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
                    <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="walks"
                      stroke="oklch(0.55 0.2 280)"
                      fillOpacity={1}
                      fill="url(#colorWalks)"
                    />
                    <Area
                      type="monotone"
                      dataKey="miles"
                      stroke="oklch(0.75 0.15 160)"
                      fillOpacity={1}
                      fill="url(#colorMiles)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Usage</CardTitle>
              <CardDescription>Daily AI chatbot requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
                    <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="chatbot" fill="oklch(0.7 0.18 50)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user interactions across the platform</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activityIcons[activity.type] || Activity
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">@{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
