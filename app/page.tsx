import WorldView from '@/components/WorldView'
import AgentInterface from '@/components/AgentInterface'

export default function Home() {
  return (
    <div className="space-y-6">
      <WorldView />
      <AgentInterface />
    </div>
  )
}

