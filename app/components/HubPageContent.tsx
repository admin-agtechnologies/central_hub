// ============================================================
// FICHIER  : app/components/HubPageContent.tsx
// VERSION  : 3.1.0
// Fix + Vidéo réelle : https://api.salma.agtgroupholding.com/media/seed/bourses/demo.mp4
// Changements :
//   - Vidéo embarquée depuis le serveur AGT
//   - globals.css fix : @import en premier
//   - Hero redesigné : fond sombre, grain, orbes, police Syne
//   - Footer original restauré intégralement
//   - Section Tarifs supprimée
//   - Secteurs avec images illustratives Unsplash
// ============================================================

"use client";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  MessageSquare, Phone, CalendarDays, BarChart3, Smartphone, Globe,
  Sun, Moon, Star, Users, TrendingUp, Clock, Award,
  ChevronLeft, ChevronRight, Play, Pause, MapPin, Mail, ArrowRight,
  Bot, BookOpen, HelpCircle, Zap, Building2, Heart, GraduationCap,
  ShoppingCart, Utensils, Plane, Landmark, Hotel, Briefcase, Sparkles,
} from "lucide-react";

// ── URL de la vidéo de démo ────────────────────────────────────────────────
const DEMO_VIDEO_URL = "https://api.salma.agtgroupholding.com/media/seed/bourses/demo.mp4";

// ── Utilitaire ────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Routes ────────────────────────────────────────────────────────────────────
const ROUTES = {
  onboarding: "/onboarding",
  login:      "/login",
  help:       "/help",
  tutorial:   "/tutorial",
};

const SECTOR_ROUTES: Record<string, string> = {
  pme:        "https://pme.agt-bot.com",
  bancaire:   "https://banking.agt-bot.com",
  clinique:   "https://clinical.agt-bot.com",
  ecole:      "https://school.agt-bot.com",
  ecommerce:  "https://e-commerce.agt-bot.com",
  hotel:      "https://hotel.agt-bot.com",
  public:     "https://public.agt-bot.com",
  restaurant: "https://restaurant.agt-bot.com",
  voyage:     "https://travell.agt-bot.com",
};

// ── Type Secteur ─────────────────────────────────────────────────────────────
interface Sector {
  id: string; nameFr: string; nameEn: string; descFr: string; descEn: string;
  icon: React.ElementType; primary: string; accent: string; gradient: string;
  tagFr: string; tagEn: string; featuresFr: string[]; featuresEn: string[];
  image: string;
}

