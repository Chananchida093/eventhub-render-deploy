import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import {
  ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Edit3, Eye, LogOut,
  MapPin, Menu, Plus, Search, TicketCheck, Trash2, UserRound, Users, X,
} from 'lucide-react'

const translations = {
  en: {
    discover: 'Discover', events: 'Events', registrations: 'My registrations', manage: 'Manage events', signIn: 'Sign in', signOut: 'Sign out', member: 'Member', administrator: 'Administrator',
    heroEyebrow: 'Campus events · August—September', heroTitle: 'Find something<br />worth showing up for.', heroBody: 'Workshops, talks, and community gatherings—curated in one place.', browse: 'Browse upcoming events', upcoming: 'Upcoming events', eventCount: ({ count }) => `${count} ${count === 1 ? 'event' : 'events'}`, search: 'Search by title or place', all: 'All', available: 'Available', registered: 'Registered',
    registrationOpen: 'Registration open', full: 'Full', ended: 'Ended', register: 'Register', eventFull: 'Event full', closed: 'Closed', spotsLeft: 'spots left', of: 'of', confirmed: 'Confirmed', cancel: 'Cancel registration', yourSchedule: 'Your schedule', myRegistrations: 'My registrations', scheduleBody: 'Everything you’ve signed up for, in one place.', noRegistrations: 'No registrations yet', browseSave: 'Browse upcoming events and save your spot.',
    administration: 'Administration', manageEvents: 'Manage events', manageBody: 'Create events, monitor capacity, and see who’s coming.', createEvent: 'Create event', totalEvents: 'total events', accepting: 'accepting registration', totalRegistrations: 'total registrations', event: 'Event', datePlace: 'Date & place', capacity: 'Capacity', status: 'Status', actions: 'Actions', viewAttendees: 'View attendees for {{name}}', edit: 'Edit {{name}}', delete: 'Delete {{name}}',
    newEvent: 'New event', editEvent: 'Edit event', eventTitle: 'Event title', description: 'Description', location: 'Location', dateTime: 'Date & time', maximum: 'Maximum attendees', cancelAction: 'Cancel', saveChanges: 'Save changes', saving: 'Saving…', temporaryTitle: 'e.g. Product Design Workshop', descriptionHint: 'What will attendees learn or experience?', locationHint: 'Building and room', registrationList: 'Registration list', spotsFilled: '{{count}} of {{capacity}} spots filled', noAttendees: 'No registrations yet', attendeesBody: 'Attendees will appear here after they register.',
    memberAccess: 'Member access', signInTitle: 'Sign in to register', signInBody: 'Your registrations stay tied to your account, so you can manage them anytime.', email: 'Email', password: 'Password', signingIn: 'Signing in…', demoAccounts: 'Demo accounts', userDemo: 'User: user@event.local / password', adminDemo: 'Admin: admin@event.local / admin123',
    cancelTitle: 'Cancel your registration?', cancelBody: 'Your spot for {{name}} will become available to someone else.', keep: 'Keep it', yesCancel: 'Yes, cancel', working: 'Working…', deleteTitle: 'Delete {{name}}?', deleteBody: 'This permanently removes the event and all registrations. This action cannot be undone.', deleteEvent: 'Delete event',
    noEvents: 'No events found', noEventsSearch: 'Try a shorter search or clear your filters.', noEventsSoon: 'New events will appear here soon.', footer: 'Gather / Event registration platform', footerBody: 'Built for campus communities',
    welcome: 'Welcome back, {{name}}', going: 'You’re going to {{name}}', cancelled: 'Registration cancelled', signedOut: 'You’re signed out', eventDeleted: 'Event deleted', eventUpdated: 'Event updated', eventCreated: 'Event created',
    errorCredentials: 'Email or password is incorrect.', close: 'Close', openNavigation: 'Open navigation',
  },
  th: {
    discover: 'ค้นหาอีเวนต์', events: 'อีเวนต์', registrations: 'การลงทะเบียนของฉัน', manage: 'จัดการอีเวนต์', signIn: 'เข้าสู่ระบบ', signOut: 'ออกจากระบบ', member: 'สมาชิก', administrator: 'ผู้ดูแลระบบ',
    heroEyebrow: 'อีเวนต์ในมหาวิทยาลัย · สิงหาคม—กันยายน', heroTitle: 'หาอีเวนต์ที่คุ้มค่า จนอยากมาเจอกันจริง ๆ', heroBody: 'เวิร์กช็อป ทอล์ก และกิจกรรมชุมชน รวมไว้ให้ค้นหาในที่เดียว', browse: 'ดูอีเวนต์ที่กำลังจะมาถึง', upcoming: 'อีเวนต์ที่กำลังจะมาถึง', eventCount: ({ count }) => `${count} อีเวนต์`, search: 'ค้นหาจากชื่อหรือสถานที่', all: 'ทั้งหมด', available: 'ยังมีที่ว่าง', registered: 'ลงทะเบียนแล้ว',
    registrationOpen: 'เปิดรับลงทะเบียน', full: 'เต็มแล้ว', ended: 'ปิดรับแล้ว', register: 'ลงทะเบียน', eventFull: 'ที่นั่งเต็ม', closed: 'ปิดรับสมัคร', spotsLeft: 'ที่นั่งเหลือ', of: 'จาก', confirmed: 'ยืนยันแล้ว', cancel: 'ยกเลิกการลงทะเบียน', yourSchedule: 'ตารางของคุณ', myRegistrations: 'การลงทะเบียนของฉัน', scheduleBody: 'รวมทุกอีเวนต์ที่คุณลงทะเบียนไว้ในที่เดียว', noRegistrations: 'ยังไม่มีการลงทะเบียน', browseSave: 'ค้นหาอีเวนต์ที่สนใจแล้วจองที่นั่งของคุณ',
    administration: 'การจัดการระบบ', manageEvents: 'จัดการอีเวนต์', manageBody: 'สร้างอีเวนต์ ตรวจสอบจำนวนที่นั่ง และดูรายชื่อผู้เข้าร่วม', createEvent: 'สร้างอีเวนต์', totalEvents: 'อีเวนต์ทั้งหมด', accepting: 'กำลังเปิดรับสมัคร', totalRegistrations: 'การลงทะเบียนทั้งหมด', event: 'อีเวนต์', datePlace: 'วันเวลาและสถานที่', capacity: 'จำนวนที่นั่ง', status: 'สถานะ', actions: 'จัดการ', viewAttendees: 'ดูผู้เข้าร่วม {{name}}', edit: 'แก้ไข {{name}}', delete: 'ลบ {{name}}',
    newEvent: 'อีเวนต์ใหม่', editEvent: 'แก้ไขอีเวนต์', eventTitle: 'ชื่ออีเวนต์', description: 'รายละเอียด', location: 'สถานที่', dateTime: 'วันและเวลา', maximum: 'จำนวนผู้เข้าร่วมสูงสุด', cancelAction: 'ยกเลิก', saveChanges: 'บันทึกการแก้ไข', saving: 'กำลังบันทึก…', temporaryTitle: 'เช่น เวิร์กช็อปออกแบบผลิตภัณฑ์', descriptionHint: 'ผู้เข้าร่วมจะได้เรียนรู้หรือสัมผัสอะไรบ้าง', locationHint: 'อาคารและห้อง', registrationList: 'รายชื่อผู้ลงทะเบียน', spotsFilled: 'ใช้ไป {{count}} จาก {{capacity}} ที่นั่ง', noAttendees: 'ยังไม่มีผู้ลงทะเบียน', attendeesBody: 'รายชื่อผู้เข้าร่วมจะแสดงที่นี่เมื่อมีการลงทะเบียน',
    memberAccess: 'สำหรับสมาชิก', signInTitle: 'เข้าสู่ระบบเพื่อลงทะเบียน', signInBody: 'รายการลงทะเบียนจะผูกกับบัญชีของคุณ เพื่อให้กลับมาจัดการได้ทุกเมื่อ', email: 'อีเมล', password: 'รหัสผ่าน', signingIn: 'กำลังเข้าสู่ระบบ…', demoAccounts: 'บัญชีสำหรับทดลองใช้', userDemo: 'ผู้ใช้: user@event.local / password', adminDemo: 'ผู้ดูแล: admin@event.local / admin123',
    cancelTitle: 'ยกเลิกการลงทะเบียนนี้ไหม', cancelBody: 'ที่นั่งของคุณสำหรับ {{name}} จะถูกเปิดให้คนอื่นลงทะเบียน', keep: 'เก็บไว้ก่อน', yesCancel: 'ใช่ ยกเลิกเลย', working: 'กำลังดำเนินการ…', deleteTitle: 'ลบ {{name}} ไหม', deleteBody: 'อีเวนต์และการลงทะเบียนทั้งหมดจะถูกลบถาวรและไม่สามารถย้อนกลับได้', deleteEvent: 'ลบอีเวนต์',
    noEvents: 'ไม่พบอีเวนต์', noEventsSearch: 'ลองค้นหาด้วยคำที่สั้นลง หรือล้างตัวกรอง', noEventsSoon: 'อีเวนต์ใหม่จะแสดงที่นี่เร็ว ๆ นี้', footer: 'Gather / แพลตฟอร์มลงทะเบียนอีเวนต์', footerBody: 'สร้างพื้นที่ให้ชุมชนในมหาวิทยาลัย',
    welcome: 'ยินดีต้อนรับกลับ {{name}}', going: 'คุณกำลังจะไป {{name}}', cancelled: 'ยกเลิกการลงทะเบียนแล้ว', signedOut: 'ออกจากระบบแล้ว', eventDeleted: 'ลบอีเวนต์แล้ว', eventUpdated: 'แก้ไขอีเวนต์แล้ว', eventCreated: 'สร้างอีเวนต์แล้ว',
    errorCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', close: 'ปิด', openNavigation: 'เปิดเมนูนำทาง',
  },
}

