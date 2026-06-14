import { Langfuse } from 'langfuse';
import fs from 'fs';
import path from 'path';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_HOST ?? 'https://us.cloud.langfuse.com',
});

interface AgentLogEntry {
  timestamp: string;
  agent: string;
  task: string;
  files_touched: string[];
  status: 'completed' | 'in_progress' | 'blocked';
  token_estimate: number;
  duration_seconds: number;
  notes?: string;
}

async function syncAgentLogs(date: string) {
  const logDir = path.join('agent-logs', date);

  if (!fs.existsSync(logDir)) {
    console.log(`No logs found for ${date}`);
    return;
  }

  const files = fs.readdirSync(logDir).filter((f) => f.endsWith('.jsonl'));

  for (const file of files) {
    const filePath = path.join(logDir, file);
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

    for (const line of lines) {
      const entry: AgentLogEntry = JSON.parse(line);

      const trace = langfuse.trace({
        name: entry.task,
        userId: entry.agent,
        timestamp: new Date(entry.timestamp),
        metadata: {
          agent: entry.agent,
          files_touched: entry.files_touched,
          status: entry.status,
          duration_seconds: entry.duration_seconds,
          token_estimate: entry.token_estimate,
        },
      });

      await trace.update({ output: entry.notes ?? '' });
    }
  }

  await langfuse.flushAsync();
  console.log(`Synced logs for ${date}`);
}

const date = process.argv[2] ?? new Date().toISOString().split('T')[0];
syncAgentLogs(date).catch(console.error);
