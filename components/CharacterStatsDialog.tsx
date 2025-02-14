import React, { useEffect, useState } from 'react'
import { Agent } from "@/redux/types/agent"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Cat, Battery, Brain, PlayCircle, HeartPulse } from 'lucide-react'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter } from '@/lib/utils'

interface CharacterStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
}

const CharacterStatsDialog = ({ open, onOpenChange, name }: CharacterStatsDialogProps) => {
  const agents = useSelector((state: RootState) => state.agentActivity.agents as Agent[])
  const [stats, setStats] = useState({
    activity: "Napping in the sun",
    mood: "Happy",
    energy: 60,
    thoughts: "I wonder what adventure awaits me today!"
  })

  useEffect(() => {
    const agent = agents.find((agent) => agent.name == name)

    if ( agent ) {
      setStats({
        activity: agent.activity.split('>')[0],
        mood:  capitalizeFirstLetter(agent.emotion),
        energy: agent.basic_needs.energy * 10,
        thoughts: agent.thoughts
      })
    }
  }, [agents])

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "Ecstatic": return "😺"
      case "Happy": return "😸"
      case "Content": return "😺"
      case "Curious": return "🙀"
      case "Playful": return "😽"
      case "Sleepy": return "😴"
      case "Grumpy": return "😾"
      default: return "😺"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-2 font-title">
            <Cat className="w-6 h-6" />
            {name}'s Status
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-200 font-body">Activity</span>
              </div>
              <p className="text-sm text-slate-300 font-body">{stats.activity}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium text-slate-200 font-body">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300 font-body">{stats.mood}</span>
                <span className="text-2xl" role="img" aria-label={`Mood: ${stats.mood}`}>
                  {getMoodEmoji(stats.mood)}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-slate-200 font-body">Energy</span>
              </div>
              <span className="text-sm text-slate-300 font-body">{stats.energy}%</span>
            </div>
            <Progress value={stats.energy} className="h-2" />
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-slate-200 font-title">{name}'s Thoughts</span>
            </div>
            <p className="text-sm text-slate-300 italic font-body">
              "{stats.thoughts}"
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CharacterStatsDialog
