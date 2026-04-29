// src/app/_components/HubPageContent.tsx
"use client";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Check, MessageSquare, Phone, CalendarDays, BarChart3, Smartphone, Globe,
  Sun, Moon, Star, Users, TrendingUp, Clock, Award,
  ChevronLeft, ChevronRight, Play, MapPin, Mail, ArrowRight,
  Bot, BookOpen, HelpCircle, Zap, Building2, Heart, GraduationCap,
  ShoppingCart, Utensils, Plane, Landmark, Hotel, Briefcase,
  ExternalLink, Sparkles
} from "lucide-react";

// ── Utilitaire ────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Routes ────────────────────────────────────────────────────────────────────
const ROUTES = {
  onboarding: "/onboarding",
  login: "/login",
  help: "/help",
  tutorial: "/tutorial",
};

const SECTOR_ROUTES: Record<string, string> = {
  pme:        "/pme",
  bancaire:   "/bancaire",
  clinique:   "/clinique",
  ecole:      "/ecole",
  ecommerce:  "/ecommerce",
  hotel:      "/hotel",
  public:     "/public",
  restaurant: "/restaurant",
  voyage:     "/voyage",
};

// ── 9 Secteurs ────────────────────────────────────────────────────────────────
interface Sector {
  id: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  icon: React.ElementType;
  primary: string;
  accent: string;
  gradient: string;
  tagFr: string;
  tagEn: string;
  featuresFr: string[];
  featuresEn: string[];
}

