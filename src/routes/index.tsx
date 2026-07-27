import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroCafe from "@/assets/hero-cafe.jpg";
import cafePizza from "@/assets/pizza.jpg";
import cafeInterior from "@/assets/ambience-1.jpg";
import cafeMocha from "@/assets/latte-art.jpg";
import cafeSandwich from "@/assets/pasta.jpg";
import userCoffee from "@/assets/barista.jpg";
import userSalad from "@/assets/dessert.jpg";
import userSizzler from "@/assets/pizza.jpg";
import userCafeVibe from "@/assets/ambience-1.jpg";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Home,
});
const HERO_IMAGES = [
  heroCafe,
  cafeInterior,
  cafeMocha,
  cafePizza,
  cafeSandwich,
];

const NAV = [
  { href: "#story", label: "Story" },
  { href: "#menu", label: "Menu" },
  { href: "#full-menu", label: "Full Menu" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
];

const HIGHLIGHTS = [
  {
    category: "Signature Coffee",
    items: [
      { name: "Single-Origin Pour Over", desc: "Rotating beans, hand-brewed", price: "₹220" },
      { name: "Bean Journal Latte", desc: "House blend, silky microfoam, rosetta art", price: "₹180" },
      { name: "Iced Hazelnut Mocha", desc: "Dark chocolate, hazelnut, cold milk", price: "₹240" },
      { name: "Classic Cappuccino", desc: "Double shot, velvet foam", price: "₹160" },
    ],
  },
  {
    category: "Wood-Fired & Continental",
    items: [
      { name: "Margherita Napoletana", desc: "San Marzano tomato, fior di latte, basil", price: "₹380" },
      { name: "Truffle Mushroom Pizza", desc: "Cremini, truffle oil, mozzarella, rocket", price: "₹520" },
      { name: "Alfredo Fettuccine", desc: "Slow-cooked cream, parmesan, cracked pepper", price: "₹360" },
      { name: "Pesto Penne", desc: "House basil pesto, sundried tomato, pine nuts", price: "₹340" },
    ],
  },
  {
    category: "Sweet Endings",
    items: [
      { name: "Classic Tiramisu", desc: "Espresso-soaked ladyfingers, mascarpone", price: "₹260" },
      { name: "Belgian Chocolate Torte", desc: "70% cocoa, sea salt, gold leaf", price: "₹280" },
      { name: "Cheesecake of the Week", desc: "Ask your server", price: "₹240" },
      { name: "Affogato", desc: "Vanilla gelato drowned in espresso", price: "₹200" },
    ],
  },
];

const FULL_MENU = [
  {
    category: "Espresso Bar",
    items: [
      ["Espresso", "Single or double, house blend", "₹120"],
      ["Americano", "Long black, hot or iced", "₹140"],
      ["Flat White", "Two ristretto shots, silky milk", "₹170"],
      ["Cortado", "Equal parts espresso and steamed milk", "₹160"],
      ["Macchiato", "Espresso marked with foam", "₹150"],
      ["Piccolo Latte", "Ristretto with a dash of milk", "₹160"],
    ],
  },
  {
    category: "Cold Brews & Iced",
    items: [
      ["24-Hour Cold Brew", "Slow-steeped, chocolatey finish", "₹220"],
      ["Iced Vanilla Latte", "Espresso, cold milk, house vanilla", "₹230"],
      ["Iced Caramel Macchiato", "Vanilla, caramel drizzle", "₹250"],
      ["Salted Caramel Frappé", "Blended, whipped cream, sea salt", "₹280"],
      ["Nitro Cold Brew", "Cascading nitrogen pour", "₹280"],
      ["Iced Matcha Latte", "Ceremonial-grade matcha", "₹260"],
    ],
  },
  {
    category: "Teas & Non-Coffee",
    items: [
      ["Assam First Flush", "Local, floral, single estate", "₹150"],
      ["Masala Chai", "Whole spices, farm milk", "₹120"],
      ["Peppermint Green", "Fresh mint, jasmine green", "₹140"],
      ["Belgian Hot Chocolate", "70% dark, thick and rich", "₹220"],
      ["Rose & Cardamom Latte", "Botanical, warming", "₹210"],
      ["Fresh Fruit Cooler", "Watermelon · Lychee · Peach", "₹180"],
    ],
  },
  {
    category: "All-Day Breakfast",
    items: [
      ["The Bean Journal Breakfast", "Eggs, sausage, hash, toast, beans", "₹420"],
      ["Avocado & Poached Eggs", "Sourdough, chili flakes, dukkah", "₹360"],
      ["French Toast Brioche", "Cinnamon custard, maple, berries", "₹320"],
      ["Belgian Waffle Stack", "Vanilla cream, chocolate or fruit", "₹300"],
      ["Shakshuka", "Baked eggs, tomato, feta, pita", "₹340"],
      ["Granola Parfait Bowl", "House granola, yogurt, honey", "₹260"],
    ],
  },
  {
    category: "Sandwiches & Burgers",
    items: [
      ["Club Sandwich", "Triple-decker, fries", "₹340"],
      ["Grilled Chicken Panini", "Pesto, sundried tomato, mozzarella", "₹320"],
      ["Smoky BBQ Chicken Burger", "Slaw, cheddar, brioche bun", "₹380"],
      ["Classic Beef Burger", "Aged cheddar, pickles, house sauce", "₹420"],
      ["Paneer Tikka Wrap", "Mint chutney, onion, roomali", "₹280"],
      ["Veg Mediterranean Ciabatta", "Hummus, olives, roasted peppers", "₹300"],
    ],
  },
  {
    category: "Wood-Fired Pizza",
    items: [
      ["Margherita", "San Marzano, mozzarella, basil", "₹380"],
      ["Pepperoni Classica", "Cured pepperoni, oregano", "₹460"],
      ["BBQ Chicken", "Smoky sauce, onion, coriander", "₹480"],
      ["Truffle Mushroom", "Cremini, truffle oil, rocket", "₹520"],
      ["Quattro Formaggi", "Four cheeses, honey drizzle", "₹520"],
      ["Farmhouse Veg", "Peppers, olives, corn, mushroom", "₹420"],
    ],
  },
  {
    category: "Pasta & Mains",
    items: [
      ["Alfredo Fettuccine", "Cream, parmesan, cracked pepper", "₹360"],
      ["Pesto Penne", "Basil pesto, sundried tomato", "₹340"],
      ["Arrabbiata Spaghetti", "Chili tomato, garlic", "₹320"],
      ["Chicken Lasagna", "Layered béchamel, mozzarella", "₹420"],
      ["Thai Basil Rice Bowl", "Chicken or tofu, jasmine rice", "₹360"],
      ["Grilled Fish of the Day", "Lemon butter, herb potatoes", "₹520"],
    ],
  },
  {
    category: "Small Plates",
    items: [
      ["Truffle Fries", "Parmesan, herbs", "₹240"],
      ["Cheesy Garlic Bread", "House focaccia, mozzarella", "₹220"],
      ["Chicken Wings", "Buffalo · BBQ · Honey chili", "₹320"],
      ["Bruschetta Trio", "Tomato · Mushroom · Pesto", "₹260"],
      ["Nachos Supreme", "Cheese, salsa, jalapeños", "₹280"],
      ["Peri-Peri Paneer", "Skewered, mint yogurt", "₹280"],
    ],
  },
  {
    category: "Desserts",
    items: [
      ["Classic Tiramisu", "Espresso, mascarpone, cocoa", "₹260"],
      ["Belgian Chocolate Torte", "70% cocoa, sea salt", "₹280"],
      ["New York Cheesecake", "Berry compote", "₹260"],
      ["Sticky Toffee Pudding", "Warm caramel, vanilla ice cream", "₹280"],
      ["Affogato", "Vanilla gelato, espresso", "₹200"],
      ["Brownie à la Mode", "Warm brownie, ice cream, fudge", "₹240"],
    ],
  },
];

const REVIEWS = [
  {
    name: "Ananya P.",
    role: "Google Review · ★★★★★",
    body: "Cozy, aesthetic, and the coffee is genuinely one of the best in Guwahati. The truffle pizza is a must-try. Loved every corner of this place.",
  },
  {
    name: "Rohan M.",
    role: "Zomato · ★★★★★",
    body: "Ambience is straight out of a European café. Sat for hours reading with a cold brew — nobody rushed us. The tiramisu is the real deal.",
  },
  {
    name: "Sneha B.",
    role: "TripAdvisor · ★★★★★",
    body: "Hidden gem in Uzan Bazar. Warm lighting, wooden interiors and staff who actually know their coffee. The club sandwich is huge and delicious.",
  },
  {
    name: "Devraj K.",
    role: "Google Review · ★★★★☆",
    body: "Great spot for a weekend brunch or an evening date. The wood-fired pizzas are the highlight. Slight wait on weekends — worth it.",
  },
  {
    name: "Priyanka S.",
    role: "Zomato · ★★★★★",
    body: "The hazelnut mocha is unreal. Beautiful presentation, warm service, and books to browse while you wait. My new favourite café.",
  },
  {
    name: "Arjun D.",
    role: "Google Review · ★★★★★",
    body: "Everything from the interior to the plating feels curated. The pasta is perfectly done and the desserts are next level.",
  },
];

const HOURS = [
  ["Monday – Thursday", "10:30 AM – 10:00 PM"],
  ["Friday – Saturday", "10:30 AM – 11:00 PM"],
  ["Sunday", "11:00 AM – 10:00 PM"],
];

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, body: "" });
  const [submitted, setSubmitted] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [burn, setBurn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {

      setBurn(true);

      setTimeout(() => {
        setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 250);

      setTimeout(() => {
        setBurn(false);
      }, 900);

    }, 6000);

    return () => clearInterval(interval);

  }, []);
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReviewForm({ name: "", rating: 5, body: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header
        className={`fixed top-0 z-50 w-full transition-all ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : ""
          }`}
      >
        <nav className="container-x flex items-center justify-between py-5">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight">Bean Journal</span>
            <span className="hidden text-[10px] tracking-[0.25em] uppercase text-copper sm:inline">
              Boutique Café
            </span>
          </a>
          <ul className="hidden gap-7 text-sm lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-foreground/70 transition hover:text-copper">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="tel:+919706655295"
            className="rounded-full border border-primary bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition hover:bg-copper hover:border-copper"
          >
            Reserve
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-[100svh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
  key={currentHero}
  src={HERO_IMAGES[currentHero]}
  className="absolute inset-0 h-full w-full object-cover"

  initial={{
    opacity: 0,
    scale: 1.15,
  }}

  animate={{
    opacity: 1,
    scale: 1,

    x: burn ? [0, -2, 2, -1, 0] : 0,
    y: burn ? [0, 1, -2, 1, 0] : 0,
    rotate: burn ? [0, -0.2, 0.15, 0] : 0,

    filter: burn
      ? [
          "brightness(1)",
          "brightness(1.9) contrast(1.6) sepia(.4)",
          "brightness(1)"
        ]
      : "brightness(1)",
  }}

  exit={{
    opacity: 0,
    scale: 1.08,
  }}

  transition={{
    duration: 1.2,
    ease: "easeInOut",
  }}
/>
        </AnimatePresence>
        <AnimatePresence>
          {burn && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: [0, .9, .3, 0]
              }}

              exit={{
                opacity: 0
              }}

              transition={{
                duration: .8
              }}

              style={{
                background: `
          radial-gradient(circle at 15% 40%, rgba(255,220,150,.95), transparent 30%),
          radial-gradient(circle at 75% 20%, rgba(255,110,0,.85), transparent 40%),
          radial-gradient(circle at 100% 70%, rgba(255,40,0,.7), transparent 30%)
        `,
                mixBlendMode: "screen",
                filter: "blur(20px)"
              }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/50 to-espresso/85" />
        <div className="relative container-x flex min-h-[100svh] flex-col justify-end pb-20 pt-32 text-cream">
          <p className="eyebrow animate-fade-up text-copper/90">Est. Guwahati · Uzan Bazar</p>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.95] sm:text-7xl md:text-[6rem] animate-fade-up">
            Every cup <span className=" font-light text-copper">tells</span> a story.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg animate-fade-up">
            A boutique café where slow-brewed coffee, wood-fired plates and quiet corners come
            together on Lamb Road. Sit down. Turn a page. Stay a while.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up">
            <a href="#menu" className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-espresso transition hover:bg-copper hover:text-cream">
              Explore the menu
            </a>
            <a href="#visit" className="text-sm text-cream/90 underline underline-offset-8 hover:text-copper">
              Find us →
            </a>
          </div>
          <div className="mt-16 flex items-center gap-8 text-xs uppercase tracking-widest text-cream/60">
            <span>★ 4.3 · 1,865 reviews</span>
            <span className="hidden sm:inline">#5 Cafés in Kamrup Metro</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-cream py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 pr-12 font-display text-3xl italic text-espresso/70 md:text-4xl">
              <span>Slow coffee</span><span className="text-copper">✦</span>
              <span>Wood-fired</span><span className="text-copper">✦</span>
              <span>Handcrafted desserts</span><span className="text-copper">✦</span>
              <span>Since morning</span><span className="text-copper">✦</span>
              <span>Boutique ambience</span><span className="text-copper">✦</span>
              <span>Made in Guwahati</span><span className="text-copper">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* STORY */}
      <section id="story" className="container-x grid gap-16 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-6xl">
            A little café with a <em className="italic text-copper">long</em> memory.
          </h2>
        </div>
        <div className="space-y-6 md:col-span-6 md:col-start-7 md:text-lg">
          <p className="leading-relaxed text-foreground/80">
            Tucked into a quiet corner of Uzan Bazar, The Bean Journal began as a page in
            someone's diary — a place where the smell of freshly ground beans, the soft clink
            of ceramic, and the warmth of shared conversation could all live under one roof.
          </p>
          <p className="leading-relaxed text-foreground/80">
            Today it stands as one of Guwahati's most-loved boutique cafés, pairing
            single-origin coffees with a Continental, Italian and Mediterranean-inspired
            kitchen. Every table has a story. Every visit adds a chapter.
          </p>
          <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              ["9+", "Years brewing"],
              ["4.3★", "Google rating"],
              ["1000+", "Regulars"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-4xl text-copper">{n}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE STRIP — uses real cafe photos */}
      <section className="container-x grid gap-4 pb-28 md:grid-cols-3 md:gap-6">
        {[
          { src: userCoffee, label: "The pour", h: "Craft" },
          { src: userSalad, label: "The plate", h: "Comfort" },
          { src: userSizzler, label: "The sizzle", h: "Character" },
        ].map((f, i) => (
          <figure key={f.label} className="group relative overflow-hidden rounded-md">
            <img src={f.src} alt={f.label} loading="lazy" className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105" />
            <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent p-8 text-cream">
              <div className="eyebrow text-copper/90">0{i + 1} · {f.label}</div>
              <div className="mt-2 font-display text-4xl">{f.h}</div>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* MENU HIGHLIGHTS */}
      <section id="menu" className="bg-espresso py-28 text-cream md:py-40">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-copper">Menu Highlights</p>
              <h2 className="mt-6 text-5xl md:text-7xl">Small plates. <em className="italic text-copper">Big</em> flavors.</h2>
            </div>
            <p className="max-w-sm text-sm text-cream/70">
              A snapshot of what our regulars love. Scroll down for the full menu.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-16">
            {HIGHLIGHTS.map((section, idx) => (
              <div key={section.category} className="border-t border-cream/15 pt-8">
                <div className="mb-8 flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{section.category}</h3>
                  <span className="font-display text-copper">0{idx + 1}</span>
                </div>
                <ul className="space-y-6">
                  {section.items.map((item) => (
                    <li key={item.name} className="group">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="font-display text-lg transition group-hover:text-copper">
                          {item.name}
                        </div>
                        <div className="text-sm text-copper">{item.price}</div>
                      </div>
                      <div className="mt-1 text-sm text-cream/60">{item.desc}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* real cafe photos grid */}
          <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[cafePizza, cafeSandwich, cafeMocha, cafeInterior].map((src, i) => (
              <img key={i} src={src} loading="lazy" alt="" className="aspect-square w-full rounded-md object-cover" />
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="#full-menu" className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-4 text-sm text-cream transition hover:border-copper hover:text-copper">
              See the full menu <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* FULL MENU with tabs */}
      <section id="full-menu" className="container-x py-28 md:py-40">
        <div className="max-w-3xl">
          <p className="eyebrow">The Full Menu</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl">
            Nine chapters, <em className="italic text-copper">endless</em> pairings.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-foreground/70">
            From single-origin espresso to slow-cooked pastas and wood-fired pizzas — everything
            we serve, in one place. Prices in INR, inclusive of taxes.
          </p>
        </div>

        {/* Tab pills */}
        <div className="mt-14 flex flex-wrap gap-2">
          {FULL_MENU.map((s, i) => (
            <button
              key={s.category}
              onClick={() => setActiveCat(i)}
              className={`rounded-full border px-5 py-2.5 text-sm transition ${activeCat === i
                ? "border-espresso bg-espresso text-cream"
                : "border-border bg-transparent text-foreground/70 hover:border-copper hover:text-copper"
                }`}
            >
              {s.category}
            </button>
          ))}
        </div>

        {/* Active category */}
        <div className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {FULL_MENU[activeCat].items.map(([name, desc, price]) => (
            <div key={name} className="group border-b border-border pb-6">
              <div className="flex items-baseline justify-between gap-6">
                <div className="font-display text-xl transition group-hover:text-copper">{name}</div>
                <div className="shrink-0 font-display text-lg text-copper">{price}</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>

        <p className="mt-16 max-w-2xl text-sm text-muted-foreground">
          ✦ Vegetarian, vegan and gluten-free options available across the menu. Please inform
          us of any allergies — our kitchen is happy to adapt.
        </p>
      </section>

      {/* AMBIENCE — real interior photo */}
      <section id="ambience" className="container-x grid gap-12 pb-28 md:grid-cols-2 md:gap-20 md:pb-40">
        <div className="order-2 md:order-1">
          <img src={userCafeVibe} loading="lazy" alt="Warm wooden interior of the café with framed art and Edison bulbs" className="h-[600px] w-full rounded-md object-cover object-center" />
        </div>
        <div className="order-1 flex flex-col justify-center md:order-2">
          <p className="eyebrow">Ambience</p>
          <h2 className="mt-6 text-5xl md:text-6xl">
            Somewhere between a <em className="italic text-copper">library</em> and a living room.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-foreground/80">
            Warm wooden panels. Edison-bulb glow. Framed art on every wall. Our corners were
            built for lingering — bring a friend, a laptop, a novel, or all three.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            {[
              "Free high-speed Wi-Fi",
              "Quiet zones for work & reading",
              "Private nook for small gatherings",
              "Vegetarian, vegan & gluten-free options",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 border-b border-border pb-4">
                <span className="text-copper">✦</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-cream py-28 md:py-40">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow">Guest Book</p>
              <h2 className="mt-6 text-5xl md:text-7xl">
                What our <em className="italic text-copper">regulars</em> say.
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="font-display text-5xl text-copper">4.3<span className="text-2xl text-espresso/60">/5</span></div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">1,865 Google reviews</div>
              </div>
            </div>
          </div>

          {/* Review cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex h-full flex-col justify-between rounded-md border border-border bg-background p-8">
                <div>
                  <div className="text-copper">★★★★★</div>
                  <blockquote className="mt-6 font-display text-xl leading-snug text-foreground">
                    “{r.body}”
                  </blockquote>
                </div>
                <figcaption className="mt-8 border-t border-border pt-5">
                  <div className="font-display text-lg">{r.name}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{r.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Write a review */}
          <div className="mt-20 grid gap-12 rounded-md bg-espresso p-8 text-cream md:grid-cols-5 md:p-16">
            <div className="md:col-span-2">
              <p className="eyebrow text-copper">Leave a Review</p>
              <h3 className="mt-4 font-display text-4xl leading-tight">
                Add your chapter to the guest book.
              </h3>
              <p className="mt-4 text-sm text-cream/70">
                Your words help us keep improving — and help other guests know what to try.
              </p>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-5 md:col-span-3">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-cream/60">Your name</label>
                  <input
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-md border border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-copper focus:outline-none"
                    placeholder="e.g. Meera R."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-cream/60">Rating</label>
                  <div className="flex items-center gap-2 rounded-md border border-cream/20 bg-cream/5 px-4 py-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                        className={`text-2xl transition ${n <= reviewForm.rating ? "text-copper" : "text-cream/25"
                          }`}
                        aria-label={`${n} stars`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-cream/60">Your review</label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                  className="w-full resize-none rounded-md border border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-copper focus:outline-none"
                  placeholder="Tell us about your visit…"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-cream/50">
                  We may feature your review on this page.
                </p>
                <button
                  type="submit"
                  className="rounded-full bg-copper px-7 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-espresso"
                >
                  {submitted ? "Thank you ✓" : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* VISIT / CONTACT */}
      <section id="visit" className="relative overflow-hidden bg-background">
        <div className="container-x grid gap-16 py-28 md:grid-cols-2 md:py-40">
          <div>
            <p className="eyebrow">Visit</p>
            <h2 className="mt-6 text-5xl md:text-7xl leading-[1]">
              Come <em className="italic text-copper">write</em> your chapter.
            </h2>
            <p className="mt-8 max-w-md text-lg text-foreground/70">
              We're on Lamb Road in Uzan Bazar — just around the corner from Ugra Tara Temple.
              Walk in, or ring ahead for weekend evenings.
            </p>

            <div className="mt-12 space-y-8">
              <div>
                <div className="eyebrow">Address</div>
                <p className="mt-2 font-display text-2xl">
                  50, Lamb Road, Latasil,<br /> Uzan Bazar, Guwahati 781001
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="eyebrow">Call</div>
                  <a href="tel:+919706655295" className="mt-2 block font-display text-xl hover:text-copper">
                    +91 97066 55295
                  </a>
                </div>
                <div>
                  <div className="eyebrow">Average for two</div>
                  <p className="mt-2 font-display text-xl">₹1,000</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="https://maps.google.com/?q=The+Bean+Journal+Boutique+Cafe+Guwahati"
                  target="_blank" rel="noreferrer"
                  className="rounded-full bg-espresso px-6 py-3 text-sm text-cream transition hover:bg-copper"
                >Get directions</a>
                <a
                  href="https://www.zomato.com/guwahati/the-bean-journal-2-uzan-bazaar"
                  target="_blank" rel="noreferrer"
                  className="rounded-full border border-espresso px-6 py-3 text-sm text-espresso transition hover:bg-espresso hover:text-cream"
                >Order on Zomato</a>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-md border border-border bg-card p-10">
              <div className="eyebrow">Hours</div>
              <ul className="mt-6 space-y-5">
                {HOURS.map(([day, time]) => (
                  <li key={day} className="flex items-baseline justify-between border-b border-border/60 pb-4 last:border-0">
                    <span className="text-sm text-foreground/70">{day}</span>
                    <span className="font-display text-lg">{time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs text-muted-foreground">
                Last order 30 mins before closing.
              </p>
            </div>

            <blockquote className="mt-8 rounded-md bg-espresso p-10 text-cream">
              <div className="font-display text-3xl leading-tight">
                “The kind of place where an hour turns into three, and you don't notice.”
              </div>
              <div className="mt-6 text-xs uppercase tracking-widest text-copper">— Guwahati Food Guide</div>
            </blockquote>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-espresso py-16 text-cream/70">
        <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="font-display text-3xl text-cream">The Bean Journal</div>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-copper">Boutique Café · Guwahati</p>
          </div>
          <div className="text-xs text-cream/50">
            © {new Date().getFullYear()} The Bean Journal Boutique Café. Brewed with love in Assam.
          </div>
        </div>
      </footer>

    </div>
  );
}
