import type { ReactNode } from 'react'
// Official artwork from Google Workspace's brand resources.
import gmailBrand from '../assets/gmail-brand.svg'
import LotusElephant from './LotusElephant'
import PostageStamp from './PostageStamp'
import './SocialSection.scss'

export type SocialProfile = { name: string; hindiLabel?: string; value?: string; href?: string; icon: ReactNode }

const profiles: SocialProfile[] = [
  {
    name: 'LinkedIn',
    hindiLabel: 'लिंक्डइन',
    value: '24',
    href: 'https://www.linkedin.com/in/pratikchvn/',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.31h.04c.39-.74 1.36-1.52 2.79-1.52 2.99 0 3.58 1.97 3.58 4.52v5.24Z" /></svg>,
  },
  {
    name: 'Dribbble',
    hindiLabel: 'ड्रिब्बल',
    value: '57',
    href: 'https://dribbble.com/neutronian',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" stroke="none" /><g transform="translate(4 4) scale(.666667)" stroke="var(--color-paper)"><circle cx="12" cy="12" r="9.25" /><path d="M7.3 4.1c4.6 5.4 7.4 11 8.9 16.2M3 10.1c7.2.4 12.6-1.6 16.4-5M5.3 18.8c3.8-6.1 8.7-8.1 15.8-6.4" /></g></svg>,
  },
  {
    name: 'Substack',
    hindiLabel: 'सबस्टैक',
    value: '83',
    href: 'https://substack.com/@neutronian',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="2" /><g transform="translate(4 4) scale(.666667)" fill="var(--color-paper)"><path d="M3 2h18v2H3zm0 4h18v2H3zm0 4h18v12l-9-5-9 5Z" /></g></svg>,
  },
  {
    name: 'Gmail',
    hindiLabel: 'जीमेल',
    value: '96',
    href: 'mailto:chavanpratik.pc@tesla.com',
    icon: <img src={gmailBrand} width="48" height="48" alt="" />,
  },
]

function SocialIconButton({ name, href, icon, hindiLabel, value }: SocialProfile) {
  const isEmail = href?.startsWith('mailto:')
  const label = isEmail ? `Email ${href?.slice(7)}` : `Visit my ${name}`
  const stamp = <PostageStamp label={name} hindiLabel={hindiLabel} value={value} icon={<span className={`social-brand social-brand--${name.toLowerCase()}`}>{icon}</span>} />
  return href ? (
    <a className="social-stamp-link" href={href} target={isEmail ? undefined : '_blank'} rel={isEmail ? undefined : 'noopener noreferrer'} aria-label={label} title={name}>
      {stamp}
    </a>
  ) : (
    <button className="social-stamp-link" type="button" aria-label={label} aria-disabled="true" title={name}>
      {stamp}
    </button>
  )
}

export default function SocialSection({ links = profiles }: { links?: SocialProfile[] }) {
  return (
    <section className="social-section" aria-labelledby="social-title">
      <div className="social-section__content">
        <h2 id="social-title" tabIndex={-1}>Find me on</h2>
        <div className="social-section__display">
          <LotusElephant side="left" />
          <div className="social-section__links" aria-label="Social profiles">
            {links.map(profile => <SocialIconButton key={profile.name} {...profile} />)}
          </div>
          <LotusElephant side="right" />
        </div>
      </div>
    </section>
  )
}
