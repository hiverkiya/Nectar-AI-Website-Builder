import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { nectarAgentFunction } from '@/inngest/functions';
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    nectarAgentFunction, // <-- This is where you'll always add all your functions
  ],
});
