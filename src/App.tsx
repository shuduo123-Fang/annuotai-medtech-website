import { AnchorHTMLAttributes, FocusEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import companyLogo from '../assets/annuotai-logo-transparent.png'
import wechatQr from '../assets/contact-wechat.jpg'
import whatsappQr from '../assets/contact-whatsapp.jpg'
import productHeroImage from '../assets/e7-product-studio-2-fallback.jpg'
import productHero640Avif from '../assets/e7-product-studio-2-640.avif'
import productHero1280Avif from '../assets/e7-product-studio-2-1280.avif'
import productHero1920Avif from '../assets/e7-product-studio-2-1920.avif'
import productHero640Webp from '../assets/e7-product-studio-2-640.webp'
import productHero1280Webp from '../assets/e7-product-studio-2-1280.webp'
import productHero1920Webp from '../assets/e7-product-studio-2-1920.webp'
import productDetailImage from '../assets/e7-product-studio-1-fallback.jpg'
import productDetail640Avif from '../assets/e7-product-studio-1-640.avif'
import productDetail1280Avif from '../assets/e7-product-studio-1-1280.avif'
import productDetail1920Avif from '../assets/e7-product-studio-1-1920.avif'
import productDetail640Webp from '../assets/e7-product-studio-1-640.webp'
import productDetail1280Webp from '../assets/e7-product-studio-1-1280.webp'
import productDetail1920Webp from '../assets/e7-product-studio-1-1920.webp'
import aboutGlobalAccessImage from '../assets/about-global-access-fallback.png'
import aboutGlobal640Avif from '../assets/about-global-access-640.avif'
import aboutGlobal1280Avif from '../assets/about-global-access-1280.avif'
import aboutGlobal1920Avif from '../assets/about-global-access-1920.avif'
import aboutGlobal640Webp from '../assets/about-global-access-640.webp'
import aboutGlobal1280Webp from '../assets/about-global-access-1280.webp'
import aboutGlobal1920Webp from '../assets/about-global-access-1920.webp'
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

const productHeroSources = {
  avif: `${productHero640Avif} 640w, ${productHero1280Avif} 1280w, ${productHero1920Avif} 1920w`,
  webp: `${productHero640Webp} 640w, ${productHero1280Webp} 1280w, ${productHero1920Webp} 1920w`,
  fallback: productHeroImage,
  width: 2156,
  height: 1984,
}

const productDetailSources = {
  avif: `${productDetail640Avif} 640w, ${productDetail1280Avif} 1280w, ${productDetail1920Avif} 1920w`,
  webp: `${productDetail640Webp} 640w, ${productDetail1280Webp} 1280w, ${productDetail1920Webp} 1920w`,
  fallback: productDetailImage,
  width: 2156,
  height: 1984,
}

const aboutGlobalSources = {
  avif: `${aboutGlobal640Avif} 640w, ${aboutGlobal1280Avif} 1280w, ${aboutGlobal1920Avif} 1920w`,
  webp: `${aboutGlobal640Webp} 640w, ${aboutGlobal1280Webp} 1280w, ${aboutGlobal1920Webp} 1920w`,
  fallback: aboutGlobalAccessImage,
  width: 2816,
  height: 1536,
}

type ResponsiveImageProps = {
  sources: typeof productHeroSources
  alt: string
  sizes: string
  priority?: boolean
}

function ResponsiveImage({ sources, alt, sizes, priority = false }: ResponsiveImageProps) {
  return (
    <picture className="responsive-picture">
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img
        src={sources.fallback}
        width={sources.width}
        height={sources.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}

function normalisePath(pathname: string): Route {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return routes.includes(path as Route) ? (path as Route) : '/'
}

function App() {
  const [path, setPath] = useState<Route>(() => normalisePath(window.location.pathname))
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef<Route>(path)

  useEffect(() => {
    const handlePopState = () => setPath(normalisePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = routeTitles[path]
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMenuOpen(false)
    if (previousPath.current !== path) {
      mainRef.current?.focus({ preventScroll: true })
    }
    previousPath.current = path
  }, [path])

  useEffect(() => {
    const root = document.documentElement
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    root.classList.add('reveal-enabled')
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
    return () => {
      observer.disconnect()
      root.classList.remove('reveal-enabled')
    }
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
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header path={path} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main-content" ref={mainRef} tabIndex={-1}>{page}</main>
      <Footer navigate={navigate} />
    </div>
  )
}

type NavProps = {
  path?: Route
  navigate: (route: Route) => void
}

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  to: Route
  navigate: NavProps['navigate']
  children: ReactNode
}

function SmartLink({ to, navigate, children, className = '', ...anchorProps }: SmartLinkProps) {
  return (
    <a
      href={to}
      className={className}
      {...anchorProps}
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
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navItems: { label: string; href: Route }[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ]

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen, setMenuOpen])

  const navigateFromHeader = (route: Route) => {
    setMenuOpen(false)
    navigate(route)
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <SmartLink to="/" navigate={navigateFromHeader} className="brand-link" aria-label="ANNUOTAI MEDTECH home">
          <img src={companyLogo} width="900" height="207" alt="ANNUOTAI MEDTECH" decoding="async" />
        </SmartLink>
        <nav id="primary-navigation" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          {navItems.map(item => (
            <SmartLink
              key={item.href}
              to={item.href}
              navigate={navigateFromHeader}
              className={path === item.href || (item.href === '/products' && path === '/products/e7-genpro') ? 'active' : ''}
              aria-current={path === item.href ? 'page' : undefined}
            >
              {item.label}
            </SmartLink>
          ))}
          <SmartLink
            to="/contact"
            navigate={navigateFromHeader}
            className={path === '/contact' ? 'nav-contact active' : 'nav-contact'}
            aria-current={path === '/contact' ? 'page' : undefined}
          >
            Contact
          </SmartLink>
        </nav>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="primary-navigation"
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
          <img src={companyLogo} width="900" height="207" alt="ANNUOTAI MEDTECH" loading="lazy" decoding="async" />
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
        <div className="hero-copy">
          <p className="eyebrow">International Medical Technology</p>
          <h1>Bringing Quality Medical Innovation To More Patients.</h1>
          <p className="hero-lede">We help clinically valuable technologies reach the healthcare professionals and patients who need them most.</p>
          <div className="button-row">
            <SmartLink to="/products" navigate={navigate} className="button button-primary">Explore Products</SmartLink>
            <SmartLink to="/contact" navigate={navigate} className="text-link">Work With Us <span>↗</span></SmartLink>
          </div>
        </div>

        <div className="hero-visual">
          <div className="product-stage">
            <ResponsiveImage
              sources={productHeroSources}
              alt="E7 GENPRO test kit with sample release agent, test cassette, and dropper in a laboratory setting"
              sizes="(max-width: 820px) calc(100vw - 60px), (max-width: 1100px) calc(100vw - 64px), 47vw"
              priority
            />
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
          <ResponsiveImage
            sources={productDetailSources}
            alt="E7 GENPRO test kit with sample release agent, test cassette, and dropper on a laboratory bench"
            sizes="(max-width: 820px) calc(100vw - 36px), 50vw"
          />
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
            <ResponsiveImage
              sources={productHeroSources}
              alt="E7 GENPRO product kit with sample release agent, test cassette, and dropper in a laboratory setting"
              sizes="(max-width: 820px) calc(100vw - 36px), 52vw"
            />
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
        <div className="product-hero-copy">
          <p className="eyebrow">E7 GENPRO</p>
          <h1>Detect HPV E7 In 15 Minutes.</h1>
          <p>A rapid lateral flow test that directly detects HPV E7 oncoprotein in cervical specimens, with a visual result in 15 minutes.</p>
          <div className="button-row">
            <SmartLink to="/contact" navigate={navigate} className="button button-primary">Request Product Information</SmartLink>
            <a className="text-link" href={productBrochure} download>Download Brochure <span>↓</span></a>
          </div>
        </div>
        <div className="product-hero-visual">
          <div className="product-image-panel">
            <ResponsiveImage
              sources={productDetailSources}
              alt="E7 GENPRO HPV E7 Oncoprotein Test Kit with sample release agent, test cassette, and dropper"
              sizes="(max-width: 820px) calc(100vw - 36px), 50vw"
              priority
            />
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
            <ResponsiveImage
              sources={aboutGlobalSources}
              alt="Medical technology connecting global markets and patient communities"
              sizes="(max-width: 820px) calc(100vw - 36px), 45vw"
            />
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

type InquiryField = 'firstName' | 'lastName' | 'email' | 'organization' | 'audience' | 'message'
type InquiryFieldErrors = Partial<Record<InquiryField, string>>
type InquiryControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const inquiryFields: InquiryField[] = ['firstName', 'lastName', 'email', 'organization', 'audience', 'message']

function getInquiryFieldError(field: InquiryField, control: InquiryControl) {
  if (!control.value.trim()) {
    const labels: Record<InquiryField, string> = {
      firstName: 'Enter your first name.',
      lastName: 'Enter your last name.',
      email: 'Enter your work email address.',
      organization: 'Enter your organization.',
      audience: 'Select the option that best describes you.',
      message: 'Tell us how we can help.',
    }
    return labels[field]
  }
  if (field === 'email' && control.validity.typeMismatch) {
    return 'Enter a valid email address, such as name@company.com.'
  }
  return ''
}

function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({})
  const successRef = useRef<HTMLDivElement>(null)
  const formHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const updateFieldError = (field: InquiryField, message: string) => {
    setFieldErrors(current => {
      const next = { ...current }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  const validateOnBlur = (event: FocusEvent<InquiryControl>) => {
    const field = event.currentTarget.name as InquiryField
    updateFieldError(field, getInquiryFieldError(field, event.currentTarget))
  }

  const clearFieldError = (field: InquiryField) => {
    if (fieldErrors[field]) updateFieldError(field, '')
  }

  const fieldAccessibility = (field: InquiryField) => ({
    'aria-invalid': Boolean(fieldErrors[field]),
    'aria-describedby': fieldErrors[field] ? `${field}-error` : undefined,
  })

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const nextFieldErrors: InquiryFieldErrors = {}
    inquiryFields.forEach(field => {
      const control = form.elements.namedItem(field)
      if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) {
        const message = getInquiryFieldError(field, control)
        if (message) nextFieldErrors[field] = message
      }
    })

    const firstInvalidField = inquiryFields.find(field => nextFieldErrors[field])
    if (firstInvalidField) {
      setFieldErrors(nextFieldErrors)
      setStatus('idle')
      setError('')
      window.requestAnimationFrame(() => {
        const control = form.elements.namedItem(firstInvalidField)
        if (control instanceof HTMLElement) control.focus()
      })
      return
    }

    setStatus('loading')
    setError('')
    setFieldErrors({})

    const formData = new FormData(form)
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
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
        submissionError instanceof DOMException && submissionError.name === 'AbortError'
          ? 'The request timed out. Please try again.'
          : submissionError instanceof Error
          ? submissionError.message
          : 'We could not send your inquiry. Please try again or email us directly.',
      )
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  const startAnotherInquiry = () => {
    setStatus('idle')
    setError('')
    setFieldErrors({})
    window.requestAnimationFrame(() => formHeadingRef.current?.focus())
  }

  return (
    <section className="contact-page">
      <div className="contact-intro">
        <p className="eyebrow">Contact ANNUOTAI MEDTECH</p>
        <h1>Start A Product Or Market Conversation.</h1>
        <p>For product information, distribution discussions, or clinical inquiries, reach our team directly or use the form.</p>
        <div className="direct-contact">
          <a href="mailto:contact@annuotaimedtech.com"><span>Email</span><strong>contact@annuotaimedtech.com</strong></a>
          <a href="tel:+8618210813735"><span>China</span><strong>+86 182 1081 3735</strong></a>
          <a href="tel:+16465250292"><span>United States</span><strong>+1 646 525 0292</strong></a>
        </div>
        <div className="qr-row">
          <div><img src={whatsappQr} width="680" height="666" alt="WhatsApp contact QR code" loading="lazy" decoding="async" /><span>WhatsApp</span></div>
          <div><img src={wechatQr} width="799" height="716" alt="WeChat contact QR code" loading="lazy" decoding="async" /><span>WeChat</span></div>
        </div>
      </div>
      <div className="form-panel">
        {status === 'success' ? (
          <div ref={successRef} className="form-success" role="status" tabIndex={-1}>
            <span>Inquiry sent</span>
            <h2>Thank You For Your Inquiry.</h2>
            <p>Your message has been sent to our team. We will respond using the email address you provided.</p>
            <a className="button button-primary" href="mailto:contact@annuotaimedtech.com">Email Us Directly</a>
            <button type="button" className="text-button" onClick={startAnotherInquiry}>Send another inquiry</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate aria-busy={status === 'loading'}>
            <div className="form-heading">
              <span>Inquiry form</span>
              <h2 ref={formHeadingRef} tabIndex={-1}>How Can We Help?</h2>
              <p className="form-required-note">All fields are required.</p>
            </div>
            <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="field-row">
              <label htmlFor="inquiry-first-name">
                <span>First name</span>
                <input id="inquiry-first-name" name="firstName" autoComplete="given-name" maxLength={80} required onBlur={validateOnBlur} onChange={() => clearFieldError('firstName')} {...fieldAccessibility('firstName')} />
                {fieldErrors.firstName && <p id="firstName-error" className="field-error">{fieldErrors.firstName}</p>}
              </label>
              <label htmlFor="inquiry-last-name">
                <span>Last name</span>
                <input id="inquiry-last-name" name="lastName" autoComplete="family-name" maxLength={80} required onBlur={validateOnBlur} onChange={() => clearFieldError('lastName')} {...fieldAccessibility('lastName')} />
                {fieldErrors.lastName && <p id="lastName-error" className="field-error">{fieldErrors.lastName}</p>}
              </label>
            </div>
            <label htmlFor="inquiry-email">
              <span>Work email</span>
              <input id="inquiry-email" name="email" type="email" autoComplete="email" maxLength={254} required onBlur={validateOnBlur} onChange={() => clearFieldError('email')} {...fieldAccessibility('email')} />
              {fieldErrors.email && <p id="email-error" className="field-error">{fieldErrors.email}</p>}
            </label>
            <label htmlFor="inquiry-organization">
              <span>Organization</span>
              <input id="inquiry-organization" name="organization" autoComplete="organization" maxLength={160} required onBlur={validateOnBlur} onChange={() => clearFieldError('organization')} {...fieldAccessibility('organization')} />
              {fieldErrors.organization && <p id="organization-error" className="field-error">{fieldErrors.organization}</p>}
            </label>
            <label htmlFor="inquiry-audience">
              <span>I am a</span>
              <select id="inquiry-audience" name="audience" defaultValue="Distributor" required onBlur={validateOnBlur} onChange={() => clearFieldError('audience')} {...fieldAccessibility('audience')}>
                <option>Distributor</option>
                <option>Hospital or clinician</option>
                <option>Consumer</option>
                <option>Other</option>
              </select>
              {fieldErrors.audience && <p id="audience-error" className="field-error">{fieldErrors.audience}</p>}
            </label>
            <label htmlFor="inquiry-message">
              <span>Message</span>
              <textarea id="inquiry-message" name="message" rows={5} maxLength={4000} required placeholder="Tell us about your market, clinical setting, or product question." onBlur={validateOnBlur} onChange={() => clearFieldError('message')} {...fieldAccessibility('message')} />
              {fieldErrors.message && <p id="message-error" className="field-error">{fieldErrors.message}</p>}
            </label>
            {status === 'error' && <p className="form-error" role="alert">{error} <a href="mailto:contact@annuotaimedtech.com">Email us directly.</a></p>}
            <button className="button button-primary form-submit" type="submit" disabled={status === 'loading'}>
              <span aria-live="polite">{status === 'loading' ? 'Sending inquiry...' : 'Submit inquiry'}</span>
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
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <p className="page-hero-text">{text}</p>
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
