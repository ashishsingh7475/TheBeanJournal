import { createFileRoute, Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import heroImage from "@/assets/order-hero.jpg";

const ORDER_PHONE = "917086248042";

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
] as const;

const MENU_ITEMS = FULL_MENU.flatMap((section) =>
  section.items.map(([name, desc, price]) => ({
    name,
    desc,
    price: Number(String(price).replace(/[^\d]/g, "")) || 0,
    category: section.category,
  })),
);

const NAV = [
  { href: "/#story", label: "Story" },
  { href: "/#menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#visit", label: "Visit" },
];

const STEPS = [
  { key: "table", label: "Table" },
  { key: "menu", label: "Menu" },
  { key: "review", label: "Review" },
  { key: "complete", label: "Complete" },
] as const;

type DetectedBarcode = { rawValue?: string };
type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]>;
};
type BarcodeDetectorConstructor = new (options?: { formats: string[] }) => BarcodeDetectorLike;

const getTableFromPath = (pathname: string) => {
  const match = pathname.match(/^\/order\/([^/]+)\/?$/);
  const table = match?.[1] ? decodeURIComponent(match[1]) : "";
  return /^\d+$/.test(table) ? table : "";
};

const getTableFromQrValue = (value: string) => {
  try {
    const url = new URL(value, window.location.origin);
    return getTableFromPath(url.pathname);
  } catch {
    return getTableFromPath(value);
  }
};

