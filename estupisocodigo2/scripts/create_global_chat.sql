-- Create global_messages table for public chat
CREATE TABLE IF NOT EXISTS public.global_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.global_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read messages
CREATE POLICY "Anyone can read global messages"
  ON public.global_messages
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert messages
CREATE POLICY "Anyone can insert global messages"
  ON public.global_messages
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS global_messages_created_at_idx 
  ON public.global_messages(created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_messages;
