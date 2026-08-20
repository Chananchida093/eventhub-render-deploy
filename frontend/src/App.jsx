import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Edit3, Eye, LogOut,
  MapPin, Menu, Plus, Search, Sparkles, TicketCheck, Trash2, Users, X, ReceiptText, Minus,
} from 'lucide-react'

const translations = {
  en: {
    discover: 'Discover', events: 'Events', registrations: 'My registrations', manage: 'Manage events', signIn: 'Sign in', signOut: 'Sign out', member: 'Member', administrator: 'Administrator',
    heroEyebrow: 'Campus events · made for showing up', heroTitle: 'Find the event for you,<br /><em>then show up.</em>', heroBody: 'Discover events, choose the ticket that fits, and reserve your place in minutes.', browse: 'Explore upcoming events', upcoming: 'Upcoming events', openNow: 'Open now', freeCount: 'free events', spotsAvailable: 'spots available', eventCount: ({ count }) => `${count} ${count === 1 ? 'event' : 'events'}`, search: 'Search by title or place', all: 'All', available: 'Available', registered: 'Registered', landingKicker: 'Events & tickets, all in one place', landingCta: 'Find your next event', landingNote: 'New moments added throughout the semester.', featuredLabel: 'Happening next', curatedTitle: 'Made to be more than a date on the calendar.', curatedBody: 'A short list of things people are genuinely making time for.', exploreLabel: 'Explore the programme', exploreTitle: 'Find your kind of room.', availabilityLabel: '{{count}} places left', activityDetails: 'Event details', ticketChoices: 'ticket types', ticketsAvailable: 'tickets still available', recommended: 'Recommended for you', recommendedBody: 'A visual look at events worth showing up for.', visualBrowse: 'Pick a moment', browseByInterest: 'Browse by interest', freeKicker: 'No ticket fee', timelineKicker: 'Mark your calendar', freeEvents: 'Free to join', freeEventsBody: 'Save a spot — no ticket cost required.', comingSoon: 'Next on the calendar', comingSoonBody: 'A simple view of the dates coming up next.', viewAllEvents: 'View all events', categoryAll: 'All interests', categoryTech: 'Tech', categoryDesign: 'Design', categoryCareer: 'Career', categoryCommunity: 'Community', category: 'Category', bookingKicker: 'Open registration', bookingTitle: 'Event booking board', bookingBody: 'Compare dates, ticket options, and availability before reserving a place.', dateLabel: 'Date', ticketLabel: 'Tickets', availability: 'Availability',
    registrationOpen: 'Registration open', full: 'Full', ended: 'Ended', register: 'Register', eventFull: 'Event full', closed: 'Closed', spotsLeft: 'spots left', of: 'of', confirmed: 'Confirmed', cancel: 'Cancel registration', yourSchedule: 'Your schedule', myRegistrations: 'My registrations', scheduleBody: 'Everything you’ve signed up for, in one place.', noRegistrations: 'No registrations yet', browseSave: 'Browse upcoming events and save your spot.', eventDetails: 'Event details', viewEvent: 'View event', previousEvent: 'Previous event', nextEvent: 'Next event', backToEvents: 'Back to events', viewTickets: 'See ticket types & prices', hideTickets: 'Hide ticket types', viewOrganizer: 'View organizer', hideOrganizer: 'Hide organizer', organizerLabel: 'Organizer', organizerName: 'Gather Campus Events', organizerBody: 'A student-led event team creating practical spaces to learn, share, and meet people across campus.', attendeeCount: '{{count}} / {{capacity}} registered', ticketInformation: 'Ticket information', eventOverview: 'About this event', closeDetails: 'Close event details',
    administration: 'Administration', manageEvents: 'Manage events', manageBody: 'Create events, monitor capacity, and see who’s coming.', createEvent: 'Create event', totalEvents: 'total events', accepting: 'accepting registration', totalRegistrations: 'total registrations', event: 'Event', datePlace: 'Date & place', capacity: 'Capacity', status: 'Status', actions: 'Actions', viewAttendees: 'View attendees for {{name}}', edit: 'Edit {{name}}', delete: 'Delete {{name}}',
    newEvent: 'New event', editEvent: 'Edit event', eventTitle: 'Event title', description: 'Description', location: 'Location', dateTime: 'Date & time', maximum: 'Maximum attendees', cancelAction: 'Cancel', saveChanges: 'Save changes', saving: 'Saving…', temporaryTitle: 'e.g. Product Design Workshop', descriptionHint: 'What will attendees learn or experience?', locationHint: 'Building and room', registrationList: 'Registration list', spotsFilled: '{{count}} of {{capacity}} spots filled', noAttendees: 'No registrations yet', attendeesBody: 'Attendees will appear here after they register.',
    memberAccess: 'Member access', signInTitle: 'Sign in to register', signInBody: 'Your registrations stay tied to your account, so you can manage them anytime.', email: 'Email', password: 'Password', signingIn: 'Signing in…', demoAccounts: 'Demo accounts', userDemo: 'User: user@event.local / password', adminDemo: 'Admin: admin@event.local / admin123',
    cancelTitle: 'Cancel your registration?', cancelBody: 'Your spot for {{name}} will become available to someone else.', keep: 'Keep it', yesCancel: 'Yes, cancel', working: 'Working…', deleteTitle: 'Delete {{name}}?', deleteBody: 'This permanently removes the event and all registrations. This action cannot be undone.', deleteEvent: 'Delete event',
    noEvents: 'No events found', noEventsSearch: 'Try a shorter search or clear your filters.', noEventsSoon: 'New events will appear here soon.', footer: 'Gather / Event registration platform', footerBody: 'Built for campus communities',
    welcome: 'Welcome back, {{name}}', going: 'You’re going to {{name}}', cancelled: 'Registration cancelled', signedOut: 'You’re signed out', eventDeleted: 'Event deleted', eventUpdated: 'Event updated', eventCreated: 'Event created',
    errorCredentials: 'Email or password is incorrect.', close: 'Close', openNavigation: 'Open navigation', previousPage: 'Previous page', nextPage: 'Next page', pageOf: 'Page {{current}} of {{total}}', registrationsShown: 'registrations shown',
    ticketFrom: 'Tickets from ฿{{price}}', ticketTypes: 'Ticket types', chooseTicket: 'Choose your ticket', ticketQuantity: 'Quantity', remaining: '{{count}} remaining', free: 'Free', orderSummary: 'Order summary', total: 'Total', reserveTicket: 'Reserve ticket', ticketReady: 'Your e-ticket is ready', ticketCode: 'Ticket code', ticketPolicy: 'Tickets are confirmed instantly. Cancel to release every seat in this order.', addTicketType: 'Add ticket type', ticketName: 'Ticket name', ticketDescription: 'What is included?', ticketPrice: 'Price (THB)', ticketQuota: 'Ticket quota', ticketQuotaNote: 'Ticket quotas must add up to the maximum attendees.', ticketPlanTotal: '{{count}} of {{capacity}} ticket places allocated', purchaser: 'Purchaser', ticketPurchase: 'Ticket purchase', selectedTicket: 'Selected ticket',
  },
  th: {
    discover: 'ค้นหาอีเวนต์', events: 'อีเวนต์', registrations: 'การลงทะเบียนของฉัน', manage: 'จัดการอีเวนต์', signIn: 'เข้าสู่ระบบ', signOut: 'ออกจากระบบ', member: 'สมาชิก', administrator: 'ผู้ดูแลระบบ',
    heroEyebrow: 'อีเวนต์ในมหาวิทยาลัย · ออกไปเจอกันจริง ๆ', heroTitle: 'ค้นหาอีเวนต์ที่ใช่<br /><em>แล้วไปเจอกันจริง</em>', heroBody: 'ค้นหากิจกรรม เลือกบัตรตามราคาและสิทธิ์ที่ต้องการ แล้วจองที่นั่งของคุณได้ในไม่กี่คลิก', browse: 'ดูอีเวนต์ที่กำลังจะมาถึง', upcoming: 'อีเวนต์ที่กำลังจะมาถึง', openNow: 'กำลังเปิดรับสมัคร', freeCount: 'อีเวนต์เข้าฟรี', spotsAvailable: 'ที่นั่งที่ยังเหลือ', eventCount: ({ count }) => `${count} อีเวนต์`, search: 'ค้นหาจากชื่อหรือสถานที่', all: 'ทั้งหมด', available: 'ยังมีที่ว่าง', registered: 'ลงทะเบียนแล้ว', landingKicker: 'อีเวนต์และบัตรทั้งหมดในที่เดียว', landingCta: 'หาอีเวนต์ต่อไปของคุณ', landingNote: 'มีกิจกรรมใหม่เพิ่มเข้ามาตลอดเทอม', featuredLabel: 'กิจกรรมถัดไป', curatedTitle: 'มากกว่าแค่วันหนึ่งในปฏิทิน', curatedBody: 'กิจกรรมที่หลายคนกำลังหาเวลาเพื่อไปเจอกันจริง ๆ', exploreLabel: 'สำรวจกิจกรรมทั้งหมด', exploreTitle: 'เลือกห้องที่ใช่สำหรับคุณ', availabilityLabel: 'เหลือ {{count}} ที่นั่ง', activityDetails: 'รายละเอียดกิจกรรม', ticketChoices: 'ประเภทบัตรให้เลือก', ticketsAvailable: 'บัตรที่ยังจองได้', recommended: 'กิจกรรมแนะนำ', recommendedBody: 'ภาพรวมกิจกรรมที่น่าไป และพร้อมให้คุณเลือกต่อได้ทันที', visualBrowse: 'เลือกโมเมนต์ที่อยากไป', browseByInterest: 'เลือกตามความสนใจ', freeKicker: 'ไม่เสียค่าบัตร', timelineKicker: 'ปักหมุดวันไว้ก่อน', freeEvents: 'อีเวนต์เข้าฟรี', freeEventsBody: 'จองที่นั่งไว้ก่อนได้ โดยไม่มีค่าบัตร', comingSoon: 'คิวอีเวนต์ถัดไป', comingSoonBody: 'ดูวันจัดงานที่กำลังเรียงต่อจากนี้ แล้วเลือกอันที่อยากไป', viewAllEvents: 'ดูอีเวนต์ทั้งหมด', categoryAll: 'ทุกความสนใจ', categoryTech: 'เทคโนโลยี', categoryDesign: 'ออกแบบ', categoryCareer: 'อาชีพ', categoryCommunity: 'คอมมูนิตี้', category: 'หมวดหมู่', bookingKicker: 'กำลังเปิดจอง', bookingTitle: 'กำหนดการที่เปิดจอง', bookingBody: 'เทียบวัน ประเภทบัตร และจำนวนที่นั่ง ก่อนเลือกงานที่อยากไป', dateLabel: 'วันจัดงาน', ticketLabel: 'บัตร', availability: 'ที่นั่ง',
    registrationOpen: 'เปิดรับลงทะเบียน', full: 'เต็มแล้ว', ended: 'ปิดรับแล้ว', register: 'ลงทะเบียน', eventFull: 'ที่นั่งเต็ม', closed: 'ปิดรับสมัคร', spotsLeft: 'ที่นั่งเหลือ', of: 'จาก', confirmed: 'ยืนยันแล้ว', cancel: 'ยกเลิกการลงทะเบียน', yourSchedule: 'ตารางของคุณ', myRegistrations: 'การลงทะเบียนของฉัน', scheduleBody: 'รวมทุกอีเวนต์ที่คุณลงทะเบียนไว้ในที่เดียว', noRegistrations: 'ยังไม่มีการลงทะเบียน', browseSave: 'ค้นหาอีเวนต์ที่สนใจแล้วจองที่นั่งของคุณ', eventDetails: 'รายละเอียดอีเวนต์', viewEvent: 'ดูรายละเอียดอีเวนต์', previousEvent: 'อีเวนต์ก่อนหน้า', nextEvent: 'อีเวนต์ถัดไป', backToEvents: 'กลับไปดูอีเวนต์', viewTickets: 'ดูประเภทและราคาบัตร', hideTickets: 'ซ่อนประเภทบัตร', viewOrganizer: 'ดูผู้จัดอีเวนต์', hideOrganizer: 'ซ่อนข้อมูลผู้จัด', organizerLabel: 'ผู้จัดอีเวนต์', organizerName: 'Gather Campus Events', organizerBody: 'ทีมผู้จัดกิจกรรมจากนักศึกษาที่สร้างพื้นที่ให้เรียนรู้ แลกเปลี่ยน และพบปะผู้คนในมหาวิทยาลัย', attendeeCount: 'ลงทะเบียนแล้ว {{count}} / {{capacity}}', ticketInformation: 'ข้อมูลบัตร', eventOverview: 'เกี่ยวกับกิจกรรมนี้', closeDetails: 'ปิดรายละเอียดอีเวนต์',
    administration: 'การจัดการระบบ', manageEvents: 'จัดการอีเวนต์', manageBody: 'สร้างอีเวนต์ ตรวจสอบจำนวนที่นั่ง และดูรายชื่อผู้เข้าร่วม', createEvent: 'สร้างอีเวนต์', totalEvents: 'อีเวนต์ทั้งหมด', accepting: 'กำลังเปิดรับสมัคร', totalRegistrations: 'การลงทะเบียนทั้งหมด', event: 'อีเวนต์', datePlace: 'วันเวลาและสถานที่', capacity: 'จำนวนที่นั่ง', status: 'สถานะ', actions: 'จัดการ', viewAttendees: 'ดูผู้เข้าร่วม {{name}}', edit: 'แก้ไข {{name}}', delete: 'ลบ {{name}}',
    newEvent: 'อีเวนต์ใหม่', editEvent: 'แก้ไขอีเวนต์', eventTitle: 'ชื่ออีเวนต์', description: 'รายละเอียด', location: 'สถานที่', dateTime: 'วันและเวลา', maximum: 'จำนวนผู้เข้าร่วมสูงสุด', cancelAction: 'ยกเลิก', saveChanges: 'บันทึกการแก้ไข', saving: 'กำลังบันทึก…', temporaryTitle: 'เช่น เวิร์กช็อปออกแบบผลิตภัณฑ์', descriptionHint: 'ผู้เข้าร่วมจะได้เรียนรู้หรือสัมผัสอะไรบ้าง', locationHint: 'อาคารและห้อง', registrationList: 'รายชื่อผู้ลงทะเบียน', spotsFilled: 'ใช้ไป {{count}} จาก {{capacity}} ที่นั่ง', noAttendees: 'ยังไม่มีผู้ลงทะเบียน', attendeesBody: 'รายชื่อผู้เข้าร่วมจะแสดงที่นี่เมื่อมีการลงทะเบียน',
    memberAccess: 'สำหรับสมาชิก', signInTitle: 'เข้าสู่ระบบเพื่อลงทะเบียน', signInBody: 'รายการลงทะเบียนจะผูกกับบัญชีของคุณ เพื่อให้กลับมาจัดการได้ทุกเมื่อ', email: 'อีเมล', password: 'รหัสผ่าน', signingIn: 'กำลังเข้าสู่ระบบ…', demoAccounts: 'บัญชีสำหรับทดลองใช้', userDemo: 'ผู้ใช้: user@event.local / password', adminDemo: 'ผู้ดูแล: admin@event.local / admin123',
    cancelTitle: 'ยกเลิกการลงทะเบียนนี้ไหม', cancelBody: 'ที่นั่งของคุณสำหรับ {{name}} จะถูกเปิดให้คนอื่นลงทะเบียน', keep: 'เก็บไว้ก่อน', yesCancel: 'ใช่ ยกเลิกเลย', working: 'กำลังดำเนินการ…', deleteTitle: 'ลบ {{name}} ไหม', deleteBody: 'อีเวนต์และการลงทะเบียนทั้งหมดจะถูกลบถาวรและไม่สามารถย้อนกลับได้', deleteEvent: 'ลบอีเวนต์',
    noEvents: 'ไม่พบอีเวนต์', noEventsSearch: 'ลองค้นหาด้วยคำที่สั้นลง หรือล้างตัวกรอง', noEventsSoon: 'อีเวนต์ใหม่จะแสดงที่นี่เร็ว ๆ นี้', footer: 'Gather / แพลตฟอร์มลงทะเบียนอีเวนต์', footerBody: 'สร้างพื้นที่ให้ชุมชนในมหาวิทยาลัย',
    welcome: 'ยินดีต้อนรับกลับ {{name}}', going: 'คุณกำลังจะไป {{name}}', cancelled: 'ยกเลิกการลงทะเบียนแล้ว', signedOut: 'ออกจากระบบแล้ว', eventDeleted: 'ลบอีเวนต์แล้ว', eventUpdated: 'แก้ไขอีเวนต์แล้ว', eventCreated: 'สร้างอีเวนต์แล้ว',
    errorCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', close: 'ปิด', openNavigation: 'เปิดเมนูนำทาง', previousPage: 'หน้าก่อนหน้า', nextPage: 'หน้าถัดไป', pageOf: 'หน้า {{current}} จาก {{total}}', registrationsShown: 'การลงทะเบียนในหน้าปัจจุบัน',
    ticketFrom: 'บัตรเริ่มต้น ฿{{price}}', ticketTypes: 'ประเภทบัตร', chooseTicket: 'เลือกบัตรของคุณ', ticketQuantity: 'จำนวนบัตร', remaining: 'เหลือ {{count}} ใบ', free: 'ฟรี', orderSummary: 'สรุปรายการ', total: 'รวมทั้งหมด', reserveTicket: 'ยืนยันการจองบัตร', ticketReady: 'e-ticket ของคุณพร้อมแล้ว', ticketCode: 'รหัสบัตร', ticketPolicy: 'ยืนยันบัตรทันที หากยกเลิก ที่นั่งทั้งหมดในรายการนี้จะถูกคืน', addTicketType: 'เพิ่มประเภทบัตร', ticketName: 'ชื่อบัตร', ticketDescription: 'สิ่งที่รวมในบัตร', ticketPrice: 'ราคา (บาท)', ticketQuota: 'โควตาบัตร', ticketQuotaNote: 'โควตาบัตรทุกประเภทต้องรวมเท่ากับจำนวนผู้เข้าร่วมสูงสุด', ticketPlanTotal: 'จัดสรรโควตาแล้ว {{count}} จาก {{capacity}} ที่นั่ง', purchaser: 'ผู้จอง', ticketPurchase: 'การจองบัตร', selectedTicket: 'บัตรที่เลือก',
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
const eventArtwork = {
  'Designing for Real People': '/art-design.svg',
  'Spring Boot at Scale': '/art-spring.svg',
  'Campus Product Night': '/art-product.svg',
  'Accessibility Testing Lab': '/art-accessibility.svg',
}
function imageFor(event) { return eventArtwork[event?.title] ?? '/art-design.svg' }
function categoryLabel(category, locale) { return t(locale, `category${category?.charAt(0)}${category?.slice(1).toLowerCase()}`) }

const DEFAULT_EVENT_PARAMS = { page: 0, size: 20, search: '', category: 'ALL', status: 'ALL' }
const EMPTY_EVENT_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0, hasNext: false, hasPrevious: false, totalOpenEvents: 0, totalRegistrations: 0 }

function App() {
  const [eventPage, setEventPage] = useState(EMPTY_EVENT_PAGE)
  const [eventParams, setEventParams] = useState(DEFAULT_EVENT_PARAMS)
  const [user, setUser] = useState(null)
  const [view, setView] = useState('events')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [detailEvent, setDetailEvent] = useState(null)
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [locale, setLocale] = useState(() => localStorage.getItem('gather-locale') || 'th')
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('gather-locale', locale)
    document.documentElement.lang = locale === 'th' ? 'th' : 'en'
  }, [locale])

  const loadEvents = useCallback(async (nextParams = eventParams) => {
    setEventsLoading(true)
    try {
      const data = await api.events(nextParams)
      setEventPage(data)
      setEventParams(nextParams)
      return data
    } finally {
      setEventsLoading(false)
    }
  }, [eventParams])

  useEffect(() => {
    Promise.all([api.events(DEFAULT_EVENT_PARAMS), api.me().catch(() => null)])
      .then(([eventData, currentUser]) => { setEventPage(eventData); setUser(currentUser) })
      .finally(() => { setLoading(false); setEventsLoading(false) })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleRegister(event) {
    if (!user) { setModal({ type: 'login', afterLoginEvent: event }); return }
    setModal({ type: 'purchase', event })
  }

  function openEventDetail(event) {
    setModal(null)
    setDetailEvent(event)
    setView('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeEventDetail() {
    setDetailEvent(null)
    setView('events')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleCancel(event, onDone) {
    setModal({ type: 'confirm', title: t(locale, 'cancelTitle'), body: t(locale, 'cancelBody', { name: eventCopy(event, locale).title }), action: async () => {
      await api.cancel(event.id); await loadEvents(); await onDone?.(); setModal(null)
      setToast({ message: t(locale, 'cancelled'), tone: 'success' })
    }})
  }

  async function logout() {
    await api.logout(); setUser(null); setView('events'); await loadEvents({ ...eventParams, page: 0, status: 'ALL' }); setMenuOpen(false)
    setToast({ message: t(locale, 'signedOut'), tone: 'success' })
  }

  const isAdmin = user?.role === 'ADMIN'
  const navItems = isAdmin
    ? [{ id: 'events', label: t(locale, 'events') }, { id: 'admin', label: t(locale, 'manage') }]
    : [{ id: 'events', label: t(locale, 'discover') }, ...(user ? [{ id: 'registrations', label: t(locale, 'registrations') }] : [])]

  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); closeEventDetail() }} aria-label="Gather home">
        <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
        <span>Gather</span>
      </a>
      <nav className="desktop-nav" aria-label={t(locale, 'discover')}>
        {navItems.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => { setDetailEvent(null); setView(item.id) }}>{item.label}</button>)}
      </nav>
      <div className="header-actions">
        <button className="header-search-trigger" onClick={() => { setDetailEvent(null); setView('events'); setTimeout(() => document.querySelector('.events-search-input')?.focus(), 0) }}><Search size={16} /> <span>{t(locale, 'search')}</span></button>
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
        {navItems.map(item => <button key={item.id} onClick={() => { setDetailEvent(null); setView(item.id); setMenuOpen(false) }}>{item.label}</button>)}
        {!user && <button onClick={() => { setModal({ type: 'login' }); setMenuOpen(false) }}>{t(locale, 'signIn')}</button>}
        {user && <button onClick={logout}>{t(locale, 'signOut')}</button>}
      </nav>}
    </header>

    <main>
      {loading ? <Loading /> : view === 'detail' && detailEvent ? <EventDetailPage event={detailEvent} onBack={closeEventDetail} onRegister={handleRegister} locale={locale} />
        : view === 'events' ? <Discover page={eventPage} params={eventParams} loading={eventsLoading} user={user} onRegister={handleRegister} onViewDetail={openEventDetail} onParamsChange={loadEvents} locale={locale} />
        : view === 'registrations' ? <MyRegistrations onCancel={handleCancel} locale={locale} />
        : <AdminDashboard page={eventPage} params={eventParams} loading={eventsLoading} onParamsChange={loadEvents} refresh={loadEvents} setModal={setModal} setToast={setToast} locale={locale} />}
    </main>
    <footer><span>{t(locale, 'footer')}</span><span>{t(locale, 'footerBody')}</span></footer>
    {modal?.type === 'login' && <LoginModal modal={modal} setModal={setModal} setUser={setUser} refresh={loadEvents} setToast={setToast} locale={locale} />}
    {modal?.type === 'purchase' && <PurchaseModal event={modal.event} onClose={() => setModal(null)} refresh={loadEvents} setToast={setToast} locale={locale} />}
    {modal?.type === 'confirm' && <ConfirmModal modal={modal} setModal={setModal} locale={locale} />}
    {toast && <div className={`toast ${toast.tone}`} role="status"><Check size={17} />{toast.message}</div>}
  </div>
}