const eventTranslations = {
  'Designing for Real People': { title: 'ออกแบบเพื่อผู้คนจริง', description: 'เวิร์กช็อปลงมือทำเพื่อเปลี่ยนอินไซต์จากการรีเสิร์ชให้เป็นอินเทอร์เฟซที่คนเข้าใจและไว้วางใจ', location: 'Creative Hall อาคาร A' },
  'Spring Boot at Scale': { title: 'Spring Boot สำหรับระบบที่ขยายได้', description: 'เรียนรู้การสร้างบริการที่เสถียรด้วยขอบเขตธุรกรรม การสังเกตระบบ และสถาปัตยกรรมที่ใช้งานได้จริง', location: 'Engineering Lab 3' },
  'Campus Product Night': { title: 'คืนแห่งโปรดักต์ในมหาวิทยาลัย', description: 'ทีมสตัดดี้แชร์ต้นแบบ บทเรียน และเหตุผลเบื้องหลังการตัดสินใจสร้างผลิตภัณฑ์', location: 'หอประชุมใหญ่' },
  'Accessibility Testing Lab': { title: 'แล็บทดสอบเพื่อการเข้าถึง', description: 'นำอินเทอร์เฟซของคุณมาทดสอบด้วยคีย์บอร์ด โปรแกรมอ่านหน้าจอ และเช็กลิสต์คอนทราสต์ที่ทำซ้ำได้', location: 'Digital Studio 2' },
}

