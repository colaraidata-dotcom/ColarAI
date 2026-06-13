'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle2, BarChart3, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockNotifications, mockAccessRequests } from '@guardian/shared/mock';
import type { AppNotification } from '@guardian/shared';

const TYPE_CONFIG: Record<AppNotification['type'], { icon: typeof Bell; color: string; label: string }> = {
  access_request: { icon: Bell, color: '#F59E0B', label: 'Access Request' },
  weekly_report: { icon: BarChart3, color: '#0EA5E9', label: 'Weekly Report' },
  device_added: { icon: Smartphone, color: '#22C55E', label: 'Device Added' },
  limit_reached: { icon: CheckCircle2, color: '#22D3EE', label: 'Limit Reached' },
  tamper_attempt: { icon: AlertTriangle, color: '#EF4444', label: 'Tamper Attempt' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function toAppNotification(n: Record<string, unknown>): AppNotification {
  return {
    id: n.id as string,
    type: n.type as AppNotification['type'],
    title: n.title as string,
    body: n.body as string,
    read: (n.is_read ?? n.read) as boolean,
    createdAt: (n.created_at ?? n.createdAt) as string,
    accessRequestId: n.related_id as string | undefined,
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [accessRequests, setAccessRequests] = useState(mockAccessRequests);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data.map((n) => toAppNotification(n as Record<string, unknown>)));
        } else {
          setNotifications(mockNotifications);
        }
      })
      .catch(() => setNotifications(mockNotifications))
      .finally(() => setLoaded(true));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch('/api/notifications/mark-read', { method: 'POST' }).catch(() => {});
  }

  function handleRequest(id: string, action: 'approved' | 'rejected') {
    setAccessRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    setNotifications((prev) =>
      prev.map((n) => (n.accessRequestId === id ? { ...n, read: true } : n))
    );
    fetch('/api/access-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: action === 'approved' ? 'approved' : 'denied' }),
    }).catch(() => {});
  }

  const pendingRequests = accessRequests.filter((r) => r.status === 'pending');

  if (!loaded) {
    return (
      <div className="p-8">
        <div className="h-8 w-40 rounded-lg bg-[#1A1A2E] animate-pulse mb-2" />
        <div className="h-4 w-24 rounded bg-[#1A1A2E] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Notifications</h1>
          <p className="text-[#94A3B8] text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Pending access requests */}
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-[#F1F5F9] mb-3">Pending Access Requests</h2>
          <div className="flex flex-col gap-3">
            {pendingRequests.map((req) => (
              <Card key={req.id} className="flex items-center justify-between gap-4 border-[#F59E0B]/20 bg-[#F59E0B]/5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-lg shrink-0">
                    {req.profileEmoji}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F1F5F9]">
                      {req.profileName} — <span className="font-mono">{req.siteName}</span>
                    </p>
                    {req.note && <p className="text-xs text-[#94A3B8] mt-0.5">&ldquo;{req.note}&rdquo;</p>}
                    <p className="text-xs text-[#64748B] mt-0.5">{timeAgo(req.requestedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="danger" size="sm" onClick={() => handleRequest(req.id, 'rejected')}>
                    Deny
                  </Button>
                  <Button size="sm" onClick={() => handleRequest(req.id, 'approved')}>
                    Approve
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All notifications */}
      <section>
        <h2 className="text-base font-semibold text-[#F1F5F9] mb-3">All Notifications</h2>
        {notifications.length === 0 ? (
          <Card className="py-12 text-center text-sm text-[#64748B]">No notifications yet.</Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#1A1A2E]">
              {notifications.map((notif) => {
                const cfg = TYPE_CONFIG[notif.type];
                const Icon = cfg?.icon ?? Bell;
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                      !notif.read ? 'bg-[#111120]' : ''
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: (cfg?.color ?? '#94A3B8') + '20' }}
                    >
                      <Icon className="h-4 w-4" style={{ color: cfg?.color ?? '#94A3B8' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-medium ${!notif.read ? 'text-[#F1F5F9]' : 'text-[#CBD5E1]'}`}>
                          {notif.title}
                        </p>
                        {cfg && <Badge variant="muted" className="text-xs">{cfg.label}</Badge>}
                      </div>
                      <p className="text-xs text-[#94A3B8]">{notif.body}</p>
                      <p className="text-xs text-[#475569] mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                    {!notif.read && (
                      <div className="h-2 w-2 rounded-full bg-[#0EA5E9] mt-2 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
