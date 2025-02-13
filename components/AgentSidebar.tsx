'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cat, Battery, Brain, HeartPulse } from 'lucide-react'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter } from '@/lib/utils'

export default function AgentSidebar() {
  const agents = useSelector((state: RootState) => state.agentActivity.agents)
  const [stats, setStats] = useState({
    name: "Kuro",
    mood: "Happy",
    energy: 80,
    health: 100,
    thoughts: "I wonder what adventure awaits me today!"
  })

  useEffect(() => {
    const Kuro = agents.find((agent) => agent.name == 'Kuro')
    if ( Kuro == undefined ) return ;
    
    setStats({
      name: 'Kuro',
      mood:  capitalizeFirstLetter(Kuro.emotion),
      energy: Kuro.basic_needs.energy * 10,
      health: Kuro.basic_needs.health * 10,
      thoughts: Kuro.thoughts
    })
  }, [agents])

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

