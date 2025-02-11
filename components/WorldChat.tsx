'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

const characters = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan']

export default function WorldChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const addMessage = (sender: string, content: string) => {
    const newMsg: Message = {
      id: Date.now(),
      sender,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, newMsg])
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      addMessage('Kuro', newMessage.trim())
      setNewMessage('')
    }
  }

  useEffect(() => {
    // Initial messages
    addMessage('System', 'Welcome to Kuro\'s World Chat!')
    addMessage('Alice', 'Hey Kuro, how are you doing today?')
    addMessage('Kuro', 'Meow! I\'m doing great, thanks for asking!')

    // Simulate periodic messages
    const interval = setInterval(() => {
      const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
      addMessage(randomCharacter, `Hey Kuro! What's new in your adventure?`)
    }, 15000) // Add new message every 15 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-[400px] flex flex-col">
      <ScrollArea className="flex-grow mb-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === 'Kuro' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
              message.sender === 'Kuro' ? 'bg-blue-500 text-white' : 'bg-slate-700'
            }`}>
              <p className="font-bold text-xs mb-1">{message.sender}</p>
              <p className="text-sm">{message.content}</p>
            </div>
            <p className="text-xs text-slate-400 mt-1">{message.timestamp}</p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}

