export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></span>
      </div>
    </div>
  )
}
