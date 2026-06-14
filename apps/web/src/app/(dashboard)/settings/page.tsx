'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, CreditCard, Bell, Smartphone, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockDevices } from '@guardian/shared/mock';
import { SUBSCRIPTION_TIERS } from '@guardian/shared/constants';
import { createClient } from '@/lib/supabase/client';

const NOTIFICATION_PREFS = [
  { id: 'access_requests', label: 'Access requests', desc: 'When your child requests access to a blocked site' },
  { id: 'weekly_reports', label: 'Weekly reports', desc: 'Every Monday via email' },
  { id: 'limit_alerts', label: 'Limit alerts', desc: 'When approaching daily usage limit' },
  { id: 'tamper_attempts', label: 'Tamper attempts', desc: 'When someone tries to disable Guardian' },
] as const;

type PrefId = typeof NOTIFICATION_PREFS[number]['id'];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative h-5 w-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 focus:ring-offset-white ${
        enabled ? 'bg-[#0EA5E9]' : 'bg-[#CBD5E1]'
      }`}
    >
      <div
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');
  const [notifPrefs, setNotifPrefs] = useState<Record<PrefId, boolean>>({
    access_requests: true,
    weekly_reports: true,
    limit_alerts: true,
    tamper_attempts: true,
  });
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgraded') === '1';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserEmail(user.email ?? '');
      setUserName(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User');
      setMemberSince(new Date(user.created_at).toLocaleDateString('en-US'));
    });
  }, []);

  const tier = SUBSCRIPTION_TIERS['free'];
  const nextTier = SUBSCRIPTION_TIERS['basic'];

  function togglePref(id: PrefId) {
    setNotifPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleUpgrade(plan: 'basic' | 'family') {
    startTransition(async () => {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    });
  }

  function handleManageBilling() {
    startTransition(async () => {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    });
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Settings</h1>
        <p className="text-[#64748B] text-sm mt-0.5">Account and subscription settings</p>
      </div>

      {upgraded && (
        <div className="flex items-center gap-3 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-[#22C55E] shrink-0" />
          <p className="text-sm font-medium text-[#15803D]">Subscription upgraded successfully. Welcome to the plan!</p>
        </div>
      )}

      {/* Account info */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-[#0EA5E9]" />
          <h2 className="text-base font-semibold text-[#0F172A]">Account Information</h2>
        </div>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-[#0F172A]">{userName || '—'}</p>
              <p className="text-sm text-[#64748B]">{userEmail || '—'}</p>
              {memberSince && (
                <p className="text-xs text-[#94A3B8] mt-0.5">Member since {memberSince}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-[#DBEAFE]">
            <Button variant="secondary" size="sm">Change Email</Button>
            <Button variant="ghost" size="sm">Change Password</Button>
          </div>
        </Card>
      </section>

      {/* Subscription */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-[#22C55E]" />
          <h2 className="text-base font-semibold text-[#0F172A]">Subscription</h2>
        </div>
        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#0F172A]">{tier.label} Plan</p>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-[#64748B] mt-1">
                {tier.price === 0 ? 'Free forever' : `$${(tier.price / 100).toFixed(2)}/mo`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleUpgrade('basic')} disabled={isPending}>
                Upgrade to {nextTier.label}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleManageBilling} disabled={isPending}>
                Manage Billing
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#DBEAFE]">
            <div>
              <p className="text-xs text-[#64748B]">Profile Limit</p>
              <p className="text-sm font-medium text-[#0F172A] mt-0.5">
                — / {tier.profileLimit} profiles
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Device Limit</p>
              <p className="text-sm font-medium text-[#0F172A] mt-0.5">
                — / {tier.deviceLimit} devices
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Notification preferences */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-[#F59E0B]" />
          <h2 className="text-base font-semibold text-[#0F172A]">Notification Preferences</h2>
        </div>
        <Card className="flex flex-col gap-0 p-0 overflow-hidden">
          {NOTIFICATION_PREFS.map((pref, i) => (
            <div
              key={pref.id}
              className={`flex items-center justify-between px-5 py-3.5 ${
                i < NOTIFICATION_PREFS.length - 1 ? 'border-b border-[#DBEAFE]' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{pref.label}</p>
                <p className="text-xs text-[#94A3B8]">{pref.desc}</p>
              </div>
              <Toggle enabled={notifPrefs[pref.id]} onChange={() => togglePref(pref.id)} />
            </div>
          ))}
        </Card>
      </section>

      {/* Devices overview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-4 w-4 text-[#22D3EE]" />
          <h2 className="text-base font-semibold text-[#0F172A]">All Devices</h2>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#DBEAFE]">
            {mockDevices.map((dev) => (
              <div key={dev.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{dev.deviceName}</p>
                  <p className="text-xs text-[#94A3B8] capitalize mt-0.5">{dev.platform} · {dev.osVersion}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={dev.isOnline ? 'success' : 'muted'}>
                    {dev.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-base font-semibold text-[#EF4444] mb-4">Danger Zone</h2>
        <Card className="border-[#EF4444]/20 bg-[#EF4444]/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Delete Account</p>
            <p className="text-xs text-[#64748B] mt-0.5">
              All profiles, rules, and devices will be permanently deleted.
            </p>
          </div>
          <Button variant="danger" size="sm">Delete Account</Button>
        </Card>
      </section>
    </div>
  );
}