function Discover({ page, params, loading, user, onRegister, onViewDetail, onParamsChange, locale }) {
  const [query, setQuery] = useState(params.search)
  const filter = params.status === 'OPEN' ? 'available' : params.status === 'REGISTERED' ? 'registered' : 'all'
  const events = page.items
  const spotlightEvents = events.filter(event => event.status === 'OPEN')
  const featured = spotlightEvents[0] ?? events[0]
  const ticketChoices = events.reduce((sum, event) => sum + (event.ticketTypes?.length || 0), 0)
  const ticketsAvailable = events.reduce((sum, event) => sum + event.spotsLeft, 0)
  const freeEventCount = events.filter(event => event.status === 'OPEN' && event.ticketTypes?.some(ticket => Number(ticket.price) === 0)).length
  const categoryOptions = ['ALL', 'TECH', 'DESIGN', 'CAREER', 'COMMUNITY']
  const recommended = events.filter(event => event.status === 'OPEN').slice(0, 4)
  const freeEvents = events.filter(event => event.status === 'OPEN' && event.ticketTypes?.some(ticket => Number(ticket.price) === 0)).slice(0, 2)
  const comingSoon = events.filter(event => event.status === 'OPEN').slice(0, 2)

  useEffect(() => {
    setQuery(params.search)
  }, [params.search])

  useEffect(() => {
    if (query === params.search) return undefined
    const timer = setTimeout(() => onParamsChange({ ...params, page: 0, search: query }), 280)
    return () => clearTimeout(timer)
  }, [query, params, onParamsChange])

  return <>
    <section className="landing-hero container">
      <div className="landing-copy">
        <span className="eyebrow"><Sparkles size={13} /> {t(locale, 'landingKicker')}</span>
        <h1 className={`landing-title locale-${locale}`} dangerouslySetInnerHTML={{ __html: t(locale, 'heroTitle') }} />
        <p>{t(locale, 'heroBody')}</p>
        <div className="landing-actions"><button className="button button-dark" onClick={() => document.querySelector('.events-section')?.scrollIntoView({ behavior: 'smooth' })}>{t(locale, 'landingCta')} <ArrowRight size={17} /></button><span>{t(locale, 'landingNote')}</span></div>
        <div className="landing-stats" aria-label={t(locale, 'upcoming')}><div className="landing-stat-open"><small>{t(locale, 'openNow')}</small><strong>{spotlightEvents.length}</strong><span>{t(locale, 'available')}</span></div><div className="landing-stat-free"><small>{t(locale, 'freeCount')}</small><strong>{freeEventCount}</strong><span>{t(locale, 'free')}</span></div><div className="landing-stat-seats"><small>{t(locale, 'spotsAvailable')}</small><strong>{ticketsAvailable}</strong><span>{t(locale, 'spotsLeft')}</span></div></div>
      </div>
      {featured && <HeroHighlight event={featured} events={spotlightEvents.length ? spotlightEvents : events} onRegister={onRegister} locale={locale} />}
    </section>

    {!params.search && params.status === 'ALL' && params.category === 'ALL' && <>
      <section className="interest-section container" aria-label={t(locale, 'browseByInterest')}><div className="discovery-heading"><div><span className="eyebrow">{t(locale, 'browseByInterest')}</span><h2>{t(locale, 'browseByInterest')}</h2></div><span>{t(locale, 'eventCount', { count: page.totalElements })}</span></div><div className="interest-chips">{categoryOptions.map(category => <button key={category} className={category === 'ALL' ? 'active' : ''} onClick={() => onParamsChange({ ...params, page: 0, category })}>{category === 'ALL' ? t(locale, 'categoryAll') : categoryLabel(category, locale)}</button>)}</div></section>
      {recommended.length > 0 && <DiscoveryRail title={t(locale, 'recommended')} body={t(locale, 'recommendedBody')} events={recommended} locale={locale} onViewDetail={onViewDetail} />}
      <section className="discovery-columns container"><DiscoveryList kicker={t(locale, 'freeKicker')} title={t(locale, 'freeEvents')} body={t(locale, 'freeEventsBody')} events={freeEvents} locale={locale} onViewDetail={onViewDetail} /><DiscoveryTimeline kicker={t(locale, 'timelineKicker')} title={t(locale, 'comingSoon')} body={t(locale, 'comingSoonBody')} events={comingSoon} locale={locale} onViewDetail={onViewDetail} /></section>
    </>}

    <section className="events-section booking-board container" aria-labelledby="upcoming-heading">
      <div className="booking-board-header">
        <div><span className="eyebrow">{t(locale, 'bookingKicker')}</span><h2 id="upcoming-heading">{t(locale, 'bookingTitle')}</h2><p>{t(locale, 'bookingBody')}</p></div>
        <span className="event-count">{t(locale, 'eventCount', { count: page.totalElements })}</span>
      </div>
      <div className="event-tools booking-tools">
        <label className="search"><Search size={18} /><span className="sr-only">{t(locale, 'search')}</span><input className="events-search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder={t(locale, 'search')} /></label>
        <div className="filter-group" aria-label={t(locale, 'status')}>
          {[['all',t(locale, 'all'),'ALL'],['available',t(locale, 'available'),'OPEN'], ...(user ? [['registered',t(locale, 'registered'),'REGISTERED']] : [])].map(([id,label,status]) => <button key={id} className={filter === id ? 'active' : ''} onClick={() => onParamsChange({ ...params, page: 0, status })}>{label}</button>)}
        </div>
      </div>
      {loading ? <Loading /> : featured ? <><div className="booking-list">
        {events.map(event => <BookingRow key={event.id} event={event} onRegister={onRegister} onViewDetail={onViewDetail} locale={locale} />)}
      </div><Pagination page={page} onChange={nextPage => onParamsChange({ ...params, page: nextPage })} locale={locale} /></> : <EmptyState query={query} locale={locale} />}
    </section>
  </>
}