function t(locale, key, vars = {}) {
  const value = translations[locale]?.[key] ?? translations.en[key] ?? key
  if (typeof value === 'function') return value(vars)
  return value.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? '')
}
function formatDate(value, locale) { return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) }
function formatTime(value, locale) { return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)) }
function formatMonth(value, locale) { return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', { month: 'short' }).format(new Date(value)) }
function eventCopy(event, locale) { return locale === 'th' ? (eventTranslations[event.title] ?? event) : event }

function App() {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)
  const [view, setView] = useState('events')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [locale, setLocale] = useState(() => localStorage.getItem('gather-locale') || 'th')

  useEffect(() => {
    localStorage.setItem('gather-locale', locale)
    document.documentElement.lang = locale === 'th' ? 'th' : 'en'
  }, [locale])

  async function refresh() {
    const data = await api.events()
    setEvents(data)
  }

  useEffect(() => {
    Promise.all([api.events(), api.me().catch(() => null)])
      .then(([eventData, currentUser]) => { setEvents(eventData); setUser(currentUser) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleRegister(event) {
    if (!user) { setModal({ type: 'login', afterLoginEvent: event }); return }
    try {
      await api.register(event.id); await refresh()
      setToast({ message: t(locale, 'going', { name: eventCopy(event, locale).title }), tone: 'success' })
    } catch (error) { setToast({ message: error.message, tone: 'error' }) }
  }

  async function handleCancel(event, onDone) {
    setModal({ type: 'confirm', title: t(locale, 'cancelTitle'), body: t(locale, 'cancelBody', { name: eventCopy(event, locale).title }), action: async () => {
      await api.cancel(event.id); await refresh(); await onDone?.(); setModal(null)
      setToast({ message: t(locale, 'cancelled'), tone: 'success' })
    }})
  }

  async function logout() {
    await api.logout(); setUser(null); setView('events'); await refresh(); setMenuOpen(false)
    setToast({ message: t(locale, 'signedOut'), tone: 'success' })
  }

  const isAdmin = user?.role === 'ADMIN'
  const navItems = isAdmin
    ? [{ id: 'events', label: t(locale, 'events') }, { id: 'admin', label: t(locale, 'manage') }]
    : [{ id: 'events', label: t(locale, 'discover') }, ...(user ? [{ id: 'registrations', label: t(locale, 'registrations') }] : [])]

  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setView('events') }} aria-label="Gather home">
        <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
        <span>Gather</span>
      </a>
      <nav className="desktop-nav" aria-label={t(locale, 'discover')}>
        {navItems.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}>{item.label}</button>)}
      </nav>
      <div className="header-actions">
        <button className="language-toggle" onClick={() => setLocale(locale === 'th' ? 'en' : 'th')} aria-label={locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}>{locale === 'th' ? 'EN' : 'ไทย'}</button>
        {user ? <div className="account-wrap">
          <button className="account-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>
            <span className="avatar">{user.name.charAt(0)}</span><span className="account-copy"><strong>{user.name}</strong><small>{isAdmin ? t(locale, 'administrator') : t(locale, 'member')}</small></span><ChevronDown size={16} />
          </button>
          {menuOpen && <div className="account-menu"><span>{user.email}</span><button onClick={logout}><LogOut size={16} /> {t(locale, 'signOut')}</button></div>}
        </div> : <button className="button button-dark button-small" onClick={() => setModal({ type: 'login' })}>{t(locale, 'signIn')}</button>}
        <button className="mobile-menu" aria-label={t(locale, 'openNavigation')} onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label={t(locale, 'discover')}>
        {navItems.map(item => <button key={item.id} onClick={() => { setView(item.id); setMenuOpen(false) }}>{item.label}</button>)}
        {!user && <button onClick={() => { setModal({ type: 'login' }); setMenuOpen(false) }}>{t(locale, 'signIn')}</button>}
        {user && <button onClick={logout}>{t(locale, 'signOut')}</button>}
      </nav>}
    </header>

    <main>
      {loading ? <Loading /> : view === 'events' ? <Discover events={events} user={user} onRegister={handleRegister} locale={locale} />
        : view === 'registrations' ? <MyRegistrations onCancel={handleCancel} locale={locale} />
        : <AdminDashboard events={events} refresh={refresh} setModal={setModal} setToast={setToast} locale={locale} />}
    </main>
    <footer><span>{t(locale, 'footer')}</span><span>{t(locale, 'footerBody')}</span></footer>
    {modal?.type === 'login' && <LoginModal modal={modal} setModal={setModal} setUser={setUser} refresh={refresh} setToast={setToast} locale={locale} />}
    {modal?.type === 'confirm' && <ConfirmModal modal={modal} setModal={setModal} locale={locale} />}
    {toast && <div className={`toast ${toast.tone}`} role="status"><Check size={17} />{toast.message}</div>}
  </div>
}

