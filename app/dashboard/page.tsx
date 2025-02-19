'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicNeedsChart } from '@/components/analytics/BasicNeedsChart'
import { SocialChart } from '@/components/analytics/SocialChart'
import { EmotionsChart } from '@/components/analytics/EmotionsChart'
import { ActivitiesChart } from '@/components/analytics/ActivitiesChart'
import { mockAnalytics, agentProfiles } from '@/lib/mock-analytics'
import { ArrowLeft } from 'lucide-react'
import styles from '@/styles/dashboard.module.css'
import backStyles from '@/styles/back-button.module.css'

export default function DashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState('Kuro')
  const agentData = mockAnalytics[selectedAgent]

  return (
    <div className="min-h-screen bg-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/mapLayers/clouds.png"
          alt="Clouds"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className="relative p-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className={backStyles.backButton}>
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </Link>
        </div>
        <div className={`text-center mb-8 ${styles.fadeIn}`}>
          <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-800 mt-2">Track and analyze agent behavior and interactions</p>
        </div>

        <Tabs defaultValue="Kuro" className="w-full max-w-7xl mx-auto" onValueChange={setSelectedAgent}>
          <TabsList className={`w-full justify-start mb-8 ${styles.slideIn}`}>
            {Object.keys(mockAnalytics).map((agent) => (
              <TabsTrigger
                key={agent}
                value={agent}
                className={`px-8 py-3 data-[state=active]:bg-white flex items-center gap-2 ${agentProfiles[agent].color} bg-opacity-20 data-[state=active]:bg-opacity-100`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={agentProfiles[agent].pfp}
                    alt={agent}
                    fill
                    className="object-cover"
                  />
                </div>
                {agent}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(mockAnalytics).map((agent) => (
            <TabsContent key={agent} value={agent} className="space-y-8">
              <div className={styles.chartGrid}>
                <div className={styles.chartContainer}>
                  <BasicNeedsChart
                    timestamps={agentData.basicNeeds.timestamps}
                    energy={agentData.basicNeeds.energy}
                    health={agentData.basicNeeds.health}
                  />
                </div>
                <div className={styles.chartContainer}>
                  <SocialChart
                    relationships={agentData.socialRelationships}
                  />
                </div>
                <div className={styles.chartContainer}>
                  <EmotionsChart
                    emotions={agentData.emotions}
                  />
                </div>
                <div className={styles.chartContainer}>
                  <ActivitiesChart
                    timestamps={agentData.activities.timestamps}
                    activities={agentData.activities.activities}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
