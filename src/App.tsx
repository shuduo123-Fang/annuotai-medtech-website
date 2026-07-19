import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import companyLogo from '../assets/annuotai-logo-transparent.png'
import wechatQr from '../assets/contact-wechat.jpg'
import whatsappQr from '../assets/contact-whatsapp.jpg'
import productHeroImage from '../assets/e7-product-studio-2.jpg'
import productDetailImage from '../assets/e7-product-studio-1.jpg'
import aboutGlobalAccessImage from '../assets/about-global-access-transparent.png'
import productBrochure from '../assets/E7-GENPRO-brochure.pdf?url'

type Route = '/' | '/products' | '/products/e7-genpro' | '/about' | '/contact'

const routes: Route[] = ['/', '/products', '/products/e7-genpro', '/about', '/contact']

const routeTitles: Record<Route, string> = {
  '/': 'ANNUOTAI MEDTECH | Rapid Diagnostics',
  '/products': 'Products | ANNUOTAI MEDTECH',
  '/products/e7-genpro': 'E7 GENPRO | ANNUOTAI MEDTECH',
  '/about': 'About | ANNUOTAI MEDTECH',
  '/contact': 'Contact | ANNUOTAI MEDTECH',
}

function normalisePath(pathname: string): Route {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return routes.includes(path as Route) ? (path as Route) : '/'
}

function App() {
  const [path, setPath] = useState<Route>(() => normalisePath(window.location.pathname))
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handlePopState = () => setPath(normalisePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = routeTitles[path]
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMenuOpen(false)
  }, [path])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [path])

  const navigate = (to: Route) => {
    if (to === path) return
    window.history.pushState({}, '', to)
    setPath(to)
  }

  const page = useMemo(() => {
    if (path === '/products') return <ProductsPage navigate={navigate} />
    if (path === '/products/e7-genpro') return <ProductPage navigate={navigate} />
    if (path === '/about') return <AboutPage navigate={navigate} />
    if (path === '/contact') return <ContactPage />
    return <HomePage navigate={navigate} />
  }, [path])

  return (
    <div className="site-shell">
      <Header path={path} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>{page}</main>
      <Footer navigate={navigate} />
    </div>
  )
}

type NavProps = {
  path?: Route
  navigate: (route: Route) => void
}