// ── 9 Secteurs ────────────────────────────────────────────────────────────────
const SECTORS: Sector[] = [
  { id:"pme",        nameFr:"PME",           nameEn:"SME",           descFr:"Automatisez votre service client et vos rendez-vous.",        descEn:"Automate your customer service and appointments.",                icon:Briefcase,    primary:"#075E54", accent:"#25D366", gradient:"from-[#075E54] to-[#128C7E]", tagFr:"Solution phare",       tagEn:"Flagship solution",    featuresFr:["WhatsApp 24/7","Agent vocal IA","Gestion RDV","Tableau de bord"],           featuresEn:["WhatsApp 24/7","AI voice agent","Appointment mgmt","Dashboard"],          image:"https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80" },
  { id:"bancaire",   nameFr:"Bancaire",      nameEn:"Banking",       descFr:"Conseil client automatisé et gestion de comptes.",           descEn:"Automated customer advice and account management.",              icon:Building2,    primary:"#059669", accent:"#34D399", gradient:"from-[#059669] to-[#047857]", tagFr:"Finance & Banque",      tagEn:"Finance & Banking",    featuresFr:["Conseil financier IA","Suivi de comptes","Alertes transaction","Support 24/7"], featuresEn:["AI financial advice","Account tracking","Transaction alerts","24/7 support"], image:"https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&q=80" },
  { id:"clinique",   nameFr:"Clinique",      nameEn:"Clinic",        descFr:"Prise de RDV médicaux et suivi patient automatisé.",         descEn:"Automated medical appointment booking and patient follow-up.",  icon:Heart,        primary:"#0EA5E9", accent:"#38BDF8", gradient:"from-[#0EA5E9] to-[#0284C7]", tagFr:"Santé & Médical",       tagEn:"Health & Medical",     featuresFr:["RDV médical auto","Rappels patients","Suivi prescriptions","Urgences 24/7"], featuresEn:["Auto medical booking","Patient reminders","Prescription tracking","24/7 emergencies"], image:"https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80" },
  { id:"ecole",      nameFr:"École",         nameEn:"School",        descFr:"Communication parents-élèves simplifiée et automatisée.",    descEn:"Simplified parent-student communication.",                      icon:GraduationCap,primary:"#6366F1", accent:"#A5B4FC", gradient:"from-[#6366F1] to-[#4F46E5]", tagFr:"Éducation & Formation", tagEn:"Education & Training", featuresFr:["Infos résultats","Alertes absences","Inscriptions auto","FAQ parents"],     featuresEn:["Grade info","Absence alerts","Auto enrollment","Parent FAQ"],             image:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" },
  { id:"ecommerce",  nameFr:"E-commerce",    nameEn:"E-commerce",    descFr:"Suivi commandes et support client intelligent.",             descEn:"Order tracking and intelligent customer support.",              icon:ShoppingCart, primary:"#8B5CF6", accent:"#C4B5FD", gradient:"from-[#8B5CF6] to-[#7C3AED]", tagFr:"Commerce en ligne",    tagEn:"Online commerce",      featuresFr:["Suivi commandes","Support retours","Recommandations IA","Stock temps réel"], featuresEn:["Order tracking","Returns support","AI recommendations","Real-time stock"], image:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80" },
  { id:"hotel",      nameFr:"Hôtel",         nameEn:"Hotel",         descFr:"Réservations et conciergerie virtuelle 24h/24.",             descEn:"Reservations and virtual concierge 24/7.",                      icon:Hotel,        primary:"#64748B", accent:"#94A3B8", gradient:"from-[#334155] to-[#1E293B]", tagFr:"Hôtellerie & Accueil",  tagEn:"Hospitality",          featuresFr:["Réservations auto","Conciergerie IA","Check-in/out","Services hôtel"],     featuresEn:["Auto reservations","AI concierge","Check-in/out info","Hotel services"],  image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
  { id:"public",     nameFr:"Secteur Public",nameEn:"Public Sector", descFr:"Services aux citoyens accessibles 24/7.",                   descEn:"Citizen services accessible 24/7.",                             icon:Landmark,     primary:"#1E3A5F", accent:"#3B82F6", gradient:"from-[#1E3A5F] to-[#1E40AF]", tagFr:"Administration publique",tagEn:"Public administration", featuresFr:["Info citoyens","Suivi dossiers","Prise de RDV","Alertes officielles"],     featuresEn:["Citizen info","File tracking","Appointment booking","Official alerts"],  image:"https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&q=80" },
  { id:"restaurant", nameFr:"Restaurant",    nameEn:"Restaurant",    descFr:"Commandes, réservations et livraisons automatisées.",        descEn:"Automated orders, reservations and deliveries.",                icon:Utensils,     primary:"#F97316", accent:"#FDBA74", gradient:"from-[#F97316] to-[#EA580C]", tagFr:"Restauration",          tagEn:"Food & Beverage",      featuresFr:["Commandes WhatsApp","Réservations tables","Menu digital","Livraisons suivi"], featuresEn:["WhatsApp orders","Table reservations","Digital menu","Delivery tracking"], image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" },
  { id:"voyage",     nameFr:"Voyage",        nameEn:"Travel",        descFr:"Devis, réservations et assistance voyage IA.",              descEn:"Quotes, bookings and AI travel assistance.",                    icon:Plane,        primary:"#06B6D4", accent:"#67E8F9", gradient:"from-[#06B6D4] to-[#0891B2]", tagFr:"Voyage & Tourisme",    tagEn:"Travel & Tourism",     featuresFr:["Devis instantanés","Réservations billets","Visas & documents","Assistance voyage"], featuresEn:["Instant quotes","Ticket booking","Visas & docs","Travel assistance"],    image:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80" },
];

// ── Témoignages ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name:"Jean-Paul Mbarga",  role:"Directeur",         company:"Albatros Hôtel",     city:"Yaoundé",   avatar:"JM", rating:5, textFr:"Depuis AGT Platform, notre réception virtuelle répond aux clients 24h/24. Les réservations ont augmenté de 35% en 2 mois.", textEn:"Since AGT Platform, our virtual reception answers clients 24/7. Bookings increased by 35% in 2 months." },
  { name:"Christelle Nkomo",  role:"Responsable Digital",company:"Orange Cameroun",   city:"Douala",    avatar:"CN", rating:5, textFr:"L'assistant WhatsApp gère des centaines de demandes simultanément. Le temps de réponse est passé de 4h à moins de 30 secondes.", textEn:"The WhatsApp assistant handles hundreds of requests. Response time dropped from 4h to under 30 seconds." },
  { name:"Patrick Essama",    role:"Gérant",            company:"Finex Voyage",       city:"Yaoundé",   avatar:"PE", rating:5, textFr:"Nos clients reçoivent leurs devis et confirmations instantanément via WhatsApp. AGT Platform a transformé notre service.", textEn:"Our clients receive quotes and travel confirmations instantly via WhatsApp. AGT Platform transformed our service." },
  { name:"Dr. Aminatou Bello",role:"Médecin-chef",      company:"Clinique Sainte-Marie",city:"Bafoussam",avatar:"AB", rating:5, textFr:"La gestion des rendez-vous est entièrement automatisée. Plus de files d'attente. Nos patients adorent prendre RDV à toute heure.", textEn:"Appointment management is fully automated. No more queues. Our patients love being able to book at any hour." },
  { name:"Samuel Tchatchou",  role:"CEO",               company:"TechBuild Cameroun", city:"Douala",    avatar:"ST", rating:5, textFr:"En 5 minutes, notre assistant était opérationnel. L'agent vocal IA impressionne nos clients. Rentabilisé dès la première semaine.", textEn:"In 5 minutes, our assistant was operational. The AI voice agent impresses our clients. Paid off in the first week." },
];

// ── Hero slides ───────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { image:"/images/hero/Bank1.jpg",     badgeFr:"10 000 FCFA offerts à l\'inscription", badgeEn:"10,000 XAF offered at registration", line1Fr:"Votre assistant virtuel,",  line1En:"Your virtual assistant,",   line2Fr:"prêt en 5 minutes.",          line2En:"ready in 5 minutes.",         accent:"#25D366", badgeIcon:"zap",     overlayA:"#075E54CC", overlayB:"#022c22EE" },
  { image:"/images/hero/hero-2.png",    badgeFr:"WhatsApp · 24h/24 · 7j/7",            badgeEn:"WhatsApp · 24/7",                   line1Fr:"Répondez à vos clients",    line1En:"Answer your customers",     line2Fr:"même quand vous dormez.",     line2En:"even while you sleep.",       accent:"#25D366", badgeIcon:"message", overlayA:"#022c22E8", overlayB:"#075E54CC" },
  { image:"/images/hero/hero-3.jpg",    badgeFr:"Agent Vocal IA nouvelle génération",   badgeEn:"Next-gen AI Voice Agent",           line1Fr:"Un agent IA qui décroche",  line1En:"An AI agent that answers",  line2Fr:"à votre place.",              line2En:"in your place.",              accent:"#A78BFA", badgeIcon:"phone",   overlayA:"#2D1B69E0", overlayB:"#075E54C0" },
  { image:"/images/hero/E-com.avif",    badgeFr:"E-commerce & boutiques en ligne",      badgeEn:"E-commerce & online stores",        line1Fr:"Boostez vos ventes",        line1En:"Boost your sales",          line2Fr:"avec l\'IA 24h/24.",          line2En:"with AI 24/7.",               accent:"#C4B5FD", badgeIcon:"zap",     overlayA:"#4C1D95DD", overlayB:"#1E1040CC" },
  { image:"/images/hero/clinique.avif", badgeFr:"Santé & Médical",                      badgeEn:"Health & Medical",                  line1Fr:"Votre clinique connectée,", line1En:"Your clinic connected,",    line2Fr:"patients servis 24h/24.",     line2En:"patients served 24/7.",       accent:"#38BDF8", badgeIcon:"phone",   overlayA:"#0C4A6EDD", overlayB:"#0284C7BB" },
  { image:"/images/hero/Ecole.jpg",     badgeFr:"Éducation & Formation",                badgeEn:"Education & Training",              line1Fr:"L\'école du futur,",        line1En:"The school of the future,", line2Fr:"connectée à chaque famille.", line2En:"connected to every family.",  accent:"#A5B4FC", badgeIcon:"message", overlayA:"#312E81E0", overlayB:"#4338CACC" },
  { image:"/images/hero/resto.jpg",     badgeFr:"Restauration & Hôtellerie",            badgeEn:"Food & Hospitality",                line1Fr:"Votre restaurant digital,",  line1En:"Your digital restaurant,",  line2Fr:"commandes & réservations IA.",line2En:"AI orders & reservations.",   accent:"#FDBA74", badgeIcon:"message", overlayA:"#9A3412E0", overlayB:"#EA580CCC" },
];

// ── HeroCarousel ──────────────────────────────────────────────────────────────
function HeroCarousel({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const total = HERO_SLIDES.length;

  const goTo = useCallback((i: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(i);
    setTimeout(() => setTransitioning(false), 700);
  }, [transitioning]);

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);

  const s = HERO_SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100svh" }}>

      {/* Couches image + overlay */}
      {HERO_SLIDES.map((slide, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out" style={{ opacity: i === current ? 1 : 0 }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})`, transform: i === current ? "scale(1)" : "scale(1.05)", transition: "transform 8s ease-out" }} />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(145deg, ${slide.overlayA} 0%, ${slide.overlayB} 100%)` }} />
        </div>
      ))}

      {/* Grain texture cinématique */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.16]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")", backgroundSize: "180px 180px" }} />

      {/* Grille déco */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Orbe lumière dynamique */}
      <div className="absolute top-[-100px] right-[12%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${s.accent}28 0%, transparent 65%)` }} />
      <div className="absolute bottom-[-80px] left-[8%] w-[320px] h-[320px] rounded-full blur-3xl pointer-events-none opacity-35"
        style={{ background: "radial-gradient(circle, #6C3CE145 0%, transparent 65%)" }} />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4"
        style={{ minHeight: "100svh", paddingTop: "64px", paddingBottom: "80px" }}>

        {/* Badge */}
        <div key={`b-${current}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold mb-7 animate-fade-in"
          style={{ background: "rgba(255,255,255,0.11)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.20)", boxShadow: `0 0 24px ${s.accent}28` }}>
          {s.badgeIcon === "zap"     && <Zap          className="w-4 h-4" style={{ color: s.accent }} />}
          {s.badgeIcon === "message" && <MessageSquare className="w-4 h-4" style={{ color: s.accent }} />}
          {s.badgeIcon === "phone"   && <Phone         className="w-4 h-4" style={{ color: s.accent }} />}
          {locale === "fr" ? s.badgeFr : s.badgeEn}
        </div>

        {/* Titre */}
        <h1 key={`h-${current}`} className="animate-slide-up"
          style={{ fontSize: "clamp(1.6rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.06, color: "#fff", textShadow: "0 4px 32px rgba(0,0,0,0.4)", letterSpacing: "-0.03em", maxWidth: "880px", fontFamily: "'Syne',system-ui,sans-serif" }}>
          {locale === "fr" ? s.line1Fr : s.line1En}
          <br />
          <span style={{ color: s.accent, filter: `drop-shadow(0 0 22px ${s.accent}55)` }}>
            {locale === "fr" ? s.line2Fr : s.line2En}
          </span>
        </h1>

        {/* Description */}
        <p key={`p-${current}`} className="mt-5 mb-10 text-sm leading-relaxed animate-fade-in delay-200"
          style={{ color: "rgba(255,255,255,0.72)", maxWidth: "560px" }}>
          {locale === "fr"
            ? "AGT Platform donne à chaque entreprise un assistant intelligent disponible 24h/24."
            : "AGT Platform gives every business an intelligent assistant available 24/7."}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-in delay-300">
          <Link href={ROUTES.onboarding}
            className="group px-8 py-4 rounded-2xl font-black text-base text-white flex items-center gap-2 transition-all hover:scale-105"
            style={{ backgroundColor: s.accent, boxShadow: `0 8px 32px ${s.accent}50` }}>
            {locale === "fr" ? "Créer mon assistant" : "Create my assistant"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a href="#secteurs"
            className="px-8 py-4 rounded-2xl font-semibold text-base text-white flex items-center gap-2 transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.11)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.24)" }}>
            {locale === "fr" ? "Voir les solutions" : "See solutions"}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/22 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-white/45 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Flèches navigation */}
      <button onClick={prev} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.16)" }}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.16)" }}>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicateurs dots */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 28 : 8, height: 8, backgroundColor: i === current ? s.accent : "rgba(255,255,255,0.32)", boxShadow: i === current ? `0 0 10px ${s.accent}80` : "none" }} />
        ))}
      </div>

      {/* Compteur */}
      <div className="absolute bottom-10 right-6 z-20 text-white/30 text-xs font-mono tracking-widest">
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
    <Link href={SECTOR_ROUTES[sector.id]}
      className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
      style={{ boxShadow: hovered ? `0 28px 64px ${sector.primary}42, 0 8px 24px rgba(0,0,0,0.22)` : "0 4px 20px rgba(0,0,0,0.16)", border: "1px solid rgba(255,255,255,0.10)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={sector.image} alt={locale === "fr" ? sector.nameFr : sector.nameEn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className={`absolute inset-0 bg-gradient-to-br ${sector.gradient} opacity-75 group-hover:opacity-62 transition-opacity duration-300`} />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/30 backdrop-blur-sm text-white">
            {locale === "fr" ? sector.tagFr : sector.tagEn}
          </span>
        </div>
        <div className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="absolute bottom-0 inset-x-0 px-5 pb-4 pt-8"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%)" }}>
          <h3 className="font-black text-xl text-white" style={{ fontFamily: "'Syne',system-ui", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
            {locale === "fr" ? sector.nameFr : sector.nameEn}
          </h3>
        </div>
      </div>

      {/* Corps */}
      <div className="p-5 bg-[var(--bg-card)]">
        <p className="text-sm leading-relaxed mb-4 text-[var(--text-muted)]">{locale === "fr" ? sector.descFr : sector.descEn}</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(locale === "fr" ? sector.featuresFr : sector.featuresEn).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sector.accent }} />
              {f}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <span className="text-xs font-bold tracking-wide" style={{ color: sector.primary }}>{locale === "fr" ? "Découvrir la solution" : "Discover the solution"}</span>
          <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1" style={{ backgroundColor: `${sector.primary}18` }}>
            <ArrowRight className="w-3.5 h-3.5" style={{ color: sector.primary }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Témoignages carousel ──────────────────────────────────────────────────────
function TestimonialsCarousel({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);
  const visible = [0, 1, 2].map(o => TESTIMONIALS[(current + o) % total]);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visible.map((t, idx) => (
          <div key={`${t.company}-${idx}`} className={cn("card p-6 flex flex-col gap-4 transition-all duration-500", idx === 1 ? "ring-2 ring-[#25D366]/40 shadow-lg shadow-[#25D366]/10" : "opacity-90")}>
            <div className="flex gap-1">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
            <p className="text-sm text-[var(--text)] leading-relaxed flex-1 italic">&ldquo;{locale === "fr" ? t.textFr : t.textEn}&rdquo;</p>
            <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
              <div className="w-10 h-10 rounded-full bg-[#075E54]/10 flex items-center justify-center text-[#075E54] text-xs font-black flex-shrink-0">{t.avatar}</div>
              <div>
                <p className="text-sm font-bold text-[var(--text)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.role} · {t.company}</p>
                <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{t.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[#25D366] transition-colors"><ChevronLeft className="w-5 h-5 text-[var(--text-muted)]" /></button>
        <div className="flex gap-2">{TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={cn("h-2 rounded-full transition-all duration-300", i === current ? "bg-[#25D366] w-6" : "bg-[var(--border)] w-2")} />)}</div>
        <button onClick={next} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[#25D366] transition-colors"><ChevronRight className="w-5 h-5 text-[var(--text-muted)]" /></button>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function HubPageContent() {
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [theme, setTheme]   = useState<"light" | "dark">("light");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  const stats = [
    { value: "500+",    labelFr: "Entreprises équipées",   labelEn: "Businesses equipped",    icon: Users },
    { value: "98%",     labelFr: "Satisfaction client",    labelEn: "Client satisfaction",    icon: Award },
    { value: "< 5 min", labelFr: "Temps de configuration", labelEn: "Setup time",             icon: Clock },
    { value: "24/7",    labelFr: "Disponibilité garantie", labelEn: "Guaranteed availability",icon: TrendingUp },
  ];

  const features = [
    { icon: MessageSquare, titleFr: "Assistant WhatsApp",     titleEn: "WhatsApp Assistant",    descFr: "Bot WhatsApp intelligent qui répond à vos clients en temps réel, même la nuit.", descEn: "Smart WhatsApp bot that responds to your clients in real time, even at night." },
    { icon: Phone,         titleFr: "Agent Vocal IA",         titleEn: "AI Voice Agent",        descFr: "Un agent vocal IA décroche vos appels entrants et répond comme un humain.", descEn: "An AI voice agent answers your inbound calls and responds like a human." },
    { icon: CalendarDays,  titleFr: "Gestion des RDV",        titleEn: "Appointment Management",descFr: "Prise de rendez-vous automatique 24/7, rappels et confirmations par WhatsApp.", descEn: "Automatic appointment booking 24/7, reminders and confirmations via WhatsApp." },
    { icon: BarChart3,     titleFr: "Analytics en temps réel",titleEn: "Real-time Analytics",   descFr: "Tableau de bord complet avec toutes vos métriques clés en un coup d'œil.", descEn: "Complete dashboard with all your key metrics at a glance." },
    { icon: Smartphone,    titleFr: "Multi-canal",            titleEn: "Multi-channel",         descFr: "WhatsApp, voix, SMS — votre assistant est partout où sont vos clients.", descEn: "WhatsApp, voice, SMS — your assistant is everywhere your clients are." },
    { icon: Globe,         titleFr: "Multilingue",            titleEn: "Multilingual",          descFr: "Français, anglais, langues locales — votre assistant parle la langue de vos clients.", descEn: "French, English, local languages — your assistant speaks your clients' language." },
  ];

  const handlePlayVideo = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-card)]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/logo.png" alt="AGT Platform" className="h-9 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-black text-[var(--text)] text-sm tracking-tight" style={{ fontFamily: "'Syne',system-ui" }}>AGT Platform</span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium hidden sm:block">by AG Technologies</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-muted)]">
            <a href="#features"    className="hover:text-[var(--text)] transition-colors">{locale === "fr" ? "Fonctionnalités" : "Features"}</a>
            <a href="#demo"        className="hover:text-[var(--text)] transition-colors">Demo</a>
            <a href="#testimonials"className="hover:text-[var(--text)] transition-colors">{locale === "fr" ? "Témoignages" : "Testimonials"}</a>
            <a href="#secteurs"    className="hover:text-[#075E54] text-[#075E54] font-semibold transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />{locale === "fr" ? "Nos solutions" : "Our solutions"}
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setLocale(l => l === "fr" ? "en" : "fr")} className="p-2 rounded-xl hover:bg-[var(--bg)] text-[var(--text-muted)] transition-colors text-xs font-bold">{locale === "fr" ? "EN" : "FR"}</button>
            <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-[var(--bg)] text-[var(--text-muted)] transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href={ROUTES.login} className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors">{locale === "fr" ? "Se connecter" : "Log in"}</Link>
            <Link href={ROUTES.onboarding} className="btn-primary text-sm px-3 sm:px-4 whitespace-nowrap">
              <span className="hidden sm:inline">{locale === "fr" ? "Créer mon assistant" : "Create my assistant"}</span>
              <span className="sm:hidden">{locale === "fr" ? "Démarrer" : "Start"}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <HeroCarousel locale={locale} />

      {/* ══ STATS ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="card p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
            {stats.map((stat, i) => { const Icon = stat.icon; return (
              <div key={i} className="flex flex-col items-center justify-center gap-2 py-8 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1" style={{ backgroundColor: "#25D36618" }}>
                  <Icon className="w-6 h-6 text-[#075E54]" />
                </div>
                <p className="text-3xl font-black text-[var(--text)]">{stat.value}</p>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">{locale === "fr" ? stat.labelFr : stat.labelEn}</p>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* ══ SECTEURS ════════════════════════════════════════════════════════ */}
      <section id="secteurs" className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0a3d30 0%, #0f2744 45%, #1e1040 100%)" }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-[-150px] left-[10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.12]" style={{ background: "radial-gradient(circle, #25D366 0%, transparent 65%)" }} />
        <div className="absolute bottom-[-100px] right-[5%] w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.14]" style={{ background: "radial-gradient(circle, #6C3CE1 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
              {locale === "fr" ? "Solutions par secteur" : "Industry solutions"}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)", fontFamily: "'Syne',system-ui" }}>
              {locale === "fr" ? <>Une solution <span className="text-[#25D366]">sur mesure</span><br />pour chaque secteur</> : <>A <span className="text-[#25D366]">tailored solution</span><br />for every industry</>}
            </h2>
            <p className="text-white/75 max-w-2xl mx-auto text-lg leading-relaxed">
              {locale === "fr" ? "AGT Platform s'adapte à votre métier. Choisissez votre secteur pour découvrir une solution conçue spécifiquement pour vos besoins." : "AGT Platform adapts to your business. Choose your industry to discover a solution specifically designed for your needs."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              {[{value:"9",fr:"Secteurs couverts",en:"Industries covered"},{value:"500+",fr:"Clients actifs",en:"Active clients"},{value:"24/7",fr:"Disponibilité",en:"Availability"}].map((s,i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "'Syne',system-ui" }}>{s.value}</p>
                  <p className="text-xs text-white/55 font-semibold uppercase tracking-widest mt-1">{locale === "fr" ? s.fr : s.en}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS.map(sector => <SectorCard key={sector.id} sector={sector} locale={locale} />)}
          </div>
          <div className="text-center mt-16">
            <p className="text-white/50 text-sm mb-6">{locale === "fr" ? "Votre secteur n'est pas listé ? Contactez-nous pour une solution personnalisée." : "Your industry isn't listed? Contact us for a custom solution."}</p>
            <Link href={ROUTES.onboarding} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-black text-base hover:bg-[#128C7E] transition-all hover:scale-105 shadow-lg shadow-[#25D366]/20">
              {locale === "fr" ? "Créer mon assistant maintenant" : "Create my assistant now"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ DÉMO VIDÉO ══════════════════════════════════════════════════════ */}
      <section id="demo" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 text-[#6C3CE1] text-xs font-bold mb-4 uppercase tracking-widest">
            <Play className="w-3 h-3" />{locale === "fr" ? "Démonstration" : "Demo"}
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mb-4" style={{ fontFamily: "'Syne',system-ui" }}>
            {locale === "fr" ? "Voyez AGT Platform en action" : "See AGT Platform in action"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {locale === "fr" ? "En moins de 5 minutes, votre assistant est opérationnel pour répondre à vos clients." : "In less than 5 minutes, your assistant is operational to respond to your clients."}
          </p>
        </div>

        {/* ── Player vidéo stylé ── */}
        <div className="relative rounded-2xl overflow-hidden max-w-3xl mx-auto"
          style={{ background: "#010f0c", boxShadow: "0 40px 100px rgba(7,94,84,0.32), 0 8px 32px rgba(0,0,0,0.28)" }}>

          {/* Barre titre façon macOS */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-xs text-white/35 font-mono">agt-platform.tech — Demo Live</span>
              </div>
            </div>
          </div>

          {/* Zone vidéo */}
          <div className="aspect-video relative bg-[#010f0c]">

            {/* ── Vraie vidéo depuis le serveur AGT ── */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onEnded={() => setVideoPlaying(false)}
              preload="metadata"
              playsInline
            >
              <source src={DEMO_VIDEO_URL} type="video/mp4" />
            </video>

            {/* Overlay play/pause — affiché quand pas en lecture */}
            {!videoPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "rgba(1,15,12,0.65)", backdropFilter: "blur(2px)" }}>

                {/* Mockup chat WhatsApp en fond déco */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none px-12">
                  <div className="w-72 space-y-3">
                    {[
                      { msg: "Bonjour, j'ai besoin d'un RDV médical",      me: false },
                      { msg: "Bien sûr ! Pour quelle spécialité ?",         me: true  },
                      { msg: "Cardiologue, demain matin si possible",        me: false },
                      { msg: "✅ RDV confirmé — Dr. Martin, Mardi 9h30",    me: true  },
                      { msg: "Merci ! Je reçois une confirmation ?",         me: false },
                      { msg: "Oui, envoyée sur WhatsApp 📱",                me: true  },
                    ].map((item, i) => (
                      <div key={i} className={`flex ${item.me ? "justify-end" : "justify-start"}`}>
                        <div className={`px-3 py-2 rounded-2xl text-[11px] text-white max-w-[75%] leading-relaxed ${item.me ? "bg-[#25D366]/60 rounded-br-sm" : "bg-white/15 rounded-bl-sm"}`}>
                          {item.msg}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton play central */}
                <div className="relative flex flex-col items-center z-10">
                  {/* Anneaux animés */}
                  <div className="absolute rounded-full border border-[#25D366]/15 animate-ping"
                    style={{ width: 130, height: 130, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                  <div className="absolute rounded-full border border-[#25D366]/22"
                    style={{ width: 108, height: 108, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                  <button
                    onClick={handlePlayVideo}
                    className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #25D366, #075E54)", boxShadow: "0 0 40px rgba(37,211,102,0.42), 0 8px 24px rgba(0,0,0,0.3)" }}>
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                  <p className="mt-8 text-white/45 text-sm font-medium">
                    {locale === "fr" ? "Regarder la démo" : "Watch the demo"}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {[
                      { e: "🕐", t: "30 sec" },
                      { e: "⚡", t: locale === "fr" ? "Sans code" : "No code" },
                      { e: "📱", t: "WhatsApp" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/45"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {c.e} {c.t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bouton pause (quand vidéo en cours) */}
            {videoPlaying && (
              <button
                onClick={handlePlayVideo}
                className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 opacity-70 hover:opacity-100"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Pause className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Métriques bas */}
          <div className="grid grid-cols-3 divide-x border-t" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
            {[
              { v: "30 sec",  fr: "Durée",           en: "Duration"   },
              { v: "< 5 min", fr: "Mise en service", en: "Setup time" },
              { v: "0 code",  fr: "Requis",          en: "Required"   },
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center py-4 text-center" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <span className="font-black text-[#25D366] text-base">{m.v}</span>
                <span className="text-[10px] text-white/28 uppercase tracking-widest mt-0.5">{locale === "fr" ? m.fr : m.en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#075E54]/10 border border-[#075E54]/20 text-[#075E54] text-xs font-bold mb-4 uppercase tracking-widest">
            <Zap className="w-3 h-3" />{locale === "fr" ? "Fonctionnalités" : "Features"}
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mb-4" style={{ fontFamily: "'Syne',system-ui" }}>
            {locale === "fr" ? "Tout ce dont vous avez besoin" : "Everything you need"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {locale === "fr" ? "AGT Platform regroupe toutes les fonctionnalités essentielles pour automatiser votre service client." : "AGT Platform includes all the essential features to automate your customer service."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => { const Icon = f.icon; return (
            <div key={i} className="card p-6 group hover:border-[#25D366]/30 hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-4 group-hover:bg-[#25D366]/20 group-hover:scale-110 transition-all">
                <Icon className="w-5 h-5 text-[#075E54]" />
              </div>
              <h3 className="font-bold text-[var(--text)] mb-2">{locale === "fr" ? f.titleFr : f.titleEn}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{locale === "fr" ? f.descFr : f.descEn}</p>
            </div>
          ); })}
        </div>
      </section>

      {/* ══ TÉMOIGNAGES ═════════════════════════════════════════════════════ */}
      <section id="testimonials" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold mb-4 uppercase tracking-widest">
            <Star className="w-3 h-3" />{locale === "fr" ? "Témoignages" : "Testimonials"}
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mb-4" style={{ fontFamily: "'Syne',system-ui" }}>
            {locale === "fr" ? "Ils nous font confiance" : "They trust us"}
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">{locale === "fr" ? "Des centaines d'entreprises africaines utilisent déjà AGT Platform." : "Hundreds of African businesses already use AGT Platform."}</p>
        </div>
        <TestimonialsCarousel locale={locale} />
      </section>

      {/* ══ CTA FINAL ═══════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="card p-12 text-center relative overflow-hidden border-0" style={{ background: "linear-gradient(135deg, #022c22 0%, #075E54 60%, #0a3d30 100%)" }}>
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #25D366 0%, transparent 50%), radial-gradient(circle at 80% 50%, #6C3CE1 0%, transparent 50%)" }} />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 flex items-center justify-center mx-auto mb-6 border border-[#25D366]/30"><Bot className="w-8 h-8 text-[#25D366]" /></div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Syne',system-ui" }}>
              {locale === "fr" ? "Prêt à automatiser votre service client ?" : "Ready to automate your customer service?"}
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto">
              {locale === "fr" ? "Rejoignez 500+ entreprises africaines qui font confiance à AGT Platform. Inscription gratuite." : "Join 500+ African businesses that trust AGT Platform. Free registration."}
            </p>
            <Link href={ROUTES.onboarding} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#25D366] text-white font-black text-base hover:bg-[#128C7E] transition-all hover:scale-105 shadow-lg shadow-[#25D366]/30">
              {locale === "fr" ? "Démarrer gratuitement" : "Start for free"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER — VERSION ORIGINALE COMPLÈTE ═════════════════════════════ */}
      <footer className="bg-[#022c22] text-white">
        <div className="h-1 bg-gradient-to-r from-[#25D366] via-[#075E54] to-[#6C3CE1]" />
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="AGT Platform" className="h-10 w-auto object-contain brightness-0 invert" />
                <div className="flex flex-col leading-none">
                  <span className="font-black text-lg text-white tracking-tight" style={{ fontFamily: "'Syne',system-ui" }}>AGT Platform</span>
                  <span className="text-[11px] text-white/50 font-medium">by AG Technologies</span>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                {locale === "fr" ? "La plateforme d'assistants virtuels IA pour les entreprises africaines." : "The AI virtual assistant platform for African businesses."}
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

            {/* Produit */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-5">{locale === "fr" ? "Produit" : "Product"}</p>
              <ul className="space-y-3">
                {[
                  { fr:"Fonctionnalités", en:"Features",  href:"#features" },
                  { fr:"Tarifs",         en:"Pricing",    href:"#plans" },
                  { fr:"Demo",           en:"Demo",       href:"#demo" },
                  { fr:"S'inscrire",     en:"Sign up",    href:ROUTES.onboarding },
                ].map(item => (
                  <li key={item.href}>
                    <a href={item.href} className="text-sm text-white/60 hover:text-[#25D366] transition-colors flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {locale === "fr" ? item.fr : item.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="md:col-span-3 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-5">Solutions</p>
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

            {/* Ressources */}
            <div className="md:col-span-3 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-5">{locale === "fr" ? "Ressources" : "Resources"}</p>
              <ul className="space-y-3">
                {[
                  { fr:"Aide",         en:"Help",       href:ROUTES.help,     Icon:HelpCircle },
                  { fr:"Tutoriels",    en:"Tutorials",  href:ROUTES.tutorial, Icon:BookOpen },
                  { fr:"Se connecter",en:"Log in",      href:ROUTES.login,    Icon:Bot },
                ].map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#25D366] transition-colors group">
                      <item.Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-[#25D366] transition-colors" />
                      {locale === "fr" ? item.fr : item.en}
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