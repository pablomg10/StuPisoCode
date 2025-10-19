"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"

const STICKERS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "🥲",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "😶‍🌫️",
  "😵",
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✍️",
  "💪",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "💔",
  "❤️‍🔥",
  "❤️‍🩹",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "🏆",
  "🥇",
  "🥈",
  "🥉",
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🎾",
  "🏐",
  "🏉",
  "🎱",
  "🍕",
  "🍔",
  "🍟",
  "🌭",
  "🍿",
  "🧂",
  "🥓",
  "🥚",
  "🍞",
  "🥐",
  "🥖",
  "🥨",
  "🥯",
  "🧇",
  "🥞",
  "🧈",
]

type StickerPickerProps = {
  onSelectSticker: (sticker: string) => void
}

export function StickerPicker({ onSelectSticker }: StickerPickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (sticker: string) => {
    onSelectSticker(sticker)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" type="button">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="grid grid-cols-8 gap-1">
          {STICKERS.map((sticker, index) => (
            <button
              key={index}
              onClick={() => handleSelect(sticker)}
              className="text-2xl hover:bg-muted rounded p-1 transition-colors"
              type="button"
            >
              {sticker}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
