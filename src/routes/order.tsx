import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

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

export const Route = createFileRoute("/order")({
  component: OrderPage,
});

function OrderPage() {
  const [tableDraft, setTableDraft] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [activeSlide, setActiveSlide] = useState(0);
  const menuScrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = menuScrollerRef.current;
    if (!scroller) return;

    const updateActiveSlide = () => {
      const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-slide-card]"));
      if (!cards.length) return;

      const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveSlide(closestIndex);
    };

    updateActiveSlide();
    scroller.addEventListener("scroll", updateActiveSlide, { passive: true });

    return () => scroller.removeEventListener("scroll", updateActiveSlide);
  }, [tableNumber]);

  const scrollToSlide = (index: number) => {
    const scroller = menuScrollerRef.current;
    const cards = scroller ? Array.from(scroller.querySelectorAll<HTMLElement>("[data-slide-card]")) : [];
    const target = cards[index];

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setActiveSlide(index);
    }
  };

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

  const handlePlaceOrder = () => {
    if (!tableNumber.trim() || orderList.length === 0) return;

    const lines = orderList.map(
      (item) => `${selectedItems[item.name]}x ${item.name} - ₹${item.price * (selectedItems[item.name] ?? 0)}`,
    );

    const message = [
      "Hello Bean Journal!",
      `Table: ${tableNumber.trim()}`,
      "",
      "Order:",
      ...lines,
      "",
      `Total: ₹${subtotal}`,
      "Please prepare this for my table.",
    ].join("\n");

    window.open(`https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container-x flex items-center justify-between py-4">
          <Link to="/" className="font-display text-2xl text-espresso">
            Bean Journal
          </Link>
          <div className="rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            WhatsApp desk · +91 70862 48042
          </div>
        </div>
      </header>

      <main className="container-x py-8 md:py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Quick Order</p>
            <h1 className="mt-6 text-4xl md:text-6xl">
              Order <em className="italic text-copper">your table</em> favourites.
            </h1>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Table number</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={tableDraft}
              onChange={(event) => setTableDraft(event.target.value)}
              className="w-full max-w-md rounded-xl border border-border bg-background px-4 py-3 text-lg outline-none transition focus:border-copper"
              placeholder="e.g. T12"
            />
            <button
              type="button"
              onClick={() => {
                const cleanValue = tableDraft.trim();
                if (cleanValue) {
                  setTableNumber(cleanValue);
                }
              }}
              disabled={!tableDraft.trim()}
              className="rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-copper disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to menu
            </button>
          </div>
        </div>

        {tableNumber.trim() ? (
          <div className="grid gap-8 pb-28 lg:grid-cols-[1.7fr_0.85fr]">
            <div className="space-y-8">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Serving table</div>
                    <div className="mt-2 font-display text-3xl text-espresso">{tableNumber}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTableNumber("");
                      setTableDraft("");
                    }}
                    className="rounded-full border border-border px-4 py-2 text-sm transition hover:border-copper hover:text-copper"
                  >
                    Change table
                  </button>
                </div>
              </div>

<div className="overflow-x-hidden overflow-y-auto">                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="font-display text-3xl text-espresso">Menu</h2>
                  <div className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Swipe sideways
                  </div>
                </div>

                <div
                  ref={menuScrollerRef}
                  className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {FULL_MENU.map((section, index) => (
                    <div
                      key={section.category}
                      data-slide-card
                      className="min-w-[88vw] snap-center rounded-[28px] border border-[#3b2a22] bg-[#2f1d16] p-4 text-[#f5efe8] shadow-[0_18px_56px_rgba(15,8,7,0.25)] sm:min-w-[76vw] lg:min-w-[60vw] xl:min-w-[52vw]"
                    >
                      <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#6a4d3e] pb-4">
                        <h3 className="font-display text-2xl leading-none tracking-tight text-[#f5efe8] sm:text-3xl">
                          {section.category}
                        </h3>
                        <span className="font-display text-xl text-[#d58a59]">{String(index + 1).padStart(2, "0")}</span>
                      </div>

                      <div className="space-y-4">
                        {section.items.map(([name, desc, price]) => {
                          const quantity = selectedItems[name] ?? 0;
                          return (
                            <div key={name} className="border-b border-[#5a3e32] pb-4 last:border-b-0 last:pb-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="font-display text-[1.4rem] leading-tight text-[#f5efe8] sm:text-[1.6rem]">
                                    {name}
                                  </div>
                                  <div className="mt-2 text-sm leading-relaxed text-[#d9cec5]">{desc}</div>
                                </div>
                                <div className="shrink-0 text-base font-medium text-[#d58a59] sm:text-lg">{price}</div>
                              </div>

                              <div className="mt-4 flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateItemQty(name, -1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#6a4d3e] bg-transparent text-xl text-[#f5efe8] transition hover:border-[#d58a59] hover:text-[#d58a59]"
                                  aria-label={`Decrease ${name}`}
                                >
                                  −
                                </button>
                                <span className="min-w-8 text-center text-sm font-medium text-[#f5efe8]">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateItemQty(name, 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#6a4d3e] bg-transparent text-xl text-[#f5efe8] transition hover:border-[#d58a59] hover:text-[#d58a59]"
                                  aria-label={`Increase ${name}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {FULL_MENU.map((section, index) => (
                    <button
                      key={section.category}
                      type="button"
                      aria-label={`Go to ${section.category}`}
                      onClick={() => scrollToSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        activeSlide === index
                          ? "w-8 bg-[#d58a59]"
                          : "w-2.5 bg-[#d9cec5]/45 hover:bg-[#d9cec5]/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-espresso p-6 text-cream shadow-lg">
                <div className="text-xs uppercase tracking-[0.2em] text-copper">Your order</div>
                <div className="mt-5 space-y-4">
                  {orderList.length === 0 ? (
                    <p className="text-sm text-cream/70">Pick a few favourites to build your order.</p>
                  ) : (
                    orderList.map((item) => (
                      <div key={item.name} className="flex items-center justify-between gap-4 border-b border-cream/10 pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="font-display text-lg">{item.name}</div>
                          <div className="text-xs uppercase tracking-[0.18em] text-cream/60">
                            {selectedItems[item.name]} x ₹{item.price}
                          </div>
                        </div>
                        <div className="text-sm text-copper">₹{item.price * (selectedItems[item.name] ?? 0)}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 border-t border-cream/10 pt-4">
                  <div className="flex items-center justify-between text-sm text-cream/70">
                    <span>Items</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-lg font-medium text-cream">
                    <span>Total</span>
                    <span>₹{subtotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={orderList.length === 0}
                  onClick={handlePlaceOrder}
                  className="mt-8 w-full rounded-full bg-copper px-6 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Place order on WhatsApp
                </button>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mb-24 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">Enter your table number to start ordering.</p>
          </div>
        )}
      </main>

      {orderList.length > 0 && tableNumber.trim() && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-espresso/10 bg-white/90 p-2 shadow-[0_20px_50px_rgba(34,26,17,0.18)] backdrop-blur-md">
            <div className="px-3 text-left">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Table {tableNumber}</div>
              <div className="font-display text-lg text-espresso">₹{subtotal}</div>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="rounded-full bg-espresso px-5 py-3 text-sm font-medium text-cream transition hover:bg-copper"
            >
              Place order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
