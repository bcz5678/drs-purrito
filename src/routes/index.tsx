import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { saveOrder } from "@/lib/orderStorage";
import { DRINKS, findItem, money, PROTEINS, RICE, SIDES, TOPPINGS, type MenuItem } from "@/lib/menu";
import { CONTRACT_ADDRESS } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Build Your Purrito — Catpotle Mexican Grill" },
      {
        name: "description",
        content:
          "Build your Purrito at Catpotle: humanely caught, never caged kitten, fresh sides and drinks, ready for pickup.",
      },
      { property: "og:title", content: "Build Your Purrito — Catpotle Mexican Grill" },
      {
        property: "og:description",
        content:
          "Pick your kitten, add a side of mouse, bird or gecko, and finish with pure water or organic milk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildPurrito,
});

function randomDigits(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10).toString();
  return out;
}

function ChoiceRow({
  item,
  selected,
  onToggle,
}: {
  item: MenuItem;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      aria-pressed={selected}
      className={`group relative flex h-[142px] w-full justify-start overflow-hidden rounded-none border bg-card p-0 text-left shadow-none transition-colors hover:bg-muted/50 ${
        selected ? "border-brand ring-1 ring-brand" : "border-border"
      }`}
    >
      <div className="h-full w-[142px] shrink-0 overflow-hidden bg-muted">
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          className={TOPPINGS.concat(RICE).some((topping) => topping.id === item.id) || SIDES.concat(DRINKS).some((other) => other.id === item.id) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-5">
        <span className="font-display whitespace-normal text-[22px] font-bold uppercase leading-[26px] text-brand">{item.name}</span>
        {item.detail ? <span className="text-base font-normal leading-[22px] text-muted-foreground">{item.detail}</span> : null}
        {item.detail2 ?? (item.price > 0 && !item.detail ? money(item.price) : null) ? (
          <span className="text-base font-bold leading-[22px] text-muted-foreground">
            {item.detail2 ?? money(item.price)}
          </span>
        ) : null}
      </div>
      {selected ? <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-foreground"><Check className="h-4 w-4" /></span> : null}
    </Button>
  );
}

function BuildPurrito() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [protein, setProtein] = useState<string | null>(null);
  const [rice, setRice] = useState<string[]>([]);
  const [sides, setSides] = useState<string[]>([]);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [toppings, setToppings] = useState<string[]>([]);

  useEffect(() => {
    setCode(randomDigits(36));
  }, []);

  const toggle = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const ready = Boolean(protein);

  const selectedIds = [...(protein ? [protein] : []), ...rice, ...toppings, ...sides, ...drinks];
  const total = selectedIds.reduce((sum, id) => sum + (findItem(id)?.price ?? 0), 0);

  const placeOrder = () => {
    if (!ready || !protein) {
      toast.error("Choose your kitten first");
      return;
    }
    const items = selectedIds.map((id) => {
      const item = findItem(id);
      return { id, name: item?.name ?? id, price: item?.price ?? 0 };
    });
    saveOrder({
      pickup_number: code,
      protein,
      rice,
      toppings,
      sides,
      drinks,
      items,
      total,
      created_at: new Date().toISOString(),
    });
    void navigate({ to: "/order/$pickup", params: { pickup: code } });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader title="Purrito" code={CONTRACT_ADDRESS} />

      <main>
        <section className="mx-auto flex min-h-[370px] max-w-[970px] items-center gap-8 px-5 py-12">
          <img
            src="/site/images/header_burrito.png"
            alt="A foil-wrapped Purrito with a kitten nestled inside"
            className="hidden w-[320px] shrink-0 object-contain sm:block md:w-[380px]"
          />
          <div>
            <p className="font-semibold text-[19.2px] uppercase leading-[26px] text-muted-foreground">Build Your</p>
            <h1 className="font-display text-[64px] font-bold uppercase leading-none text-brand">Purrito</h1>
            <p className="mt-4 max-w-[590px] text-base leading-[22px] text-brand">
              Your choice of humanely caught, never caged kitten wrapped in a warm flour tortilla with fresh sides and drinks.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1010px] border-t border-border px-5 pb-12 pt-7">
          <section>
            <div>
              <h2 className="font-display text-[30px] font-bold uppercase leading-9 text-brand">Protein or Veggie</h2>
              <p className="mt-2 text-base leading-[22px] text-muted-foreground">Select one or more.</p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {PROTEINS.map((item) => (
                <ChoiceRow
                  key={item.id}
                  item={item}
                  selected={protein === item.id}
                  onToggle={() => setProtein(protein === item.id ? null : item.id)}
                />
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-[30px] font-bold uppercase leading-9 text-brand">Rice</h2>
            <p className="mt-2 text-base leading-[22px] text-muted-foreground">Select one or more.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {RICE.map((item) => (
                <ChoiceRow
                  key={item.id}
                  item={item}
                  selected={rice.includes(item.id)}
                  onToggle={() => setRice((prev) => toggle(prev, item.id))}
                />
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-[30px] font-bold uppercase leading-9 text-brand">Top Things Off</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {TOPPINGS.map((item) => (
                <ChoiceRow
                  key={item.id}
                  item={item}
                  selected={toppings.includes(item.id)}
                  onToggle={() => setToppings((prev) => toggle(prev, item.id))}
                />
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-[30px] font-bold uppercase leading-9 text-brand">Sides</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {SIDES.map((item) => (
                <ChoiceRow
                  key={item.id}
                  item={item}
                  selected={sides.includes(item.id)}
                  onToggle={() => setSides((prev) => toggle(prev, item.id))}
                />
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-[30px] font-bold uppercase leading-9 text-brand">Drinks</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {DRINKS.map((item) => (
                <ChoiceRow
                  key={item.id}
                  item={item}
                  selected={drinks.includes(item.id)}
                  onToggle={() => setDrinks((prev) => toggle(prev, item.id))}
                />
              ))}
            </div>
          </section>

          <p className="mx-auto mt-16 max-w-[970px] text-center text-[12px] leading-[17px] text-muted-foreground">
            ©2026 This $PURRITO has no affiliation with a company, has no intrinsic use, fundamental value, or known future yield. It is classified as a digital collectible meant for novelty and entertainment, rather than a traditional financial investments or security.
          </p>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-muted shadow-[0_-2px_8px_var(--bottom-shadow)]">
        <div className="mx-auto flex min-h-[76px] max-w-[1100px] items-center justify-between gap-4 px-5 py-3">
          <p className="hidden text-sm font-bold text-brand sm:block">
            {ready ? `Total ${money(total)}` : "Choose your kitten to build your Purrito"}
          </p>
          <Button
            type="button"
            disabled={!ready}
            onClick={placeOrder}
            className="ml-auto h-12 w-full rounded-sm bg-brand px-10 font-display text-base font-bold uppercase text-brand-foreground hover:bg-brand-hover sm:w-auto"
          >
            Build Purrito
          </Button>
        </div>
      </footer>
    </div>
  );
}
