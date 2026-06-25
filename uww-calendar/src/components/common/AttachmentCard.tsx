import { Paperclip } from 'lucide-react';

function DownloadIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function AttachmentCard({ att, own, spaced }: { att: { name: string; url: string }; own?: boolean; spaced?: boolean }) {
  return (
    <a
      href={att.url}
      download={att.name}
      title={`Download ${att.name}`}
      style={{
        marginTop: spaced ? 8 : 0,
        display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px', borderRadius: 10,
        background: own ? 'rgba(0,0,0,.22)' : 'var(--field)',
        border: '1px solid ' + (own ? 'rgba(255,255,255,.18)' : 'var(--border-strong)'),
        textDecoration: 'none', color: own ? '#fff' : 'var(--text)', maxWidth: 260, minWidth: 160,
      }}
    >
      <Paperclip size={16} color="var(--accent)" />
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.name}</span>
      <DownloadIcon size={16} color={own ? 'rgba(255,255,255,.75)' : 'var(--text-muted)'} />
    </a>
  );
}