function DiscoveryRail({ title, body, events, locale, onViewDetail }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeEvent = events[activeIndex] ?? events[0]
  const copy = eventCopy(activeEvent, locale)
  const move = direction => setActiveIndex(index => (index + direction + events.length) % events.length)
  useEffect(() => { if (activeIndex >= events.length) setActiveIndex(0) }, [activeIndex, events.length])
  useEffect(() => {
    if (events.length < 2) return undefined
    const timer = setInterval(() => setActiveIndex(index => (index + 1) % events.length), 5200)
    return () => clearInterval(timer)
  }, [events.length])
  return <section className="discovery-rail-section container"><div className="discovery-heading"><div><span className="eyebrow">{t(locale, 'visualBrowse')}</span><h2>{title}</h2><p>{body}</p></div><span>{activeIndex + 1} / {events.length}</span></div><article className="visual-carousel"><img src={imageFor(activeEvent)} alt={copy.title} /><div className="visual-carousel-shade" /><div className="visual-carousel-copy"><span>{categoryLabel(activeEvent.category, locale)}</span><p>{formatDate(activeEvent.startsAt, locale)} · {copy.location}</p><h3>{copy.title}</h3><button className="button button-light" onClick={() => onViewDetail(activeEvent)}>{t(locale, 'viewEvent')} <ArrowUpRight size={16} /></button></div><div className="visual-carousel-controls"><button onClick={() => move(-1)} aria-label={t(locale, 'previousEvent')}><ChevronLeft size={19} /></button><div>{events.map((event, index) => <button key={event.id} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`${t(locale, 'viewEvent')} ${index + 1}`} />)}</div><button onClick={() => move(1)} aria-label={t(locale, 'nextEvent')}><ChevronRight size={19} /></button></div></article></section>
}

