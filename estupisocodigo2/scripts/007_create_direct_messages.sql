-- Create direct messages table for chat between users
-- This allows any authenticated user to message any other user

CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_receiver ON direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created ON direct_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation ON direct_messages(sender_id, receiver_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages to anyone
CREATE POLICY "Users can send messages"
  ON direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update read status of messages sent to them
CREATE POLICY "Users can mark messages as read"
  ON direct_messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Enable realtime for direct_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;
