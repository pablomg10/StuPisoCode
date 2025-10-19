-- Add support for images, stickers, and soft deletes in direct messages

-- Add new columns to direct_messages table
ALTER TABLE direct_messages 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'text' CHECK (tipo IN ('text', 'image', 'sticker')),
ADD COLUMN IF NOT EXISTS deleted_by UUID[] DEFAULT '{}';

-- Add index for deleted messages
CREATE INDEX IF NOT EXISTS idx_direct_messages_deleted ON direct_messages USING GIN (deleted_by);

-- Add policy for deleting messages (soft delete by adding user to deleted_by array)
CREATE POLICY "Users can soft delete their messages"
  ON direct_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