function SmartLink({ to, navigate, children, className = '' }: { to: Route; navigate: NavProps['navigate']; children: ReactNode; className?: string }) {
  return (
    <a
      href={to}
      className={className}
      onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

function Header({ path, navigate, menuOpen, setMenuOpen }: NavProps & { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const navItems: { label: string; href: Route }[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ]

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <SmartLink to="/" navigate={navigate} className="brand-link" aria-label="ANNUOTAI MEDTECH home">
          <img src={companyLogo} alt="ANNUOTAI MEDTECH" />
        </SmartLink>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          {navItems.map(item => (
            <SmartLink
              key={item.href}
              to={item.href}
              navigate={navigate}
              className={path === item.href || (item.href === '/products' && path === '/products/e7-genpro') ? 'active' : ''}
            >
              {item.label}
            </SmartLink>
          ))}
          <SmartLink to="/contact" navigate={navigate} className="nav-contact">
            Contact
          </SmartLink>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function Footer({ navigate }: NavProps) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={companyLogo} alt="ANNUOTAI MEDTECH" />
          <p>Bringing Quality Medical Technologies To More Patients.</p>
        </div>
        <div>
          <p className="footer-title">Explore</p>
          <SmartLink to="/products" navigate={navigate}>Products</SmartLink>
          <SmartLink to="/products/e7-genpro" navigate={navigate}>E7 GENPRO</SmartLink>
          <SmartLink to="/about" navigate={navigate}>About</SmartLink>
        </div>
        <div>
          <p className="footer-title">Contact</p>
          <a href="mailto:contact@annuotaimedtech.com">contact@annuotaimedtech.com</a>
          <a href="tel:+8618210813735">+86 182 1081 3735</a>
          <a href="tel:+16465250292">+1 646 525 0292</a>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} ANNUOTAI MEDTECH</span>
        <span>Product availability and intended use may vary by market.</span>
      </div>
    </footer>
  )
}

function HomePage({ navigate }: NavProps) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">International Medical Technology</p>
          <h1>Bringing Quality Medical Innovation To More Patients.</h1>
          <p className="hero-lede">We help clinically valuable technologies reach the healthcare professionals and patients who need them most.</p>
          <div className="button-row">
            <SmartLink to="/products" navigate={navigate} className="button button-primary">Explore Products</SmartLink>
            <SmartLink to="/contact" navigate={navigate} className="text-link">Work With Us <span>↗</span></SmartLink>
          </div>
        </div>

        <div className="hero-visual" data-reveal>
          <div className="product-stage">
            <img src={productHeroImage} alt="E7 GENPRO test kit with sample release agent, test cassette, and dropper in a laboratory setting" />
            <div className="stage-caption">
              <strong>E7 GENPRO</strong>
              <span>HPV E7 Oncoprotein Rapid Test</span>
            </div>
          </div>
        </div>

      </section>

      <section className="trust-rail" data-reveal aria-label="E7 GENPRO product credentials">
        <span>CE marked</span>
        <span>ISO 13485</span>
        <span>China NMPA Class II</span>
        <span>2 to 30°C storage</span>
      </section>

      <section className="section intro-section">
        <div className="section-heading" data-reveal>
          <h2>Helping Quality Medical Technologies Reach More Patients.</h2>
        </div>
        <div className="intro-copy" data-reveal>
          <p>Founded in 2026, ANNUOTAI MEDTECH is an international medical technology company dedicated to expanding access to high-quality medical devices.</p>
          <p>We partner with manufacturers and international distributors to bring clinically valuable products to more healthcare professionals and patients through responsible market development and long-term collaboration.</p>
        </div>
      </section>

      <section className="section featured-product">
        <div className="featured-image" data-reveal>
          <img src={productDetailImage} alt="E7 GENPRO test kit with sample release agent, test cassette, and dropper on a laboratory bench" />
        </div>
        <div className="featured-copy" data-reveal>
          <p className="eyebrow">Featured Product</p>
          <h2>E7 GENPRO</h2>
          <p className="product-subtitle">HPV E7 Oncoprotein Test Kit, Colloidal Gold</p>
          <p>Designed to move cervical screening beyond viral presence and toward an active disease-related biomarker, with a visual result in 15 minutes.</p>
          <div className="metric-pair">
            <div><strong>15</strong><span>minute result</span></div>
            <div><strong>18</strong><span>month shelf life</span></div>
          </div>
          <SmartLink to="/products/e7-genpro" navigate={navigate} className="button button-dark">View Product Details</SmartLink>
        </div>
      </section>

      <section className="section audience-section">
        <div className="audience-heading" data-reveal>
          <h2>How We Create Value.</h2>
        </div>
        <div className="audience-list">
          <AudienceRow title="Distributors" text="Competitive product selection, market development, regulatory coordination, channel support, and long-term local collaboration." />
          <AudienceRow title="Hospitals And Clinicians" text="Practical medical technologies selected for clinical relevance, reliable quality, and efficient deployment." />
          <AudienceRow title="Consumers" text="Broader access to appropriate medical technologies through responsible product selection and trusted local channels." />
        </div>
      </section>

      <ContactBand navigate={navigate} />
    </>
  )
}