function Discover({ events, user, onRegister, locale }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const visible = useMemo(() => events.filter(event => {
    const copy = eventCopy(event, locale)
    const matches = `${copy.title} ${copy.description} ${copy.location}`.toLowerCase().includes(query.toLowerCase())
    return matches && (filter === 'all' || (filter === 'available' && event.status === 'OPEN') || (filter === 'registered' && event.registered))
  }), [events, query, filter, locale])
  const featured = visible[0]

  return <>
    <section className="hero container">
      <div className="eyebrow">{t(locale, 'heroEyebrow')}</div>
      <div className="hero-grid">
        <h1 className={`hero-title locale-${locale}`} dangerouslySetInnerHTML={{ __html: t(locale, 'heroTitle') }} />
        <div className="hero-aside"><p>{t(locale, 'heroBody')}</p>
          {!user && <button className="text-link" onClick={() => document.querySelector('.events-section')?.scrollIntoView({ behavior: 'smooth' })}>{t(locale, 'browse')} <ArrowRight size={17} /></button>}
        </div>
      </div>
    </section>

    <section className="events-section container" aria-labelledby="upcoming-heading">
      <div className="section-heading">
        <div><span className="section-index">01</span><h2 id="upcoming-heading">{t(locale, 'upcoming')}</h2></div>
        <span className="event-count">{t(locale, 'eventCount', { count: visible.length })}</span>
      </div>
      <div className="event-tools">
        <label className="search"><Search size={18} /><span className="sr-only">{t(locale, 'search')}</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t(locale, 'search')} /></label>
        <div className="filter-group" aria-label={t(locale, 'status')}>
          {[['all',t(locale, 'all')],['available',t(locale, 'available')], ...(user ? [['registered',t(locale, 'registered')]] : [])].map(([id,label]) => <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>)}
        </div>
      </div>
      {featured ? <div className="event-list">
        <FeaturedEvent event={featured} onRegister={onRegister} locale={locale} />
        {visible.slice(1).map(event => <EventRow key={event.id} event={event} onRegister={onRegister} locale={locale} />)}
      </div> : <EmptyState query={query} locale={locale} />}
    </section>
  </>
}

