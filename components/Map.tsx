'use client'

import React, { useState, useEffect, useRef } from 'react'
import ExpandableChat from './ExpandableChat'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Cat, Cloud, Sun, CloudRain, CloudSun, CloudDrizzle, Users, Clock,
  Coffee, TreesIcon as Tree, Building2, Mail, Home, Newspaper, ShoppingCart, Shirt,
  Moon, Sunrise, Dog, Bird
} from 'lucide-react'
import CharacterStatsDialog from './CharacterStatsDialog'
import AIAgentDialog from './AIAgentDialog'
import moment from 'moment';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { fetchAgentActivity } from "@/redux/slices/activitySlice";
import { increaseInteract } from "@/redux/slices/interactionSlice";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'


// Define MovingClouds so they animate over the map.
// You can adjust the duration, delay, and z-index as needed.
const MovingClouds = () => {
  const clouds = [
    { src: '/mapLayers/movingCloud1.png', top: '5%', duration: 90, delay: 0 },
    { src: '/mapLayers/movingCloud2.png', top: '10%', duration: 110, delay: 20 },
    { src: '/mapLayers/movingCloud3.png', top: '3%', duration: 80, delay: 10 },
    { src: '/mapLayers/movingCloud4.png', top: '8%', duration: 100, delay: 30, },
  ]
  return (
    <>
      {clouds.map((cloud, index) => (
        <img
          key={index}
          src={cloud.src}
          alt="Moving Cloud"
          draggable={false}
          onDragStart={e => e.preventDefault()}
          style={{
            position: 'absolute',
            top: cloud.top,
            left: '-30%',
            width: '300px',
            opacity: 0.8,
            pointerEvents: 'none',
            // Place moving clouds above the panned layers but below UI overlays:
            zIndex: 100,
            animation: `moveCloud${index} ${cloud.duration}s linear infinite`,
            animationDelay: `${cloud.delay}s`
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes moveCloud0 {
          from { transform: translateX(0); }
          to { transform: translateX(160vw); }
        }
        @keyframes moveCloud1 {
          from { transform: translateX(0); }
          to { transform: translateX(160vw); }
        }
        @keyframes moveCloud2 {
          from { transform: translateX(0); }
          to { transform: translateX(160vw); }
        }
        @keyframes moveCloud3 {
          from { transform: translateX(0); }
          to { transform: translateX(160vw); }
        }
      `}</style>
    </>
  )
}

interface Location {
  id: number
  name: string
  // Coordinates in percentage relative to 1920x1080
  x: number
  y: number
  icon: JSX.Element
  color: string
}

const locations: Location[] = [
  { id: 1, name: "Coffee Shop", x: 81.35, y: 47.90, icon: <Coffee className="w-6 h-6" />, color: "bg-amber-600" },
  { id: 2, name: "Park", x: 48.44, y: 48.98, icon: <Tree className="w-6 h-6" />, color: "bg-green-600" },
  { id: 3, name: "Office Building", x: 23.57, y: 34.81, icon: <Building2 className="w-6 h-6" />, color: "bg-blue-600" },
  { id: 4, name: "Postal Office", x: 79.79, y: 76.20, icon: <Mail className="w-6 h-6" />, color: "bg-red-600" },
  { id: 5, name: "Kuro's House", x: 48.75, y: 87.59, icon: <Home className="w-6 h-6" />, color: "bg-purple-600" },
  { id: 6, name: "Newspaper Stand", x: 27.86, y: 73.47, icon: <Newspaper className="w-6 h-6" />, color: "bg-orange-600" },
  { id: 7, name: "Grocery Store", x: 52.50, y: 17.13, icon: <ShoppingCart className="w-6 h-6" />, color: "bg-lime-600" },
  { id: 8, name: "Fashion Store", x: 67.02, y: 34.91, icon: <Shirt className="w-6 h-6" />, color: "bg-pink-600" },
]

const aiAgents = [
  { id: 1, name: "Kuro", location: "Kuro's House", avatar: "/pfps/pfp1.png", color: 'bg-amber-600', isMainAgent: true },
  { id: 2, name: "Theo", location: "Grocery Store", avatar: "/pfps/pfp2.png", color: 'bg-amber-600', isMainAgent: true },
  { id: 3, name: "Milo", location: "Coffee Shop", avatar: "/pfps/pfp3.png", color: 'bg-amber-600', isMainAgent: true },
  { id: 4, name: "Alice", location: "Coffee Shop", avatar: "/pfps/pfp6.png", color: 'bg-amber-600', isMainAgent: false },
  { id: 5, name: "Bob", location: "Park", avatar: "", color: 'bg-green-600', isMainAgent: false },
  { id: 6, name: "Klaus", location: "Office Building", avatar: "/pfps/pfp4.png", color: 'bg-blue-600', isMainAgent: false },
  { id: 7, name: "Diana", location: "Postal Office", avatar: "", color: 'bg-red-600', isMainAgent: false },
  { id: 8, name: "Ethan", location: "Newspaper Stand", avatar: "", color: 'bg-orange-600', isMainAgent: false },
  { id: 9, name: "Ava", location: "Grocery Store", avatar: "/pfps/pfp5.png", color: 'bg-lime-600', isMainAgent: false },
  { id: 10, name: "George", location: "Fashion Store", avatar: "", color: 'bg-pink-600', isMainAgent: false },
]

// Mapping for structures (hover effect controlled via buttons)
const structureMapping: Record<string, string> = {
  "_0007_house7": "Coffee Shop",
  "_0002_fountain": "Park",
  "_0000_house1": "Kuro's House",
  "_0011_house10": "Grocery Store",
  "_0004_house2": "Postal Office",
  "_0008_house8": "Fashion Store",
  "_0009_house9": "Office Building",
  "_0005_house4": "Newspaper Stand",
}

// Layers to be panned (exclude base clouds)
const pannedLayers = [
  { name: "_0013_street", width: 1920, height: 1080, top: 0, left: 0 },
  { name: "_0012_trees4", width: 804, height: 269, top: 0, left: 534 },
  { name: "_0011_house10", width: 516, height: 360, top: 5, left: 750 },
  { name: "_0010_trees3", width: 746, height: 798, top: 199, left: 645 },
  { name: "_0009_house9", width: 905, height: 518, top: 117, left: 0 },
  { name: "_0008_house8", width: 682, height: 434, top: 160, left: 945 },
  { name: "_0007_house7", width: 548, height: 296, top: 369, left: 1288 },
  { name: "_0006_trees2", width: 282, height: 243, top: 530, left: 1638 },
  { name: "_0005_house4", width: 1068, height: 573, top: 507, left: 1 },
  { name: "_0004_house2", width: 610, height: 442, top: 602, left: 1227 },
  { name: "_0003_lamps", width: 821, height: 556, top: 129, left: 418 },
  { name: "_0002_fountain", width: 158, height: 194, top: 432, left: 851 },
  { name: "_0001_trees1", width: 204, height: 188, top: 553, left: 933 },
  { name: "_0000_house1", width: 752, height: 268, top: 812, left: 560 },
]

interface MapProps {
  weather: string
}

const MapComponent = ({ weather }: MapProps) => {
  const dispatch = useAppDispatch();

  // Agents activities and Conversations from Redux
  const agents = useSelector((state: RootState) => state.agentActivity.agents);
  const conversations = useSelector((state: RootState) => state.agentActivity.conversations);

  // Panning and zoom state
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  // Hover state (set via buttons only)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [currentEvent, setCurrentEvent] = useState("Kuro is sleeping")

  // Initialize Kuro at his house
  const [positions, setPositions] = useState<Array<string>>(aiAgents.filter((agent) => agent.isMainAgent).map((agent) => agent.location))
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [isCharacterStatsDialogOpen, setIsCharacterStatsDialogOpen] = useState(false)
  const [selectedCharacterName, setSelectedCharacterName] = useState('Kuro')
  const [selectedAgent, setSelectedAgent] = useState<{ id: number, name: string, location: string, avatar: string, color: string, isMainAgent: boolean } | null>(null)
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date(2025, 1, /*Math.floor(Math.random() * 7) + */1, 6, 0, 0))
  const [isNight, setIsNight] = useState(false)

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setScale((containerWidth / 1920) * 1.2)
      }
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const clampOffset = (newOffset: { x: number; y: number }) => {
    if (!containerRef.current) return newOffset
    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight
    const mapWidth = 1920 * scale
    const mapHeight = 1080 * scale
    const minX = containerWidth - mapWidth
    const minY = containerHeight - mapHeight
    return {
      x: Math.min(0, Math.max(newOffset.x, minX)),
      y: Math.min(0, Math.max(newOffset.y, minY))
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const newOffset = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }
    setOffset(clampOffset(newOffset))
  }
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = new Date(prevTime.getTime() + 5 * 60000)
        setIsNight(newTime.getHours() >= 20 || newTime.getHours() < 6)
        return newTime
      })
    }, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    // console.log('Updated Time:', moment(currentTime).format('YYYY-MM-DD HH:mm'));
    if ( moment(currentTime).format('YYYY-MM-DD') !== moment(currentTime).format('YYYY-MM-DD') )
      handlePlanDate(currentTime)

    if ( currentTime.getMinutes() % 15 == 0 )
        handleFetchActivity(currentTime)
  }, [currentTime])

  useEffect(() => {
    const kuroAcitivity = agents.find((agent) => agent.name == 'Kuro')

    if ( kuroAcitivity ) {
      setCurrentEvent(`Kuro ${kuroAcitivity.activity.split('>')[0]}`)
    }
    
    let newPosition: Array<string> = []
    aiAgents.forEach((agent) => {
      if ( agent.isMainAgent ) {
        const agentActivity = agents.find((item) => item.name == agent.name)
        const newLocation = locations.find((location) => location.name == agentActivity?.location[0])

        if ( newLocation ) newPosition.push(newLocation.name);
        else newPosition.push(positions[agent.id - 1])
      }
    })

    setPositions(newPosition);
  }, [agents])

  useEffect(() => {
    if ( conversations ){
      Object.values(conversations!).forEach((conversation) => {
        if ( conversation[0].length < 2 ) return ;
        if ( conversation[0][0].name == 'Kuro' ) {
          const aiAgent = getAgentWithName(conversation[0][1].name);
          if ( aiAgent ) dispatch(increaseInteract({ index: aiAgent.id, date: currentTime.toLocaleString() }))
        }
        if ( conversation[0][1].name == 'Kuro' ) {
          const aiAgent = getAgentWithName(conversation[0][0].name);
          if ( aiAgent ) dispatch(increaseInteract({ index: aiAgent.id, date: currentTime.toLocaleString() }))
        }
      })
    }
  }, [conversations])

  const handlePlanDate = async (date: Date) => {
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: moment(date).format('YYYY-MM-DD') }),
      });

      if (!response.ok) throw new Error("Failed to fetch time");

      const data = await response.json();
      console.log('success plan: ' + data.success);
    } catch (error) {
      console.error("Error fetching time:", error);
    }
  };

  const handleFetchActivity = async (date: Date) => {
    dispatch(fetchAgentActivity(date));
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location)
    setIsLocationDialogOpen(true)
  }

  const handleCharacterClick = (name: string) => {
    setSelectedCharacterName(name);
    setIsCharacterStatsDialogOpen(true)
  }
  const handleAgentClick = (agent: { id: number, name: string, location: string, avatar: string, color: string, isMainAgent: boolean }) => {
    setSelectedAgent(agent)
    setIsAgentDialogOpen(true)
  }
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-400" />
      case 'partly cloudy': return <CloudSun className="w-6 h-6 text-gray-400" />
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-400" />
      case 'light rain': return <CloudDrizzle className="w-6 h-6 text-blue-400" />
      case 'heavy rain': return <CloudRain className="w-6 h-6 text-blue-600" />
      default: return <Sun className="w-6 h-6 text-yellow-400" />
    }
  }
  const getAgentsAtLocation = (locationName: string) => {
    return aiAgents.filter(agent => agent.location === locationName && !agent.isMainAgent)
  }
  const getAgentWithName = (name: string) => {
    return aiAgents.find(agent => agent.name === name)
  }
  const getLocation = (location: string) => {
    return locations.find((item) => item.name == location)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-700 select-none"
      onMouseDownCapture={handleMouseDown}
      onMouseMoveCapture={handleMouseMove}
      onMouseUpCapture={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Fixed Base Clouds as background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/mapLayers/clouds.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 1,
          zIndex: 10
        }}
      />

      {/* Draggable map content */}
      <div
        className="absolute"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'top left',
          width: '1920px',
          height: '1080px',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          zIndex: 1
        }}
      >
        <MovingClouds />

        {/* Render panned map layers */}
        {pannedLayers.map((layer, index) => {
          const extraStyles =
            structureMapping[layer.name] === hoveredLocation
              ? { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }
              : {}
          return (
            <img
              key={layer.name}
              src={`/mapLayers/${layer.name}.png`}
              alt={layer.name}
              draggable={false}
              onDragStart={e => e.preventDefault()}
              className="transition-all duration-200"
              style={{
                position: 'absolute',
                left: `${layer.left}px`,
                top: `${layer.top}px`,
                width: `${layer.width}px`,
                height: `${layer.height}px`,
                zIndex: index + 2,
                pointerEvents: 'none',
                ...extraStyles
              }}
            />
          )
        })}

        {/* Map Location Buttons */}
        {locations.map((location) => (
          <Popover key={`location-${location.id}`}>
            <PopoverTrigger asChild>
              <Button
                onMouseEnter={() => setHoveredLocation(location.name)}
                onMouseLeave={() => setHoveredLocation(null)}
                className={`absolute w-12 h-12 rounded-full ${location.color} border-2 border-yellow-600 shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  hoveredLocation === location.name ? 'scale-105 ring-2 ring-yellow-400' : ''
                }`}
                style={{ left: `${location.x}%`, top: `${location.y}%`, zIndex: 101 }}
                aria-label={`Visit ${location.name}`}
                onClick={() => handleLocationClick(location)}
              >
                {location.icon}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <div className="p-4 bg-slate-800 rounded-t-lg">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{location.name}</h3>
                <p className="text-sm text-slate-300">{getLocationDescription(location.name)}</p>
                <Button className="w-full" onClick={() => handleLocationClick(location)}>
                  Visit Location
                </Button>
              </div>
              <div className="p-4 bg-slate-700 rounded-b-lg">
                <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Characters Here
                </h4>
                {getAgentsAtLocation(location.name).map((agent) => (
                  <Button
                    key={agent.id}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start text-left mb-1 bg-yellow-500 text-slate-900 hover:bg-yellow-600"
                    onClick={() => handleAgentClick(agent)}
                  >
                    {agent.name}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ))}

        {/* Main Avatars */}
        {aiAgents.map((agent) => (
          agent.isMainAgent && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
              style={{ left: `${getLocation(positions[agent.id - 1])!.x + 2 * Math.pow(-1, agent.id + Math.floor(agent.id / 2))}%`, top: `${getLocation(positions[agent.id - 1])!.y + 2 * Math.pow(-1, agent.id)}%`, zIndex: 102 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onMouseEnter={() => setHoveredLocation("Kuro")}
                      onMouseLeave={() => setHoveredLocation(null)}
                      variant="ghost"
                      className="w-12 h-12 rounded-full bg-black border-2 border-yellow-400 shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 p-0"
                      onClick={(e) => handleCharacterClick(agent.name)}
                      aria-label="Kuro's current location"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback className={agent.color}>
                          {agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{positions[agent.id - 1]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
        )))}
      </div>

      {/* Fixed UI Overlays (2% padding from edges) */}
      <div className="absolute" style={{ top: '2%', right: '2%', zIndex: 1100 }}>
        <div className="bg-slate-800/90 p-2 rounded-lg border border-yellow-400 shadow-lg flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather)}
            <span className="text-sm font-bold text-yellow-400">{weather}</span>
          </div>
          <div className="flex items-center space-x-2">
            {isNight ? (
              <Moon className="w-6 h-6 text-blue-200" />
            ) : (
              <Sunrise className="w-6 h-6 text-orange-400" />
            )}
            <span className="text-sm font-bold text-yellow-400">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute" style={{ top: '2%', left: '2%', zIndex: 1100 }}>
        <div className="bg-slate-800/90 p-2 rounded-lg border border-yellow-400 shadow-lg max-w-xs">
          <h3 className="text-sm font-bold text-yellow-400 mb-1">Current Event</h3>
          <p className="text-xs text-slate-300">{currentEvent}</p>
        </div>
      </div>

      <div className="absolute" style={{ bottom: '2%', left: '2%', zIndex: 1100 }}>
        <div className="bg-slate-800/90 p-2 rounded-lg border border-yellow-400 shadow-lg">
          <h3 className="text-sm font-bold text-yellow-400 mb-1">Kuro's Location</h3>
          <p className="text-xs text-slate-300">{positions[0]}</p>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              {selectedLocation?.icon}
              {selectedLocation?.name}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <DialogDescription className="text-slate-300">
                {selectedLocation && getLocationDescription(selectedLocation.name)}
              </DialogDescription>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Opening Hours
                  </h4>
                  <p className="text-sm text-slate-300">
                    {selectedLocation && getLocationHours(selectedLocation.name)}
                  </p>
                </div>
                <div className="bg-slate-700 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Location Details
                  </h4>
                  <p className="text-sm text-slate-300">
                    {selectedLocation && getLocationDetails(selectedLocation.name)}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="characters" className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                {selectedLocation && getAgentsAtLocation(selectedLocation.name).map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-4 mb-4 p-3 bg-slate-700 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback className={agent.color}>
                        {agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{agent.name}</h4>
                      <p className="text-xs text-slate-400">At {agent.location}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="ml-auto bg-yellow-500 text-slate-900 hover:bg-yellow-600"
                      onClick={() => handleAgentClick(agent)}
                    >
                      Interact
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="activities" className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                {selectedLocation && getLocationActivities(selectedLocation.name).map((activity, index) => (
                  <div key={index} className="mb-4 p-3 bg-slate-700 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">{activity.name}</h4>
                    <p className="text-xs text-slate-300">{activity.description}</p>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button onClick={() => setIsLocationDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kuro Stats Dialog */}
      <CharacterStatsDialog open={isCharacterStatsDialogOpen} onOpenChange={setIsCharacterStatsDialogOpen} name={selectedCharacterName} />

      {/* AI Agent Dialog */}
      <AIAgentDialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen} agent={selectedAgent} date={currentTime} />
      
      {/* Expandable Chat */}
      <ExpandableChat currentTime={currentTime} />
    </div>
  )
}

function getLocationDescription(locationName: string) {
  switch (locationName) {
    case "Coffee Shop":
      return "A cozy spot where Kuro can watch people and enjoy the aroma of coffee. The warm atmosphere and gentle chatter make it a perfect place for Kuro to relax and observe human behavior."
    case "Park":
      return "A lush green space with plenty of trees for Kuro to climb and explore. The park offers various exciting smells, birds to watch, and occasionally other friendly animals to interact with."
    case "Office Building":
      return "A tall building with lots of windows, perfect for Kuro to observe the busy human world. The constant movement of people and the occasional open window provide endless entertainment."
    case "Postal Office":
      return "An interesting place with various smells and packages that pique Kuro's curiosity. The constant flow of people and parcels keeps Kuro engaged and intrigued."
    case "Kuro's House":
      return "Kuro's safe haven, filled with comfortable spots for napping and playing. This is where Kuro feels most at home, with familiar scents and cozy corners to curl up in."
    case "Newspaper Stand":
      return "A small booth with fresh papers that Kuro finds irresistible to sit on. The crisp smell of new print and the occasional treat from the friendly vendor make this a favorite spot."
    case "Grocery Store":
      return "A place full of interesting smells and potential for finding dropped treats. The variety of scents from fresh produce to the deli counter keeps Kuro's senses stimulated."
    case "Fashion Store":
      return "A store with soft fabrics and many hiding spots for Kuro to explore. The changing rooms and clothing racks provide excellent places for an adventurous cat to investigate."
    default:
      return "An interesting location in Kuro's world."
  }
}

function getLocationHours(locationName: string) {
  switch (locationName) {
    case "Coffee Shop":
      return "Open daily: 6:00 AM - 10:00 PM"
    case "Park":
      return "Open 24/7"
    case "Office Building":
      return "Monday - Friday: 8:00 AM - 6:00 PM"
    case "Postal Office":
      return "Monday - Saturday: 9:00 AM - 5:00 PM"
    case "Kuro's House":
      return "Always open for Kuro!"
    case "Newspaper Stand":
      return "Daily: 5:00 AM - 7:00 PM"
    case "Grocery Store":
      return "Daily: 7:00 AM - 11:00 PM"
    case "Fashion Store":
      return "Monday - Saturday: 10:00 AM - 9:00 PM, Sunday: 11:00 AM - 6:00 PM"
    default:
      return "Hours vary"
  }
}

function getLocationDetails(locationName: string) {
  switch (locationName) {
    case "Coffee Shop":
      return "A quaint two-story building with outdoor seating and a cozy interior."
    case "Park":
      return "Sprawling green space with walking paths, a pond, and plenty of trees."
    case "Office Building":
      return "Modern high-rise in the heart of downtown with 20 floors of offices."
    case "Postal Office":
      return "Classic brick building with multiple service counters and a sorting area."
    case "Kuro's House":
      return "Charming two-bedroom home with a spacious backyard and cat-friendly features."
    case "Newspaper Stand":
      return "Compact kiosk located on a busy street corner, always buzzing with activity."
    case "Grocery Store":
      return "Large supermarket with wide aisles and a diverse selection of products."
    case "Fashion Store":
      return "Trendy boutique with large display windows and multiple changing rooms."
    default:
      return "Unique location in Kuro's world."
  }
}

function getLocationActivities(locationName: string) {
  switch (locationName) {
    case "Coffee Shop":
      return [
        { name: "People Watching", description: "Observe the diverse clientele and their interactions." },
        { name: "Nap in Sunbeam", description: "Find a cozy spot by the window for a peaceful nap." },
        { name: "Beg for Treats", description: "Try your luck with friendly customers for a tasty morsel." }
      ]
    case "Park":
      return [
        { name: "Tree Climbing", description: "Test your agility on various trees throughout the park." },
        { name: "Bird Watching", description: "Observe the local bird population from hidden vantage points." },
        { name: "Butterfly Chase", description: "Engage in a playful pursuit of colorful butterflies." }
      ]
    case "Office Building":
      return [
        { name: "Window Perching", description: "Find the perfect windowsill for a bird's eye view of the city." },
        { name: "Paper Chase", description: "Investigate loose papers and their intriguing rustling sounds." },
        { name: "Elevator Ride", description: "Sneak into the elevator for an exciting vertical adventure." }
      ]
    case "Postal Office":
      return [
        { name: "Box Inspection", description: "Examine various packages and their interesting scents." },
        { name: "Stamp Collection", description: "Hunt for fallen stamps and add them to your collection." },
        { name: "Mail Cart Ride", description: "Hitch a ride on a moving mail cart for a tour of the facility." }
      ]
    case "Kuro's House":
      return [
        { name: "Sunbathing", description: "Find the perfect sunny spot for a relaxing sunbath." },
        { name: "Toy Mouse Hunt", description: "Search for hidden toy mice throughout the house." },
        { name: "Cardboard Box Fun", description: "Explore new cardboard boxes and make them your fort." }
      ]
    case "Newspaper Stand":
      return [
        { name: "Paper Surfing", description: "Slide across freshly laid out newspapers." },
        { name: "Headline Reading", description: "Attempt to decipher the latest news headlines." },
        { name: "Magazine Tower Toppling", description: "Carefully knock over stacks of magazines." }
      ]
    case "Grocery Store":
      return [
        { name: "Produce Inspection", description: "Investigate the various scents in the produce section." },
        { name: "Box Fort Building", description: "Create a fort using empty cardboard boxes." },
        { name: "Fish Counter Stakeout", description: "Watch the activity at the fish counter with great interest." }
      ]
    case "Fashion Store":
      return [
        { name: "Clothing Rack Hide and Seek", description: "Find the perfect hiding spot among the clothes." },
        { name: "Dressing Room Mirror Play", description: "Interact with your reflection in the dressing room mirrors." },
        { name: "Mannequin Observation", description: "Study the strange, motionless humans on display." }
      ]
    default:
      return [
        { name: "Explore", description: "Discover the unique features of this location." },
        { name: "Nap", description: "Find a cozy spot for a quick nap." },
        { name: "People Watch", description: "Observe the comings and goings of visitors." }
      ]
  }
}

export default MapComponent
