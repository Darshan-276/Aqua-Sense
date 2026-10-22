'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Hls from 'hls.js'

const videoUrl = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

function Loader({ done }: { done: () => void }) {
  const [progress, setProgress] = useState(0); const [word, setWord] = useState(0); const reduced = useReducedMotion()
  useEffect(() => { const duration = reduced ? 250 : 2700; const start = performance.now(); let frame = 0
    const tick = (now: number) => { const n = Math.min(100, Math.round(((now - start) / duration) * 100)); setProgress(n); if (n < 100) frame = requestAnimationFrame(tick); else window.setTimeout(done, reduced ? 0 : 400) }; frame = requestAnimationFrame(tick)
    const rotation = window.setInterval(() => setWord(w => (w + 1) % 3), reduced ? 99999 : 900)
    return () => { cancelAnimationFrame(frame); clearInterval(rotation) }
  }, [done, reduced])
  return <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: .55 }}><div className="loader-top"><span>AquaSense</span><span>PHASE 01 / 2026</span></div><div className="loader-center"><AnimatePresence mode="wait"><motion.i key={word} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: .35 }}>{['Sense', 'Monitor', 'Understand'][word]}</motion.i></AnimatePresence><strong>{String(progress).padStart(3, '0')}</strong></div><div className="loader-progress"><motion.div className="accent-gradient" animate={{ width: `${progress}%` }} /></div></motion.div>
}

function HlsVideo({ flip = false }: { flip?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null); const [failed, setFailed] = useState(false)
  useEffect(() => { let hls: Hls | undefined; const video = ref.current; if (!video) return
    const setup = async () => { try { if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = videoUrl } else { const Hls = (await import('hls.js')).default; if (Hls.isSupported()) { hls = new Hls({ enableWorker: true }); hls.loadSource(videoUrl); hls.attachMedia(video) } else setFailed(true) }; await video.play().catch(() => undefined) } catch { setFailed(true) } }; setup(); return () => hls?.destroy()
  }, [])
  return <>{!failed && <video ref={ref} className={`video ${flip ? 'flipped' : ''}`} muted loop playsInline autoPlay onError={() => setFailed(true)} />}{failed && <div className="video-fallback" aria-label="Atmospheric background fallback" />}</>
}