const SECTORS: Sector[] = [
  {
    id: "pme",
    nameFr: "PME",
    nameEn: "SME",
    descFr: "Petites et moyennes entreprises — automatisez votre service client et vos rendez-vous.",
    descEn: "Small & medium businesses — automate your customer service and appointments.",
    icon: Briefcase,
    primary: "#075E54",
    accent: "#25D366",
    gradient: "from-[#075E54] to-[#128C7E]",
    tagFr: "Solution phare",
    tagEn: "Flagship solution",
    featuresFr: ["WhatsApp 24/7", "Agent vocal IA", "Gestion RDV", "Tableau de bord"],
    featuresEn: ["WhatsApp 24/7", "AI voice agent", "Appointment mgmt", "Dashboard"],
  },
  {
    id: "bancaire",
    nameFr: "Bancaire",
    nameEn: "Banking",
    descFr: "Banques, microfinances & assurances — conseil client automatisé et gestion de comptes.",
    descEn: "Banks, microfinance & insurance — automated customer advice and account management.",
    icon: Building2,
    primary: "#059669",
    accent: "#34D399",
    gradient: "from-[#059669] to-[#047857]",
    tagFr: "Finance & Banque",
    tagEn: "Finance & Banking",
    featuresFr: ["Conseil financier IA", "Suivi de comptes", "Alertes transaction", "Support 24/7"],
    featuresEn: ["AI financial advice", "Account tracking", "Transaction alerts", "24/7 support"],
  },
  {
    id: "clinique",
    nameFr: "Clinique",
    nameEn: "Clinic",
    descFr: "Cliniques, hôpitaux & pharmacies — prise de RDV médicaux et suivi patient automatisé.",
    descEn: "Clinics, hospitals & pharmacies — automated medical appointment booking and patient follow-up.",
    icon: Heart,
    primary: "#0EA5E9",
    accent: "#38BDF8",
    gradient: "from-[#0EA5E9] to-[#0284C7]",
    tagFr: "Santé & Médical",
    tagEn: "Health & Medical",
    featuresFr: ["RDV médical auto", "Rappels patients", "Suivi prescriptions", "Urgences 24/7"],
    featuresEn: ["Auto medical booking", "Patient reminders", "Prescription tracking", "24/7 emergencies"],
  },
  {
    id: "ecole",
    nameFr: "École",
    nameEn: "School",
    descFr: "Écoles, universités & centres de formation — communication parents-élèves simplifiée.",
    descEn: "Schools, universities & training centers — simplified parent-student communication.",
    icon: GraduationCap,
    primary: "#6366F1",
    accent: "#A5B4FC",
    gradient: "from-[#6366F1] to-[#4F46E5]",
    tagFr: "Éducation & Formation",
    tagEn: "Education & Training",
    featuresFr: ["Infos résultats", "Alertes absences", "Inscriptions auto", "FAQ parents"],
    featuresEn: ["Grade info", "Absence alerts", "Auto enrollment", "Parent FAQ"],
  },
  {
    id: "ecommerce",
    nameFr: "E-commerce",
    nameEn: "E-commerce",
    descFr: "Boutiques en ligne & marketplaces — suivi commandes et support client intelligent.",
    descEn: "Online stores & marketplaces — order tracking and intelligent customer support.",
    icon: ShoppingCart,
    primary: "#8B5CF6",
    accent: "#C4B5FD",
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
    tagFr: "Commerce en ligne",
    tagEn: "Online commerce",
    featuresFr: ["Suivi commandes", "Support retours", "Recommandations IA", "Stock en temps réel"],
    featuresEn: ["Order tracking", "Returns support", "AI recommendations", "Real-time stock"],
  },
  {
    id: "hotel",
    nameFr: "Hôtel",
    nameEn: "Hotel",
    descFr: "Hôtels, lodges & auberges — réservations et conciergerie virtuelle 24h/24.",
    descEn: "Hotels, lodges & hostels — reservations and virtual concierge 24/7.",
    icon: Hotel,
    primary: "#64748B",
    accent: "#94A3B8",
    gradient: "from-[#334155] to-[#1E293B]",
    tagFr: "Hôtellerie & Accueil",
    tagEn: "Hospitality",
    featuresFr: ["Réservations auto", "Conciergerie IA", "Check-in/out info", "Services hôtel"],
    featuresEn: ["Auto reservations", "AI concierge", "Check-in/out info", "Hotel services"],
  },
  {
    id: "public",
    nameFr: "Secteur Public",
    nameEn: "Public Sector",
    descFr: "Mairies, ministères & administrations — services aux citoyens accessibles 24/7.",
    descEn: "Municipalities, ministries & administrations — citizen services accessible 24/7.",
    icon: Landmark,
    primary: "#1E3A5F",
    accent: "#3B82F6",
    gradient: "from-[#1E3A5F] to-[#1E40AF]",
    tagFr: "Administration publique",
    tagEn: "Public administration",
    featuresFr: ["Info citoyens", "Suivi dossiers", "Prise de RDV", "Alertes officielles"],
    featuresEn: ["Citizen info", "File tracking", "Appointment booking", "Official alerts"],
  },
  {
    id: "restaurant",
    nameFr: "Restaurant",
    nameEn: "Restaurant",
    descFr: "Restaurants, maquis & traiteurs — commandes, réservations et livraisons automatisées.",
    descEn: "Restaurants, local eateries & caterers — automated orders, reservations and deliveries.",
    icon: Utensils,
    primary: "#F97316",
    accent: "#FDBA74",
    gradient: "from-[#F97316] to-[#EA580C]",
    tagFr: "Restauration",
    tagEn: "Food & Beverage",
    featuresFr: ["Commandes WhatsApp", "Réservations tables", "Menu digital", "Livraisons suivi"],
    featuresEn: ["WhatsApp orders", "Table reservations", "Digital menu", "Delivery tracking"],
  },
  {
    id: "voyage",
    nameFr: "Voyage",
    nameEn: "Travel",
    descFr: "Agences de voyage & tour-opérateurs — devis, réservations et assistance voyage IA.",
    descEn: "Travel agencies & tour operators — quotes, bookings and AI travel assistance.",
    icon: Plane,
    primary: "#06B6D4",
    accent: "#67E8F9",
    gradient: "from-[#06B6D4] to-[#0891B2]",
    tagFr: "Voyage & Tourisme",
    tagEn: "Travel & Tourism",
    featuresFr: ["Devis instantanés", "Réservations billets", "Visas & documents", "Assistance voyage"],
    featuresEn: ["Instant quotes", "Ticket booking", "Visas & docs", "Travel assistance"],
  },
];

