"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Check, 
  ChevronRight, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Loader2, 
  ThumbsUp, 
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";

// Eligibility criteria data
const ELIGIBILITY_CRITERIA = [
  {
    id: "unemployed",
    title: "Unemployed",
    desc: "Currently contributing a proud 0% to the national GDP.",
    icon: "💤"
  },
  {
    id: "lazy",
    title: "Lazy",
    desc: "Spending a minimum of 12 hours a day in a fully horizontal position.",
    icon: "🛌"
  },
  {
    id: "chronically_online",
    title: "Chronically Online",
    desc: "Engaging in at least 3 pointless arguments on social media per day.",
    icon: "📱"
  },
  {
    id: "sleep_anywhere",
    title: "Can Sleep Anywhere",
    desc: "Capable of falling asleep in any environment (loud, bright, or vertical).",
    icon: "😴"
  }
];

// Manifesto items data
const MANIFESTO_ITEMS = [
  {
    num: "01",
    title: "Universal Basic Naptime",
    desc: "Mandatory 2-hour daily nap window (2:00 PM - 4:00 PM) for all citizens, enforced by soundproof sirens and blackout blinds."
  },
  {
    num: "02",
    title: "Anti-Hustle Tax",
    desc: "Heavy, progressive taxation on anyone caught working more than 4 hours a day. All proceeds directly redistributed to certified non-workers."
  },
  {
    num: "03",
    title: "Horizontal Orientation Rights",
    desc: "Constitutional protection guaranteeing the right to work, study, eat, or socialize in a fully reclined position without societal judgment."
  },
  {
    num: "04",
    title: "Professional Procrastination",
    desc: "Government-funded university courses and workshops specializing in advanced techniques for putting things off until 'tomorrow'."
  },
  {
    num: "05",
    title: "Extreme Comfort Subsidies",
    desc: "Free high-speed internet, premium orthopaedic pillows, and active subscriptions to all streaming services for certified lazy citizens."
  }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeManifesto, setActiveManifesto] = useState<number | null>(null);
  
  // Cockroach crawling state
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;

      // Calculate scroll percentage
      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollableHeight > 0) {
        const pct = currentScrollY / totalScrollableHeight;
        setScrollPercent(pct);
      }

      // Clear previous timeout and set a new one to stop crawling legs
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  
  // Interactive Eligibility Checklist State
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({
    unemployed: false,
    lazy: false,
    chronically_online: false,
    sleep_anywhere: false,
  });

  const eligibilityScore = Object.values(checkedCriteria).filter(Boolean).length;

  const toggleCriteria = (id: string) => {
    setCheckedCriteria(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Live Metric Count Up simulation
  const [membersCount, setMembersCount] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      // Satirically slow CJP member count growth
      setMembersCount(prev => prev + (Math.random() > 0.95 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    tier: "Lazy",
    reason: "",
    sleepTime: "under_5",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.age) {
      setErrorMsg("Please fill out all required fields. Work is hard, but filling this is easy!");
      return;
    }
    
    setErrorMsg("");
    setIsSubmitting(true);

    // Mock network submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 1800);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      age: "",
      tier: "Lazy",
      reason: "",
      sleepTime: "under_5",
    });
    setIsSuccessModalOpen(false);
  };

  const getScoreMessage = () => {
    switch (eligibilityScore) {
      case 0: return { label: "Too Productive!", color: "bg-red-500 text-white", desc: "You are actively contributing to the economy. Highly suspicious. CJP is watching you." };
      case 1: return { label: "Amateur Slacker", color: "bg-yellow-600 text-white", desc: "You have laziness in you, but you are still resisting. Stop working, take a nap!" };
      case 2: return { label: "Potential Recruit", color: "bg-orange-500 text-white", desc: "Solid slacker skills. You understand the beauty of doing nothing." };
      case 3: return { label: "Horizontal Expert", color: "bg-green-700 text-white", desc: "Superb slacker. A horizontal champion. Perfect candidate for our local committees!" };
      case 4: return { label: "Grandmaster of Rest 🛌", color: "bg-brand-saffron text-white", desc: "Absolute legend! You are the human embodiment of a sleeping sloth. Instant horizontal general rank!" };
      default: return { label: "Checking...", color: "bg-gray-400", desc: "" };
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col antialiased selection:bg-brand-saffron selection:text-white">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-brand-cardBorder/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <a href="#home" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 rounded-full border-2 border-brand-saffron flex items-center justify-center bg-brand-creamLight overflow-hidden group-hover:rotate-12 transition-transform duration-300">
              <span className="text-xl">🪳</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg tracking-tight leading-none text-brand-text group-hover:text-brand-saffron transition-colors">COCKROACH</span>
              <span className="font-sans font-extrabold text-[10px] tracking-[0.25em] leading-none text-brand-green">JANTA PARTY</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-semibold text-sm">
            <a href="#home" className="hover:text-brand-saffron transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-saffron hover:after:w-full after:transition-all duration-300">Home</a>
            <a href="#vision" className="hover:text-brand-saffron transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-saffron hover:after:w-full after:transition-all duration-300">Vision</a>
            <a href="#manifesto" className="hover:text-brand-saffron transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-saffron hover:after:w-full after:transition-all duration-300">Manifesto</a>
            <a href="#eligibility" className="hover:text-brand-saffron transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-saffron hover:after:w-full after:transition-all duration-300">Eligibility</a>
            <a href="#contact" className="hover:text-brand-saffron transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-saffron hover:after:w-full after:transition-all duration-300">Contact</a>
          </nav>

          {/* Nav CTA */}
          <div className="hidden md:flex items-center">
            <a 
              href="#join-form" 
              className="bg-brand-text hover:bg-brand-saffron text-brand-bg font-sans font-bold text-xs uppercase tracking-widest px-6 py-3 rounded border border-transparent shadow hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Get Involved
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-brand-text hover:bg-brand-cardBorder/30 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-20 left-0 w-full bg-brand-bg/95 border-b border-brand-cardBorder shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-5">
            <div className="px-4 pt-4 pb-6 space-y-3 font-sans font-bold text-lg flex flex-col">
              <a 
                href="#home" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-brand-cardBorder/30 hover:text-brand-saffron transition-colors"
              >
                Home
              </a>
              <a 
                href="#vision" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-brand-cardBorder/30 hover:text-brand-saffron transition-colors"
              >
                Vision
              </a>
              <a 
                href="#manifesto" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-brand-cardBorder/30 hover:text-brand-saffron transition-colors"
              >
                Manifesto
              </a>
              <a 
                href="#eligibility" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-brand-cardBorder/30 hover:text-brand-saffron transition-colors"
              >
                Eligibility
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-brand-cardBorder/30 hover:text-brand-saffron transition-colors"
              >
                Contact
              </a>
              <div className="pt-4 border-t border-brand-cardBorder/50">
                <a 
                  href="#join-form" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-brand-saffron text-white py-3 rounded-md shadow-md uppercase tracking-wider text-sm hover:bg-brand-saffron/90"
                >
                  Get Involved Now
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section id="home" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Details (Left Column) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              {/* Overline Badge */}
              <div className="inline-flex items-center gap-2 mb-6 text-brand-green font-sans font-black text-xs uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4 text-brand-saffron animate-pulse" />
                <span>A Revolution for the Rest of Us</span>
              </div>
              
              {/* Hero Main Heading */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-extrabold text-brand-text leading-[1.05] tracking-tight mb-6">
                Voice of <br />
                the <span className="font-serif italic font-black text-brand-saffron relative">Lazy</span> &amp; <br />
                <span className="font-serif font-black underline decoration-brand-green decoration-wavy underline-offset-8 text-brand-green">Unemployed.</span>
              </h1>
              
              {/* Hero Subheading Description */}
              <p className="font-sans text-base sm:text-lg text-brand-text/80 leading-relaxed max-w-2xl mb-8 font-medium">
                Fighting for the constitutional rights of the horizontally aligned and the financially inactive. Join the political movement that proudly stands for... well, sitting down.
              </p>
              
              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
                <a 
                  href="#join-form" 
                  className="bg-brand-saffron hover:bg-brand-saffron/90 text-white font-sans font-extrabold text-sm uppercase tracking-widest text-center px-8 py-4 rounded border border-transparent shadow-[0_4px_14px_rgba(217,82,4,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Join CJP Today
                </a>
                <a 
                  href="#manifesto" 
                  className="font-sans font-bold text-sm text-brand-text hover:text-brand-saffron flex items-center justify-center gap-2 border-2 border-brand-text/30 hover:border-brand-saffron px-8 py-4 rounded transition-all duration-200"
                >
                  Read The Manifesto
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Satirical Stats metric row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-brand-cardBorder/80 max-w-3xl">
                <div>
                  <div className="font-serif font-black text-3xl sm:text-4xl text-brand-saffron leading-none mb-1">{membersCount}</div>
                  <div className="font-sans text-xs font-semibold text-brand-text/60 uppercase tracking-wider">Members (Growing)</div>
                </div>
                <div>
                  <div className="font-serif font-black text-3xl sm:text-4xl text-brand-green leading-none mb-1">0</div>
                  <div className="font-sans text-xs font-semibold text-brand-text/60 uppercase tracking-wider">Hours Worked</div>
                </div>
                <div>
                  <div className="font-serif font-black text-3xl sm:text-4xl text-brand-text leading-none mb-1">99%</div>
                  <div className="font-sans text-xs font-semibold text-brand-text/60 uppercase tracking-wider">Success Rate</div>
                </div>
                <div>
                  <div className="font-serif font-black text-3xl sm:text-4xl text-brand-saffron leading-none mb-1">1</div>
                  <div className="font-sans text-xs font-semibold text-brand-text/60 uppercase tracking-wider">Active Leader</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image Poster (Right Column) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(29,17,7,0.18)] border-[6px] border-brand-cardBorder bg-brand-creamLight hover:scale-[1.02] transition-transform duration-500">
                <Image 
                  src="/cjp_hero_poster.png" 
                  alt="Stronger Together CJP Retro Campaign Poster" 
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  priority
                  className="object-cover"
                />
                
                {/* Poster Overlay Banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-brand-bgDark/90 backdrop-blur-sm border border-brand-cardBorder/30 p-3 rounded text-center">
                  <div className="font-serif font-black text-base text-brand-bg uppercase tracking-widest">Stronger Together</div>
                  <div className="font-sans font-bold text-[9px] text-brand-saffron uppercase tracking-widest mt-0.5">Nap More • Live Better</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* INFINITE RUNNING TICKER MARQUEE */}
        <section className="w-full bg-brand-bgDark py-4 border-y-2 border-brand-saffron overflow-hidden flex select-none">
          <div className="flex w-max items-center whitespace-nowrap animate-marquee">
            
            {/* Ticker Set 1 */}
            <div className="flex items-center gap-12 font-serif text-lg font-black text-brand-bg uppercase tracking-widest px-6">
              <span>Together We Survive</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span className="text-brand-saffron">Stronger Together</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Unity</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span className="text-brand-green">Resilience</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Progress</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Work Is Optional</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span className="text-brand-saffron">Horizontal Pride</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Do Nothing Better</span>
              <span className="text-brand-saffron text-xl">•</span>
            </div>

            {/* Ticker Set 2 (Duplicate for seamless loop) */}
            <div className="flex items-center gap-12 font-serif text-lg font-black text-brand-bg uppercase tracking-widest px-6">
              <span>Together We Survive</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span className="text-brand-saffron">Stronger Together</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Unity</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span className="text-brand-green">Resilience</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Progress</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Work Is Optional</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span className="text-brand-saffron">Horizontal Pride</span>
              <span className="text-brand-saffron text-xl">•</span>
              <span>Do Nothing Better</span>
              <span className="text-brand-saffron text-xl">•</span>
            </div>
            
          </div>
        </section>

        {/* VISION SECTION */}
        <section id="vision" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-brand-cardBorder/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Vision Details (Left Column) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="text-brand-saffron font-sans font-black text-xs uppercase tracking-widest mb-3">Our Core Philosophy</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-text leading-tight mb-6">
                Our Movement&apos;s <br />
                <span className="font-serif italic font-black text-brand-saffron">Vision.</span>
              </h2>
              
              <div className="space-y-6 font-sans text-base leading-relaxed text-brand-text/80">
                <p>
                  We believe in a world where productivity is optional, where napping is a constitutional right, and where the endless rush of modern hustle culture is replaced by the serene art of the chill. Our vision is to build a nation that values rest, relaxation, and the simple joy of doing absolutely nothing.
                </p>
                <p>
                  For too long, the lazy and horizontally aligned have been marginalized by alarm clocks and coffee chains. CJP envisions a society that honors sleep cycles, supports vertical-to-horizontal transitions, and gives every individual the freedom to rest without guilt.
                </p>
              </div>

              {/* High-contrast callout box */}
              <div className="mt-8 border-l-4 border-brand-saffron bg-brand-creamLight p-5 rounded-r shadow-sm">
                <div className="flex gap-4">
                  <Info className="w-6 h-6 text-brand-saffron shrink-0 mt-0.5" />
                  <div>
                    <div className="font-sans font-bold text-xs uppercase text-brand-saffron tracking-wider mb-1">Key Pillar Of CJP</div>
                    <p className="font-serif italic font-medium text-brand-text text-base leading-relaxed">
                      &quot;Redefining success not by how much you do, but by how peaceful you remain in the face of societal pressure.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Graphic Card (Right Column) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-lg overflow-hidden border-[6px] border-brand-cardBorder shadow-lg bg-brand-creamLight group hover:scale-[1.01] transition-transform duration-500">
                <Image 
                  src="/cjp_vision_leader.png" 
                  alt="Cockroach Politician Delivering Speech" 
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
                
                {/* Vision Visual Overlay Cap */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bgDark/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-left">
                    <span className="bg-brand-saffron text-white font-sans font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">Our Leader Speaking</span>
                    <h3 className="font-serif font-black text-lg text-brand-bg mt-2 uppercase tracking-wide">Horizontal Leadership</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* MANIFESTO SECTION (DARK BROWN ACCENT) */}
        <section id="manifesto" className="bg-brand-bgDark text-brand-bg py-20 lg:py-28 relative overflow-hidden">
          
          {/* Subtle gold glow lights */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-saffron/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* Manifesto Section Header */}
            <span className="text-brand-saffron font-sans font-black text-xs uppercase tracking-[0.25em] mb-4 block">The Satirical Mandate</span>
            <h2 className="font-serif text-5xl sm:text-6xl font-black text-brand-bg leading-none mb-4">
              The <span className="font-serif italic font-black text-brand-saffron">Manifesto.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-brand-bg/70 max-w-2xl mx-auto mb-16 leading-relaxed">
              Our 5 core demands designed to challenge the relentless hustle and pave the way for a relaxed, horizontal, and truly prosperous tomorrow.
            </p>

            {/* Manifesto Interactive List */}
            <div className="space-y-4 max-w-4xl mx-auto text-left">
              {MANIFESTO_ITEMS.map((item, index) => {
                const isActive = activeManifesto === index;
                return (
                  <div 
                    key={item.num}
                    onMouseEnter={() => setActiveManifesto(index)}
                    onMouseLeave={() => setActiveManifesto(null)}
                    onClick={() => setActiveManifesto(isActive ? null : index)}
                    className={`border border-brand-cardBorder/30 rounded-lg p-6 lg:p-8 cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? "bg-brand-bg/5 border-brand-saffron shadow-[0_10px_25px_rgba(217,82,4,0.15)] translate-x-1" 
                        : "hover:bg-brand-bg/5"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                      {/* Big Saffron Number */}
                      <span className={`font-serif text-3xl lg:text-4xl font-black leading-none ${
                        isActive ? "text-brand-saffron scale-110" : "text-brand-saffron/70"
                      } transition-all`}>
                        {item.num}
                      </span>
                      
                      {/* Manifesto Content */}
                      <div className="space-y-2">
                        <h3 className="font-serif font-black text-xl lg:text-2xl text-brand-bg tracking-wide flex items-center gap-3">
                          {item.title}
                          {isActive && (
                            <span className="inline-block w-2 h-2 rounded-full bg-brand-saffron animate-ping" />
                          )}
                        </h3>
                        <p className="font-sans text-sm leading-relaxed text-brand-bg/75">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* INTERACTIVE ELIGIBILITY CHECKLIST */}
        <section id="eligibility" className="py-20 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-brand-cardBorder/60">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-green font-sans font-black text-xs uppercase tracking-widest mb-3 block">Recruitment Test</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-text leading-tight mb-4">
              Are you eligible <br />
              to <span className="font-serif italic font-black text-brand-saffron">join?</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-brand-text/75 leading-relaxed">
              Toggle our highly rigorous entrance criteria boxes below to calculate your slacker score and verify your compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ELIGIBILITY_CRITERIA.map(criterion => {
              const isChecked = checkedCriteria[criterion.id];
              return (
                <div 
                  key={criterion.id}
                  onClick={() => toggleCriteria(criterion.id)}
                  className={`border-2 rounded-xl p-6 cursor-pointer select-none transition-all duration-300 flex items-start gap-4 ${
                    isChecked 
                      ? "bg-brand-creamLight border-brand-saffron shadow-[0_8px_20px_rgba(217,82,4,0.1)] scale-[1.01]" 
                      : "bg-transparent border-brand-cardBorder/80 hover:border-brand-text/30"
                  }`}
                >
                  {/* Custom Checkbox Emblem */}
                  <div className={`w-8 h-8 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                    isChecked 
                      ? "bg-brand-saffron border-brand-saffron text-white scale-110" 
                      : "border-brand-cardBorder bg-brand-creamLight"
                  }`}>
                    {isChecked ? <Check className="w-5 h-5 stroke-[3]" /> : <span className="text-sm">{criterion.icon}</span>}
                  </div>
                  
                  {/* Checklist text details */}
                  <div className="text-left">
                    <h3 className="font-sans font-extrabold text-base text-brand-text leading-tight mb-1">{criterion.title}</h3>
                    <p className="font-sans text-xs text-brand-text/70 leading-normal">{criterion.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Score Tracker Banner */}
          <div className="max-w-xl mx-auto mt-12 p-6 bg-brand-creamLight border-2 border-brand-cardBorder rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="font-sans font-extrabold text-xs uppercase text-brand-text/50 tracking-wider">Your Slacker Status:</span>
                <p className="font-sans text-sm text-brand-text/80 leading-normal mt-1 max-w-xs">{getScoreMessage().desc}</p>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <span className={`px-4 py-2 rounded-full font-sans font-black text-xs uppercase tracking-widest ${getScoreMessage().color} shadow-sm`}>
                  {getScoreMessage().label}
                </span>
                <span className="font-serif font-black text-2xl text-brand-saffron mt-2">{eligibilityScore} / 4 Met</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a 
              href="#join-form" 
              className="inline-block bg-brand-saffron hover:bg-brand-saffron/90 text-white font-sans font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded border border-transparent shadow hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              Apply to Join Now
            </a>
          </div>
        </section>

        {/* LARGE PARTY Crest BANNER (THEME LOGO) */}
        <section className="w-full bg-brand-bgDark py-16 relative overflow-hidden flex flex-col items-center justify-center border-y-2 border-brand-saffron">
          {/* Subtle tri-color saffron and green flag stripe overlays */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-brand-saffron via-brand-bg/50 to-brand-green" />
          <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-brand-saffron via-brand-bg/50 to-brand-green" />
          
          <div className="max-w-4xl mx-auto px-4 text-center z-10 flex flex-col items-center">
            {/* Circular Seals Emblem */}
            <div className="relative w-44 h-44 rounded-full border-4 border-brand-saffron overflow-hidden bg-brand-creamLight shadow-[0_10px_35px_rgba(217,82,4,0.3)] mb-6 hover:scale-105 transition-transform duration-300">
              <Image 
                src="/cjp_party_seal.png" 
                alt="Cockroach Janta Party Seal Crest" 
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
            
            {/* Bold political title typography */}
            <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-bg uppercase tracking-wider mb-2">
              COCKROACH
            </h2>
            <div className="flex items-center gap-4 justify-center mb-6">
              <div className="w-12 h-1 bg-brand-saffron rounded" />
              <span className="font-sans font-black text-sm uppercase tracking-[0.4em] text-brand-saffron">JANTA PARTY</span>
              <div className="w-12 h-1 bg-brand-green rounded" />
            </div>
            
            {/* Comedy silhouette badge */}
            <div className="font-sans font-bold text-[10px] text-brand-bg/50 uppercase tracking-widest max-w-md mx-auto">
              🪳 Standing Up For Slouching Down Since 2026 🪳
            </div>
          </div>
        </section>

        {/* CONNECT & APPLICATION FORM */}
        <section id="contact" className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Contact Details (Left Column) */}
            <div className="lg:col-span-5 flex flex-col text-left justify-start">
              <span className="text-brand-saffron font-sans font-black text-xs uppercase tracking-widest mb-3">Get In Touch</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-text leading-tight mb-6">
                Connect <br />
                with <span className="font-serif italic font-black text-brand-saffron">us.</span>
              </h2>
              <p className="font-sans text-base leading-relaxed text-brand-text/75 mb-10 font-medium">
                Do you have questions about horizontal living, basic napping hours, or want to host a local CJP slacker chapter in your community? Feel free to reach out to our Horizontal Committee!
              </p>

              {/* Satirical Contact Info Rows */}
              <div className="space-y-6 font-sans">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-brand-creamLight border border-brand-cardBorder flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-saffron" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-brand-text/40 tracking-wider">Phone Hotline</h3>
                    <p className="font-bold text-sm text-brand-text mt-0.5">1-800-NAP-TIME (627-8463)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-brand-creamLight border border-brand-cardBorder flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-brand-text/40 tracking-wider">Email Committee</h3>
                    <p className="font-bold text-sm text-brand-text mt-0.5">relax@cockroachjantaparty.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-brand-creamLight border border-brand-cardBorder flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-saffron" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-brand-text/40 tracking-wider">CJP HQ Address</h3>
                    <p className="font-bold text-sm text-brand-text mt-0.5">101 Sleepy Hollow Lane, Pillowsburg, 400101</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-brand-creamLight border border-brand-cardBorder flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-brand-text/40 tracking-wider">Committee Working Hours</h3>
                    <p className="font-bold text-sm text-brand-text mt-0.5">12:00 PM - 12:15 PM (Tue &amp; Thu, if we wake up)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Interactive Form (Right Column) */}
            <div id="join-form" className="lg:col-span-7">
              <div className="bg-brand-creamLight border-2 border-brand-cardBorder rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md relative">
                
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-brand-text tracking-wide mb-2">
                  Application Form for CJP
                </h3>
                <p className="font-sans text-xs text-brand-text/60 mb-6 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-brand-saffron shrink-0" />
                  <span>WARNING: Form contains multiple questions. Take breaks as needed.</span>
                </p>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-left flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="font-sans text-xs text-red-700 font-bold leading-normal">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-5 text-left font-sans">
                  
                  {/* Name field */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-extrabold text-brand-text uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Johnathan Pillow"
                      className="w-full bg-brand-bg px-4 py-3 rounded border border-brand-cardBorder focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-all font-semibold text-sm"
                    />
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-extrabold text-brand-text uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@slackers.com"
                        className="w-full bg-brand-bg px-4 py-3 rounded border border-brand-cardBorder focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-all font-semibold text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-extrabold text-brand-text uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-brand-bg px-4 py-3 rounded border border-brand-cardBorder focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>

                  {/* Age & Slacker Tier level selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-xs font-extrabold text-brand-text uppercase tracking-wider mb-2">
                        Age *
                      </label>
                      <input 
                        type="number" 
                        id="age"
                        name="age"
                        required
                        min="18"
                        max="150"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="e.g. 25"
                        className="w-full bg-brand-bg px-4 py-3 rounded border border-brand-cardBorder focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-all font-semibold text-sm"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="tier" className="block text-xs font-extrabold text-brand-text uppercase tracking-wider mb-2">
                        Select Your Slacker Tier *
                      </label>
                      <select 
                        id="tier"
                        name="tier"
                        value={formData.tier}
                        onChange={handleInputChange}
                        className="w-full bg-brand-bg px-4 py-3 rounded border border-brand-cardBorder focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-all font-bold text-sm text-brand-text"
                      >
                        <option value="Lazy">Lazy (Just standard relaxing)</option>
                        <option value="Super Lazy">Super Lazy (Refuses tasks daily)</option>
                        <option value="Horizontally Aligned">Horizontally Aligned (General sleep champion)</option>
                        <option value="Unemployed Elite">Unemployed Elite (Instant legend rank)</option>
                      </select>
                    </div>
                  </div>

                  {/* Radios for sleep details */}
                  <div className="space-y-2 pt-2">
                    <span className="block text-xs font-extrabold text-brand-text uppercase tracking-wider">
                      Can you fall asleep in under 5 minutes?
                    </span>
                    <div className="flex gap-6 items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                        <input 
                          type="radio" 
                          name="sleepTime" 
                          value="under_5"
                          checked={formData.sleepTime === "under_5"}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-brand-saffron"
                        />
                        Yes, instantly.
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                        <input 
                          type="radio" 
                          name="sleepTime" 
                          value="over_5"
                          checked={formData.sleepTime === "over_5"}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-brand-saffron"
                        />
                        Sometimes.
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                        <input 
                          type="radio" 
                          name="sleepTime" 
                          value="never"
                          checked={formData.sleepTime === "never"}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-brand-saffron"
                        />
                        No (highly alert).
                      </label>
                    </div>
                  </div>

                  {/* Reason for joining textarea */}
                  <div>
                    <label htmlFor="reason" className="block text-xs font-extrabold text-brand-text uppercase tracking-wider mb-2">
                      Why do you want to join CJP?
                    </label>
                    <textarea 
                      id="reason"
                      name="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="e.g. I want to escape meetings and sleep horizontially."
                      className="w-full bg-brand-bg px-4 py-3 rounded border border-brand-cardBorder focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron transition-all font-semibold text-sm resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-saffron hover:bg-brand-saffron/90 text-white font-sans font-black text-xs uppercase tracking-widest py-4 rounded border border-transparent shadow-md flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Processing Application...
                      </>
                    ) : (
                      "Submit CJP Application"
                    )}
                  </button>

                </form>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-brand-bgDark text-brand-bg py-16 border-t border-brand-cardBorder/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
            
            {/* CJP Footer description */}
            <div className="md:col-span-2 flex flex-col space-y-4">
              <a href="#home" className="flex items-center gap-3 group focus:outline-none">
                <div className="relative w-9 h-9 rounded-full border border-brand-saffron flex items-center justify-center bg-brand-creamLight overflow-hidden">
                  <span className="text-lg">🪳</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black text-base tracking-tight leading-none text-brand-bg">COCKROACH</span>
                  <span className="font-sans font-extrabold text-[9px] tracking-[0.25em] leading-none text-brand-saffron">JANTA PARTY</span>
                </div>
              </a>
              <p className="font-sans text-xs text-brand-bg/60 max-w-sm leading-relaxed">
                The ultimate political satire organization supporting relaxation, deep naps, horizontal rights, and the fight against toxic productivity culture. Join the rest of us.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-black text-sm uppercase text-brand-saffron tracking-wider mb-4">Quick Navigation</h4>
              <ul className="space-y-2.5 font-sans font-semibold text-xs text-brand-bg/75">
                <li><a href="#home" className="hover:text-brand-saffron transition-colors">Home</a></li>
                <li><a href="#vision" className="hover:text-brand-saffron transition-colors">Vision</a></li>
                <li><a href="#manifesto" className="hover:text-brand-saffron transition-colors">Manifesto</a></li>
                <li><a href="#eligibility" className="hover:text-brand-saffron transition-colors">Eligibility</a></li>
                <li><a href="#contact" className="hover:text-brand-saffron transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-serif font-black text-sm uppercase text-brand-saffron tracking-wider mb-4">Join Our Community</h4>
              <ul className="space-y-2.5 font-sans font-semibold text-xs text-brand-bg/75">
                <li><a href="#" className="hover:text-brand-saffron transition-colors">📱 Slackers Discord</a></li>
                <li><a href="#" className="hover:text-brand-saffron transition-colors">🐦 Twitter (Nap updates)</a></li>
                <li><a href="#" className="hover:text-brand-saffron transition-colors">🎥 YouTube (Relaxing Lofi)</a></li>
                <li><a href="#" className="hover:text-brand-saffron transition-colors">📸 Instagram (Napping Memes)</a></li>
              </ul>
            </div>

          </div>

          {/* Divider and Disclaimer */}
          <div className="pt-8 border-t border-brand-cardBorder/10 text-center flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans text-[10px] text-brand-bg/40 font-semibold uppercase tracking-wider">
              &copy; {new Date().getFullYear()} Cockroach Janta Party. All Rights Reserved.
            </p>
            <p className="font-serif italic text-[10px] text-brand-saffron max-w-md">
              Disclaimer: CJP is a satirical comedy project. We fully support hard working professionals. No cockroaches were harmed or registered to vote.
            </p>
          </div>
        </div>
      </footer>

      {/* REACT SUCCESS DIALOG / MODAL POPUP */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bgDark/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-brand-bg border-4 border-brand-saffron rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative animate-in zoom-in-95 duration-300"
            role="dialog"
            aria-modal="true"
          >
            {/* Party badge icon */}
            <div className="w-16 h-16 rounded-full bg-brand-creamLight border-4 border-brand-saffron flex items-center justify-center mx-auto mb-6 scale-110 shadow">
              <span className="text-3xl">🛌</span>
            </div>
            
            {/* Title */}
            <h3 className="font-serif font-black text-2xl sm:text-3xl text-brand-text tracking-wide mb-3">
              Welcome to the Horizontal Army!
            </h3>
            
            {/* Satirical Success Text */}
            <div className="font-sans text-sm text-brand-text/80 leading-relaxed mb-6 space-y-3">
              <p className="font-bold">
                Congratulations, <span className="text-brand-saffron">{formData.fullName}</span>!
              </p>
              <p>
                Your application to join the <span className="font-bold">Cockroach Janta Party</span> has been received. Our Horizontal Committee will review it... right after their 4-hour nap.
              </p>
              <div className="p-3 bg-brand-creamLight rounded-lg border border-brand-cardBorder text-xs text-brand-green font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <ThumbsUp className="w-4 h-4 shrink-0" />
                <span>Assigned Rank: General Slacker</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={resetForm}
              className="w-full bg-brand-text hover:bg-brand-saffron text-brand-bg font-sans font-extrabold text-xs uppercase tracking-widest py-3.5 rounded border border-transparent shadow hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Great, let me sleep now.
            </button>
            
            {/* Subtle close cross */}
            <button 
              onClick={resetForm}
              className="absolute top-4 right-4 p-1 rounded-full text-brand-text/50 hover:bg-brand-cardBorder/30 hover:text-brand-text"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PERSISTENT FLOATING CRAWLING COCKROACH */}
      <div 
        className={`fixed right-4 md:right-8 z-[90] pointer-events-none transition-all duration-300 ease-out flex flex-col items-center ${
          isScrolling ? "scurrying" : ""
        }`}
        style={{
          top: `${15 + scrollPercent * 70}vh`,
          transform: `rotate(${scrollDirection === "down" ? 180 : 0}deg)`,
        }}
      >
        {/* Satirical Speech Bubble */}
        {isScrolling && (
          <div 
            className="absolute bottom-[115%] px-2.5 py-1.5 bg-brand-bgDark text-brand-bg font-sans font-bold text-[9px] rounded-lg shadow-md border border-brand-saffron/30 whitespace-nowrap animate-bounce"
            style={{
              transform: `rotate(${scrollDirection === "down" ? -180 : 0}deg)`,
            }}
          >
            🏃‍♂️ Huff, puff... busy scurrying!
          </div>
        )}
        
        {/* Cockroach SVG */}
        <svg 
          width="54" 
          height="54" 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_8px_rgba(29,17,7,0.35)]"
        >
          {/* Left Legs */}
          <g className="left-legs-group">
            <path d="M 15 14 C 10 12, 8 10, 4 9" stroke="#4E270C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 14 20 C 8 20, 6 20, 2 21" stroke="#4E270C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 15 26 C 9 27, 7 29, 3 32" stroke="#4E270C" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          
          {/* Right Legs */}
          <g className="right-legs-group">
            <path d="M 25 14 C 30 12, 32 10, 36 9" stroke="#4E270C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 26 20 C 32 20, 34 20, 38 21" stroke="#4E270C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 25 26 C 31 27, 33 29, 37 32" stroke="#4E270C" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Left Antenna */}
          <path 
            className="antenna-left"
            d="M 18 6 C 15 -1, 10 -4, 5 -6" 
            stroke="#4E270C" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            fill="none" 
          />
          
          {/* Right Antenna */}
          <path 
            className="antenna-right"
            d="M 22 6 C 25 -1, 30 -4, 35 -6" 
            stroke="#4E270C" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Body and head group */}
          <g className="cockroach-body-group">
            {/* Outer shell (body back) */}
            <ellipse cx="20" cy="20" rx="8" ry="12" fill="#4E270C" stroke="#221105" strokeWidth="1.5" />
            {/* Wings line divider */}
            <path d="M 20 8 L 20 31" stroke="#221105" strokeWidth="1.5" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx="20" cy="7" rx="4.5" ry="3.5" fill="#6E3D1C" stroke="#221105" strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="18" cy="6.5" r="0.8" fill="#F4EFE6" />
            <circle cx="22" cy="6.5" r="0.8" fill="#F4EFE6" />
          </g>
        </svg>
      </div>

    </div>
  );
}