function FeaturedEvent({ event, onRegister, locale }) {
  const date = new Date(event.startsAt)
  const copy = eventCopy(event, locale)
  return <article className="featured-event">
    <div className="date-block"><span>{formatMonth(event.startsAt, locale)}</span><strong>{date.getDate()}</strong></div>
    <div className="featured-main">
      <div className="event-meta"><Status event={event} locale={locale} /><span><Clock3 size={15} />{formatTime(event.startsAt, locale)}</span><span><MapPin size={15} />{copy.location}</span></div>
      <h3>{copy.title}</h3><p>{copy.description}</p>
      <div className="capacity-line"><div><span style={{ width: `${Math.min(100, event.registeredCount / event.capacity * 100)}%` }} /></div><small>{event.spotsLeft} {t(locale, 'of')} {event.capacity} {t(locale, 'spotsLeft')}</small></div>
    </div>
    <EventAction event={event} onRegister={onRegister} locale={locale} />
  </article>
}

function EventRow({ event, onRegister, locale }) {
  const date = new Date(event.startsAt)
  const copy = eventCopy(event, locale)
  return <article className="event-row">
    <div className="row-date"><strong>{date.getDate()}</strong><span>{formatMonth(event.startsAt, locale)}</span></div>
    <div className="row-title"><Status event={event} locale={locale} /><h3>{copy.title}</h3><p>{copy.description}</p></div>
    <div className="row-details"><span><CalendarDays size={16} />{formatDate(event.startsAt, locale)}</span><span><MapPin size={16} />{copy.location}</span></div>
    <div className="row-capacity"><strong>{event.spotsLeft}</strong><span>{t(locale, 'spotsLeft')}</span></div>
    <EventAction event={event} onRegister={onRegister} locale={locale} />
  </article>
}