export const Route = createFileRoute("/order")({
  component: OrderPage,
  head: () => ({
    meta: [
      { title: "Order at your table · Bean Journal" },
      {
        name: "description",
        content:
          "Enter your table number, browse the Bean Journal menu and send your order to our team on WhatsApp.",
      },
      { property: "og:title", content: "Order at your table · Bean Journal" },
      {
        property: "og:description",
        content: "Quick table ordering for coffee, breakfast, pizza and desserts at Bean Journal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

export function OrderPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routeTableNumber = getTableFromPath(pathname);
  const [tableNumber, setTableNumber] = useState(routeTableNumber);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeStep, setActiveStep] = useState<"table" | "menu" | "review" | "complete">("table");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const matchingMenuItems = useMemo(() => {
    const query = menuSearch.trim().toLowerCase();

    if (!query) return [] as (readonly [string, string, string])[];

    return FULL_MENU.flatMap((section) =>
      section.items.filter(([name]) => {
        const cleanedName = name.toLowerCase().replace(/^(the|a|an)\s+/i, "").trim();
        return cleanedName.startsWith(query);
      }),
    );
  }, [menuSearch]);

  const visibleSections = useMemo(() => {
    const query = menuSearch.trim();

    if (!query) return FULL_MENU;

    return [{ category: "Matches", items: matchingMenuItems }];
  }, [matchingMenuItems, menuSearch]);

  const orderList = useMemo(
    () => MENU_ITEMS.filter((item) => (selectedItems[item.name] ?? 0) > 0),
    [selectedItems],
  );

  const subtotal = useMemo(
    () => orderList.reduce((total, item) => total + item.price * (selectedItems[item.name] ?? 0), 0),
    [orderList, selectedItems],
  );

  const totalItems = useMemo(
    () => orderList.reduce((sum, item) => sum + (selectedItems[item.name] ?? 0), 0),
    [orderList, selectedItems],
  );

  const currentCategory = visibleSections[activeCategory] ?? visibleSections[0] ?? FULL_MENU[0];

  useEffect(() => {
    if (routeTableNumber && routeTableNumber !== tableNumber) {
      setTableNumber(routeTableNumber);
    }
  }, [routeTableNumber, tableNumber, activeStep]);

  useEffect(() => {
    if (!isScanning) return;

    const Detector = (window as typeof window & { BarcodeDetector?: BarcodeDetectorConstructor })
      .BarcodeDetector;
    if (!Detector) {
      setScanError("QR scanning is not supported in this browser. Please open this page in Chrome or Safari.");
      return;
    }

    let animationFrame = 0;
    let stopped = false;
    const detector = new Detector({ formats: ["qr_code"] });

    const scan = async () => {
      if (stopped || !videoRef.current || videoRef.current.readyState < 2) {
        if (!stopped) animationFrame = requestAnimationFrame(scan);
        return;
      }

      try {
        const [result] = await detector.detect(videoRef.current);
        const scannedTable = result?.rawValue ? getTableFromQrValue(result.rawValue) : "";
        if (scannedTable) {
          setTableNumber(scannedTable);
          setActiveStep("menu");
          setIsScanning(false);
          setScanError("");
          return;
        }
      } catch {
        setScanError("We could not read that QR code. Please try again.");
      }

      if (!stopped) animationFrame = requestAnimationFrame(scan);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } } })
      .then((stream) => {
        if (stopped || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        void videoRef.current.play();
        animationFrame = requestAnimationFrame(scan);
      })
      .catch(() => setScanError("Camera access is needed to scan the table QR code."));

    return () => {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [isScanning]);

  useEffect(() => {
    if (activeCategory >= visibleSections.length) {
      setActiveCategory(0);
    }
  }, [activeCategory, visibleSections.length]);

  const updateItemQty = (name: string, delta: number) => {
    setSelectedItems((prev) => {
      const nextQty = (prev[name] ?? 0) + delta;
      if (nextQty <= 0) {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: nextQty };
    });
  };

  const handleContinueToMenu = () => {
    if (tableNumber.trim()) setActiveStep("menu");
  };

  const handlePlaceOrder = () => {
    if (!tableNumber.trim() || orderList.length === 0) return;

    const lines = orderList.map(
      (item) =>
        `${selectedItems[item.name]}x ${item.name} — ₹${item.price * (selectedItems[item.name] ?? 0)}`,
    );

    const message = [
      "Bean Journal",
      `Table: ${tableNumber.trim()}`,
      "",
      "Order:",
      ...lines,
      "",
      `Total: ₹${subtotal}`,
      "Please prepare this order for my table.",
    ].join("\n");

    setActiveStep("complete");
    window.open(
      `https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const renderProgress = () => {
    const currentIndex = STEPS.findIndex((step) => step.key === activeStep);

    return (
      <div className="border-b border-border px-4 py-6 sm:px-8 sm:py-8">
        <ol className="mx-auto flex w-full max-w-2xl items-start">
          {STEPS.map((step, index) => {
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            const isLast = index === STEPS.length - 1;

            return (
              <li
                key={step.key}
                className={`flex min-w-0 items-start ${isLast ? "shrink-0" : "flex-1"}`}
              >
                <div className="flex w-10 shrink-0 flex-col items-center gap-2 sm:w-14">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-medium tabular-nums transition-all sm:h-8 sm:w-8 sm:text-xs ${
                      isComplete
                        ? "border-espresso bg-espresso text-cream"
                        : isActive
                          ? "border-copper bg-copper text-cream"
                          : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {isComplete ? "✓" : String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[10px] tracking-wide sm:text-xs ${
                      isActive ? "font-semibold text-espresso" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`mt-3.5 h-px min-w-0 flex-1 sm:mt-4 ${
                      isComplete ? "bg-espresso/40" : "bg-border"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  const renderTableStep = () => (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-12">
      <div className="relative overflow-hidden rounded-[1.5rem] lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden"
          style={{ backgroundImage: `url(${heroImage})`, minHeight: "78vh" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/50 to-espresso/85 lg:hidden" />

        <div className="relative z-10 grid min-h-[78vh] items-end gap-6 px-4 pb-8 pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:min-h-0 lg:px-0 lg:pb-0 lg:pt-0">
          <div className="flex flex-col justify-end text-cream lg:justify-center lg:px-0 lg:pb-0 lg:pt-0 lg:text-foreground">
            <p className="eyebrow text-cream/90 lg:text-copper">Quick Order</p>
            <h1 className="mt-5 max-w-md font-display text-[2.4rem] leading-[0.98] text-white sm:text-5xl lg:text-[4.2rem] lg:text-foreground">
              Order <em className="italic text-[#f3c9a7] lg:text-copper">your table</em> favourites.
            </h1>

            <div className="mt-8 max-w-md rounded-[1.5rem] border border-border/80 bg-[oklch(0.99_0.004_80)]/85 p-5 shadow-[0_18px_50px_rgba(41,22,12,0.06)] backdrop-blur-sm sm:mt-10 sm:p-7 lg:bg-[oklch(0.99_0.004_80)] lg:backdrop-blur-none">
              {routeTableNumber ? (
                <>
                  <label
                    htmlFor="table-number"
                    className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                  >
                    Table number
                  </label>
                  <input
                    id="table-number"
                    value={tableNumber}
                    readOnly
                    aria-readonly="true"
                    className="mt-4 w-full rounded-xl border border-border bg-secondary px-4 py-3.5 text-lg text-foreground outline-none"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">Set by this table&apos;s QR code.</p>
                  <button
                    type="button"
                    onClick={handleContinueToMenu}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-espresso px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-copper"
                  >
                    Continue to menu
                    <span aria-hidden="true">→</span>
                  </button>
                </>
              ) : isScanning ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Scan table QR code
                      </div>
                      <p className="mt-2 text-sm text-foreground">Point your camera at the code on your table.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsScanning(false)}
                      className="rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-copper hover:text-copper"
                    >
                      Cancel
                    </button>
                  </div>
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    aria-label="Camera view for scanning the table QR code"
                    className="mt-5 aspect-video w-full rounded-xl bg-espresso object-cover"
                  />
                  {scanError && <p className="mt-3 text-xs text-copper">{scanError}</p>}
                </>
              ) : (
                <>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Table required
                  </div>
                  <p className="mt-3 font-display text-2xl text-foreground">Scan your table QR code</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Scan the code to securely link your order to the right table.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setScanError("");
                      setIsScanning(true);
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-espresso px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-copper"
                  >
                    Scan table QR code
                    <span aria-hidden="true">⌁</span>
                  </button>
                  {scanError && <p className="mt-3 text-xs text-copper">{scanError}</p>}
                </>
              )}

              {tableNumber && !routeTableNumber && !isScanning && (
                <button
                  type="button"
                  onClick={handleContinueToMenu}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-espresso px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-copper"
                >
                  Continue to menu
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:h-full">
            <div className="relative h-[320px] w-full overflow-hidden rounded-b-[2rem] sm:h-[420px] lg:h-full lg:rounded-none">
              <img
                src={heroImage}
                alt="Latte with rosetta art beside a vase of dried flowers on a sunlit café table"
                width={1024}
                height={1280}
                className="torn-edge-top md:torn-edge-left md:object-center absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMenuStep = () => (
    <div className="px-4 pb-8 pt-8 sm:px-8 sm:pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Step 02</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Our <em className="italic text-copper">menu</em>
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Table {tableNumber}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-[oklch(0.99_0.004_80)] p-3.5 shadow-[0_10px_30px_rgba(33,22,13,0.04)] sm:p-4">
        <label htmlFor="menu-search" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Search menu
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-muted-foreground">
            ⌕
          </span>
          <input
            id="menu-search"
            type="search"
            value={menuSearch}
            onChange={(event) => setMenuSearch(event.target.value)}
            placeholder="Search coffee, pizza, desserts..."
            className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/65 focus:border-copper"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleSections.map((section, index) => (
          <button
            key={section.category}
            type="button"
            onClick={() => setActiveCategory(index)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition ${
              index === activeCategory
                ? "border-espresso bg-espresso text-cream"
                : "border-border bg-card text-muted-foreground hover:border-copper hover:text-copper"
            }`}
          >
            {section.category}
          </button>
        ))}
      </div>

      {visibleSections.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-[oklch(0.99_0.004_80)] p-8 text-center">
          <div className="font-display text-2xl">No matches found</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search, like “coffee”, “pizza”, or “breakfast”.
          </p>
          <button
            type="button"
            onClick={() => setMenuSearch("")}
            className="mt-5 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-copper hover:text-copper"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-[oklch(0.99_0.004_80)] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <h3 className="min-w-0 truncate font-display text-2xl sm:text-3xl">
              {currentCategory.category}
            </h3>
            <span className="shrink-0 font-display text-lg text-copper tabular-nums">
              {menuSearch.trim() ? `${currentCategory.items.length} matches` : String(activeCategory + 1).padStart(2, "0")}
            </span>
          </div>

          <ul>
            {currentCategory.items.map(([name, desc, price]) => {
              const quantity = selectedItems[name] ?? 0;

              return (
                <li
                  key={name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 border-b border-border py-4 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="font-display text-lg sm:text-xl">{name}</div>
                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {desc}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium text-copper tabular-nums">{price}</span>
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-background p-1">
                      <button
                        type="button"
                        onClick={() => updateItemQty(name, -1)}
                        aria-label={`Decrease ${name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-espresso transition hover:bg-secondary"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-sm font-medium tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemQty(name, 1)}
                        aria-label={`Increase ${name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-espresso transition hover:bg-secondary"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {visibleSections.map((section, index) => (
          <button
            key={section.category}
            type="button"
            aria-label={`Go to ${section.category}`}
            aria-current={activeCategory === index}
            onClick={() => setActiveCategory(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeCategory === index ? "w-7 bg-copper" : "w-2.5 bg-sand hover:bg-copper/40"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="px-4 pb-10 pt-8 sm:px-8">
      <p className="eyebrow">Step 03</p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl">
        Review <em className="italic text-copper">your</em> order
      </h2>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Table number
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-[oklch(0.99_0.004_80)] px-4 py-3">
            <span className="font-display text-2xl tabular-nums">{tableNumber}</span>
            <button
              type="button"
              onClick={() => {
                if (!routeTableNumber) {
                  setTableNumber("");
                  setScanError("");
                  setActiveStep("table");
                }
              }}
              disabled={!!routeTableNumber}
              className="rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-copper hover:text-copper"
            >
              Edit
            </button>
          </div>

          <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Your order
          </div>
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-[oklch(0.99_0.004_80)]">
            {orderList.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                Your cart is empty. Head back to the menu to add something warm.
              </li>
            )}
            {orderList.map((item) => (
              <li key={item.name} className="flex items-center gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-lg">{item.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                    {selectedItems[item.name]} × ₹{item.price}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-medium tabular-nums">
                  ₹{item.price * (selectedItems[item.name] ?? 0)}
                </div>
                <button
                  type="button"
                  onClick={() => updateItemQty(item.name, -(selectedItems[item.name] ?? 0))}
                  aria-label={`Remove ${item.name}`}
                  className="shrink-0 text-copper/70 transition hover:text-copper"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setActiveStep("menu")}
            className="mt-5 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:border-copper hover:text-copper"
          >
            Back to menu
          </button>
        </div>

        <div className="rounded-2xl bg-espresso p-6 text-cream">
          <div className="font-display text-2xl">Order Summary</div>

          <div className="mt-5 space-y-3 text-sm text-cream/75">
            <div className="flex items-center justify-between">
              <span>Items ({totalItems})</span>
              <span className="tabular-nums">₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxes &amp; Charges</span>
              <span className="tabular-nums">₹0</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-cream/15 pt-5 font-display text-2xl">
            <span>Total</span>
            <span className="tabular-nums">₹{subtotal}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={orderList.length === 0}
            className="mt-6 w-full rounded-lg bg-copper px-5 py-3.5 text-sm font-medium text-cream transition hover:bg-cream hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="px-4 py-14 text-center sm:px-8 sm:py-20">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-espresso text-3xl text-cream">
        ✓
      </div>

      <h2 className="mt-7 font-display text-3xl sm:text-4xl">Order placed!</h2>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        We&apos;ve sent your order to our team. They&apos;ll start preparing it shortly.
      </p>

      <div className="mt-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Table {tableNumber}
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedItems({});
          setTableNumber(routeTableNumber);
          setActiveCategory(0);
          setActiveStep(routeTableNumber ? "menu" : "table");
        }}
        className="mt-8 rounded-lg bg-espresso px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-copper"
      >
        Place another order
      </button>
    </div>
  );

  const showOrderBar = activeStep === "menu" && orderList.length > 0 && !!tableNumber.trim();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 z-50 w-full bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a href="/#top" className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight text-foreground">Bean Journal</span>
            <span className="hidden text-[10px] tracking-[0.25em] uppercase text-copper sm:inline">
              Boutique Café
            </span>
          </a>

          <ul className="hidden gap-7 text-sm lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                {item.href.startsWith("/") ? (
                  <Link to={item.href} className="text-foreground/70 transition hover:text-copper">
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className="text-foreground/70 transition hover:text-copper">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground lg:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-border/80 bg-background/90 backdrop-blur-md sm:hidden">
            <div className="mx-auto grid max-w-7xl gap-1 px-2 py-2 text-center text-[11px] leading-none text-foreground/70">
              {NAV.map((item, index) => (
                <div key={item.href} className="min-w-0">
                  {item.href.startsWith("/") ? (
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-full px-1 py-2 transition ${
                        item.href === "/order" ? "font-semibold text-copper" : "hover:text-copper"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-full px-1 py-2 transition ${
                        index === 2 ? "font-semibold text-copper" : "hover:text-copper"
                      }`}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        {renderProgress()}

        {activeStep === "table" && renderTableStep()}
        {activeStep === "menu" && renderMenuStep()}
        {activeStep === "review" && renderReviewStep()}
        {activeStep === "complete" && renderCompleteStep()}
      </main>

      {showOrderBar && <div className="h-24" aria-hidden="true" />}

      {showOrderBar && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div className="grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-card/95 p-2 pl-5 shadow-[0_18px_50px_oklch(0.245_0.026_45/0.18)] backdrop-blur">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {totalItems} item{totalItems === 1 ? "" : "s"} · Table {tableNumber}
              </div>
              <div className="font-display text-lg tabular-nums">₹{subtotal}</div>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep("review")}
              className="shrink-0 rounded-full bg-espresso px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-copper"
            >
              View summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