function DiscoveryList({ kicker, title, body, events, locale, onViewDetail }) {
  return <section className="discovery-list"><div className="discovery-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2><p>{body}</p></div></div>{events.length === 0 ? <p className="discovery-empty">—</p> : events.map(event => { const copy = eventCopy(event, locale); return <button className="discovery-list-item" key={event.id} onClick={() => onViewDetail(event)}><img src={imageFor(event)} alt="" /><div className="mini-date"><strong>{new Date(event.startsAt).getDate()}</strong><span>{formatMonth(event.startsAt, locale)}</span></div><div><span className="status status-open">{categoryLabel(event.category, locale)}</span><h3>{copy.title}</h3><p><MapPin size={13} /> {copy.location}</p><small>{t(locale, 'ticketFrom', { price: cheapestPrice(event) })} · {t(locale, 'availabilityLabel', { count: event.spotsLeft })}</small></div><span className="mini-action" aria-hidden="true"><ArrowUpRight size={18} /></span></button> })}</section>
}

function DiscoveryTimeline({ kicker, title, body, events, locale, onViewDetail }) {
  return <section className="discovery-list discovery-timeline"><div className="discovery-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2><p>{body}</p></div></div>{events.length === 0 ? <p className="discovery-empty">—</p> : <div className="timeline-items">{events.map(event => { const copy = eventCopy(event, locale); return <button className="timeline-item" key={event.id} onClick={() => onViewDetail(event)}><time><strong>{new Date(event.startsAt).getDate()}</strong><span>{formatMonth(event.startsAt, locale)}</span></time><span className="timeline-line" aria-hidden="true" /><span className="timeline-copy"><span className="status status-open">{categoryLabel(event.category, locale)}</span><strong>{copy.title}</strong><small>{formatTime(event.startsAt, locale)} · {copy.location}</small></span><ArrowUpRight size={17} /></button> })}</div>}</section>
}