function Status({ event, locale }) {
  const labels = { OPEN: t(locale, 'registrationOpen'), FULL: t(locale, 'full'), ENDED: t(locale, 'ended') }
  return <span className={`status status-${event.status.toLowerCase()}`}>{event.registered ? t(locale, 'registered') : labels[event.status]}</span>
}

function EventAction({ event, onRegister, locale }) {
  if (event.registered) return <button className="button button-confirmed" disabled><TicketCheck size={17} /> {t(locale, 'registered')}</button>
  return <button className="button button-outline" disabled={event.status !== 'OPEN'} onClick={() => onRegister(event)}>
    {event.status === 'OPEN' ? t(locale, 'register') : event.status === 'FULL' ? t(locale, 'eventFull') : t(locale, 'closed')} {event.status === 'OPEN' && <ArrowRight size={16} />}
  </button>
}

function MyRegistrations({ onCancel, locale }) {
  const [items, setItems] = useState(null)
  const loadRegistrations = () => api.registrations().then(setItems)
  useEffect(() => { loadRegistrations() }, [])
  return <section className="container page-section">
    <div className="page-heading"><div className="eyebrow">{t(locale, 'yourSchedule')}</div><h1>{t(locale, 'myRegistrations')}</h1><p>{t(locale, 'scheduleBody')}</p></div>
    {!items ? <Loading /> : items.length === 0 ? <EmptyRegistrations locale={locale} /> : <div className="registration-list">
      {items.map(({ event }) => <article key={event.id} className="registration-item">
        <div className="registration-date"><span>{formatMonth(event.startsAt, locale)}</span><strong>{new Date(event.startsAt).getDate()}</strong></div>
        <div><span className="status status-open">{t(locale, 'confirmed')}</span><h2>{eventCopy(event, locale).title}</h2><p><Clock3 size={16} /> {formatDate(event.startsAt, locale)} · {formatTime(event.startsAt, locale)}</p><p><MapPin size={16} /> {eventCopy(event, locale).location}</p></div>
        <button className="button button-ghost-danger" onClick={() => onCancel(event, loadRegistrations)}>{t(locale, 'cancel')}</button>
      </article>)}
    </div>}
  </section>
}

