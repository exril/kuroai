'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Inline custom scrollbar styling
const customScrollbarStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.4); /* ~slate-400 w/ some opacity */
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}
`

type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
}

const characterProfiles: Record<string, { pfp: string; color: string }> = {
  Kuro: { pfp: '/pfps/pfp1.png', color: 'bg-pink-500' },
  Theo: { pfp: '/pfps/pfp2.png', color: 'bg-purple-500' },
  Milo: { pfp: '/pfps/pfp3.png', color: 'bg-green-500' },
  Klaus: { pfp: '/pfps/pfp4.png', color: 'bg-blue-500' },
  Ava: { pfp: '/pfps/pfp5.png', color: 'bg-lime-500' },
  Alice: { pfp: '/pfps/pfp6.png', color: 'bg-amber-500' },
  Ivy: { pfp: '/pfps/pfp7.png', color: 'bg-yellow-500' },
  System: { pfp: '', color: 'bg-slate-500' },
}

// Example characters (besides System, Kuro)
const randomCharacters = Object.keys(characterProfiles).filter(
  (name) => name !== 'System' && name !== 'Kuro'
)

export default function ExpandableChat() {
  const conversations = useSelector((state: RootState) => state.agentActivity.conversations);
  const time = useSelector((state: RootState) => state.agentActivity.time);

  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Helper: add a new message with a truly unique ID
  const addMessage = (sender: string, content: string, time: string) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    setMessages((prev) => [
      ...prev,
      {
        id: uniqueId,
        sender,
        content,
        timestamp: time,
      },
    ].slice(-10))
  }

  // Simulate incoming messages
  useEffect(() => {
    addMessage('System', "Welcome to Kuro's World Chat Logs!", "6:00")
  }, [])

  // Add messages
  useEffect(() => {
    if ( conversations && Object.values(conversations).length > 0 ) {
      Object.values(conversations).forEach((conversation) => {
        conversation.forEach((chats: Array<{name: string, text: string, reaction: string}>) => {
          chats.forEach((chat) => {
            if ( chat.text ) addMessage(chat.name, chat.text, time)
          })
        })
      });
    }
  }, [conversations])

  // Auto-scroll if expanded
  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isExpanded])

  // Last message for collapsed preview
  const lastMsg = messages[messages.length - 1]

  // Container animate only height (width fixed at 400px)
  const containerVariants = {
    collapsed: { height: 60, width: 400, transition: { duration: 0.3 } },
    expanded: { height: 600, width: 400, transition: { duration: 0.3 } },
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1200] select-none max-w-[400px] w-full">
      {/* Custom scrollbar CSS */}
      <style jsx global>{customScrollbarStyles}</style>

      <motion.div
        className="rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400"
        variants={containerVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
      >
        {isExpanded ? (
          // Expanded chat
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-yellow-400/30">
              <h3 className="text-sm font-bold text-yellow-400">World Chat Logs</h3>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(false)
                }}
                className="text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-5 h-5 transform" />
              </Button>
            </div>

            {/* Message list with stylized scrollbar */}
            <div className="flex-grow bg-slate-900 custom-scrollbar overflow-y-auto" ref={scrollRef}>
              <div className="p-3 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'Kuro' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar for every user, including Kuro */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={characterProfiles[msg.sender]?.pfp} alt={msg.sender} />
                        <AvatarFallback className={characterProfiles[msg.sender]?.color}>
                          {msg.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Bubble with timestamp inside at bottom right */}
                      <div className={`relative w-[80%] px-3 py-3 pb-3 pr-10 rounded-2xl break-words transition-all hover:brightness-110 ${
                        msg.sender === 'Kuro'
                          ? 'bg-yellow-500 text-slate-900'
                          : msg.sender === 'System'
                          ? 'bg-slate-600 text-slate-100'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                      >
                        <p className="font-bold text-xs mb-1">{msg.sender}</p>
                        <p className="text-sm leading-snug">{msg.content}</p>
                        {/* Timestamp inside bubble at bottom right */}
                        <span className="absolute bottom-1 right-2 text-[0.7rem] text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Collapsed preview bar
          <div
            className="flex items-center px-4 py-2 cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={lastMsg ? characterProfiles[lastMsg.sender]?.pfp : ''}
                alt={lastMsg?.sender || 'System'}
              />
              <AvatarFallback className={lastMsg ? characterProfiles[lastMsg.sender]?.color : 'bg-slate-500'}>
                {lastMsg ? lastMsg.sender.charAt(0) : 'S'}
              </AvatarFallback>
            </Avatar>

            <div className="ml-4 flex flex-col flex-grow">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-yellow-400">
                  {lastMsg ? lastMsg.sender : 'System'}
                </span>
                <span className="text-xs text-slate-400">
                  {lastMsg ? lastMsg.timestamp : ''}
                </span>
              </div>
              {/* Truncated preview text */}
              <div className="text-sm text-slate-100 truncate max-w-[250px]">
                {lastMsg ? lastMsg.content : 'No messages yet.'}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