// ── Témoignages ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Jean-Paul Mbarga",
    role: "Directeur",
    company: "Albatros Hôtel",
    city: "Yaoundé",
    avatar: "JM",
    rating: 5,
    textFr: "Depuis AGT Platform, notre réception virtuelle répond aux clients 24h/24. Les réservations ont augmenté de 35% en 2 mois. Un outil indispensable pour notre hôtel.",
    textEn: "Since AGT Platform, our virtual reception answers clients 24/7. Bookings increased by 35% in 2 months. An essential tool for our hotel.",
  },
  {
    name: "Christelle Nkomo",
    role: "Responsable Digital",
    company: "Orange Cameroun",
    city: "Douala",
    avatar: "CN",
    rating: 5,
    textFr: "L'assistant WhatsApp gère des centaines de demandes clients simultanément. Le temps de réponse est passé de 4h à moins de 30 secondes. Nos équipes peuvent se concentrer sur l'essentiel.",
    textEn: "The WhatsApp assistant handles hundreds of customer requests simultaneously. Response time dropped from 4h to under 30 seconds. Our teams can focus on what matters.",
  },
  {
    name: "Patrick Essama",
    role: "Gérant",
    company: "Finex Voyage",
    city: "Yaoundé",
    avatar: "PE",
    rating: 5,
    textFr: "Nos clients reçoivent leurs devis et confirmations de voyage instantanément via WhatsApp. AGT Platform a transformé notre service client.",
    textEn: "Our clients receive their quotes and travel confirmations instantly via WhatsApp. AGT Platform transformed our customer service.",
  },
  {
    name: "Dr. Aminatou Bello",
    role: "Médecin-chef",
    company: "Clinique Sainte-Marie",
    city: "Bafoussam",
    avatar: "AB",
    rating: 5,
    textFr: "La gestion des rendez-vous est maintenant entièrement automatisée. Plus de files d'attente téléphoniques. Nos patients adorent pouvoir prendre RDV à n'importe quelle heure.",
    textEn: "Appointment management is now fully automated. No more phone queues. Our patients love being able to book at any hour.",
  },
  {
    name: "Samuel Tchatchou",
    role: "CEO",
    company: "TechBuild Cameroun",
    city: "Douala",
    avatar: "ST",
    rating: 5,
    textFr: "En 5 minutes de configuration, notre assistant était opérationnel. L'agent vocal IA impressionne vraiment nos clients. Un investissement rentabilisé dès la première semaine.",
    textEn: "In 5 minutes of setup, our assistant was operational. The AI voice agent truly impresses our clients. An investment that paid off in the first week.",
  },
];

// ── Plans ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "starter",
    nameFr: "Starter",
    nameEn: "Starter",
    priceFr: "Gratuit",
    priceEn: "Free",
    subtitleFr: "Pour démarrer",
    subtitleEn: "To get started",
    featuresFr: ["1 assistant WhatsApp", "500 messages/mois", "Support par email", "Dashboard basique"],
    featuresEn: ["1 WhatsApp assistant", "500 messages/month", "Email support", "Basic dashboard"],
    cta: true,
    highlight: false,
  },
  {
    id: "pro",
    nameFr: "Pro",
    nameEn: "Pro",
    priceFr: "25 000 FCFA",
    priceEn: "25,000 XAF",
    subtitleFr: "/mois",
    subtitleEn: "/month",
    featuresFr: ["2 assistants (WhatsApp + Vocal)", "5 000 messages/mois", "Support prioritaire", "Analytics avancés", "Gestion RDV"],
    featuresEn: ["2 assistants (WhatsApp + Voice)", "5,000 messages/month", "Priority support", "Advanced analytics", "Appointment mgmt"],
    cta: true,
    highlight: true,
  },
  {
    id: "enterprise",
    nameFr: "Enterprise",
    nameEn: "Enterprise",
    priceFr: "Sur mesure",
    priceEn: "Custom",
    subtitleFr: "Contactez-nous",
    subtitleEn: "Contact us",
    featuresFr: ["Assistants illimités", "Messages illimités", "SLA garanti", "Intégrations sur mesure", "Account manager dédié"],
    featuresEn: ["Unlimited assistants", "Unlimited messages", "Guaranteed SLA", "Custom integrations", "Dedicated account manager"],
    cta: true,
    highlight: false,
  },
];

