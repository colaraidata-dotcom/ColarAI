'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Requests browser notification permission and listens for new DB notifications via Supabase Realtime.
// Drop this component into the dashboard layout to get push-style alerts even without a service worker.
export function NotificationListener({ userId }: { userId: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Request permission on first render (fires once, no-op if already granted/denied)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `account_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as { title: string; body: string; type: string };
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(row.title, {
              body: row.body,
              icon: '/icon-192.png',
              tag: row.type,
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return null;
}