function AdminDashboard({ events, refresh, setModal, setToast, locale }) {
  const [editor, setEditor] = useState(null)
  const [attendees, setAttendees] = useState(null)
  async function remove(event) {
    setModal({ type: 'confirm', title: t(locale, 'deleteTitle', { name: eventCopy(event, locale).title }), body: t(locale, 'deleteBody'), destructive: true, action: async () => {
      await api.deleteEvent(event.id); await refresh(); setModal(null); setToast({ message: t(locale, 'eventDeleted'), tone: 'success' })
    }})
  }
  async function showAttendees(event) { setAttendees({ event, list: null }); setAttendees({ event, list: await api.attendees(event.id) }) }
  return <section className="container page-section admin-page">
    <div className="admin-heading"><div><div className="eyebrow">{t(locale, 'administration')}</div><h1>{t(locale, 'manageEvents')}</h1><p>{t(locale, 'manageBody')}</p></div><button className="button button-accent" onClick={() => setEditor({})}><Plus size={18} /> {t(locale, 'createEvent')}</button></div>
    <div className="admin-summary"><span><strong>{events.length}</strong> {t(locale, 'totalEvents')}</span><span><strong>{events.filter(e => e.status === 'OPEN').length}</strong> {t(locale, 'accepting')}</span><span><strong>{events.reduce((sum,e) => sum + e.registeredCount, 0)}</strong> {t(locale, 'totalRegistrations')}</span></div>
    <div className="table-wrap"><table><thead><tr><th>{t(locale, 'event')}</th><th>{t(locale, 'datePlace')}</th><th>{t(locale, 'capacity')}</th><th>{t(locale, 'status')}</th><th><span className="sr-only">{t(locale, 'actions')}</span></th></tr></thead>
      <tbody>{events.map(event => <tr key={event.id}><td><strong>{eventCopy(event, locale).title}</strong><span>{eventCopy(event, locale).description}</span></td><td><strong>{formatDate(event.startsAt, locale)}</strong><span>{eventCopy(event, locale).location}</span></td><td><div className="table-capacity"><strong>{event.registeredCount} / {event.capacity}</strong><div><span style={{ width: `${event.registeredCount / event.capacity * 100}%` }} /></div></div></td><td><Status event={event} locale={locale} /></td><td><div className="row-actions"><button aria-label={t(locale, 'viewAttendees', { name: eventCopy(event, locale).title })} onClick={() => showAttendees(event)}><Eye /></button><button aria-label={t(locale, 'edit', { name: eventCopy(event, locale).title })} onClick={() => setEditor(event)}><Edit3 /></button><button className="danger" aria-label={t(locale, 'delete', { name: eventCopy(event, locale).title })} onClick={() => remove(event)}><Trash2 /></button></div></td></tr>)}</tbody></table></div>
    {editor && <EventEditor event={editor.id ? editor : null} onClose={() => setEditor(null)} onSaved={async message => { await refresh(); setEditor(null); setToast({ message: t(locale, message === 'Event updated' ? 'eventUpdated' : 'eventCreated'), tone: 'success' }) }} locale={locale} />}
    {attendees && <AttendeePanel data={attendees} onClose={() => setAttendees(null)} locale={locale} />}
  </section>
}

function EventEditor({ event, onClose, onSaved, locale }) {
  const initial = event ? { ...event, startsAt: event.startsAt.slice(0,16) } : { title:'', description:'', location:'', startsAt:'', capacity:30 }
  const [form, setForm] = useState(initial); const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  const field = key => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) })
  async function submit(e) { e.preventDefault(); setSaving(true); setError(''); try { const payload = { ...form, capacity: Number(form.capacity) }; if (event) await api.updateEvent(event.id, payload); else await api.createEvent(payload); await onSaved(event ? 'Event updated' : 'Event created') } catch (err) { setError(err.message); setSaving(false) } }
  return <div className="overlay" role="presentation"><div className="sheet" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
    <div className="sheet-header"><div><span className="eyebrow">{event ? t(locale, 'editEvent') : t(locale, 'newEvent')}</span><h2 id="event-form-title">{event ? eventCopy(event, locale).title : t(locale, 'createEvent')}</h2></div><button className="icon-button" onClick={onClose} aria-label={t(locale, 'close')}><X /></button></div>
    <form onSubmit={submit} className="event-form"><label>{t(locale, 'eventTitle')}<input required autoFocus {...field('title')} placeholder={t(locale, 'temporaryTitle')} /></label><label>{t(locale, 'description')}<textarea required rows="5" {...field('description')} placeholder={t(locale, 'descriptionHint')} /></label><label>{t(locale, 'location')}<input required {...field('location')} placeholder={t(locale, 'locationHint')} /></label><div className="form-row"><label>{t(locale, 'dateTime')}<input required type="datetime-local" {...field('startsAt')} /></label><label>{t(locale, 'maximum')}<input required type="number" min={event?.registeredCount || 1} {...field('capacity')} /></label></div>{error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="button button-plain" onClick={onClose}>{t(locale, 'cancelAction')}</button><button className="button button-dark" disabled={saving}>{saving ? t(locale, 'saving') : event ? t(locale, 'saveChanges') : t(locale, 'createEvent')}</button></div></form>
  </div></div>
}

