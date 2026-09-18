import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/Toast";
import { RouteProgressBar } from "@/components/layout/RouteProgressBar";
import { InitialSplash } from "@/components/layout/InitialSplash";
import { SITE_URL, STORE_NAME } from "@/lib/constants";
import { getLocalBusinessJsonLd } from "@/lib/structured-data";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const DESCRIPTION =
  "Indumentaria, perfumería, cremas, tuppers y variedades en San Rafael, Mendoza. Mirá el catálogo y consultá por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE_NAME} — Catálogo`,
    template: `%s — ${STORE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${STORE_NAME} — Catálogo`,
    description: DESCRIPTION,
    siteName: STORE_NAME,
    url: SITE_URL,
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} — Catálogo`,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7EFE0" },
    { media: "(prefers-color-scheme: dark)", color: "#1B1512" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${fraunces.variable} ${workSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <RouteProgressBar />
            <InitialSplash />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
