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
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeStep, setActiveStep] = useState<"table" | "menu" | "review" | "complete">("table");

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

  const currentCategory = FULL_MENU[activeCategory] ?? FULL_MENU[0];

  useEffect(() => {
    if (tableNumber.trim() && activeStep === "table") {
      setActiveStep("menu");
    }
  }, [tableNumber, activeStep]);

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
    const cleanValue = tableDraft.trim();
    if (!cleanValue) return;

    setTableNumber(cleanValue);
    setActiveStep("menu");
  };

  const handlePlaceOrder = () => {
    if (!tableNumber.trim() || orderList.length === 0) return;

    const lines = orderList.map(
      (item) => `${selectedItems[item.name]}x ${item.name} — ₹${item.price * (selectedItems[item.name] ?? 0)}`,
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
    window.open(`https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const renderProgress = () => {
    const steps = [
      { key: "table", label: "Table" },
      { key: "menu", label: "Menu" },
      { key: "review", label: "Review" },
      { key: "complete", label: "Complete" },
    ] as const;

    return (
      <div className="mx-auto mb-8 max-w-2xl overflow-hidden px-1 sm:mb-10">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {steps.map((step, index) => {
            const isActive = activeStep === step.key;
            const isComplete = ["table", "menu", "review", "complete"].indexOf(activeStep) > index;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.key} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium transition-all ${
                      isComplete
                        ? "border-espresso bg-espresso text-cream"
                        : isActive
                          ? "border-copper bg-copper text-cream shadow-[0_0_0_4px_rgba(197,120,68,0.12)]"
                          : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {isComplete ? "✓" : index + 1}
                  </div>

                  <div className="hidden min-w-0 flex-1 text-left sm:block">
                    <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {step.label}
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div
                    className={`h-px flex-1 rounded-full ${
                      isComplete ? "bg-espresso" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTableStep = () => (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-left">
        <p className="eyebrow">Quick Order</p>
        <h1 className="mt-5 max-w-xl text-4xl leading-[0.96] md:text-6xl">
          Order <em className="italic text-copper">your table</em> favourites.
        </h1>
      </div>

      <div className="mx-auto max-w-xl rounded-[28px] border border-border bg-card p-5 shadow-[0_18px_60px_rgba(41,22,12,0.08)] sm:p-7">
        <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Table number</div>

        <label className="sr-only" htmlFor="table-number">Table number</label>
        <input
          id="table-number"
          value={tableDraft}
          onChange={(event) => setTableDraft(event.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-lg text-foreground outline-none transition focus:border-copper"
          placeholder="e.g. 34"
        />

        <button
          type="button"
          onClick={handleContinueToMenu}
          disabled={!tableDraft.trim()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-copper disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to menu
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );

  const renderMenuStep = () => (
    <div className="mx-auto max-w-6xl pb-28">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Menu</div>
          <h2 className="mt-2 font-display text-4xl text-espresso">Our Menu</h2>
        </div>

        <div className="rounded-full border border-border bg-card px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Table {tableNumber}
        </div>
      </div>

      <div className="rounded-[30px] border border-border bg-card p-3 shadow-[0_22px_60px_rgba(41,22,12,0.08)] sm:p-5">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FULL_MENU.map((section, index) => (
            <button
              key={section.category}
              type="button"
              onClick={() => setActiveCategory(index)}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition sm:px-4 ${
                index === activeCategory
                  ? "border-copper bg-copper/10 text-copper"
                  : "border-border bg-background text-muted-foreground hover:border-copper hover:text-copper"
              }`}
            >
              {section.category}
            </button>
          ))}
        </div>

        <div className="rounded-[24px] border border-border bg-[#f5efe7] p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
            <h3 className="font-display text-2xl text-espresso sm:text-3xl">{currentCategory.category}</h3>
            <span className="font-display text-lg text-copper">{String(activeCategory + 1).padStart(2, "0")}</span>
          </div>

          <div className="space-y-0">
            {currentCategory.items.map(([name, desc, price]) => {
              const quantity = selectedItems[name] ?? 0;

              return (
                <div key={name} className="border-b border-border py-4 last:border-b-0 last:pb-0 first:pt-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-xl text-espresso sm:text-2xl">{name}</div>
                      <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</div>
                    </div>
                    <div className="shrink-0 text-sm font-medium text-copper sm:text-base">{price}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => updateItemQty(name, -1)}
                      aria-label={`Decrease ${name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-xl text-espresso transition hover:border-copper hover:text-copper"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium text-espresso">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItemQty(name, 1)}
                      aria-label={`Increase ${name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-xl text-espresso transition hover:border-copper hover:text-copper"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {FULL_MENU.map((section, index) => (
            <button
              key={section.category}
              type="button"
              aria-label={`Go to ${section.category}`}
              onClick={() => setActiveCategory(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeCategory === index ? "w-8 bg-copper" : "w-2.5 bg-[#d5cabd] hover:bg-[#c9b5a2]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="mx-auto max-w-5xl pb-28">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Review</p>
          <h2 className="mt-3 font-display text-4xl text-espresso">Review your order</h2>
        </div>
        <button
          type="button"
          onClick={() => setActiveStep("menu")}
          className="rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:border-copper hover:text-copper"
        >
          Edit
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] border border-border bg-card p-5 shadow-[0_18px_60px_rgba(41,22,12,0.08)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Table number</div>
              <div className="mt-2 font-display text-3xl text-espresso">{tableNumber}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveStep("table");
                setTableDraft(tableNumber);
              }}
              className="text-xs uppercase tracking-[0.18em] text-copper transition hover:text-espresso"
            >
              Edit
            </button>
          </div>

          <div className="space-y-0">
            {orderList.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xl text-espresso">{item.name}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {selectedItems[item.name]} × ₹{item.price}
                  </div>
                </div>
                <div className="text-sm font-medium text-copper">₹{item.price * (selectedItems[item.name] ?? 0)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-espresso bg-espresso p-5 text-cream shadow-[0_18px_60px_rgba(41,22,12,0.18)] sm:p-6">
          <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-copper">Order summary</div>
          <div className="space-y-3 text-sm text-cream/80">
            {orderList.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <span>{item.name}</span>
                <span>₹{item.price * (selectedItems[item.name] ?? 0)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-cream/10 pt-4">
            <div className="flex items-center justify-between text-sm text-cream/70">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="mt-3 flex items-center justify-between font-display text-2xl text-cream">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={orderList.length === 0}
            className="mt-6 w-full rounded-full bg-copper px-6 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="mx-auto max-w-xl pb-24 pt-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-espresso text-4xl text-cream shadow-[0_14px_30px_rgba(41,22,12,0.18)]">
        ✓
      </div>

      <h2 className="font-display text-4xl text-espresso sm:text-5xl">Order placed!</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        We&apos;ve sent your order to our team. They&apos;ll start preparing it shortly.
      </p>

      <div className="mt-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">Table {tableNumber}</div>

      <button
        type="button"
        onClick={() => {
          setSelectedItems({});
          setTableDraft("");
          setTableNumber("");
          setActiveCategory(0);
          setActiveStep("table");
        }}
        className="mt-8 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-copper"
      >
        Place another order
      </button>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container-x flex items-center justify-between py-4">
          <Link to="/" className="font-display text-2xl text-espresso">
            Bean Journal
          </Link>
          <div className="rounded-full border border-border bg-card px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            WhatsApp desk · +91 70862 48042
          </div>
        </div>
      </header>

      <main className="container-x py-8 md:py-12">
        {activeStep !== "complete" && renderProgress()}

        {activeStep === "table" && renderTableStep()}
        {activeStep === "menu" && renderMenuStep()}
        {activeStep === "review" && renderReviewStep()}
        {activeStep === "complete" && renderCompleteStep()}
      </main>

      {activeStep !== "complete" && orderList.length > 0 && tableNumber.trim() && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-espresso/10 bg-white/90 p-2 shadow-[0_20px_50px_rgba(34,26,17,0.18)] backdrop-blur-md">
            <div className="px-3 text-left">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Table {tableNumber}</div>
              <div className="font-display text-lg text-espresso">₹{subtotal}</div>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep(activeStep === "review" ? "review" : "review")}
              className="rounded-full bg-espresso px-5 py-3 text-sm font-medium text-cream transition hover:bg-copper"
            >
              View order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