function Nav() { const [scrolled, setScrolled] = useState(false); useEffect(() => { const onScroll = () => setScrolled(scrollY > 100); addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll) }, [])
  return <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`} aria-label="Main navigation"><button className="monogram" onClick={() => go('home')} aria-label="AquaSense home">AS</button><div className="nav-links"><button onClick={() => go('home')}>Home</button><button onClick={() => go('system')}>System</button><button onClick={() => go('how')}>How It Works</button><button onClick={() => go('info')}>Project Info</button></div><button className="small-cta" onClick={() => go('system')}>Explore Project <span>↗</span></button></nav> }

function TankArt({ circuit = false, future = false }: { circuit?: boolean; future?: boolean }) { return <div className={`art ${circuit ? 'circuit' : ''} ${future ? 'future' : ''}`} aria-hidden="true">{circuit ? <><div className="probe p1"/><div className="probe p2"/><div className="transistor">BC<br/>547</div><div className="wire"/>{[1,2,3,4].map(x => <i className="led" key={x}/>)}</> : future ? <><div className="chip">WEB<br/>UI</div><div className="nodes">○ ─ ○<br/>╲ &nbsp; ╱<br/> ○ ─ ○</div></> : <><div className="tank"><span/><span/><span/><span/></div><div className="level-labels">25%<br/>50%<br/>75%<br/>FULL</div></>}</div> }

const cards = [
  ['Four-Level Indicator', 'Four thresholds indicate rising water levels using separate LED stages.', 'tank'],
  ['BC547 Transistor Circuit', 'NPN transistor switching stages drive the corresponding LED indicators.', 'circuit'],
  ['Water-Level Simulator', 'An interactive demonstration of the four indicator thresholds.', 'planned'],
  ['Future Development', 'Potential extensions include data logging, connected monitoring, and a web-based monitoring interface.', 'future'],
] as const
const principles = [
  ['01', 'Conductive Water', 'Water with sufficient conductivity can provide a path for a small base current through the sensing circuit.'],
  ['02', 'Transistor Switching', 'A BC547 NPN transistor can switch its associated LED circuit when sufficient base current is supplied.'],
  ['03', 'Four-Level Indication', 'Separate probes are intended to signal the 25%, 50%, 75%, and FULL water thresholds.'],
  ['04', 'Limitations & Calibration', 'Conductivity, electrode placement, resistor values, tank geometry, and sensor arrangement affect practical operation.'],
]
const gallery = ['Water-Level Concept', 'Transistor Switching', 'LED Thresholds', 'Circuit Architecture', 'Interactive Visualization', 'Future IoT Extension']

export default function Home() {
  const [loaded, setLoaded] = useState(false); const reduced = useReducedMotion(); const parallax = useRef<HTMLElement>(null); const hero = useRef<HTMLElement>(null)
  useEffect(() => { if (reduced) return; gsap.registerPlugin(ScrollTrigger); const ctx = gsap.context(() => { gsap.from('[data-hero]', { opacity: 0, y: 34, filter: 'blur(10px)', stagger: .1, duration: 1, delay: .15, ease: 'power3.out' }); if (parallax.current) { gsap.to('.gallery-left', { yPercent: -18, scrollTrigger: { trigger: parallax.current, start: 'top bottom', end: 'bottom top', scrub: true } }); gsap.to('.gallery-right', { yPercent: 18, scrollTrigger: { trigger: parallax.current, start: 'top bottom', end: 'bottom top', scrub: true } }) } }, hero); return () => ctx.revert() }, [reduced])
  return <><AnimatePresence>{!loaded && <Loader done={() => setLoaded(true)} />}</AnimatePresence><Nav/><main><section id="home" ref={hero} className="hero"><HlsVideo/><div className="video-shade"/><div className="hero-content"><p data-hero className="eyebrow">ENGINEERING PROJECT / 2026</p><h1 data-hero>Aqua<span>Sense</span></h1><h2 data-hero>Water level. Made visible.</h2><p data-hero className="hero-copy">A transistor-based, four-level water indicator that turns a simple electronic circuit into a clear and interactive engineering experience.</p><p data-hero className="technical">BC547 Transistors <b>·</b> Four LED Indicators <b>·</b> 9V Power</p><div data-hero className="hero-actions"><button className="button primary" onClick={() => go('system')}>Explore the System <span>↓</span></button><button className="button ghost" onClick={() => go('how')}>How It Works <span>↘</span></button></div></div><button className="scroll-hint" onClick={() => go('system')} aria-label="Scroll to system">SCROLL <i/></button></section>

  <section id="system" className="section works"><Header eyebrow="THE SYSTEM" title={<>Simple circuit. <em>Clear signals.</em></>} text="Explore the four-level water indicator and the electronics behind its operation."/><div className="bento">{cards.map(([title, desc, kind], index) => <article className={`project-card card-${index + 1}`} key={title} tabIndex={0} onClick={() => kind !== 'planned' && go(kind === 'circuit' ? 'how' : 'explorations')}><div className="card-art"><TankArt circuit={kind === 'circuit'} future={kind === 'future'}/></div><div className="card-content"><span className="card-index">0{index + 1}{kind === 'planned' && ' / PLANNED'}</span><h3>{title}</h3><p>{desc}</p>{kind !== 'planned' && <span className="view">View <b>↗</b></span>}</div></article>)}</div></section>

  <section id="how" className="section journal"><Header eyebrow="THE PRINCIPLE" title={<>Understanding <em>the circuit</em></>} text="A closer look at how water contact can activate transistor-based LED indicators."/><div className="principles">{principles.map(([number, title, text]) => <article key={number} className="principle"><span>{number}</span><div className="principle-icon">⌁</div><div><h3>{title}</h3><p>{text}</p></div><b className="arrow">↗</b></article>)}</div></section>

  <section id="explorations" ref={parallax} className="explorations"><div className="gallery-column gallery-left">{gallery.slice(0, 3).map((item, i) => <GalleryCard key={item} item={item} n={i + 1}/>)}</div><div className="explore-center"><p className="eyebrow">BEYOND THE CIRCUIT</p><h2>An engineering<br/><em>playground.</em></h2><p>Explore the relationship between physical electronics, visual feedback, and software interfaces.</p><button className="button primary" onClick={() => go('info')}>Explore the Project <span>↓</span></button></div><div className="gallery-column gallery-right">{gallery.slice(3).map((item, i) => <GalleryCard key={item} item={item} n={i + 4}/>)}</div></section>

  <section id="info" className="section stats"><h2>System at a <em>glance.</em></h2><div className="stat-grid">{[['04','Water-Level Thresholds'],['04','Indicator LEDs'],['9V','Planned Power Supply']].map(([value, label]) => <div key={label}><strong>{value}</strong><p>{label}</p></div>)}</div></section>
  </main><Footer/></>
}

function Header({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text: string }) { return <div className="section-header"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{text}</p></div> }
function GalleryCard({ item, n }: { item: string; n: number }) { return <button className="gallery-card" aria-label={`Open conceptual illustration: ${item}`}><span>CONCEPT / 0{n}</span><div className={`gallery-visual g${n}`}><i/><i/><i/></div><strong>{item}</strong></button> }
function Footer() { const reduced = useReducedMotion(); const track = useRef<HTMLDivElement>(null); useEffect(() => { if (reduced || !track.current) return; const a = gsap.to(track.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 }); return () => { a.kill() } }, [reduced]); return <footer className="footer"><HlsVideo flip/><div className="footer-shade"/><div className="marquee"><div ref={track}>BUILDING AQUASENSE <b>•</b> ENGINEERING MEETS INTERACTION <b>•</b> BUILDING AQUASENSE <b>•</b> ENGINEERING MEETS INTERACTION <b>•</b></div></div><div className="footer-content"><p className="eyebrow">PROJECT INFORMATION</p><h2>From circuit to <em>interface.</em></h2><p>A hardware project exploring how simple electronic sensing can be communicated through clear visual feedback.</p><button className="button primary" onClick={() => go('how')}>Explore the Circuit <span>↑</span></button></div><div className="footer-bottom"><span>© 2026 AQUASENSE</span><div><button onClick={() => go('home')}>Home</button><button onClick={() => go('system')}>System</button><button onClick={() => go('how')}>How It Works</button><button onClick={() => go('explorations')}>Explorations</button><button onClick={() => go('info')}>Project Info</button></div></div></footer> }
