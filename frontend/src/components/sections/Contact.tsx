import { useState } from 'react';
import { Mail, Linkedin, Github, FileText, Send } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { profile } from '@/data/profile';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(form.email)) e.email = 'Invalid email format';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const channels = [
    { icon: Mail, label: 'EMAIL', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Linkedin, label: 'LINKEDIN', value: 'Ayush Patidar', href: profile.linkedin },
    { icon: Github, label: 'GITHUB', value: profile.githubUsername, href: profile.github },
    { icon: FileText, label: 'RESUME', value: 'Download PDF', href: profile.resumeUrl },
  ];

  return (
    <Section id="contact">
      <SectionHeading
        command="./contact.sh"
        title="Contact"
        subtitle="Get in touch — for work, collaboration, or just to talk shop."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 sm:gap-6">
        {/* Channels */}
        <div className="space-y-3">
          <div className="mono text-sm text-terminal-green mb-2">$ ./contact.sh --channels</div>
          {channels.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="panel rounded-lg p-4 flex items-center gap-4 hover:border-terminal-accent/40 hover:bg-terminal-hover transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-terminal-hover flex items-center justify-center group-hover:bg-terminal-accent/10 transition-colors">
                <Icon size={18} className="text-terminal-accent" />
              </div>
              <div>
                <div className="mono text-[10px] text-terminal-dim tracking-wider">{label}</div>
                <div className="text-sm text-terminal-text font-medium">{value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Form */}
        <div className="panel rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-panel">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-red/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-amber/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-green/80" />
            </div>
            <span className="mono text-xs text-terminal-dim ml-2">contact.sh — execute</span>
          </div>

          {sent ? (
            <div className="p-8 text-center">
              <div className="mono text-terminal-green text-sm mb-2">✓ Message prepared</div>
              <p className="text-terminal-dim text-sm">
                Your email client should open with the message pre-filled. If it didn't, write to{' '}
                <a href={`mailto:${profile.email}`} className="text-terminal-accent underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent rounded">
                  {profile.email}
                </a>
                .
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: '', email: '', message: '' });
                }}
                className="mono text-xs text-terminal-dim hover:text-terminal-accent mt-4 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent rounded"
              >
                ← send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="p-5 space-y-4" noValidate>
              <div>
                <label className="mono text-[11px] text-terminal-dim tracking-wider block mb-1.5">
                  NAME
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  className="w-full bg-terminal-bg border border-terminal-border rounded-md px-3 py-2.5 text-sm text-terminal-text outline-none focus:border-terminal-accent transition-colors"
                  placeholder="Your name"
                />
                {errors.name && <p className="mono text-[11px] text-terminal-red mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="mono text-[11px] text-terminal-dim tracking-wider block mb-1.5">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full bg-terminal-bg border border-terminal-border rounded-md px-3 py-2.5 text-sm text-terminal-text outline-none focus:border-terminal-accent transition-colors"
                  placeholder="your.email@domain.com"
                />
                {errors.email && <p className="mono text-[11px] text-terminal-red mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="mono text-[11px] text-terminal-dim tracking-wider block mb-1.5">
                  MESSAGE
                </label>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={5}
                  className="w-full bg-terminal-bg border border-terminal-border rounded-md px-3 py-2.5 text-sm text-terminal-text outline-none focus:border-terminal-accent transition-colors resize-none"
                  placeholder="Tell me what you'd like to build..."
                />
                {errors.message && (
                  <p className="mono text-[11px] text-terminal-red mt-1">{errors.message}</p>
                )}
              </div>

              <MagneticButton
                as="button"
                strength={0.15}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 sm:py-3 bg-terminal-accent text-terminal-bg rounded-md font-medium text-sm hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-terminal-accent focus-visible:outline-offset-2"
              >
                <Send size={14} /> Open in Email Client
              </MagneticButton>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
