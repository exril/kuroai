import React, { useEffect, useState } from 'react'
import { Agent } from "@/redux/types/agent"
import { AgentInteractState } from "@/redux/types/interactions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { MapPin, Heart, MessageCircle, Clock } from 'lucide-react'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter } from '@/lib/utils';

interface AIAgent {
  id: number;
  name: string;
  location: string;
  avatar: string;
  color: string;
  isMainAgent: boolean;
}

interface AIAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AIAgent | null;
  date: Date;
}

const AIAgentDialog = ({ open, onOpenChange, agent, date }: AIAgentDialogProps) => {
  if (!agent) return null

  const agents = useSelector((state: RootState) => state.agentActivity.agents as Agent[])
  const agentInteracts = useSelector((state: RootState) => state.agentInteracts as AgentInteractState).interacts

  const [mood, setMood] = useState("Happy")
  const [activity, setActivity] = useState("")
  const [location, setLocation] = useState(agent.location)
  const [relationWithKuro, setRelationWithKuro] = useState(0)
  const [interactCount, setInteractCount] = useState(0)
  const [interactDate, setInteractDate] = useState<Date | null>(null)

  useEffect(() => {
    if ( agents == undefined ) return ;
    const agentActivity = agents.find((agt) => agt.name == agent.name)
    const interact = agentInteracts[agent.id - 1]

    if ( agentActivity ) {
      setMood(agentActivity.emotion)
      setActivity(agentActivity.activity.split('>')[0])
      setLocation(agentActivity.location.join(" > "))
      setRelationWithKuro(agentActivity.social_relationships['Kuro']?.closeness / 2 | 0)  
    } else {
      setMood("Happy")
      setActivity("")
      setLocation(agent.location)
      setRelationWithKuro(0)
    }
    
    setInteractCount(interact.totalInteractions)
    if (interact.lastInteractDate) setInteractDate(new Date(interact.lastInteractDate!))
  }, [agent, agents])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400 font-title">
            {agent.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200 mb-2 flex items-center font-title">
              <Heart className="w-5 h-5 mr-2 text-red-400" />
              Relationship with Kuro
            </h3>
            <Progress value={relationWithKuro * 20} className="h-2 mb-2" />
            <p className="text-sm text-slate-300 font-body">Level {relationWithKuro} / 5</p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200 mb-2 flex items-center font-title">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
              Interactions
            </h3>
            <p className="text-sm text-slate-300 font-body">Total interactions: {interactCount}</p>
            <p className="text-sm text-slate-300 font-body">Last interaction: { interactDate ?
                Math.floor((date.getTime() - interactDate!.getTime()) / (60 * 60000))
                : ''
              } hours ago</p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200 mb-2 flex items-center font-title">
              <MapPin className="w-5 h-5 mr-2 text-green-400" />
              Current Location
            </h3>
            <p className="text-sm text-slate-300 font-body">{location}</p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200 mb-2 flex items-center font-title">
              <Clock className="w-5 h-5 mr-2 text-purple-400" />
              Current Status
            </h3>
            <p className="text-sm text-slate-300 font-body">Mood: { capitalizeFirstLetter(mood) }</p>
            <p className="text-sm text-slate-300 font-body">Activity: { capitalizeFirstLetter(activity) }</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIAgentDialog
