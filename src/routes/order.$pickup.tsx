import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { loadOrder, type StoredOrder } from "@/lib/orderStorage";
import { streamImage } from "@/lib/streamImage";
import { findItem, money, TOPPINGS } from "@/lib/menu";
import { CONTRACT_ADDRESS } from "@/lib/site";

function MeatGrinderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* hopper */}
      <path d="M4 3h8l-1.5 5h-5L4 3Z" />
      {/* body */}
      <rect x="4.5" y="8" width="7" height="7" rx="1" />
      {/* crank */}
      <path d="M11.5 10h3v-2.5" />
      <circle cx="15.5" cy="6.5" r="1.2" />
      {/* grinder head */}
      <rect x="15" y="9.5" width="4.5" height="4" rx="0.8" />
      <path d="M17.2 10.7v1.6M19.3 10.7v1.6" />
      {/* base */}
      <path d="M4.5 15l1.5 5h2l1-5" />
      {/* falling grind */}
      <circle cx="17" cy="16.5" r="0.4" fill="currentColor" />
      <circle cx="18.5" cy="18.5" r="0.4" fill="currentColor" />
      <circle cx="16.5" cy="20" r="0.4" fill="currentColor" />
    </svg>
  );
}

export const Route = createFileRoute("/order/$pickup")({
  head: () => ({
    meta: [
      { title: "Your Purrito Order — Catpotle Mexican Grill" },
      {
        name: "description",
        content:
          "View the Purrito you built at Catpotle: a freshly imagined picture of your wrap, your total and your pickup number.",
      },
      { property: "og:title", content: "Your Purrito Order — Catpotle Mexican Grill" },
      {
        property: "og:description",
        content: "See your Purrito, your total and your pickup number.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { pickup } = Route.useParams();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [mode, setMode] = useState<"photo" | "splatter">("photo");
  const startedFor = useRef<string | null>(null);

  const [data, setData] = useState<StoredOrder | null | undefined>(undefined);
  useEffect(() => {
    setData(loadOrder(pickup));
  }, [pickup]);
  const isLoading = data === undefined;

  const protein = data?.protein ? findItem(data.protein) : undefined;
  const toppingList = (data?.toppings ?? [])
    .map((id) => findItem(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => TOPPINGS.findIndex((t) => t.id === a.id) - TOPPINGS.findIndex((t) => t.id === b.id));
  const riceList = (data?.rice ?? [])
    .map((id) => findItem(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const sideList = (data?.sides ?? []).map(findItem).filter(Boolean);
  const drinkList = (data?.drinks ?? []).map(findItem).filter(Boolean);

  const buildPrompt = (mode: "photo" | "splatter" = "photo") => {
    const fillings = [...riceList, ...toppingList].map((item) => item.name).join(", ");
    if (mode === "splatter") {
      return [
        "Create a heavily ground-up, mashed burrito food smear — as if the entire wrap, kitten, and fillings have been pushed through a meat grinder and smeared across the canvas like real food.",
        "Use thick, heavy, chunky smears and large drippy blobs of actual burrito ingredients — mashed beans, ground protein, rice, guacamole, salsa, sour cream, cheese — not pastel paints or art supplies.",
        "The texture should look like wet, smeared food on a surface: greasy, grainy, and lumpy, with visible bits of rice, bean skins, corn, lettuce shreds, and sauce streaks.",
        "Colors must come from real food: earthy browns, deep tomato reds, creamy whites, avocado green, corn yellow, rice tan, and foil silver — no soft pastel hues or paint-tube colors.",
        "The kitten and ingredients should be almost unrecognizable: only faint suggestions of fur, paws, tortilla, and food colors remain, blended into the chaotic ground-up mass.",
        "No clothing, collars, bandanas, costumes, accessories, or any human-added adornments appear anywhere in the image.",
        "The bottom third of the composition reads as silver-gray foil smears, merging into the ground-up burrito matter above.",
        fillings
          ? `Pull the color palette from the actual burrito ingredients — ${fillings.toLowerCase()} — and let those food colors streak through the chunky smears, but keep everything abstract and mushed together.`
          : "Pull the color palette from real burrito ingredients for the big chunky food smears, keeping everything abstract and mushed together.",
        protein
          ? `A barely discernible hint of ${protein.name.toLowerCase()} tone may ghost through the grind, but no clear animal shape.`
          : "No clear animal shapes remain.",
        "Centered composition on a clean light background. No text, lettering, logo, or watermark.",
      ]
        .filter(Boolean)
        .join(" ");
    }
    return [
      "Create a polished, photorealistic studio product image of one playful 'Purrito'.",
      "The tortilla must be rolled into a compact, short, wide upright wrap rather than a long horizontal burrito.",
      "Its open top faces the camera, with the front tortilla flap folded across the lower half and lightly toasted brown spots visible.",
      "The bottom third of the wrap is wrapped in crinkled metallic silver foil, with the foil folded neatly up around the tortilla.",
      "A cute, realistic domestic kitten is nestled inside at the very front and center of the tortilla, about 30 percent larger than before.",
      "The kitten must be an ordinary cat with natural fur only — no clothing, collars, bandanas, costumes, accessories, or any human-added adornments.",
      "Show the kitten's head, chest, and two front paws resting naturally over the front rim; the cat must be the clear focal point, prominently sized, and must not be covered by food.",
      fillings
        ? `Arrange these selected ingredients visibly around and just behind the kitten: ${fillings.toLowerCase()}.`
        : "Keep the kitten framed by the open tortilla.",
      "Match the cheerful attached-reference style: centered symmetrical composition, compact proportions, realistic tortilla and food textures, crisp clean cutout appearance, and soft studio lighting.",
      "Show exactly one kitten and one foil-wrapped tortilla wrap. No plate, hands, people, text, lettering, logo, watermark, extra limbs, or duplicate animal.",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const generate = async (nextMode: "photo" | "splatter") => {
    setGenerating(true);
    setImageError(null);
    setImageSrc(null);
    setIsFinal(false);
    setMode(nextMode);
    try {
      await streamImage("/api/generate-purrito", buildPrompt(nextMode), (dataUrl, final) => {
        setImageSrc(dataUrl);
        if (final) setIsFinal(true);
      });
    } catch (streamFailure) {
      const message =
        streamFailure instanceof Error ? streamFailure.message : "Could not create the picture";
      setImageError(message);
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!data) return;
    if (startedFor.current === data.pickup_number) return;
    startedFor.current = data.pickup_number;
    void generate("photo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const download = () => {
    if (!imageSrc) return;
    const link = document.createElement("a");
    link.download = `purrito-${pickup.slice(0, 8)}.png`;
    link.href = imageSrc;
    link.click();
    toast.success("Purrito image downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader title="Your Order" code={CONTRACT_ADDRESS} />

      <main className="mx-auto max-w-[970px] px-5 py-10">
        {isLoading ? (
          <p className="text-base text-muted-foreground">Loading your order…</p>
        ) : !data ? (
          <div>
            <h1 className="font-display text-[40px] font-bold uppercase leading-none text-brand">Order not found</h1>
            <p className="mt-3 text-base text-muted-foreground">
              We could not find an order with that pickup number.
            </p>
            <Link to="/" className="mt-6 inline-block font-display text-base font-bold uppercase text-brand underline">
              Build a new Purrito
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-8">
              <img
                src="/site/images/header_burrito.png"
                alt="A foil-wrapped Purrito with a kitten nestled inside"
                className="hidden w-[280px] shrink-0 object-contain sm:block md:w-[340px]"
              />
              <div>
                <p className="font-semibold text-[19.2px] uppercase leading-[26px] text-muted-foreground">Ready for pickup</p>
                <h1 className="font-display text-[56px] font-bold uppercase leading-none text-brand">Your Purrito</h1>
                <p className="mt-3 max-w-[420px] text-base leading-[22px] text-muted-foreground">
                  Enjoy your fluffy, delicious, piled high with bold flavors and little whiskers purrito - meow that looks good!
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-sm border border-border bg-card p-4">
              <div className="relative mx-auto flex aspect-square w-full max-w-[620px] items-center justify-center overflow-hidden rounded-sm bg-muted">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Your freshly built Purrito"
                    className={
                      isFinal
                        ? "h-full w-full object-cover blur-0 transition-[filter] duration-500"
                        : "h-full w-full object-cover blur-2xl transition-[filter] duration-500"
                    }
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 px-6 text-center">
                    {generating ? <Loader2 className="h-6 w-6 animate-spin text-brand" /> : null}
                    <p className="text-base text-muted-foreground">
                      {generating
                        ? "Rolling your Purrito… Adorable and tasty takes some time."
                        : (imageError ?? "No picture yet.")}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  aria-label={mode === "splatter" ? "Show original Purrito" : "Redraw as a chunky splatter painting"}
                  title={mode === "splatter" ? "Show original Purrito" : "Redraw as a chunky splatter painting"}
                  onClick={() => void generate(mode === "splatter" ? "photo" : "splatter")}
                  disabled={generating}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-sm border border-brand bg-card/90 text-brand shadow-sm transition hover:bg-brand hover:text-brand-foreground disabled:opacity-50"
                >
                  <MeatGrinderIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  onClick={() => void download()}
                  disabled={!imageSrc || !isFinal}
                  className="h-12 rounded-sm bg-brand px-8 font-display text-base font-bold uppercase text-brand-foreground hover:bg-brand-hover"
                >
                  <Download className="h-4 w-4" />
                  Download my Purrito
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-sm border-brand px-6 font-display text-base font-bold uppercase text-brand"
                >
                  <Link to="/">Build Another Purrito</Link>
                </Button>
              </div>
            </div>

            <section className="mt-10 border-t border-border pt-6">
              <h2 className="font-display text-[30px] font-bold uppercase leading-9 text-brand">Order Details</h2>
              <ul className="mt-4 divide-y divide-border">
                {[
                  ...(protein ? [protein] : []),
                  ...riceList,
                  ...toppingList,
                  ...sideList,
                  ...drinkList,
                ].map((item) => (
                  <li key={item!.id} className="flex items-center justify-between py-3">
                    <span className="text-base text-brand">{item!.name}</span>
                    <span className="text-base font-bold text-muted-foreground">
                      {item!.price > 0 ? money(item!.price) : "Free"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t-2 border-brand py-4">
                <span className="font-display text-[22px] font-bold uppercase text-brand">Total</span>
                <span className="font-display text-[22px] font-bold text-brand">{money(Number(data.total))}</span>
              </div>
            </section>

            <HowToBuy />

            <p className="mx-auto mt-16 max-w-[970px] text-center text-[12px] leading-[17px] text-muted-foreground">
              ©2026 This $PURRITO has no affiliation with a company, has no intrinsic use, fundamental value, or known future yield. It is classified as a digital collectible meant for novelty and entertainment, rather than a traditional financial investments or security.
            </p>
          </>
        )}
      </main>
    </div>
  );
}



const STEPS = [
  {
    numeral: "I",
    title: "Get a Wallet",
    body: "Phantom or Solflare, funded with SOL. This part you should write down.",
  },
  {
    numeral: "II",
    title: "Open the Pair",
    body: "Use the buy button above, once the contract is published here.",
  },
  {
    numeral: "III",
    title: "Swap",
    body: "Confirm in your wallet. Then go outside and forget where you put it.",
  },
];

function HowToBuy() {
  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      toast.success("Contract address copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <section className="mt-12 border-t-4 border-brand pt-8">
      <div className="flex items-end gap-4">
        <h2 className="font-display text-[48px] font-bold uppercase leading-none text-brand md:text-[64px]">
          How to Buy
        </h2>
        <p className="hidden pb-2 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground sm:block">
          Three steps, one shovel
        </p>
      </div>
      <div className="mt-2 h-0.5 w-full bg-brand" />

      <ol className="mt-8 grid gap-8 md:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.numeral} className="border-t-4 border-brand pt-4">
            <span className="font-display text-xl font-bold uppercase text-brand">{step.numeral}</span>
            <h3 className="mt-1 font-display text-[30px] font-bold uppercase leading-9 text-brand">
              {step.title}
            </h3>
            <p className="mt-2 text-base leading-[22px] text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={copyContract}
          title="Copy contract address"
          className="flex max-w-full items-center gap-3 border border-brand px-5 py-3 text-left transition hover:bg-muted"
        >
          <span className="shrink-0 text-xs font-bold uppercase tracking-[0.3em] text-brand">Contract</span>
          <span className="break-all font-mono text-sm font-bold text-brand">{CONTRACT_ADDRESS}</span>
        </button>
      </div>
    </section>
  );
}
