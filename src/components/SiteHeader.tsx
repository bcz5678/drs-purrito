import { Link } from "@tanstack/react-router";
import { Copy, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS, COPY_CA_LABEL, SOCIAL } from "@/lib/site";

const logo = { url: "/site/images/catpoltle_logo_clear.png" };

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 7.36c.18-.01.38.06.44.28.06.22-.06.72-.13 1.07-.22 1.2-.9 4.65-1.27 6.23-.16.67-.47.9-.77.93-.65.06-1.14-.43-1.77-.84-.99-.65-1.55-1.05-2.51-1.69-.6-.39-.21-.61.13-.96.09-.09 1.63-1.49 3.29-3.03.13-.12.23-.28.06-.36-.09-.04-.24 0-.36.08-1.9 1.21-3.62 2.3-4.4 2.86-.4.29-.79.43-1.15.18-.43-.3-1.36-.6-2.05-.86-.72-.27-.63-.62.08-.94 2.36-1.06 5.05-2.24 6.66-2.9.75-.31 1.7-.7 2.42-.86.14-.03.25-.05.34-.05z" />
    </svg>
  );
}

export function SiteHeader({ title, code }: { title: string; code: string }) {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
      {/* Accessibility slot intentionally left empty */}
      <div className="h-7 bg-strip" />
      <div className="flex h-[68px] items-center px-4 md:px-7">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/"
            title="Build a new Purrito"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand p-1.5 transition-opacity hover:opacity-80"
          >
            <img src={logo.url} alt="Catpotle Mexican Grill" className="h-full w-full object-contain" />
          </Link>
          <span className="hidden h-7 w-px bg-border sm:block" />
          <span className="font-display text-lg font-bold uppercase text-brand">{title}</span>
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-3 md:gap-7">
          <div className="hidden items-center gap-2 lg:flex">
            <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <div className="text-[10px] font-bold uppercase text-muted-foreground">{COPY_CA_LABEL}</div>
              <Button
                type="button"
                variant="link"
                onClick={copyCode}
                title="Copy contract address"
                className="h-auto justify-start whitespace-nowrap p-0 font-mono text-xs text-brand"
              >
                <span>{code}</span>
                <Copy className="h-3.5 w-3.5 shrink-0" />
              </Button>
            </div>
          </div>
          <a href={SOCIAL.x} aria-label="X" className="p-2 text-brand transition-opacity hover:opacity-60">
            <XLogo />
          </a>
          <a href={SOCIAL.telegram} aria-label="Telegram" className="p-2 text-brand transition-opacity hover:opacity-60">
            <TelegramLogo />
          </a>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 lg:hidden">
        <div className="text-[10px] font-bold uppercase text-muted-foreground">{COPY_CA_LABEL}</div>
        <Button
          type="button"
          variant="link"
          onClick={copyCode}
          className="h-auto w-full items-start justify-start whitespace-normal p-0 text-left font-mono text-[11px] leading-4 text-brand"
        >
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="break-all">{code}</span>
          <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        </Button>
      </div>
    </header>
  );
}
