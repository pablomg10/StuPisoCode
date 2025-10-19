"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Search, ArrowLeft, User, ImageIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SiteLogo from "@/components/site-logo"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { TypingIndicator } from "@/components/typing-indicator"
import { MessageOptionsMenu } from "@/components/message-options-menu"
import { StickerPicker } from "@/components/sticker-picker"
import dynamic from "next/dynamic"

const ChatIA = dynamic(() => import("@/components/chat-ia"), { ssr: false })
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Profile = {
  id: string
  nombre: string
  email: string
  foto_perfil?: string
  carrera?: string
}

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  contenido: string
  tipo: "text" | "image" | "sticker"
  deleted_by: string[]
  leido: boolean
  created_at: string
}

type Conversation = {
  user: Profile
  lastMessage?: Message
  unreadCount: number
}

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const typingChannelRef = useRef<any>(null)
  const messageChannelRef = useRef<any>(null)
  const supabase = createClient()
  const router = useRouter()
  const [showDeleteChatDialog, setShowDeleteChatDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<'messages'|'ia'>('messages')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadConversations()
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser && selectedUser) {
      setIsOtherUserTyping(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      loadMessages()
      subscribeToMessages()
      subscribeToTyping()
    }

    return () => {
      if (typingChannelRef.current) {
        console.log("[v0] Cleaning up typing channel")
        supabase.removeChannel(typingChannelRef.current)
        typingChannelRef.current = null
      }
      if (messageChannelRef.current) {
        console.log("[v0] Cleaning up message channel")
        supabase.removeChannel(messageChannelRef.current)
        messageChannelRef.current = null
      }
    }
  }, [currentUser, selectedUser])

  useEffect(() => {
    if (isSearchFocused || searchQuery.trim()) {
      searchUsers()
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery, isSearchFocused, currentUser])

  const loadCurrentUser = async () => {
    try {
      console.log("[v0] Loading current user...")
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log("[v0] Auth user:", user ? "Found" : "Not found")

      if (!user) {
        console.log("[v0] No authenticated user, redirecting to login")
        toast.error("Debes iniciar sesión para usar el chat")
        router.push("/login")
        return
      }

      console.log("[v0] Fetching profile for user:", user.id)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("[v0] Error fetching profile:", profileError)
        if (profileError.code === "PGRST116") {
          console.log("[v0] Profile not found, creating basic profile...")
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              nombre: user.user_metadata?.nombre || user.email?.split("@")[0] || "Usuario",
              email: user.email || "",
            })
            .select()
            .single()

          if (createError) {
            console.error("[v0] Error creating profile:", createError)
            toast.error("Error al cargar tu perfil. Por favor, completa tu perfil primero.")
            router.push("/perfil")
            return
          }

          if (newProfile) {
            setCurrentUser(newProfile)
            toast.success("¡Bienvenido al chat!")
          }
        } else {
          toast.error("Error al cargar tu perfil")
        }
        return
      }

      if (profile) {
        console.log("[v0] Profile loaded successfully:", profile.nombre)
        setCurrentUser(profile)
      } else {
        console.log("[v0] No profile found, redirecting to complete profile")
        toast.error("Por favor, completa tu perfil primero")
        router.push("/perfil")
      }
    } catch (error) {
      console.error("[v0] Error loading user:", error)
      toast.error("Error al cargar tu información")
    } finally {
      setLoading(false)
    }
  }

  const loadConversations = async () => {
    if (!currentUser) return

    try {
      console.log("[v0] Loading conversations for user:", currentUser.id)

      const { data: allMessages } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false })

      if (!allMessages) return

      console.log("[v0] Total messages fetched:", allMessages.length)

      const visibleMessages = allMessages.filter((msg) => !msg.deleted_by || !msg.deleted_by.includes(currentUser.id))

      console.log("[v0] Visible messages after filtering deleted:", visibleMessages.length)

      const userIds = new Set<string>()
      visibleMessages.forEach((msg) => {
        const otherId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id
        userIds.add(otherId)
      })

      const { data: profiles } = await supabase.from("profiles").select("*").in("id", Array.from(userIds))

      if (!profiles) return

      const convos: Conversation[] = profiles.map((profile) => {
        const userMessages = visibleMessages.filter(
          (msg) =>
            (msg.sender_id === profile.id && msg.receiver_id === currentUser.id) ||
            (msg.sender_id === currentUser.id && msg.receiver_id === profile.id),
        )

        const lastMessage = userMessages[0]

        console.log(
          "[v0] Conversation with",
          profile.nombre,
          "- Last message:",
          lastMessage
            ? `"${lastMessage.contenido?.substring(0, 30)}..." from ${lastMessage.sender_id === currentUser.id ? "me" : "them"}`
            : "none",
        )

        const unreadCount = userMessages.filter(
          (msg) => msg.receiver_id === currentUser.id && msg.sender_id === profile.id && !msg.leido,
        ).length

        return {
          user: profile,
          lastMessage,
          unreadCount,
        }
      })

      convos.sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.created_at).getTime() : 0
        const timeB = b.lastMessage ? new Date(b.lastMessage.created_at).getTime() : 0
        return timeB - timeA
      })

      console.log("[v0] Loaded", convos.length, "conversations")
      setConversations(convos)
    } catch (error) {
      console.error("[v0] Error loading conversations:", error)
    }
  }

  const loadMessages = async () => {
    if (!currentUser || !selectedUser) return

    try {
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`,
        )
        .order("created_at", { ascending: true })

      if (data) {
        setMessages(data)
        markMessagesAsRead()
      }
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
    }
  }

  const markMessagesAsRead = async () => {
    if (!currentUser || !selectedUser) return

    try {
      await supabase
        .from("direct_messages")
        .update({ leido: true })
        .eq("sender_id", selectedUser.id)
        .eq("receiver_id", currentUser.id)
        .eq("leido", false)
    } catch (error) {
      console.error("[v0] Error marking messages as read:", error)
    }
  }

  const subscribeToMessages = () => {
    if (!currentUser || !selectedUser) return

    console.log("========================================")
    console.log("[v0] Setting up message subscription for conversation with", selectedUser.nombre)
    console.log("[v0] Current user ID:", currentUser.id)
    console.log("[v0] Selected user ID:", selectedUser.id)

    if (messageChannelRef.current) {
      console.log("[v0] Removing existing message channel")
      supabase.removeChannel(messageChannelRef.current)
    }

    const channelName = `messages:${[currentUser.id, selectedUser.id].sort().join(":")}`
    console.log("[v0] 🔔 SUBSCRIBING TO CHANNEL:", channelName)
    console.log("[v0] This device will now listen for INSERT, UPDATE, and DELETE events")

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to ALL events to debug
          schema: "public",
          table: "direct_messages",
        },
        (payload) => {
          console.log("========================================")
          console.log("[v0] 🔥 REALTIME EVENT RECEIVED 🔥")
          console.log("[v0] Event type:", payload.eventType)
          console.log("[v0] Payload:", payload)
          console.log("========================================")

          if (payload.eventType === "INSERT") {
            const newMsg = payload.new as Message

            const isRelevant =
              (newMsg.sender_id === currentUser.id && newMsg.receiver_id === selectedUser.id) ||
              (newMsg.sender_id === selectedUser.id && newMsg.receiver_id === currentUser.id)

            console.log("[v0] INSERT - Message relevance:", isRelevant)

            if (isRelevant) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) {
                  return prev
                }
                return [...prev, newMsg]
              })

              if (newMsg.sender_id === selectedUser.id && newMsg.receiver_id === currentUser.id) {
                markMessagesAsRead()
              }

              setTimeout(() => loadConversations(), 200)
            }
          } else if (payload.eventType === "DELETE") {
            console.log("[v0] 🗑️ DELETE EVENT DETECTED 🗑️")
            const deletedId = payload.old.id
            console.log("[v0] DELETE event received - payload.old:", payload.old)

            setMessages((prev) => {
              const messageExists = prev.some((m) => m.id === deletedId)
              console.log(
                "[v0] DELETE relevance:",
                messageExists
                  ? "true - message found in current conversation"
                  : "false - message not in current conversation",
              )

              if (messageExists) {
                console.log("[v0] ✅ Removing message from view")
                const filtered = prev.filter((m) => m.id !== deletedId)
                console.log("[v0] Messages count before:", prev.length, "after:", filtered.length)

                // Reload conversations to update preview
                setTimeout(() => {
                  console.log("[v0] Reloading conversations after DELETE")
                  loadConversations()
                }, 200)

                return filtered
              } else {
                console.log("[v0] ❌ Message not in current conversation, ignoring")
                return prev
              }
            })
          } else if (payload.eventType === "UPDATE") {
            console.log("[v0] UPDATE event received:", payload)
            const updatedMsg = payload.new as Message

            const isRelevant =
              (updatedMsg.sender_id === currentUser.id && updatedMsg.receiver_id === selectedUser.id) ||
              (updatedMsg.sender_id === selectedUser.id && updatedMsg.receiver_id === currentUser.id)

            console.log("[v0] Reloading conversations after UPDATE")
            if (isRelevant) {
              if (updatedMsg.deleted_by?.includes(currentUser.id)) {
                setMessages((prev) => prev.filter((m) => m.id !== updatedMsg.id))
              }

              setTimeout(() => loadConversations(), 200)
            }
          }
        },
      )
      .subscribe((status, err) => {
        console.log("========================================")
        console.log("[v0] 📡 SUBSCRIPTION STATUS CHANGED 📡")
        console.log("[v0] Channel:", channelName)
        console.log("[v0] Status:", status)
        if (err) {
          console.error("[v0] ❌ Subscription error:", err)
        }
        if (status === "SUBSCRIBED") {
          console.log("[v0] ✅ SUCCESSFULLY SUBSCRIBED TO REALTIME EVENTS")
          console.log("[v0] This device is now listening for all database changes")
        } else if (status === "CHANNEL_ERROR") {
          console.error("[v0] ❌ CHANNEL ERROR - Realtime not working!")
        } else if (status === "TIMED_OUT") {
          console.error("[v0] ❌ SUBSCRIPTION TIMED OUT")
        }
        console.log("========================================")
      })

    messageChannelRef.current = channel
    console.log("[v0] Message channel reference saved")
    console.log("========================================")
  }

  const subscribeToTyping = () => {
    if (!currentUser || !selectedUser) return

    const channelName = `typing:${[currentUser.id, selectedUser.id].sort().join(":")}`

    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.userId === selectedUser.id) {
          setIsOtherUserTyping(payload.payload.isTyping)

          if (payload.payload.isTyping) {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => {
              setIsOtherUserTyping(false)
            }, 3000)
          } else {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
          }
        }
      })
      .subscribe()

    typingChannelRef.current = channel
  }

  const broadcastTyping = (isTyping: boolean) => {
    if (!currentUser || !selectedUser || !typingChannelRef.current) {
      return
    }

    typingChannelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUser.id, isTyping },
    })
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    broadcastTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      broadcastTyping(false)
    }, 2000)
  }

  const searchUsers = async () => {
    if (!currentUser) return

    setIsSearching(true)
    try {
      let query = supabase.from("profiles").select("*").neq("id", currentUser.id).limit(50)

      if (searchQuery.trim()) {
        query = query.ilike("nombre", `%${searchQuery}%`)
      }

      const { data } = await query

      if (data) {
        setSearchResults(data)
      }
    } catch (error) {
      console.error("[v0] Error searching users:", error)
    }
  }

  const sendMessage = async (content: string, type: "text" | "image" | "sticker" = "text") => {
    if (!content.trim() || !currentUser || !selectedUser) return

    broadcastTyping(false)

    try {
      const { data, error } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          contenido: content.trim(),
          tipo: type,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error sending message:", error)
        throw error
      }

      if (data) {
        console.log("[v0] Message sent successfully:", data.id)
        setNewMessage("")

        setTimeout(() => loadConversations(), 400)
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      toast.error("Error al enviar el mensaje")
    }
  }

  const handleSendTextMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, "text")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 5MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      sendMessage(base64, "image")
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleStickerSelect = (sticker: string) => {
    sendMessage(sticker, "sticker")
  }

  const deleteMessageForMe = async (messageId: string) => {
    if (!currentUser) return

    try {
      console.log("[v0] Deleting message for me:", messageId)
      const message = messages.find((m) => m.id === messageId)
      if (!message) {
        console.log("[v0] Message not found")
        return
      }

      const updatedDeletedBy = Array.isArray(message.deleted_by)
        ? [...message.deleted_by, currentUser.id]
        : [currentUser.id]

      console.log("[v0] Updating deleted_by to:", updatedDeletedBy)

      const { error } = await supabase
        .from("direct_messages")
        .update({ deleted_by: updatedDeletedBy })
        .eq("id", messageId)

      if (error) {
        console.error("[v0] Error updating message:", error)
        throw error
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageId))
      loadConversations()
      toast.success("Mensaje eliminado")
    } catch (error) {
      console.error("[v0] Error deleting message:", error)
      toast.error("Error al eliminar el mensaje")
    }
  }

  const deleteMessageForEveryone = async (messageId: string) => {
    if (!currentUser) return

    try {
      const message = messages.find((m) => m.id === messageId)
      if (!message || message.sender_id !== currentUser.id) {
        toast.error("Solo puedes anular el envío de tus propios mensajes")
        return
      }

      const { error } = await supabase
        .from("direct_messages")
        .delete()
        .eq("id", messageId)
        .eq("sender_id", currentUser.id)

      if (error) {
        console.error("[v0] Error deleting message:", error)
        throw error
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageId))
      loadConversations()
      toast.success("Mensaje eliminado para todos")
    } catch (error) {
      console.error("[v0] Error deleting message:", error)
      toast.error("Error al eliminar el mensaje")
    }
  }

  const deleteEntireChat = async () => {
    if (!currentUser || !selectedUser) return

    try {
      const { error } = await supabase
        .from("direct_messages")
        .delete()
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`,
        )

      if (error) {
        console.error("[v0] Error deleting chat:", error)
        throw error
      }

      setMessages([])
      setSelectedUser(null)
      loadConversations()
      toast.success("Chat eliminado")
    } catch (error) {
      console.error("[v0] Error deleting chat:", error)
      toast.error("Error al eliminar el chat")
    }
  }

  const selectUser = (user: Profile) => {
    setSelectedUser(user)
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
    setIsSearchFocused(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando tu perfil...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="border-b bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Link href="/">
                <SiteLogo />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.foto_perfil || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.nombre[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">{currentUser.nombre}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <Card className="md:col-span-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex-shrink-0">
              <h2 className="text-xl font-serif mb-3">Mensajes</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Buscar usuarios..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(isSearching && searchResults.length > 0) || (isSearchFocused && searchResults.length > 0) ? (
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-2 mb-2">
                    {searchQuery.trim() ? "Resultados de búsqueda" : "Todos los usuarios"}
                  </p>
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="w-full p-3 hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.foto_perfil || "/placeholder.svg"} />
                          <AvatarFallback>{user.nombre[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.nombre}</p>
                          {user.carrera && <p className="text-xs text-muted-foreground truncate">{user.carrera}</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <User className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No tienes conversaciones aún</p>
                  <p className="text-xs text-muted-foreground mt-1">Busca usuarios para empezar a chatear</p>
                </div>
              ) : (
                <div className="p-2">
                  {conversations.map((convo) => (
                    <button
                      key={convo.user.id}
                      onClick={() => selectUser(convo.user)}
                      className={`w-full p-3 rounded-lg transition-colors text-left ${
                        selectedUser?.id === convo.user.id ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={convo.user.foto_perfil || "/placeholder.svg"} />
                          <AvatarFallback>{convo.user.nombre[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium truncate">{convo.user.nombre}</p>
                            {convo.unreadCount > 0 && (
                              <Badge variant="default" className="ml-2 flex-shrink-0">
                                {convo.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {convo.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {convo.lastMessage.tipo === "image"
                                ? "📷 Imagen"
                                : convo.lastMessage.tipo === "sticker"
                                  ? "🎨 Sticker"
                                  : convo.lastMessage.contenido}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="md:col-span-2 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('messages')} className={`px-3 py-1 rounded ${activeTab==='messages' ? 'bg-muted' : 'hover:bg-muted/50'}`}>Mensajes</button>
                <button onClick={() => setActiveTab('ia')} className={`px-3 py-1 rounded ${activeTab==='ia' ? 'bg-muted' : 'hover:bg-muted/50'}`}>Asesor IA</button>
              </div>
            </div>

            {activeTab === 'messages' ? (
              selectedUser ? (
                <>
                  <div className="p-4 border-b flex items-center gap-3 flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={selectedUser.foto_perfil || "/placeholder.svg"} />
                      <AvatarFallback>{selectedUser.nombre[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{selectedUser.nombre}</p>
                      {isOtherUserTyping ? (
                        <p className="text-xs text-primary">Escribiendo...</p>
                      ) : (
                        selectedUser.carrera && <p className="text-xs text-muted-foreground">{selectedUser.carrera}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowDeleteChatDialog(true)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p className="text-sm">No hay mensajes aún. ¡Envía el primero!</p>
                      </div>
                    ) : (
                      <>
                        {messages
                          .filter((m) => !m.deleted_by?.includes(currentUser.id))
                          .map((message) => {
                            const isOwn = message.sender_id === currentUser.id
                            return (
                              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
                                <div className="max-w-xs lg:max-w-md flex items-start gap-2">
                                  {isOwn && (
                                    <MessageOptionsMenu
                                      onDeleteForMe={() => deleteMessageForMe(message.id)}
                                      onDeleteForEveryone={() => deleteMessageForEveryone(message.id)}
                                      isOwnMessage={isOwn}
                                    />
                                  )}
                                  <div>
                                    <div
                                      className={`px-4 py-2 rounded-lg ${
                                        isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                                      }`}
                                    >
                                      {message.tipo === "text" && (
                                        <p className="text-sm break-words">{message.contenido}</p>
                                      )}
                                      {message.tipo === "image" && (
                                        <Image
                                          src={message.contenido || "/placeholder.svg"}
                                          alt="Imagen enviada"
                                          width={300}
                                          height={300}
                                          className="rounded max-w-full h-auto"
                                        />
                                      )}
                                      {message.tipo === "sticker" && <p className="text-5xl">{message.contenido}</p>}
                                      <p
                                        className={`text-xs mt-1 ${
                                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                                        }`}
                                      >
                                        {new Date(message.created_at).toLocaleTimeString("es-ES", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  {!isOwn && (
                                    <MessageOptionsMenu
                                      onDeleteForMe={() => deleteMessageForMe(message.id)}
                                      isOwnMessage={isOwn}
                                    />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        {isOtherUserTyping && (
                          <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md">
                              <div className="px-4 py-3 rounded-lg bg-muted">
                                <TypingIndicator />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  <div className="border-t p-4 flex-shrink-0">
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button variant="ghost" size="icon" type="button" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <StickerPicker onSelectSticker={handleStickerSelect} />
                      <Input
                        value={newMessage}
                        onChange={handleMessageChange}
                        placeholder="Escribe un mensaje..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendTextMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendTextMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <div>
                    <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">Selecciona una conversación</p>
                    <p className="text-sm text-muted-foreground mt-1">Elige un usuario de la lista o busca uno nuevo</p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col p-4 h-full overflow-hidden">
                <ChatIA />
              </div>
            )}
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteChatDialog} onOpenChange={setShowDeleteChatDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos los mensajes de esta conversación. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEntireChat} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