// ── Composant Témoignages ─────────────────────────────────────────────────────
function TestimonialsCarousel({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);
  const visible = [0, 1, 2].map(offset => TESTIMONIALS[(current + offset) % total]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visible.map((t, idx) => (
          <div key={`${t.company}-${idx}`}
            className={cn(
              "card p-6 flex flex-col gap-4 transition-all duration-500",
              idx === 1 ? "ring-2 ring-[#25D366]/40" : "opacity-90"
            )}>
            <div className="flex gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed flex-1 italic">
              &ldquo;{locale === "fr" ? t.textFr : t.textEn}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
              <div className="w-10 h-10 rounded-full bg-[#075E54]/10 flex items-center justify-center text-[#075E54] text-xs font-black flex-shrink-0">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.role} · {t.company}</p>
                <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {t.city}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-card)] hover:border-[#25D366] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={cn("h-2 rounded-full transition-all duration-300", i === current ? "bg-[#25D366] w-6" : "bg-[var(--border)] w-2")}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-card)] hover:border-[#25D366] transition-colors">
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
      </div>
    </div>
  );
}

// ── Hero Carousel ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: "/images/hero/hero-1.jpg",
    overlayColor: "from-[#075E54]/80 via-[#075E54]/60 to-[#022c22]/70",
    badgeFr: "10 000 FCFA offerts à l'inscription",
    badgeEn: "10,000 XAF offered at registration",
    titleFr: "Votre assistant virtuel,",
    titleEn: "Your virtual assistant,",
    subtitleFr: "prêt en 5 minutes.",
    subtitleEn: "ready in 5 minutes.",
    accentColor: "#25D366",
    badgeIcon: "zap",
  },
  {
    image: "/images/hero/hero-2.png",
    overlayColor: "from-[#022c22]/85 via-[#075E54]/70 to-[#075E54]/60",
    badgeFr: "WhatsApp · 24h/24 · 7j/7",
    badgeEn: "WhatsApp · 24/7",
    titleFr: "Répondez à vos clients",
    titleEn: "Answer your customers",
    subtitleFr: "même quand vous dormez.",
    subtitleEn: "even while you sleep.",
    accentColor: "#25D366",
    badgeIcon: "message",
  },
  {
    image: "/images/hero/hero-3.jpg",
    overlayColor: "from-[#2D1B69]/85 via-[#6C3CE1]/65 to-[#2D1B69]/70",
    badgeFr: "Agent Vocal IA nouvelle génération",
    badgeEn: "Next-gen AI Voice Agent",
    titleFr: "Un agent IA qui décroche",
    titleEn: "An AI agent that answers",
    subtitleFr: "à votre place.",
    subtitleEn: "in your place.",
    accentColor: "#8B5CF6",
    badgeIcon: "phone",
  },
];