function AttendeePanel({ data, onClose, locale }) {
  return <div className="overlay" role="presentation"><div className="sheet attendee-sheet" role="dialog" aria-modal="true" aria-labelledby="attendee-title"><div className="sheet-header"><div><span className="eyebrow">{t(locale, 'registrationList')}</span><h2 id="attendee-title">{eventCopy(data.event, locale).title}</h2><p>{t(locale, 'spotsFilled', { count: data.event.registeredCount, capacity: data.event.capacity })}</p></div><button className="icon-button" onClick={onClose} aria-label={t(locale, 'close')}><X /></button></div>
    {data.list === null ? <Loading /> : data.list.length === 0 ? <div className="panel-empty"><Users /><h3>{t(locale, 'noAttendees')}</h3><p>{t(locale, 'attendeesBody')}</p></div> : <div className="attendee-list">{data.list.map((person,index) => <div key={person.id}><span className="avatar muted">{person.name.charAt(0)}</span><div><strong>{person.name}</strong><span>{person.email}</span></div><small>#{String(index + 1).padStart(2,'0')}</small></div>)}</div>}
  </div></div>
}

function LoginModal({ modal, setModal, setUser, refresh, setToast, locale }) {
  const [email, setEmail] = useState('user@event.local'); const [password, setPassword] = useState('password'); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { const current = await api.login({ email, password }); setUser(current); await refresh(); setModal(null); setToast({ message: t(locale, 'welcome', { name: current.name.split(' ')[0] }), tone:'success' }); if (modal.afterLoginEvent) { await api.register(modal.afterLoginEvent.id); await refresh(); setToast({ message: t(locale, 'going', { name: eventCopy(modal.afterLoginEvent, locale).title }), tone:'success' }) } } catch (err) { setError(err.message === 'Something went wrong. Please try again.' ? t(locale, 'errorCredentials') : err.message); setBusy(false) } }
  return <div className="overlay centered" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="icon-button modal-close" onClick={() => setModal(null)} aria-label={t(locale, 'close')}><X /></button><div className="login-mark"><TicketCheck /></div><span className="eyebrow">{t(locale, 'memberAccess')}</span><h2 id="login-title">{t(locale, 'signInTitle')}</h2><p>{t(locale, 'signInBody')}</p><form onSubmit={submit}><label>{t(locale, 'email')}<input autoFocus required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label><label>{t(locale, 'password')}<input required type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark full" disabled={busy}>{busy ? t(locale, 'signingIn') : t(locale, 'signIn')}</button></form><div className="demo-note"><strong>{t(locale, 'demoAccounts')}</strong><span>{t(locale, 'userDemo')}</span><span>{t(locale, 'adminDemo')}</span></div></div></div>
}

function ConfirmModal({ modal, setModal, locale }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  async function act() { setBusy(true); try { await modal.action() } catch (err) { setError(err.message); setBusy(false) } }
  return <div className="overlay centered" role="presentation"><div className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><div className={`confirm-icon ${modal.destructive ? 'danger' : ''}`}>{modal.destructive ? <Trash2 /> : <TicketCheck />}</div><h2 id="confirm-title">{modal.title}</h2><p>{modal.body}</p>{error && <p className="form-error">{error}</p>}<div className="confirm-actions"><button className="button button-plain" onClick={() => setModal(null)}>{modal.destructive ? t(locale, 'cancelAction') : t(locale, 'keep')}</button><button className={`button ${modal.destructive ? 'button-danger' : 'button-dark'}`} disabled={busy} onClick={act}>{busy ? t(locale, 'working') : modal.destructive ? t(locale, 'deleteEvent') : t(locale, 'yesCancel')}</button></div></div></div>
}

function EmptyState({ query, locale }) { return <div className="empty-state"><Search /><h3>{t(locale, 'noEvents')}</h3><p>{query ? t(locale, 'noEventsSearch') : t(locale, 'noEventsSoon')}</p></div> }
function EmptyRegistrations({ locale }) { return <div className="empty-state"><TicketCheck /><h3>{t(locale, 'noRegistrations')}</h3><p>{t(locale, 'browseSave')}</p></div> }
function Loading() { return <div className="loading" aria-label="Loading"><span /><span /><span /></div> }

export default App
