'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Battery, Brain, PlayCircle, HeartPulse, Calendar } from 'lucide-react'
import { GradientButton } from '@/components/ui/gradient-button'

const events = [
  { id: 1, title: "Morning Stroll", location: "Park", description: "Kuro enjoys a peaceful walk." },
  { id: 2, title: "Butterfly Chase", location: "Garden", description: "Kuro chases fluttering butterflies." },
  { id: 3, title: "Nap Time", location: "Sunny Spot", description: "A quick snooze in a warm nook." },
  { id: 4, title: "Bird Watching", location: "Backyard", description: "Observing birds with keen eyes." },
  { id: 5, title: "Exploring", location: "Neighborhood", description: "Meeting new friends around." },
]

// Parent container for stagger (open & close)
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

// Fade-in/up for each item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
}

// Collapsible container variants
const collapseVariants = {
  hidden: { height: 0, opacity: 0 },
  show: { height: "auto", opacity: 1, transition: { duration: 0.4 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.4 } },
}

// Hover effect for interactive cards
const hoverPop = {
  whileHover: { scale: 1.03, transition: { type: "spring", stiffness: 300 } },
  whileTap: { scale: 0.97 },
}

export default function KuroWorld() {
  const [stats, setStats] = useState({
    activity: "Napping in the sun",
    mood: "Happy",
    energy: 60,
    thoughts: "What adventure awaits today?",
  })

  const [currentEvent, setCurrentEvent] = useState(events[0])
  const [pastEvents, setPastEvents] = useState<typeof events>([])
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        mood: getRandomMood(),
        energy: Math.min(100, Math.max(0, prev.energy + Math.floor(Math.random() * 20) - 5)),
      }))
    }, 10000)

    const eventInterval = setInterval(() => {
      const newEvent = events[Math.floor(Math.random() * events.length)]
      setPastEvents((prev) => [currentEvent, ...prev].slice(0, 3))
      setCurrentEvent(newEvent)
    }, 30000)

    return () => {
      clearInterval(statsInterval)
      clearInterval(eventInterval)
    }
  }, [currentEvent])

  const getRandomMood = () => {
    const moods = ["Ecstatic", "Happy", "Content", "Curious", "Playful", "Sleepy", "Grumpy"]
    return moods[Math.floor(Math.random() * moods.length)]
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "Ecstatic":
        return "😺"
      case "Happy":
        return "😸"
      case "Content":
        return "😺"
      case "Curious":
        return "🙀"
      case "Playful":
        return "😽"
      case "Sleepy":
        return "😴"
      case "Grumpy":
        return "😾"
      default:
        return "😺"
    }
  }

  const toggleCollapse = () => setIsCollapsed((prev) => !prev)

  return (
    <div className="mt-4 ml-4 w-[340px] relative">
      {/* Main Card with white background and fixed cloud overlay */}
      <div
        className="
          relative 
          rounded-2xl 
          border-2 
          border-black 
          bg-white
          bg-[url('/cloudspop.png')] 
          bg-repeat 
          bg-left-top 
          bg-fixed
          shadow-[4px_4px_0_0_black]
          overflow-visible
        "
      >
        <div className="relative py-2 px-4">
          {/* Header: Centered vertically */}
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                <Image
                  src="/pfps/pfp1.png"
                  alt="Cat Avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <h1 className="text-2xl font-title font-extrabold text-black">Kuro Status</h1>
            </div>
            <GradientButton onClick={toggleCollapse} size="md">
              {isCollapsed ? "▼" : "▲"}
            </GradientButton>
          </div>

          {/* Collapsible Content */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                key="collapseContent"
                variants={collapseVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="overflow-visible"
              >
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {/* Current Event */}
                  <motion.div
                    className="rounded-2xl border-2 border-black bg-pink-100 p-3 shadow-[2px_2px_0_0_black]"
                    variants={itemVariants}
                    {...hoverPop}
                  >
                    <h2 className="text-lg font-title font-bold text-black mb-1">
                      {currentEvent.title}
                    </h2>
                    <p className="text-sm text-black">{currentEvent.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentEvent.location}</span>
                    </div>
                  </motion.div>

                  {/* Activity & Mood Row */}
                  <div className="flex gap-2">
                    {/* Activity */}
                    <motion.div
                      className="flex-1 rounded-2xl border-2 border-black bg-purple-100 p-3 shadow-[2px_2px_0_0_black]"
                      variants={itemVariants}
                      {...hoverPop}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <PlayCircle className="w-5 h-5 text-purple-600" />
                        <h3 className="text-sm font-title font-bold text-black">Activity</h3>
                      </div>
                      <p className="text-sm text-black">{stats.activity}</p>
                    </motion.div>
                    {/* Mood */}
                    <motion.div
                      className="flex-1 rounded-2xl border-2 border-black bg-yellow-100 p-3 shadow-[2px_2px_0_0_black]"
                      variants={itemVariants}
                      {...hoverPop}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <HeartPulse className="w-5 h-5 text-red-600" />
                        <h3 className="text-sm font-title font-bold text-black">Mood</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-black">{stats.mood}</p>
                        <span className="text-lg" role="img" aria-label={`Mood: ${stats.mood}`}>
                          {getMoodEmoji(stats.mood)}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Energy */}
                  <motion.div
                    className="rounded-2xl border-2 border-black bg-green-100 p-3 shadow-[2px_2px_0_0_black]"
                    variants={itemVariants}
                    {...hoverPop}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Battery className="w-5 h-5 text-green-600" />
                        <h3 className="text-sm font-title font-bold text-black">Energy</h3>
                      </div>
                      <span className="text-sm text-black">{stats.energy}%</span>
                    </div>
                    <div className="w-full h-3 border-2 border-black rounded-full overflow-hidden">
                      <div className="bg-black h-full" style={{ width: `${stats.energy}%` }} />
                    </div>
                  </motion.div>

                  {/* Thoughts */}
                  <motion.div
                    className="rounded-2xl border-2 border-black bg-blue-100 p-3 shadow-[2px_2px_0_0_black]"
                    variants={itemVariants}
                    {...hoverPop}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-title font-bold text-black">Thoughts</h3>
                    </div>
                    <p className="text-sm text-black italic">"{stats.thoughts}"</p>
                  </motion.div>

                  {/* Past Events */}
                  <motion.div
                    className="rounded-2xl border-2 border-black bg-white p-3 shadow-[2px_2px_0_0_black]"
                    variants={itemVariants}
                    {...hoverPop}
                  >
                    <div className="flex items-center gap-1 mb-2">
                      <Calendar className="w-5 h-5 text-black" />
                      <h4 className="text-sm font-title font-bold text-black">Recent Adventures</h4>
                    </div>
                    <div className="max-h-[120px] overflow-y-auto overflow-x-hidden space-y-2 scrollable">
                      {pastEvents.map(ev => (
                        <motion.div
                          key={ev.id}
                          className="rounded-xl border-2 border-black bg-gray-200 p-2 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <p className="text-sm font-bold text-black">{ev.title}</p>
                          <p className="text-xs text-black">{ev.location}</p>
                        </motion.div>
                      ))}
                      {pastEvents.length === 0 && (
                        <p className="text-xs text-gray-600">No recent adventures yet.</p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        /* Custom scrollbar for Past Events */
        .scrollable {
          scrollbar-width: thin;
          scrollbar-color: #ff5a78 #ffecec;
        }
        .scrollable::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable::-webkit-scrollbar-track {
          background: #ffecec;
          border-radius: 3px;
        }
        .scrollable::-webkit-scrollbar-thumb {
          background-color: #ff5a78;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}
