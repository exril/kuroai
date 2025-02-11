'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cat, Battery, Brain, HeartPulse } from 'lucide-react'

export default function AgentSidebar() {
  const [stats, setStats] = useState({
    name: "Kuro",
    mood: "Happy",
    energy: 80,
    health: 100,
    thoughts: "I wonder what adventure awaits me today!"
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        energy: Math.max(0, Math.min(100, prev.energy + Math.floor(Math.random() * 10) - 5)),
        health: Math.max(0, Math.min(100, prev.health + Math.floor(Math.random() * 5) - 2)),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <aside className="w-80 bg-slate-900 p-4 overflow-y-auto">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <Cat className="w-6 h-6" />
            {stats.name}'s Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium text-slate-200">Mood</span>
              </div>
              <p className="text-sm text-slate-300">{stats.mood}</p>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-slate-200">Energy</span>
              </div>
              <Progress value={stats.energy} className="h-2" />
              <p className="text-xs text-slate-400 mt-1">{stats.energy}%</p>
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="w-5 h-5 text-red-400" />
              <span className="text-sm font-medium text-slate-200">Health</span>
            </div>
            <Progress value={stats.health} className="h-2" />
            <p className="text-xs text-slate-400 mt-1">{stats.health}%</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-slate-200">Thoughts</span>
            </div>
            <p className="text-sm text-slate-300 italic">"{stats.thoughts}"</p>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

