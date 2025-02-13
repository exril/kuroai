'use client'

import { useState, useEffect } from 'react'
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
    <div className="h-full p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-400/20 p-2 rounded-full">
          <Cat className="w-5 h-5 text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-yellow-400">{stats.name}'s Status</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-slate-200">Mood</span>
            </div>
            <p className="text-sm text-slate-300">{stats.mood}</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-200">Energy</span>
            </div>
            <Progress value={stats.energy} className="h-2" />
            <p className="text-xs text-slate-400 mt-1">{stats.energy}%</p>
          </div>
        </div>

        <div className="bg-slate-700/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-slate-200">Health</span>
          </div>
          <Progress value={stats.health} className="h-2" />
          <p className="text-xs text-slate-400 mt-1">{stats.health}%</p>
        </div>

        <div className="bg-slate-700/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-slate-200">Thoughts</span>
          </div>
          <p className="text-sm text-slate-300 italic">"{stats.thoughts}"</p>
        </div>
      </div>
    </div>
  )
}