function HeroCarousel({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = HERO_SLIDES.length;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);

  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
      {HERO_SLIDES.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: i === current ? 1 : 0 }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${s.image})` }} />
          <div className={`absolute inset-0 bg-gradient-to-br ${s.overlayColor}`} />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div key={`badge-${current}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold mb-6 animate-fade-in">
          {slide.badgeIcon === "zap" && <Zap className="w-4 h-4 text-[#25D366]" />}
          {slide.badgeIcon === "message" && <MessageSquare className="w-4 h-4 text-[#25D366]" />}
          {slide.badgeIcon === "phone" && <Phone className="w-4 h-4 text-[#8B5CF6]" />}
          {locale === "fr" ? slide.badgeFr : slide.badgeEn}
        </div>

        <h1 key={`title-${current}`} className="text-5xl md:text-7xl font-black text-white leading-tight mb-3 animate-slide-up" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
          {locale === "fr" ? slide.titleFr : slide.titleEn}<br />
          <span style={{ color: slide.accentColor }}>{locale === "fr" ? slide.subtitleFr : slide.subtitleEn}</span>
        </h1>

        <p key={`sub-${current}`} className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in">
          {locale === "fr"
            ? "AGT Platform donne à chaque entreprise un assistant intelligent disponible 24h/24."
            : "AGT Platform gives every business an intelligent assistant available 24/7."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href={ROUTES.onboarding}
            className="px-8 py-4 rounded-xl text-base font-black text-white transition-all hover:scale-105"
            style={{ backgroundColor: slide.accentColor }}>
            {locale === "fr" ? "Créer mon assistant" : "Create my assistant"}
          </Link>
          <a href="#secteurs"
            className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 transition-all flex items-center gap-2">
            {locale === "fr" ? "Voir les solutions" : "See solutions"}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="transition-all duration-300 rounded-full"
            style={{ width: i === current ? 32 : 8, height: 8, backgroundColor: i === current ? "#25D366" : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>

      <div className="absolute bottom-8 right-6 z-20 text-white/40 text-xs font-mono">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </section>
  );
}

// ── Carte Secteur ─────────────────────────────────────────────────────────────
function SectorCard({ sector, locale }: { sector: Sector; locale: string }) {
  const [hovered, setHovered] = useState(false);
  const Icon = sector.icon;

  return (
    <Link
      href={SECTOR_ROUTES[sector.id]}
      className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: hovered ? `0 24px 60px ${sector.primary}30, 0 8px 24px rgba(0,0,0,0.2)` : "0 4px 24px rgba(0,0,0,0.18)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Barre colorée en haut */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${sector.gradient}`} />

      {/* Corps */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${sector.primary}18` }}
            >
              <Icon className="w-6 h-6" style={{ color: sector.primary }} />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight" style={{ color: "#0F172A" }}>
                {locale === "fr" ? sector.nameFr : sector.nameEn}
              </h3>
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${sector.primary}18`, color: sector.primary }}
              >
                {locale === "fr" ? sector.tagFr : sector.tagEn}
              </span>
            </div>
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
            style={{ backgroundColor: `${sector.primary}12` }}
          >
            <ExternalLink className="w-4 h-4" style={{ color: sector.primary }} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#475569" }}>
          {locale === "fr" ? sector.descFr : sector.descEn}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2">
          {(locale === "fr" ? sector.featuresFr : sector.featuresEn).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sector.accent }} />
              {f}
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid #E2E8F0" }}>
          <span className="text-xs font-semibold" style={{ color: sector.primary }}>
            {locale === "fr" ? "Découvrir la solution" : "Discover the solution"}
          </span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: sector.primary }}
          />
        </div>
      </div>
    </Link>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function HubPageContent() {
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const stats = [
    { value: "500+", labelFr: "Entreprises équipées", labelEn: "Businesses equipped", icon: Users },
    { value: "98%", labelFr: "Satisfaction client", labelEn: "Client satisfaction", icon: Award },
    { value: "< 5 min", labelFr: "Temps de configuration", labelEn: "Setup time", icon: Clock },
    { value: "24/7", labelFr: "Disponibilité garantie", labelEn: "Guaranteed availability", icon: TrendingUp },
  ];

  const features = [
    { icon: MessageSquare, titleFr: "Assistant WhatsApp", titleEn: "WhatsApp Assistant", descFr: "Bot WhatsApp intelligent qui répond à vos clients en temps réel, même la nuit.", descEn: "Smart WhatsApp bot that responds to your clients in real time, even at night." },
    { icon: Phone, titleFr: "Agent Vocal IA", titleEn: "AI Voice Agent", descFr: "Un agent vocal IA décroche vos appels entrants et répond comme un humain.", descEn: "An AI voice agent answers your inbound calls and responds like a human." },
    { icon: CalendarDays, titleFr: "Gestion des RDV", titleEn: "Appointment Management", descFr: "Prise de rendez-vous automatique 24/7, rappels et confirmations par WhatsApp.", descEn: "Automatic appointment booking 24/7, reminders and confirmations via WhatsApp." },
    { icon: BarChart3, titleFr: "Analytics en temps réel", titleEn: "Real-time Analytics", descFr: "Tableau de bord complet avec toutes vos métriques clés en un coup d'œil.", descEn: "Complete dashboard with all your key metrics at a glance." },
    { icon: Smartphone, titleFr: "Multi-canal", titleEn: "Multi-channel", descFr: "WhatsApp, voix, SMS — votre assistant est partout où sont vos clients.", descEn: "WhatsApp, voice, SMS — your assistant is everywhere your clients are." },
    { icon: Globe, titleFr: "Multilingue", titleEn: "Multilingual", descFr: "Français, anglais, langues locales — votre assistant parle la langue de vos clients.", descEn: "French, English, local languages — your assistant speaks your clients' language." },
  ];

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (videoPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
      setVideoPlaying(!videoPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#075E54] flex items-center justify-center text-white font-black text-sm">A</div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-[var(--text)] text-sm">AGT Platform</span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium hidden sm:block">by AG Technologies</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-muted)]">
            <a href="#features" className="hover:text-[var(--text)] transition-colors">{locale === "fr" ? "Fonctionnalités" : "Features"}</a>
            <a href="#demo" className="hover:text-[var(--text)] transition-colors">Demo</a>
            <a href="#plans" className="hover:text-[var(--text)] transition-colors">{locale === "fr" ? "Tarifs" : "Pricing"}</a>
            <a href="#testimonials" className="hover:text-[var(--text)] transition-colors">{locale === "fr" ? "Témoignages" : "Testimonials"}</a>
            <a href="#secteurs" className="hover:text-[#075E54] text-[#075E54] font-semibold transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === "fr" ? "Nos solutions" : "Our solutions"}
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setLocale(l => l === "fr" ? "en" : "fr")}
              className="p-2 rounded-xl hover:bg-[var(--bg)] text-[var(--text-muted)] transition-colors text-xs font-bold">
              {locale === "fr" ? "EN" : "FR"}
            </button>
            <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-[var(--bg)] text-[var(--text-muted)] transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href={ROUTES.login}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors">
              {locale === "fr" ? "Se connecter" : "Log in"}
            </Link>
            <Link href={ROUTES.onboarding} className="btn-primary text-sm px-3 sm:px-4 whitespace-nowrap">
              <span className="hidden sm:inline">{locale === "fr" ? "Créer mon assistant" : "Create my assistant"}</span>
              <span className="sm:hidden">{locale === "fr" ? "Démarrer" : "Start"}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Carousel ──────────────────────────────────────────────────── */}
      <HeroCarousel locale={locale} />

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="card p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center gap-2 py-8 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1" style={{ backgroundColor: "#25D36618" }}>
                    <Icon className="w-6 h-6 text-[#075E54]" />
                  </div>
                  <p className="text-3xl font-black text-[var(--text)]">{stat.value}</p>
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                    {locale === "fr" ? stat.labelFr : stat.labelEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Démo vidéo ─────────────────────────────────────────────────────── */}
      <section id="demo" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 text-[#6C3CE1] text-xs font-bold mb-4 uppercase tracking-widest">
            <Play className="w-3 h-3" />
            {locale === "fr" ? "Démonstration" : "Demo"}
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mb-4">
            {locale === "fr" ? "Voyez AGT Platform en action" : "See AGT Platform in action"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {locale === "fr"
              ? "En moins de 5 minutes, votre assistant est opérationnel pour répondre à vos clients."
              : "In less than 5 minutes, your assistant is operational to respond to your clients."}
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-[#022c22] aspect-video max-w-3xl mx-auto">
          <video ref={videoRef} className="w-full h-full object-cover" poster="/images/demo-thumbnail.jpg" onEnded={() => setVideoPlaying(false)}>
            <source src="/videos/demo.mp4" type="video/mp4" />
          </video>
          {!videoPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={handlePlayVideo}
                className="w-20 h-20 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center transition-all hover:scale-110 shadow-2xl">
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#075E54]/10 border border-[#075E54]/20 text-[#075E54] text-xs font-bold mb-4 uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            {locale === "fr" ? "Fonctionnalités" : "Features"}
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mb-4">
            {locale === "fr" ? "Tout ce dont vous avez besoin" : "Everything you need"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {locale === "fr"
              ? "AGT Platform regroupe toutes les fonctionnalités essentielles pour automatiser votre service client."
              : "AGT Platform includes all the essential features to automate your customer service."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card p-6 group hover:border-[#25D366]/30 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-4 group-hover:bg-[#25D366]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#075E54]" />
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{locale === "fr" ? f.titleFr : f.titleEn}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{locale === "fr" ? f.descFr : f.descEn}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Plans ──────────────────────────────────────────────────────────── */}
      <section id="plans" className="bg-[var(--bg-card)] border-y border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold mb-4 uppercase tracking-widest">
              <Award className="w-3 h-3" />
              {locale === "fr" ? "Tarifs" : "Pricing"}
            </div>
            <h2 className="text-3xl font-black text-[var(--text)] mb-4">
              {locale === "fr" ? "Des tarifs adaptés à votre activité" : "Pricing adapted to your business"}
            </h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              {locale === "fr"
                ? "Commencez gratuitement, évoluez selon vos besoins. 10 000 FCFA offerts à l'inscription."
                : "Start free, scale as you grow. 10,000 XAF offered at registration."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className={cn("card p-8 flex flex-col relative", plan.highlight && "ring-2 ring-[#25D366]")}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-[#25D366] text-white text-xs font-black">
                      {locale === "fr" ? "Le plus populaire" : "Most popular"}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-black text-xl text-[var(--text)] mb-1">{locale === "fr" ? plan.nameFr : plan.nameEn}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[var(--text)]">{locale === "fr" ? plan.priceFr : plan.priceEn}</span>
                    <span className="text-sm text-[var(--text-muted)]">{locale === "fr" ? plan.subtitleFr : plan.subtitleEn}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {(locale === "fr" ? plan.featuresFr : plan.featuresEn).map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[var(--text)]">
                      <Check className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={ROUTES.onboarding}
                  className={cn("w-full py-3 rounded-xl text-sm font-semibold text-center transition-all",
                    plan.highlight
                      ? "bg-[#075E54] text-white hover:bg-[#128C7E]"
                      : "border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg)]"
                  )}>
                  {locale === "fr" ? "Commencer" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ────────────────────────────────────────────────────── */}
      <section id="testimonials" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold mb-4 uppercase tracking-widest">
            <Star className="w-3 h-3" />
            {locale === "fr" ? "Témoignages" : "Testimonials"}
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mb-4">
            {locale === "fr" ? "Ils nous font confiance" : "They trust us"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {locale === "fr"
              ? "Des centaines d'entreprises africaines utilisent déjà AGT Platform."
              : "Hundreds of African businesses already use AGT Platform."}
          </p>
        </div>
        <TestimonialsCarousel locale={locale} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION SECTEURS — SÉPARÉE & MISE EN AVANT ────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="secteurs" className="relative overflow-hidden">
        {/* Fond distinctif */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0a3d30 0%, #0f2744 45%, #1e1040 100%)" }} />
        {/* Grille décorative */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Orbes de lumière */}
        <div className="absolute top-[-150px] left-[10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.12]" style={{ background: "radial-gradient(circle, #25D366 0%, transparent 65%)" }} />
        <div className="absolute bottom-[-100px] right-[5%] w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.14]" style={{ background: "radial-gradient(circle, #6C3CE1 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">

          {/* Header section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
              {locale === "fr" ? "Solutions par secteur" : "Industry solutions"}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
              {locale === "fr" ? (
                <>Une solution <span className="text-[#25D366]">sur mesure</span><br />pour chaque secteur</>
              ) : (
                <>A <span className="text-[#25D366]">tailored solution</span><br />for every industry</>
              )}
            </h2>
            <p className="text-white/75 max-w-2xl mx-auto text-lg leading-relaxed">
              {locale === "fr"
                ? "AGT Platform s'adapte à votre métier. Choisissez votre secteur pour découvrir une solution conçue spécifiquement pour vos besoins."
                : "AGT Platform adapts to your business. Choose your industry to discover a solution specifically designed for your needs."}
            </p>

            {/* Stats inline */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              {[
                { value: "9", labelFr: "Secteurs couverts", labelEn: "Industries covered" },
                { value: "500+", labelFr: "Clients actifs", labelEn: "Active clients" },
                { value: "24/7", labelFr: "Disponibilité", labelEn: "Availability" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-black text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{s.value}</p>
                  <p className="text-xs text-white/55 font-semibold uppercase tracking-widest mt-1">
                    {locale === "fr" ? s.labelFr : s.labelEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Grille des 9 secteurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTORS.map((sector) => (
              <SectorCard key={sector.id} sector={sector} locale={locale} />
            ))}
          </div>

          {/* CTA bas */}
          <div className="text-center mt-14">
            <p className="text-white/50 text-sm mb-6">
              {locale === "fr"
                ? "Votre secteur n'est pas listé ? Contactez-nous pour une solution personnalisée."
                : "Your industry isn't listed? Contact us for a custom solution."}
            </p>
            <Link href={ROUTES.onboarding}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-black text-base hover:bg-[#128C7E] transition-all hover:scale-105 shadow-lg shadow-[#25D366]/20">
              {locale === "fr" ? "Créer mon assistant maintenant" : "Create my assistant now"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="card p-12 text-center bg-gradient-to-br from-[#022c22] to-[#075E54] border-0">
          <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-[#25D366]" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">
            {locale === "fr" ? "Prêt à automatiser votre service client ?" : "Ready to automate your customer service?"}
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto">
            {locale === "fr"
              ? "Rejoignez 500+ entreprises africaines qui font confiance à AGT Platform. Inscription gratuite — 10 000 FCFA offerts."
              : "Join 500+ African businesses that trust AGT Platform. Free registration — 10,000 XAF offered."}
          </p>
          <Link href={ROUTES.onboarding}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#25D366] text-white font-black text-base hover:bg-[#128C7E] transition-all">
            {locale === "fr" ? "Démarrer gratuitement" : "Start for free"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#022c22] text-white">
        <div className="h-1 bg-gradient-to-r from-[#25D366] via-[#075E54] to-[#6C3CE1]" />
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center text-white font-black text-base shadow-lg">A</div>
                <div className="flex flex-col leading-none">
                  <span className="font-black text-lg text-white tracking-tight">AGT Platform</span>
                  <span className="text-[11px] text-white/50 font-medium">by AG Technologies</span>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                {locale === "fr"
                  ? "La plateforme d'assistants virtuels IA pour les entreprises africaines."
                  : "The AI virtual assistant platform for African businesses."}
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm text-white/50">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#25D366]" />
                  <span>Montée Anne rouge, Immeuble Kadji,<br />Yaoundé, Cameroun</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/50">
                  <Mail className="w-4 h-4 flex-shrink-0 text-[#25D366]" />
                  <a href="mailto:secretariatagtechnologies@gmail.com" className="hover:text-[#25D366] transition-colors">
                    secretariatagtechnologies@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-5">
                {locale === "fr" ? "Produit" : "Product"}
              </p>
              <ul className="space-y-3">
                {[
                  { labelFr: "Fonctionnalités", labelEn: "Features", href: "#features" },
                  { labelFr: "Tarifs", labelEn: "Pricing", href: "#plans" },
                  { labelFr: "Demo", labelEn: "Demo", href: "#demo" },
                  { labelFr: "S'inscrire", labelEn: "Sign up", href: ROUTES.onboarding },
                ].map(item => (
                  <li key={item.href}>
                    <a href={item.href} className="text-sm text-white/60 hover:text-[#25D366] transition-colors flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {locale === "fr" ? item.labelFr : item.labelEn}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-5">
                {locale === "fr" ? "Solutions" : "Solutions"}
              </p>
              <ul className="space-y-2">
                {SECTORS.slice(0, 5).map(s => (
                  <li key={s.id}>
                    <Link href={SECTOR_ROUTES[s.id]} className="flex items-center gap-2 text-sm text-white/60 hover:text-[#25D366] transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.accent }} />
                      {locale === "fr" ? s.nameFr : s.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-5">
                {locale === "fr" ? "Ressources" : "Resources"}
              </p>
              <ul className="space-y-3">
                {[
                  { labelFr: "Aide", labelEn: "Help", href: ROUTES.help, Icon: HelpCircle },
                  { labelFr: "Tutoriels", labelEn: "Tutorials", href: ROUTES.tutorial, Icon: BookOpen },
                  { labelFr: "Se connecter", labelEn: "Log in", href: ROUTES.login, Icon: Bot },
                ].map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#25D366] transition-colors group">
                      <item.Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-[#25D366] transition-colors" />
                      {locale === "fr" ? item.labelFr : item.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs">
                <span>🇨🇲</span>
                <span>{locale === "fr" ? "Conçu au Cameroun" : "Made in Cameroon"}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} AG Technologies. {locale === "fr" ? "Tous droits réservés." : "All rights reserved."}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setLocale(l => l === "fr" ? "en" : "fr")}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/50 hover:text-white transition-all font-bold">
                {locale === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
              </button>
              <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}