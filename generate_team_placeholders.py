from pathlib import Path

root = Path('public/team')
root.mkdir(exist_ok=True)
profiles = [
    ('muzammil-alam', '#1E63F4', 'Muzammil'),
    ('muhammad-soman', '#0A1A3A', 'Soman'),
    ('shaharyar', '#F27D42', 'Shaharyar'),
]

for slug, color, name in profiles:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0b1020"/>
      <stop offset="48%" stop-color="{color}"/>
      <stop offset="100%" stop-color="#e9eefc"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <circle cx="600" cy="420" r="220" fill="rgba(255,255,255,0.18)"/>
  <circle cx="600" cy="420" r="170" fill="#f3f6ff" opacity="0.88"/>
  <path d="M420 940c38-170 125-250 180-250s142 80 180 250" fill="#edf3ff" opacity="0.9"/>
  <circle cx="600" cy="370" r="110" fill="#f7d9bf"/>
  <path d="M498 330c34-74 98-110 172-110 63 0 115 29 148 90-27-12-46-16-77-16-81 0-157 30-243 36z" fill="#101728"/>
  <circle cx="560" cy="360" r="12" fill="#111827"/>
  <circle cx="640" cy="360" r="12" fill="#111827"/>
  <path d="M560 420c26 24 56 35 80 35 28 0 58-11 84-35" stroke="#111827" stroke-width="14" fill="none" stroke-linecap="round"/>
  <rect x="430" y="1020" width="340" height="110" rx="55" fill="rgba(8,11,18,0.18)"/>
  <text x="600" y="1060" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#ffffff">{name}</text>
</svg>
'''
    poster = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0b1020"/>
      <stop offset="100%" stop-color="{color}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#g)"/>
  <circle cx="600" cy="420" r="220" fill="rgba(255,255,255,0.12)"/>
  <circle cx="600" cy="420" r="160" fill="#f3f6ff" opacity="0.26"/>
  <path d="M410 985c42-160 120-240 190-240s150 80 192 240" fill="#f3f6ff" opacity="0.38"/>
  <circle cx="600" cy="390" r="108" fill="#f3d5ba"/>
  <path d="M500 350c18-59 74-103 160-103 81 0 149 46 167 121-22-12-48-18-77-18-133 0-234 21-250 0z" fill="#111827"/>
  <circle cx="560" cy="390" r="12" fill="#111827"/>
  <circle cx="642" cy="390" r="12" fill="#111827"/>
  <path d="M570 440c18 18 36 26 60 26 26 0 46-8 64-26" stroke="#111827" stroke-width="12" fill="none" stroke-linecap="round"/>
</svg>
'''
    (root / f'{slug}.svg').write_text(svg, encoding='utf-8')
    (root / f'{slug}-poster.svg').write_text(poster, encoding='utf-8')

print('created', sorted(p.name for p in root.iterdir()))
