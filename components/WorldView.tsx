'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, CloudSun } from 'lucide-react'
import MapComponent from './Map'

export default function WorldView() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState('sunny')
  const [currentEvent, setCurrentEvent] = useState("Kuro is exploring the neighborhood")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const weatherInterval = setInterval(() => {
      const weathers = ['sunny', 'partly cloudy', 'cloudy', 'light rain', 'heavy rain']
      setWeather(weathers[Math.floor(Math.random() * weathers.length)])
    }, 300000) // Change weather every 5 minutes

    const eventInterval = setInterval(() => {
      const events = [
        "Kuro is chasing butterflies in the park",
        "Kuro is napping in a sunny spot",
        "Kuro is watching birds from the window",
        "Kuro is playing with a ball of yarn",
        "Kuro is exploring the neighborhood"
      ]
      setCurrentEvent(events[Math.floor(Math.random() * events.length)])
    }, 60000) // Change event every minute

    return () => {
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
      clearInterval(eventInterval)
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-yellow-400">World View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-700 p-3 rounded-lg flex items-center">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-slate-200">{isClient ? currentTime.toLocaleTimeString() : ''}</span>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg flex items-center">
              <CloudSun className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-slate-200 capitalize">{weather}</span>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg flex items-center">
              <MapPin className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-slate-200">Kuro's Neighborhood</span>
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Current Event</h3>
            <p className="text-slate-300">{currentEvent}</p>
          </div>
          <MapComponent currentEvent={currentEvent} weather={weather} />
        </CardContent>
      </Card>
    </div>
  )
}
