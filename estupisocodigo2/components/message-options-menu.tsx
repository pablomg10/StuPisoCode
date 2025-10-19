"use client"

import { MoreVertical, Trash2, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type MessageOptionsMenuProps = {
  onDeleteForMe: () => void
  onDeleteForEveryone?: () => void
  isOwnMessage: boolean
}

export function MessageOptionsMenu({ onDeleteForMe, onDeleteForEveryone, isOwnMessage }: MessageOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card">
        <DropdownMenuItem
          onClick={onDeleteForMe}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar para mí
        </DropdownMenuItem>
        {isOwnMessage && onDeleteForEveryone && (
          <DropdownMenuItem
            onClick={onDeleteForEveryone}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <UserX className="h-4 w-4 mr-2" />
            Anular envío
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
