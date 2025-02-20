'use client'

import { Event } from '@/lib/mock-events'
import { agentProfiles } from '@/lib/mock-analytics'
import Image from 'next/image'
import { Activity, Award, Heart, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface EventLogProps {
  events: Event[]
  showAgentImages?: boolean
  title?: string
  maxHeight?: string
}

export function EventLog({ 
  events, 
  showAgentImages = true, 
  title = "Event Log",
  maxHeight = "400px"
}: EventLogProps) {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'activity':
        return <Activity className="w-4 h-4 text-blue-500" />
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />
      case 'emotion':
        return <Heart className="w-4 h-4 text-pink-500" />
      case 'interaction':
        return <Users className="w-4 h-4 text-purple-500" />
    }
  }

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'activity':
        return 'bg-blue-50 border-blue-200'
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200'
      case 'emotion':
        return 'bg-pink-50 border-pink-200'
      case 'interaction':
        return 'bg-purple-50 border-purple-200'
    }
  }

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg h-full">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight }}>
        {sortedEvents.map((event, index) => (
          <div 
            key={event.id}
            className={`p-4 rounded-lg border ${getEventColor(event.type)} relative opacity-0 animate-fadeIn`}
            style={{ 
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium">
                  {event.description}
                </p>
                {event.location && (
                  <p className="text-xs text-slate-500 mt-1">
                    📍 {event.location}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {showAgentImages && event.agents.map((agent) => (
                    <div key={agent} className="relative group">
                      <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={agentProfiles[agent].pfp}
                          alt={agent}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {agent}
                      </div>
                    </div>
                  ))}
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {event.impact && (
                <div 
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `rgba(${event.impact > 80 ? '34, 197, 94' : event.impact > 60 ? '234, 179, 8' : '239, 68, 68'}, 0.1)`,
                    color: event.impact > 80 ? 'rgb(21, 128, 61)' : event.impact > 60 ? 'rgb(161, 98, 7)' : 'rgb(185, 28, 28)'
                  }}
                >
                  Impact: {event.impact}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
