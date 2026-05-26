import { useState, useEffect, useRef } from 'react'
import './App.css'

const DATE_PHOTOS = Array.from({ length: 7 }, (_, i) =>
  `/photos/foto-${String(i + 2).padStart(2, '0')}.jpeg`
)

const LINES = [
  { type: 'cmd', text: 'ssh camila@lindona.local' },
  { type: 'out', text: 'Estabelecendo conexão segura...' },
  { type: 'ok',  text: '✓  Conexão estabelecida' },
  { type: 'cmd', text: './carregar_memorias.sh' },
  { type: 'out', text: 'Procurando arquivos especiais...' },
  { type: 'ok',  text: '✓  memórias encontradas' },
  { type: 'cmd', text: 'cat mensagem.txt' },
  { type: 'msg', text: 'É incrível estar com você, Camila.' },
  { type: 'msg', text: 'Obrigado por cada segundo.' },
  { type: 'cmd', text: './abrir_galeria.sh' },
  { type: 'ok',  text: '✓  Carregando nossa história...' },
]

const C1_TEXTS = [
  'Nossa história começa a muito tempo, mesmo na escola, eu já te achava uma pessoa incrível, inteligente, dedicada e esforçada',
  'Após sua formatura, acabou que não nos viamos mais, e também não tínhamos tanto contato, mas mesmo assim, isso não impediu de estarmos aqui hoje',
  'Sei que uma de suas conquistas, começa com você se tornando uma "DOTORA" com muito esforço.',
  'E mesmo não acompanhando essa fase de perto, sinto muito orgulho do que você conquistou e do que se tornou',
  'Hoje você alça novos ares em uma nova cidade, estuda novas coisas, se profissionaliza ainda mais e mais',
  'Fico feliz que dessa jornada eu possa estar fazendo parte e estar ao seu lado na sua evolução e desenvolvimento',
  'Como sempre, sinto muito orgulho da mulher que você está se tornando e de tudo que você já é',
  'E espero poder estar ao seu lado em cada passo dessa caminhada, te apoiando, te admirando cada dia mais'
]

const C1_PHOTOS = [
  '/photos/foto-09.jpeg',
  '/photos/foto-09.jpeg',
  '/photos/foto-09.jpeg',
  '/photos/foto-09.jpeg',
  '/photos/foto-01.jpeg',
  '/photos/foto-01.jpeg',
  '/photos/foto-01.jpeg',
  '/photos/foto-01.jpeg',
]

const BRIDGE_SLIDES = [
  { type: 'text',  text: 'E mesmo com essas idas e vindas do destino' },
  { type: 'text',  text: 'Sabe onde isso nos levou?' },
  { type: 'text',  text: 'Ao dia 21/03/2026' },
  { type: 'photo', photo: '/photos/foto-11.jpg', text: 'O dia em que eu conheci o bico do papagaio' },
  { type: 'text',  text: 'Brincadeira' },
  { type: 'text',  text: 'Esse foi o dia que me levou a conhecer a pessoa que tem me alegrado cada dia mais' },
  { type: 'text',  text: 'Com boas risadas, histórias e por ser você mesma' },
  { type: 'text',  text: 'Sabe quem é essa pessoa?' },
  { type: 'text',  text: 'Você mesma, DOTORA' },
  { type: 'text',  text: 'E lembra daquele dia?' },
]

const PROPOSAL_SLIDES = [
  'Toda essa jornada',
  'Obviamente, resumida de forma bem rápida e superficial',
  'Nos trouxe até aqui',
  'Nesse momento, eu e você',
  'Acho que, não ganharei em uma rifa ou na mega',
  'Pois toda sorte que eu tinha, foi pra ter você na minha vida',
  'Sei que teremos nossos altos e baixos',
  'Mas quero muito continuar vivendo tudo isso com você',
  'Aprendendo, evoluindo, rindo, chorando, viajando, e vivendo a vida ao seu lado',
  'Esse período sem nos vermos',
  'Me fez perceber o quanto quero estar com você, e o quanto você é importante pra mim',
  'Me fez querer ser uma pessoa melhor, pra merecer alguém tão incrível como você',
  'Fez eu perceber a pessoa maravilhosa que eu tenho a sorte de ter na minha vida',
  'E também me fez perceber a admiração que eu tenho por você',
  'Você sabe que eu não sou muito bom com palavras',
  'Mas mesmo assim, queria tentar expressar o que sinto por você de alguma forma',
  'Expressar como você me faz bem, como me sinto sortudo por ter você na minha vida',
  'E como eu quero continuar tendo você na minha vida por muito tempo',
  'Como um garoto de programa',
  'Porque não inovar, e por aqui te pedir de forma simples e direta',
  'Camila',
  'Quer namorar comigo?',
]

