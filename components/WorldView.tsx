'use client'

import { useState, useEffect } from 'react'
import MapComponent from './Map'

export default function WorldView() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState('sunny')
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

    return () => {
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
    }
  }, [])

  return (
    <div className="h-full">
      <MapComponent weather={weather} />
    </div>
  )
}