function HeroHighlight({ event, events = [], onRegister, locale }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeEvent = events[activeIndex] ?? event
  const copy = eventCopy(activeEvent, locale)
  useEffect(() => { if (activeIndex >= events.length) setActiveIndex(0) }, [activeIndex, events.length])
  useEffect(() => {
    if (events.length < 2) return undefined
    const timer = setInterval(() => setActiveIndex(index => (index + 1) % events.length), 5800)
    return () => clearInterval(timer)
  }, [events.length])
  return <article className="hero-highlight">
    <img className="spotlight-image" src={imageFor(activeEvent)} alt={copy.title} />
    <div className="spotlight-shade" aria-hidden="true" />
    <div className="hero-highlight-content"><span className="hero-highlight-label">{t(locale, 'featuredLabel')}</span><span className="hero-highlight-date">{formatDate(activeEvent.startsAt, locale)}</span><h2>{copy.title}</h2><p><MapPin size={15} /> {copy.location}</p><EventAction event={activeEvent} onRegister={onRegister} locale={locale} compact /></div>
    <div className="spotlight-pagination" aria-label={t(locale, 'upcoming')}>{events.map((item, index) => <button key={item.id} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`${t(locale, 'viewEvent')} ${index + 1}`} />)}</div>
  </article>
}

function FeaturedEvent({ event, onRegister, locale }) {
  const date = new Date(event.startsAt)
  const copy = eventCopy(event, locale)
  return <article className="activity-card activity-featured">
    <div className="activity-image"><img src={imageFor(event)} alt="" /><div className="activity-date"><small>{formatMonth(event.startsAt, locale)}</small><strong>{date.getDate()}</strong></div><div className="poster-overlay poster-overlay-featured"><span>{categoryLabel(event.category, locale)}</span><h3>{copy.title}</h3><p><MapPin size={14} /> {copy.location}</p></div></div>
    <div className="activity-body"><div className="activity-topline"><Status event={event} locale={locale} /><span><Clock3 size={14} /> {formatTime(event.startsAt, locale)}</span></div><h3>{copy.title}</h3><p>{copy.description}</p><div className="activity-meta"><span><MapPin size={15} /> {copy.location}</span><span>{t(locale, 'ticketFrom', { price: cheapestPrice(event) })}</span><span>{t(locale, 'availabilityLabel', { count: event.spotsLeft })}</span></div><EventAction event={event} onRegister={onRegister} locale={locale} /></div>
  </article>
}

function EventRow({ event, onRegister, locale }) {
  const date = new Date(event.startsAt)
  const copy = eventCopy(event, locale)
  return <article className="activity-card">
    <div className="activity-image"><img src={imageFor(event)} alt="" /><div className="activity-date"><small>{formatMonth(event.startsAt, locale)}</small><strong>{date.getDate()}</strong></div><div className="poster-overlay"><span>{categoryLabel(event.category, locale)}</span><h3>{copy.title}</h3></div></div>
    <div className="activity-body"><div className="activity-topline"><Status event={event} locale={locale} /><span>{formatTime(event.startsAt, locale)}</span></div><h3>{copy.title}</h3><p>{copy.description}</p><div className="activity-meta"><span><MapPin size={15} /> {copy.location}</span><span>{t(locale, 'ticketFrom', { price: cheapestPrice(event) })}</span><span>{t(locale, 'availabilityLabel', { count: event.spotsLeft })}</span></div><EventAction event={event} onRegister={onRegister} locale={locale} /></div>
  </article>
}