const HEARTS = ['❤️', '🩷', '🧡', '💛', '💚', '💙', '💜', '🤍']

const NO_MESSAGES = [
  'Não',
  'Tem certeza? 🦥',
  'Pensa bem...',
  'Última chance 👉👈',
  'Nooo voltaaaa',
  'Eu tô implorando',
  'PLEASEEE',
  'Não faz isso comigo',
  'Ok, last chance 🪶',
  'Eu acredito em você!',
]

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export default function App() {
  const [phase, setPhase]         = useState('terminal')
  const [shown, setShown]         = useState([])
  const [photoIdx, setPhotoIdx]   = useState(0)
  const [c1TextIdx, setC1TextIdx] = useState(0)
  const [c1Displayed, setC1Displayed] = useState('')
  const [c1Typing, setC1Typing]   = useState(false)
  const [bridgeIdx, setBridgeIdx]         = useState(0)
  const [bridgeDisplayed, setBridgeDisplayed] = useState('')
  const [bridgeTyping, setBridgeTyping]   = useState(false)
  const [c2Intro, setC2Intro] = useState(true)
  const [propIdx, setPropIdx]             = useState(0)
  const [propDisplayed, setPropDisplayed] = useState('')
  const [propTyping, setPropTyping]       = useState(false)
  const [said, setSaid]                   = useState(null)
  const [noPos, setNoPos]                 = useState({ x: null, y: null })
  const [noClickCount, setNoClickCount]   = useState(0)
  const [hearts, setHearts]               = useState([])
  const [showSkip, setShowSkip]           = useState(false)
  const [yesContinue, setYesContinue]     = useState(false)
  const termRef    = useRef(null)
  const noRef      = useRef(null)
  const heartIdRef = useRef(0)

  // ── terminal auto-play ──
  useEffect(() => {
    if (phase !== 'terminal') return
    let cancelled = false
    async function run() {
      await sleep(600)
      for (let i = 0; i < LINES.length; i++) {
        if (cancelled) return
        setShown(prev => [...prev, i])
        await sleep(LINES[i].type === 'cmd' ? 900 : 500)
      }
      await sleep(1500)
      if (!cancelled) setPhase('c1')
    }
    run()
    return () => { cancelled = true }
  }, [phase])

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
  }, [shown])

  // ── digitação do capítulo 1 ──
  useEffect(() => {
    if (phase !== 'c1') return
    setC1Displayed('')
    setC1Typing(true)
    const target = C1_TEXTS[c1TextIdx]
    let i = 0
    const id = setInterval(() => {
      i++
      setC1Displayed(target.slice(0, i))
      if (i >= target.length) {
        clearInterval(id)
        setC1Typing(false)
      }
    }, 22)
    return () => clearInterval(id)
  }, [phase, c1TextIdx])

  function skipC1() {
    if (c1Typing) {
      setC1Displayed(C1_TEXTS[c1TextIdx])
      setC1Typing(false)
    }
  }

  // ── digitação da ponte ──
  useEffect(() => {
    if (phase !== 'bridge') return
    setBridgeDisplayed('')
    setBridgeTyping(true)
    const target = BRIDGE_SLIDES[bridgeIdx].text
    let i = 0
    const id = setInterval(() => {
      i++
      setBridgeDisplayed(target.slice(0, i))
      if (i >= target.length) {
        clearInterval(id)
        setBridgeTyping(false)
      }
    }, 28)
    return () => clearInterval(id)
  }, [phase, bridgeIdx])

  function skipBridge() {
    if (bridgeTyping) {
      setBridgeDisplayed(BRIDGE_SLIDES[bridgeIdx].text)
      setBridgeTyping(false)
    }
  }

  // ── corações flutuantes ──
  useEffect(() => {
    if (said !== 'yes') return
    const id = setInterval(() => {
      heartIdRef.current += 1
      setHearts(h => [...h.slice(-30), {
        id: heartIdRef.current,
        style: {
          left: `${Math.random() * 95}vw`,
          animationDuration: `${2 + Math.random() * 3}s`,
          fontSize: `${1.5 + Math.random() * 2}rem`,
        }
      }])
    }, 200)
    return () => clearInterval(id)
  }, [said])

  // ── skip do terminal ──
  useEffect(() => {
    if (phase !== 'terminal') return
    const id = setTimeout(() => setShowSkip(true), 2500)
    return () => { clearTimeout(id); setShowSkip(false) }
  }, [phase])

  // ── botão continuar na tela yes ──
  useEffect(() => {
    if (said !== 'yes') return
    const id = setTimeout(() => setYesContinue(true), 4000)
    return () => clearTimeout(id)
  }, [said])

  // ── digitação da proposta ──
  useEffect(() => {
    if (phase !== 'proposal') return
    setPropDisplayed('')
    setPropTyping(true)
    const target = PROPOSAL_SLIDES[propIdx]
    let i = 0
    const id = setInterval(() => {
      i++
      setPropDisplayed(target.slice(0, i))
      if (i >= target.length) { clearInterval(id); setPropTyping(false) }
    }, 35)
    return () => clearInterval(id)
  }, [phase, propIdx])

  function skipProp() {
    if (propTyping) { setPropDisplayed(PROPOSAL_SLIDES[propIdx]); setPropTyping(false) }
  }

  // ── intro do capítulo 2 ──
  useEffect(() => {
    if (phase !== 'c2' || !c2Intro) return
    setBridgeDisplayed('')
    setBridgeTyping(true)
    const target = 'Nosso Primeiro Encontro ✨'
    let i = 0
    const id = setInterval(() => {
      i++
      setBridgeDisplayed(target.slice(0, i))
      if (i >= target.length) { clearInterval(id); setBridgeTyping(false) }
    }, 40)
    return () => clearInterval(id)
  }, [phase, c2Intro])

  // ── avanço automático das fotos (2.5s) ──
  useEffect(() => {
    if (phase !== 'c2' || c2Intro) return
    const id = setTimeout(() => {
      if (photoIdx >= DATE_PHOTOS.length - 1) setPhase('proposal')
      else setPhotoIdx(p => p + 1)
    }, 2500)
    return () => clearTimeout(id)
  }, [phase, c2Intro, photoIdx])

  // ── terminal ──
  if (phase === 'terminal') {
    return (
      <div className="terminal-screen">
        <div className="terminal-bar">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="bar-title">bash — camila@coracao</span>
          {showSkip && (
            <button className="term-skip" onClick={() => setPhase('c1')}>pular →</button>
          )}
        </div>
        <div className="terminal-body" ref={termRef}>
          <p className="term-welcome">Bem-vindo, dev apaixonado 💻</p>
          {shown.map(i => {
            const line = LINES[i]
            return (
              <div key={i} className={`term-line term-${line.type}`}>
                {line.type === 'cmd' && <span className="prompt">~$&nbsp;</span>}
                <span className="line-text">{line.text}</span>
              </div>
            )
          })}
          {shown.length < LINES.length && <span className="cursor">█</span>}
        </div>
      </div>
    )
  }

  // ── capítulo 1: faculdade ──
  if (phase === 'c1') {
    const isLastText = c1TextIdx === C1_TEXTS.length - 1
    return (
      <div className="chapter" key="c1">
        <div className="c1-card">
          <div className="c1-photo-wrap" onClick={skipC1} style={{ cursor: c1Typing ? 'pointer' : 'default' }}>
            <img key={c1TextIdx} src={C1_PHOTOS[c1TextIdx]} alt="A Doutora" className="c1-photo" />
          </div>
          <div className="c1-text">
            <span className="ch-tag">{c1TextIdx >= 4 ? '// o presente' : '// antes de tudo'}</span>
            <h2 className="ch-title">{c1TextIdx >= 4 ? 'Vai tratar meu pobreminha 🩺' : 'A Doutora 🎓'}</h2>
            <p className="ch-body" onClick={skipC1} style={{ cursor: c1Typing ? 'pointer' : 'default' }}>
              {c1Displayed}
              {c1Typing && <span className="cursor">█</span>}
            </p>
            {!c1Typing && (
              <button
                className="ch-btn"
                onClick={() => {
                  if (!isLastText) {
                    setC1TextIdx(p => p + 1)
                  } else {
                    setBridgeIdx(0)
                    setPhase('bridge')
                  }
                }}
              >
                {isLastText ? 'continuar →' : 'próxima →'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── ponte entre capítulos ──
  if (phase === 'bridge') {
    const slide = BRIDGE_SLIDES[bridgeIdx]
    const isLast = bridgeIdx === BRIDGE_SLIDES.length - 1
    function nextBridge() {
      if (isLast) { setPhotoIdx(0); setPhase('c2') }
      else setBridgeIdx(p => p + 1)
    }

    if (slide.type === 'photo') {
      return (
        <div className="chapter" key={`bridge-${bridgeIdx}`}>
          <div className="c1-card">
            <div className="c1-photo-wrap" onClick={skipBridge} style={{ cursor: bridgeTyping ? 'pointer' : 'default' }}>
              <img src={slide.photo} alt="" className="c1-photo" />
            </div>
            <div className="c1-text">
              <span className="ch-tag">// 21.03.2026</span>
              <p className="ch-body" onClick={skipBridge} style={{ cursor: bridgeTyping ? 'pointer' : 'default' }}>
                {bridgeDisplayed}
                {bridgeTyping && <span className="cursor">█</span>}
              </p>
              {!bridgeTyping && (
                <button className="ch-btn" onClick={nextBridge}>próxima →</button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className="chapter bridge-text"
        key={`bridge-${bridgeIdx}`}
        onClick={skipBridge}
        style={{ cursor: bridgeTyping ? 'pointer' : 'default' }}
      >
        <div className="bridge-content">
          <p className="bridge-big-text">
            {bridgeDisplayed}
            {bridgeTyping && <span className="cursor">█</span>}
          </p>
          {!bridgeTyping && (
            <button className="ch-btn" onClick={e => { e.stopPropagation(); nextBridge() }}>
              {isLast ? 'sim, lembro 🤍' : 'continuar →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── capítulo 2: fotos do encontro, uma por vez ──
  if (phase === 'c2') {
    // ── tela intro do cap. 2 ──
    if (c2Intro) {
      function skipIntro() {
        if (bridgeTyping) { setBridgeDisplayed('Nosso Primeiro Encontro ✨'); setBridgeTyping(false) }
      }
      return (
        <div
          className="chapter bridge-text"
          key="c2-intro"
          onClick={skipIntro}
          style={{ cursor: bridgeTyping ? 'pointer' : 'default' }}
        >
          <div className="bridge-content">
            <span className="ch-tag">// 21.03.2026</span>
            <p className="bridge-big-text">
              {bridgeDisplayed}
              {bridgeTyping && <span className="cursor">█</span>}
            </p>
            {!bridgeTyping && (
              <button className="ch-btn" onClick={e => { e.stopPropagation(); setC2Intro(false) }}>
                ver as fotos →
              </button>
            )}
          </div>
        </div>
      )
    }

    const isLast = photoIdx === DATE_PHOTOS.length - 1
    return (
      <div className="chapter" key={`c2-${photoIdx}`}>
        <div className="c2-wrap">
          <div
            className="stage"
            onClick={() => {
              if (photoIdx >= DATE_PHOTOS.length - 1) setPhase('proposal')
              else setPhotoIdx(p => p + 1)
            }}
            style={{ cursor: 'pointer' }}
          >
            <img key={photoIdx} src={DATE_PHOTOS[photoIdx]} alt={`Foto ${photoIdx + 1}`} className="stage-img" />
            <div key={`bar-${photoIdx}`} className="photo-progress" />
          </div>
          <div className="c2-footer">
            <div className="ch-dots">
              {DATE_PHOTOS.map((_, i) => (
                <span key={i} className={`ch-dot${i === photoIdx ? ' active' : i < photoIdx ? ' seen' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── proposta ──
  if (said === 'ending') {
    return (
      <div className="chapter ending" key="ending">
        <div className="ending-content">
          <span className="ch-tag">// fim</span>
          <div className="ending-star">✨</div>
          <p className="ending-text">Para muitos outros encontros.</p>
          <p className="ending-name">Camila 🤍</p>
          <p className="ending-dev">feito com {'</>'} e muito carinho</p>
        </div>
      </div>
    )
  }

  if (said === 'yes') {
    return (
      <div className="chapter yes-screen" key="yes">
        {hearts.map(h => (
          <span key={h.id} className="floating-heart" style={h.style}>{HEARTS[h.id % HEARTS.length]}</span>
        ))}
        <div className="yes-content">
          <div className="yes-heart">❤️</div>
          <h1>Ela disse SIM! 🎉</h1>
          <p>Você é a pessoa mais especial do meu mundo 🥰</p>
          {yesContinue && (
            <button className="ch-btn yes-continue-btn" onClick={() => setSaid('ending')}>
              continuar →
            </button>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'proposal') {
    const isLast = propIdx === PROPOSAL_SLIDES.length - 1
    function runAway() {
      const btn = noRef.current
      if (!btn) return
      const vw = window.innerWidth - btn.offsetWidth - 20
      const vh = window.innerHeight - btn.offsetHeight - 20
      setNoPos({ x: Math.max(10, Math.floor(Math.random() * vw)), y: Math.max(10, Math.floor(Math.random() * vh)) })
      setNoClickCount(c => c + 1)
    }
    return (
      <div
        className="chapter bridge-text"
        key={`prop-${propIdx}`}
        onClick={skipProp}
        style={{ cursor: propTyping ? 'pointer' : 'default' }}
      >
        <div className="bridge-content">
          <p className={`bridge-big-text${isLast && !propTyping ? ' proposal-question' : ''}`}>
            {propDisplayed}
            {propTyping && <span className="cursor">█</span>}
          </p>
          {!propTyping && !isLast && (
            <button className="ch-btn" onClick={e => { e.stopPropagation(); setPropIdx(p => p + 1) }}>
              continuar →
            </button>
          )}
          {!propTyping && isLast && (
            <div className="proposal-video-wrap" onClick={e => e.stopPropagation()}>
              <iframe
                src="https://www.instagram.com/reel/DOXtmb3jbhj/embed/"
                className="proposal-video"
                allowFullScreen
                scrolling="no"
                frameBorder="0"
                title="reel"
              />
            </div>
          )}
          {!propTyping && isLast && (
            <div className="proposal-btns">
              <button className="btn yes-btn" onClick={e => { e.stopPropagation(); setSaid('yes') }}>
                Sim! 💖
              </button>
              <button
                ref={noRef}
                className="btn no-btn"
                style={noPos.x !== null ? { position: 'fixed', left: noPos.x, top: noPos.y, zIndex: 999 } : {}}
                onMouseEnter={runAway}
                onClick={e => { e.stopPropagation(); runAway() }}
              >
                {NO_MESSAGES[Math.min(noClickCount, NO_MESSAGES.length - 1)]}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── tela final ──
  return (
    <div className="chapter ending" key="ending">
      <div className="ending-content">
        <span className="ch-tag">// fim</span>
        <div className="ending-star">✨</div>
        <p className="ending-text">Para muitos outros encontros.</p>
        <p className="ending-name">Camila 🤍</p>
        <p className="ending-dev">feito com {'</>'} e muito carinho</p>
      </div>
    </div>
  )
}