function AudienceRow({ title, text }: { title: string; text: string }) {
  return (
    <article className="audience-row" data-reveal>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function ProductsPage({ navigate }: NavProps) {
  return (
    <>
      <PageHero
        eyebrow="Our Portfolio"
        title="Quality Medical Technologies Selected For Greater Impact."
        text="We identify clinically relevant products with the quality, usability, and market potential to benefit more healthcare professionals and patients."
      />
      <section className="section product-catalog">
        <article className="catalog-card" data-reveal>
          <div className="catalog-image">
            <img src={productHeroImage} alt="E7 GENPRO product kit with sample release agent, test cassette, and dropper in a laboratory setting" />
          </div>
          <div className="catalog-content">
            <p className="eyebrow">Cervical Cancer Screening</p>
            <h2>E7 GENPRO</h2>
            <p className="catalog-intro">HPV E7 Oncoprotein Test Kit, Colloidal Gold</p>
            <p>Direct detection of a functional HPV biomarker associated with high-grade cervical lesions, delivered through a rapid lateral flow format.</p>
            <div className="catalog-facts">
              <span>15-minute result</span>
              <span>No analyzer</span>
              <span>2 to 30°C storage</span>
            </div>
            <SmartLink to="/products/e7-genpro" navigate={navigate} className="button button-primary">Explore E7 GENPRO</SmartLink>
          </div>
        </article>
        <div className="pipeline-note" data-reveal>
          <span>Portfolio direction</span>
          <p>Additional ANNUOTAI MEDTECH products will be introduced here as the portfolio develops.</p>
        </div>
      </section>
      <ContactBand navigate={navigate} compact />
    </>
  )
}

function ProductPage({ navigate }: NavProps) {
  return (
    <>
      <section className="product-hero">
        <div className="product-hero-copy" data-reveal>
          <p className="eyebrow">E7 GENPRO</p>
          <h1>Detect HPV E7 In 15 Minutes.</h1>
          <p>A rapid lateral flow test that directly detects HPV E7 oncoprotein in cervical specimens, with a visual result in 15 minutes.</p>
          <div className="button-row">
            <SmartLink to="/contact" navigate={navigate} className="button button-primary">Request Product Information</SmartLink>
            <a className="text-link" href={productBrochure} download>Download Brochure <span>↓</span></a>
          </div>
        </div>
        <div className="product-hero-visual" data-reveal>
          <div className="product-image-panel">
            <img src={productDetailImage} alt="E7 GENPRO HPV E7 Oncoprotein Test Kit with sample release agent, test cassette, and dropper" />
          </div>
          <div className="quick-facts">
            <div><strong>LFIA</strong><span>Test format</span></div>
            <div><strong>15 min</strong><span>Time to result</span></div>
            <div><strong>2 to 30°C</strong><span>Storage</span></div>
          </div>
        </div>
      </section>

      <section className="section mechanism-section">
        <div className="mechanism-heading" data-reveal>
          <h2>Detecting A Signal Linked To Disease Activity.</h2>
          <p>HPV DNA testing identifies viral presence. E7 GENPRO is designed to detect E7 oncoprotein expression, a functional signal associated with progression toward high-grade lesions.</p>
        </div>
        <div className="signal-map" data-reveal>
          <div className="signal-step">
            <span>Sample</span>
            <strong>Cervical specimen</strong>
            <p>Clinician-collected or self-sampled cervical swab.</p>
          </div>
          <div className="signal-line" aria-hidden="true" />
          <div className="signal-step signal-active">
            <span>Detect</span>
            <strong>E7 biomarker detection</strong>
            <p>Colloidal gold lateral flow format identifies HPV E7 oncoprotein.</p>
          </div>
          <div className="signal-line" aria-hidden="true" />
          <div className="signal-step">
            <span>Read</span>
            <strong>Visual result</strong>
            <p>Rapid readout intended to support timely clinical evaluation.</p>
          </div>
        </div>
      </section>

      <section className="evidence-section">
        <div className="evidence-intro" data-reveal>
          <p className="eyebrow">Clinical Performance</p>
          <h2>Evidence At The CIN2+ Threshold.</h2>
          <p>Prospective clinical evaluation in top-tier university hospitals in Beijing, using histopathology as the reference standard.</p>
        </div>
        <div className="evidence-grid" data-reveal>
          <Metric value="97.67%" label="Sensitivity" />
          <Metric value="93.36%" label="Specificity" />
          <Metric value="99.51%" label="Negative predictive value" />
          <div className="study-card">
            <span>Study population</span>
            <strong>N = 523</strong>
            <p>CIN3 agreement with pathology was reported as 100%.</p>
          </div>
        </div>
        <p className="evidence-note">Clinical performance data are derived from completed internal analyses. A full peer-reviewed publication is ongoing.</p>
      </section>

      <section className="section use-section">
        <div className="use-heading" data-reveal>
          <h2>Designed For Key Moments In The Screening Pathway.</h2>
        </div>
        <div className="use-list">
          <article data-reveal><span>Screen</span><h3>Regular Screening</h3><p>For high-risk individuals within appropriate cervical screening programs.</p></article>
          <article data-reveal><span>Triage</span><h3>HPV-Positive Triage</h3><p>For further risk assessment after a positive HPV DNA result.</p></article>
          <article data-reveal><span>Follow</span><h3>Postoperative Follow-Up</h3><p>For continued evaluation following treatment, according to local clinical practice.</p></article>
        </div>
      </section>

      <section className="section spec-section">
        <div className="spec-heading" data-reveal>
          <h2>Practical By Design.</h2>
        </div>
        <div className="spec-groups" data-reveal>
          <SpecGroup title="Workflow" items={[['Specimen', 'Cervical swab'], ['Collection', 'Clinician or self-sampling'], ['Result', 'Visual readout in 15 minutes']]} />
          <SpecGroup title="Operation" items={[['Analyzer', 'Not required'], ['Power', 'Not required'], ['Personnel', 'No specialized laboratory staff required']]} />
          <SpecGroup title="Logistics" items={[['Storage', '2 to 30°C'], ['Cold chain', 'Not required'], ['Shelf life', '18 months']]} />
          <SpecGroup title="Quality And Scale" items={[['Quality system', 'ISO 13485'], ['Regulatory', 'CE marked, China NMPA Class II'], ['Capacity', '50 million tests per year']]} />
        </div>
      </section>

      <section className="product-disclaimer">
        <p>For professional evaluation. Product availability, intended use, regulatory status, and clinical claims may vary by market. Refer to locally approved labeling and instructions for use.</p>
      </section>
      <ContactBand navigate={navigate} />
    </>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function SpecGroup({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="spec-group">
      <h3>{title}</h3>
      {items.map(([label, value]) => (
        <div className="spec-row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function AboutPage({ navigate }: NavProps) {
  return (
    <>
      <PageHero
        eyebrow="About ANNUOTAI MEDTECH"
        title="Advancing Access To Quality Medical Technologies."
        text="Founded in 2026, we help clinically valuable products reach more healthcare professionals and patients through responsible, long-term market development."
      />
      <section className="section about-story">
        <div className="about-statement" data-reveal>
          <p>Our Role</p>
          <h2>From Medical Innovation To Meaningful Patient Access.</h2>
          <div className="about-illustration">
            <img src={aboutGlobalAccessImage} alt="Medical technology connecting global markets and patient communities" />
          </div>
        </div>
        <div className="about-copy" data-reveal>
          <p>ANNUOTAI MEDTECH connects high-potential medical technologies with global markets by leveraging China’s advanced medical device ecosystem and manufacturing capabilities.</p>
          <p>We support the full commercialization journey, including sourcing, regulatory coordination, market access, brand development, channel support, and after-sales collaboration.</p>
          <p>Through rigorous product selection and trusted long-term partnerships, we bring innovative Chinese medical products to the world and leading international technologies to China.</p>
        </div>
      </section>
      <section className="values-section">
        <div className="values-heading" data-reveal>
          <h2>
            Professional Judgment,<br className="values-heading-break" /> Responsible Selection,<br className="values-heading-break" />{' '}
            <span className="values-heading-final-line">Long-Term Partnership.</span>
          </h2>
        </div>
        <div className="values-list">
          <article data-reveal><h3>Product Selection</h3><p>We assess clinical value, product quality, market fit, and long-term commercial potential.</p></article>
          <article data-reveal><h3>Market Development</h3><p>We support regulatory pathways, brand communication, channel development, and local market access where appropriate.</p></article>
          <article data-reveal><h3>Local Partnership</h3><p>We work toward durable relationships with manufacturers, distributors, and healthcare partners in each market.</p></article>
        </div>
      </section>
      <section className="section quality-band" data-reveal>
        <div><strong>CE</strong><span>Marked</span></div>
        <div><strong>ISO 13485</strong><span>Quality system</span></div>
        <div><strong>NMPA</strong><span>Class II</span></div>
        <p>Current certifications and regulatory references shown here relate to E7 GENPRO and its supporting materials.</p>
      </section>
      <ContactBand navigate={navigate} />
    </>
  )
}

function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus('error')
      setError('Please complete all required fields and check your email address.')
      form.reportValidity()
      return
    }
    setStatus('loading')
    setError('')

    const formData = new FormData(form)

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          organization: formData.get('organization'),
          audience: formData.get('audience'),
          message: formData.get('message'),
          website: formData.get('website'),
        }),
      })

      const result = await response.json().catch(() => null) as { error?: string } | null
      if (!response.ok) {
        throw new Error(result?.error || 'We could not send your inquiry. Please try again.')
      }

      setStatus('success')
      form.reset()
    } catch (submissionError) {
      setStatus('error')
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'We could not send your inquiry. Please try again or email us directly.',
      )
    }
  }

  return (
    <section className="contact-page">
      <div className="contact-intro" data-reveal>
        <p className="eyebrow">Contact ANNUOTAI MEDTECH</p>
        <h1>Start A Product Or Market Conversation.</h1>
        <p>For product information, distribution discussions, or clinical inquiries, reach our team directly or use the form.</p>
        <div className="direct-contact">
          <a href="mailto:contact@annuotaimedtech.com"><span>Email</span><strong>contact@annuotaimedtech.com</strong></a>
          <a href="tel:+8618210813735"><span>China</span><strong>+86 182 1081 3735</strong></a>
          <a href="tel:+16465250292"><span>United States</span><strong>+1 646 525 0292</strong></a>
        </div>
        <div className="qr-row">
          <div><img src={whatsappQr} alt="WhatsApp contact QR code" /><span>WhatsApp</span></div>
          <div><img src={wechatQr} alt="WeChat contact QR code" /><span>WeChat</span></div>
        </div>
      </div>
      <div className="form-panel" data-reveal>
        {status === 'success' ? (
          <div className="form-success" role="status">
            <span>Inquiry sent</span>
            <h2>Thank You For Your Inquiry.</h2>
            <p>Your message has been sent to our team. We will respond using the email address you provided.</p>
            <a className="button button-primary" href="mailto:contact@annuotaimedtech.com">Email Us Directly</a>
            <button type="button" className="text-button" onClick={() => setStatus('idle')}>Send another inquiry</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="form-heading">
              <span>Inquiry form</span>
              <h2>How Can We Help?</h2>
            </div>
            <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="field-row">
              <label>First name<input name="firstName" autoComplete="given-name" maxLength={80} required /></label>
              <label>Last name<input name="lastName" autoComplete="family-name" maxLength={80} required /></label>
            </div>
            <label>Work email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
            <label>Organization<input name="organization" autoComplete="organization" maxLength={160} required /></label>
            <label>I am a
              <select name="audience" defaultValue="Distributor" required>
                <option>Distributor</option>
                <option>Hospital or clinician</option>
                <option>Consumer</option>
                <option>Other</option>
              </select>
            </label>
            <label>Message<textarea name="message" rows={5} maxLength={4000} required placeholder="Tell us about your market, clinical setting, or product question." /></label>
            {status === 'error' && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary form-submit" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending inquiry...' : 'Submit inquiry'}
            </button>
            <p className="form-privacy">By submitting, you agree that ANNUOTAI MEDTECH may contact you about this inquiry.</p>
          </form>
        )}
      </div>
    </section>
  )
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-hero">
      <div data-reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <p className="page-hero-text" data-reveal>{text}</p>
    </section>
  )
}

function ContactBand({ navigate, compact = false }: NavProps & { compact?: boolean }) {
  return (
    <section className={compact ? 'contact-band is-compact' : 'contact-band'}>
      <div data-reveal>
        <p>Have A Product Or Market Opportunity?</p>
        <h2>Help The Right Medical Technologies Reach More Patients.</h2>
      </div>
      <SmartLink to="/contact" navigate={navigate} className="button button-light">Contact Our Team</SmartLink>
    </section>
  )
}

export default App