function BookingRow({ event, onRegister, onViewDetail, locale }) {
  const date = new Date(event.startsAt)
  const copy = eventCopy(event, locale)
  return <article className="booking-row">
    <time className="booking-date" dateTime={event.startsAt}><strong>{date.getDate()}</strong><span>{formatMonth(event.startsAt, locale)}</span><small>{formatTime(event.startsAt, locale)}</small></time>
    <div className="booking-image"><img src={imageFor(event)} alt={copy.title} /><span>{categoryLabel(event.category, locale)}</span></div>
    <div className="booking-main"><Status event={event} locale={locale} /><h3>{copy.title}</h3><p>{copy.description}</p><small><MapPin size={14} /> {copy.location}</small></div>
    <dl className="booking-facts"><div><dt>{t(locale, 'ticketLabel')}</dt><dd>{t(locale, 'ticketFrom', { price: cheapestPrice(event) })}</dd></div><div><dt>{t(locale, 'availability')}</dt><dd>{t(locale, 'availabilityLabel', { count: event.spotsLeft })}</dd></div></dl>
    <div className="booking-actions"><button className="button button-ghost booking-detail-action" onClick={() => onViewDetail(event)}>{t(locale, 'viewEvent')} <ArrowUpRight size={15} /></button><EventAction event={event} onRegister={onRegister} locale={locale} /></div>
  </article>
}

function Status({ event, locale }) {
  const labels = { OPEN: t(locale, 'registrationOpen'), FULL: t(locale, 'full'), ENDED: t(locale, 'ended') }
  return <span className={`status status-${event.status.toLowerCase()}`}>{event.registered ? t(locale, 'registered') : labels[event.status]}</span>
}

function EventAction({ event, onRegister, locale, compact = false }) {
  if (event.registered) return <button className="button button-confirmed" disabled><TicketCheck size={17} /> {t(locale, 'registered')}</button>
  return <button className={`button ${compact ? 'button-light' : 'button-outline'}`} disabled={event.status !== 'OPEN'} onClick={() => onRegister(event)}>
    {event.status === 'OPEN' ? t(locale, 'register') : event.status === 'FULL' ? t(locale, 'eventFull') : t(locale, 'closed')} {event.status === 'OPEN' && (compact ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />)}
  </button>
}

function formatPrice(value, locale) {
  if (Number(value) === 0) return t(locale, 'free')
  return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(Number(value))
}
function cheapestPrice(event) { return Math.min(...(event.ticketTypes || []).map(item => Number(item.price)), 0) }

function Pagination({ page, onChange, locale }) {
  if (page.totalPages <= 1) return null
  return <nav className="pagination" aria-label={t(locale, 'upcoming')}>
    <button className="icon-button" disabled={!page.hasPrevious} aria-label={t(locale, 'previousPage')} onClick={() => onChange(page.page - 1)}><ChevronLeft size={18} /></button>
    <span>{t(locale, 'pageOf', { current: page.page + 1, total: page.totalPages })}</span>
    <button className="icon-button" disabled={!page.hasNext} aria-label={t(locale, 'nextPage')} onClick={() => onChange(page.page + 1)}><ChevronRight size={18} /></button>
  </nav>
}

function MyRegistrations({ onCancel, locale }) {
  const [items, setItems] = useState(null)
  const loadRegistrations = () => api.registrations().then(setItems)
  useEffect(() => { loadRegistrations() }, [])
  return <section className="container page-section">
    <div className="page-heading"><div className="eyebrow">{t(locale, 'yourSchedule')}</div><h1>{t(locale, 'myRegistrations')}</h1><p>{t(locale, 'scheduleBody')}</p></div>
    {!items ? <Loading /> : items.length === 0 ? <EmptyRegistrations locale={locale} /> : <div className="registration-list">
      {items.map(({ event, quantity, ticketCode, ticketTypeName, totalPrice }) => <article key={event.id} className="registration-item">
        <div className="registration-date"><span>{formatMonth(event.startsAt, locale)}</span><strong>{new Date(event.startsAt).getDate()}</strong></div>
        <div><span className="status status-open">{t(locale, 'confirmed')}</span><h2>{eventCopy(event, locale).title}</h2><p><Clock3 size={16} /> {formatDate(event.startsAt, locale)} · {formatTime(event.startsAt, locale)}</p><p><MapPin size={16} /> {eventCopy(event, locale).location}</p><div className="ticket-receipt"><ReceiptText size={16} /><span><strong>{ticketTypeName} × {quantity}</strong><small>{t(locale, 'ticketCode')}: {ticketCode || '—'} · {formatPrice(totalPrice, locale)}</small></span></div></div>
        <button className="button button-ghost-danger" onClick={() => onCancel(event, loadRegistrations)}>{t(locale, 'cancel')}</button>
      </article>)}
    </div>}
  </section>
}

function EventDetailPage({ event, onBack, onRegister, locale }) {
  const [ticketsOpen, setTicketsOpen] = useState(true)
  const [organizerOpen, setOrganizerOpen] = useState(true)
  const copy = eventCopy(event, locale)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [event?.id])
  return <section className="event-page">
    <div className="event-page-top container"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> {t(locale, 'backToEvents')}</button><span>{t(locale, 'eventDetails')}</span></div>
    <div className="event-page-hero"><img src={imageFor(event)} alt={copy.title} /><div className="event-page-hero-shade" /><div className="event-page-hero-content container"><Status event={event} locale={locale} /><p>{formatDate(event.startsAt, locale)} · {formatTime(event.startsAt, locale)}</p><h1>{copy.title}</h1><span><MapPin size={16} /> {copy.location}</span></div></div>
    <div className="event-page-content container"><main className="event-page-main"><section className="event-page-intro"><span className="eyebrow">{t(locale, 'eventOverview')}</span><p>{copy.description}</p></section><section className="event-page-facts"><div><Clock3 size={19} /><span><small>{t(locale, 'dateTime')}</small><strong>{formatDate(event.startsAt, locale)} · {formatTime(event.startsAt, locale)}</strong></span></div><div><MapPin size={19} /><span><small>{t(locale, 'location')}</small><strong>{copy.location}</strong></span></div><div><Users size={19} /><span><small>{t(locale, 'capacity')}</small><strong>{t(locale, 'attendeeCount', { count: event.registeredCount, capacity: event.capacity })}</strong></span></div></section><section className="event-long-copy"><span className="eyebrow">{t(locale, 'eventDetails')}</span><h2>{t(locale, 'eventOverview')}</h2><p>{copy.description}</p><p>{locale === 'th' ? 'มาร่วมเรียนรู้จากคนที่ลงมือทำจริง แลกเปลี่ยนมุมมองกับผู้เข้าร่วม และเก็บประสบการณ์ที่นำไปใช้ต่อได้หลังจบงาน' : 'Join people who are making things happen, exchange perspectives with fellow attendees, and leave with ideas you can use after the event.'}</p></section><button className="detail-section-toggle" onClick={() => setOrganizerOpen(open => !open)}><span><Users size={18} /> {t(locale, 'organizerLabel')}</span><strong>{organizerOpen ? t(locale, 'hideOrganizer') : t(locale, 'viewOrganizer')} <ChevronRight size={17} /></strong></button>{organizerOpen && <div className="organizer-panel"><div className="organizer-avatar">G</div><div><span className="eyebrow">{t(locale, 'organizerLabel')}</span><h3>{t(locale, 'organizerName')}</h3><p>{t(locale, 'organizerBody')}</p></div></div>}</main><aside className="event-page-aside"><div className="event-seat-card"><span>{t(locale, 'availability')}</span><strong>{t(locale, 'availabilityLabel', { count: event.spotsLeft })}</strong><small>{t(locale, 'attendeeCount', { count: event.registeredCount, capacity: event.capacity })}</small></div><button className="detail-section-toggle" onClick={() => setTicketsOpen(open => !open)}><span><TicketCheck size={18} /> {t(locale, ticketsOpen ? 'hideTickets' : 'viewTickets')}</span><ChevronRight size={17} /></button>{ticketsOpen && <div className="page-tickets">{(event.ticketTypes || []).map(ticket => <div key={ticket.id}><span><strong>{ticket.name}</strong><small>{ticket.description || t(locale, 'ticketTypes')}</small></span><b>{formatPrice(ticket.price, locale)}</b></div>)}</div>}<EventAction event={event} onRegister={onRegister} locale={locale} /></aside></div>
    <div className="event-page-bottom container"><button className="button button-outline" onClick={() => setTicketsOpen(true)}><TicketCheck size={17} /> {t(locale, 'viewTickets')}</button><EventAction event={event} onRegister={onRegister} locale={locale} /></div>
  </section>
}

