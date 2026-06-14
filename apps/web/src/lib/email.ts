import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? 'Guardian <noreply@guardian.io>';

export async function sendAccessRequestNotification(opts: {
  to: string;
  profileName: string;
  domain: string;
  reason?: string | null;
  approveUrl: string;
  denyUrl: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Access Request: ${opts.domain}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#0F172A;margin-bottom:8px">Access Request</h2>
        <p style="color:#475569"><strong>${opts.profileName}</strong> is requesting access to <strong>${opts.domain}</strong>.</p>
        ${opts.reason ? `<blockquote style="border-left:3px solid #DBEAFE;margin:16px 0;padding:8px 16px;color:#334155">"${opts.reason}"</blockquote>` : ''}
        <div style="display:flex;gap:12px;margin-top:24px">
          <a href="${opts.approveUrl}" style="background:#0EA5E9;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">Approve</a>
          <a href="${opts.denyUrl}" style="background:#FEE2E2;color:#B91C1C;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">Deny</a>
        </div>
        <p style="color:#94A3B8;font-size:12px;margin-top:24px">Guardian — Your home. Your rules. Your internet.</p>
      </div>
    `,
  });
}

export async function sendWeeklyReport(opts: {
  to: string;
  displayName: string;
  topBlocked: Array<{ domain: string; count: number }>;
  totalAllowed: number;
  totalBlocked: number;
  dashboardUrl: string;
}) {
  const rows = opts.topBlocked
    .map((r) => `<tr><td style="padding:6px 0;color:#0F172A">${r.domain}</td><td style="padding:6px 0;color:#B91C1C;text-align:right">${r.count}</td></tr>`)
    .join('');

  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: 'Your Guardian Weekly Report',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#0F172A">Weekly Report for ${opts.displayName}</h2>
        <div style="display:flex;gap:24px;margin:16px 0">
          <div style="text-align:center">
            <p style="font-size:28px;font-weight:700;color:#22C55E;margin:0">${opts.totalAllowed}</p>
            <p style="color:#475569;font-size:12px;margin:4px 0">Allowed</p>
          </div>
          <div style="text-align:center">
            <p style="font-size:28px;font-weight:700;color:#EF4444;margin:0">${opts.totalBlocked}</p>
            <p style="color:#475569;font-size:12px;margin:4px 0">Blocked</p>
          </div>
        </div>
        ${rows ? `
        <h3 style="color:#0F172A;font-size:14px">Top Blocked Sites</h3>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        ` : ''}
        <a href="${opts.dashboardUrl}" style="display:inline-block;margin-top:24px;background:#0EA5E9;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">View Dashboard</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:24px">Guardian — Your home. Your rules. Your internet.</p>
      </div>
    `,
  });
}