function EventDetailModal({ event, onClose, onRegister, locale }) {
  const copy = eventCopy(event, locale)
  return <div className="overlay event-detail-overlay" role="presentation" onMouseDown={onClose}>
    <article className="event-detail-modal" role="dialog" aria-modal="true" aria-labelledby="event-detail-title" onMouseDown={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label={t(locale, 'closeDetails')}><X size={19} /></button>
      <div className="event-detail-hero"><img src={imageFor(event)} alt={copy.title} /><div className="event-detail-shade" /><div className="event-detail-hero-copy"><Status event={event} locale={locale} /><p>{formatDate(event.startsAt, locale)} · {formatTime(event.startsAt, locale)}</p><h1 id="event-detail-title">{copy.title}</h1><span><MapPin size={15} /> {copy.location}</span></div></div>
      <div className="event-detail-content"><div className="event-detail-main"><span className="eyebrow">{t(locale, 'eventOverview')}</span><p>{copy.description}</p><div className="event-info-grid"><div><Clock3 size={18} /><span><small>{t(locale, 'dateTime')}</small><strong>{formatDate(event.startsAt, locale)} · {formatTime(event.startsAt, locale)}</strong></span></div><div><MapPin size={18} /><span><small>{t(locale, 'location')}</small><strong>{copy.location}</strong></span></div><div><Users size={18} /><span><small>{t(locale, 'capacity')}</small><strong>{t(locale, 'attendeeCount', { count: event.registeredCount, capacity: event.capacity })}</strong></span></div></div></div><aside className="event-detail-sidebar"><div className="detail-availability"><span>{t(locale, 'availability')}</span><strong>{t(locale, 'availabilityLabel', { count: event.spotsLeft })}</strong></div><span className="eyebrow">{t(locale, 'ticketInformation')}</span><div className="detail-tickets">{(event.ticketTypes || []).map(ticket => <div key={ticket.id}><span><strong>{ticket.name}</strong><small>{ticket.description || t(locale, 'ticketTypes')} · {t(locale, 'remaining', { count: ticket.remaining })}</small></span><b>{formatPrice(ticket.price, locale)}</b></div>)}</div><EventAction event={event} onRegister={onRegister} locale={locale} /></aside></div>
    </article>
  </div>
}

function PurchaseModal({ event, onClose, refresh, setToast, locale }) {
  const available = (event.ticketTypes || []).filter(ticket => ticket.remaining > 0)
  const [ticketId, setTicketId] = useState(available[0]?.id ?? null)
  const selected = available.find(ticket => ticket.id === ticketId) ?? available[0]
  const [quantity, setQuantity] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const maxQuantity = Math.min(10, event.spotsLeft, selected?.remaining || 0)
  const safeQuantity = Math.min(quantity, Math.max(1, maxQuantity))
  async function purchase() {
    if (!selected) return
    setBusy(true); setError('')
    try { await api.register(event.id, { ticketTypeId: selected.id, quantity: safeQuantity }); await refresh(); onClose(); setToast({ message: t(locale, 'ticketReady'), tone: 'success' }) }
    catch (err) { setError(err.message); setBusy(false) }
  }
  const copy = eventCopy(event, locale)
  return <div className="overlay centered" role="presentation"><div className="modal purchase-modal" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
    <button className="icon-button modal-close" onClick={onClose} aria-label={t(locale, 'close')}><X /></button><div className="login-mark"><TicketCheck /></div><span className="eyebrow">{t(locale, 'ticketPurchase')}</span><h2 id="purchase-title">{copy.title}</h2><p>{formatDate(event.startsAt, locale)} · {copy.location}</p>
    <div className="ticket-picker"><strong>{t(locale, 'chooseTicket')}</strong>{available.map(ticket => <button key={ticket.id} className={`ticket-option ${selected?.id === ticket.id ? 'selected' : ''}`} onClick={() => { setTicketId(ticket.id); setQuantity(1) }}><span><b>{ticket.name}</b><small>{ticket.description || t(locale, 'selectedTicket')} · {t(locale, 'remaining', { count: ticket.remaining })}</small></span><strong>{formatPrice(ticket.price, locale)}</strong></button>)}</div>
    {!selected ? <p className="form-error">{t(locale, 'eventFull')}</p> : <><div className="quantity-row"><span><strong>{t(locale, 'ticketQuantity')}</strong><small>{t(locale, 'remaining', { count: maxQuantity })}</small></span><div className="quantity-control"><button disabled={safeQuantity <= 1} onClick={() => setQuantity(safeQuantity - 1)} aria-label="Decrease quantity"><Minus size={15} /></button><strong>{safeQuantity}</strong><button disabled={safeQuantity >= maxQuantity} onClick={() => setQuantity(safeQuantity + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div></div><div className="purchase-total"><span>{t(locale, 'total')}</span><strong>{formatPrice(Number(selected.price) * safeQuantity, locale)}</strong></div></>}
    {error && <p className="form-error">{error}</p>}<button className="button button-dark full" disabled={!selected || busy} onClick={purchase}>{busy ? t(locale, 'working') : t(locale, 'reserveTicket')} <ArrowRight size={17} /></button><p className="purchase-policy">{t(locale, 'ticketPolicy')}</p>
  </div></div>
}

function AdminDashboard({ page, params, loading, onParamsChange, refresh, setModal, setToast, locale }) {
  const events = page.items
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
    <div className="admin-summary"><span><strong>{page.totalElements}</strong> {t(locale, 'totalEvents')}</span><span><strong>{page.totalOpenEvents}</strong> {t(locale, 'accepting')}</span><span><strong>{page.totalRegistrations}</strong> {t(locale, 'totalRegistrations')}</span></div>
    {loading ? <Loading /> : <><div className="table-wrap"><table><thead><tr><th>{t(locale, 'event')}</th><th>{t(locale, 'datePlace')}</th><th>{t(locale, 'capacity')}</th><th>{t(locale, 'status')}</th><th><span className="sr-only">{t(locale, 'actions')}</span></th></tr></thead>
      <tbody>{events.map(event => <tr key={event.id}><td><strong>{eventCopy(event, locale).title}</strong><span>{eventCopy(event, locale).description}</span></td><td><strong>{formatDate(event.startsAt, locale)}</strong><span>{eventCopy(event, locale).location}</span></td><td><div className="table-capacity"><strong>{event.registeredCount} / {event.capacity}</strong><div><span style={{ width: `${event.registeredCount / event.capacity * 100}%` }} /></div></div></td><td><Status event={event} locale={locale} /></td><td><div className="row-actions"><button aria-label={t(locale, 'viewAttendees', { name: eventCopy(event, locale).title })} onClick={() => showAttendees(event)}><Eye /></button><button aria-label={t(locale, 'edit', { name: eventCopy(event, locale).title })} onClick={() => setEditor(event)}><Edit3 /></button><button className="danger" aria-label={t(locale, 'delete', { name: eventCopy(event, locale).title })} onClick={() => remove(event)}><Trash2 /></button></div></td></tr>)}</tbody></table></div><Pagination page={page} onChange={nextPage => onParamsChange({ ...params, page: nextPage })} locale={locale} /></>}
    {editor && <EventEditor event={editor.id ? editor : null} onClose={() => setEditor(null)} onSaved={async message => { await refresh(); setEditor(null); setToast({ message: t(locale, message === 'Event updated' ? 'eventUpdated' : 'eventCreated'), tone: 'success' }) }} locale={locale} />}
    {attendees && <AttendeePanel data={attendees} onClose={() => setAttendees(null)} locale={locale} />}
  </section>
}

function EventEditor({ event, onClose, onSaved, locale }) {
  const initial = event ? { ...event, startsAt: event.startsAt.slice(0,16), ticketTypes: event.ticketTypes.map(ticket => ({ ...ticket, price: String(ticket.price) })) } : { title:'', description:'', location:'', startsAt:'', capacity:30, category:'COMMUNITY', ticketTypes:[{ name:'General admission', description:'', price:'0', capacity:30 }] }
  const [form, setForm] = useState(initial); const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  const field = key => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) })
  const ticketTotal = form.ticketTypes.reduce((sum, ticket) => sum + Number(ticket.capacity || 0), 0)
  function changeTicket(index, key, value) { setForm({ ...form, ticketTypes: form.ticketTypes.map((ticket, ticketIndex) => ticketIndex === index ? { ...ticket, [key]: value } : ticket) }) }
  async function submit(e) { e.preventDefault(); setSaving(true); setError(''); try { const payload = { ...form, capacity: Number(form.capacity), ticketTypes: form.ticketTypes.map(ticket => ({ ...ticket, price: Number(ticket.price), capacity: Number(ticket.capacity) })) }; if (event) await api.updateEvent(event.id, payload); else await api.createEvent(payload); await onSaved(event ? 'Event updated' : 'Event created') } catch (err) { setError(err.message); setSaving(false) } }
  return <div className="overlay" role="presentation"><div className="sheet" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
    <div className="sheet-header"><div><span className="eyebrow">{event ? t(locale, 'editEvent') : t(locale, 'newEvent')}</span><h2 id="event-form-title">{event ? eventCopy(event, locale).title : t(locale, 'createEvent')}</h2></div><button className="icon-button" onClick={onClose} aria-label={t(locale, 'close')}><X /></button></div>
    <form onSubmit={submit} className="event-form"><label>{t(locale, 'eventTitle')}<input required autoFocus {...field('title')} placeholder={t(locale, 'temporaryTitle')} /></label><label>{t(locale, 'description')}<textarea required rows="5" {...field('description')} placeholder={t(locale, 'descriptionHint')} /></label><div className="form-row"><label>{t(locale, 'location')}<input required {...field('location')} placeholder={t(locale, 'locationHint')} /></label><label>{t(locale, 'category')}<select required {...field('category')}>{['TECH','DESIGN','CAREER','COMMUNITY'].map(category => <option key={category} value={category}>{categoryLabel(category, locale)}</option>)}</select></label></div><div className="form-row"><label>{t(locale, 'dateTime')}<input required type="datetime-local" {...field('startsAt')} /></label><label>{t(locale, 'maximum')}<input required type="number" min={event?.registeredCount || 1} {...field('capacity')} /></label></div><div className="ticket-editor"><div className="ticket-editor-heading"><div><strong>{t(locale, 'ticketTypes')}</strong><small>{t(locale, 'ticketQuotaNote')}</small></div><button type="button" className="button button-plain button-small" onClick={() => setForm({ ...form, ticketTypes:[...form.ticketTypes, { name:'', description:'', price:'0', capacity:1 }] })}><Plus size={15} /> {t(locale, 'addTicketType')}</button></div>{form.ticketTypes.map((ticket, index) => <div className="ticket-edit-row" key={ticket.id ?? index}><div className="ticket-edit-top"><strong>0{index + 1}</strong>{form.ticketTypes.length > 1 && <button type="button" onClick={() => setForm({ ...form, ticketTypes: form.ticketTypes.filter((_, ticketIndex) => ticketIndex !== index) })} aria-label="Remove ticket type"><Trash2 size={15} /></button>}</div><label>{t(locale, 'ticketName')}<input required value={ticket.name} onChange={e => changeTicket(index, 'name', e.target.value)} /></label><label>{t(locale, 'ticketDescription')}<input value={ticket.description || ''} onChange={e => changeTicket(index, 'description', e.target.value)} /></label><div className="form-row"><label>{t(locale, 'ticketPrice')}<input required min="0" step="1" type="number" value={ticket.price} onChange={e => changeTicket(index, 'price', e.target.value)} /></label><label>{t(locale, 'ticketQuota')}<input required min="1" type="number" value={ticket.capacity} onChange={e => changeTicket(index, 'capacity', e.target.value)} /></label></div></div>)}</div><p className={`ticket-allocation ${ticketTotal === Number(form.capacity) ? 'valid' : ''}`}>{t(locale, 'ticketPlanTotal', { count: ticketTotal, capacity: form.capacity })}</p>{error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="button button-plain" onClick={onClose}>{t(locale, 'cancelAction')}</button><button className="button button-dark" disabled={saving}>{saving ? t(locale, 'saving') : event ? t(locale, 'saveChanges') : t(locale, 'createEvent')}</button></div></form>
  </div></div>
}

function AttendeePanel({ data, onClose, locale }) {
  return <div className="overlay" role="presentation"><div className="sheet attendee-sheet" role="dialog" aria-modal="true" aria-labelledby="attendee-title"><div className="sheet-header"><div><span className="eyebrow">{t(locale, 'registrationList')}</span><h2 id="attendee-title">{eventCopy(data.event, locale).title}</h2><p>{t(locale, 'spotsFilled', { count: data.event.registeredCount, capacity: data.event.capacity })}</p></div><button className="icon-button" onClick={onClose} aria-label={t(locale, 'close')}><X /></button></div>
    {data.list === null ? <Loading /> : data.list.length === 0 ? <div className="panel-empty"><Users /><h3>{t(locale, 'noAttendees')}</h3><p>{t(locale, 'attendeesBody')}</p></div> : <div className="attendee-list">{data.list.map((person,index) => <div key={person.id}><span className="avatar muted">{person.name.charAt(0)}</span><div><strong>{person.name}</strong><span>{person.email} · {person.ticketType} × {person.quantity}</span></div><small>#{String(index + 1).padStart(2,'0')}</small></div>)}</div>}
  </div></div>
}

function LoginModal({ modal, setModal, setUser, refresh, setToast, locale }) {
  const [email, setEmail] = useState('user@event.local'); const [password, setPassword] = useState('password'); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { const current = await api.login({ email, password }); setUser(current); await refresh(); setToast({ message: t(locale, 'welcome', { name: current.name.split(' ')[0] }), tone:'success' }); setModal(modal.afterLoginEvent ? { type: 'purchase', event: modal.afterLoginEvent } : null) } catch (err) { setError(err.message === 'Something went wrong. Please try again.' ? t(locale, 'errorCredentials') : err.message); setBusy(false) } }
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
