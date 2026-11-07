import type { Metadata } from "next";
import "./globals.css";
import "./themes.css";
import "./renewal.css";
import "./readability.css";
import "./stack-fit.css";
import "./contact-flow.css";
import "./cloud-universe.css";
import "./immersive-hero.css";
import "./deepu.css";
import "./journey-glass.css";
import "./services-experience.css";
import "./contact-partnership.css";
import "./polish.css";
import "./cloud-service-network.css";
import "./enterprise-artwork.css";
import {
  Header,
  Footer,
  Assistant,
  MotionProvider,
} from "@/components/Interface";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.infocuscs.com"),
  title: {
    default: "INFOCUS — Intelligent technology. Extraordinary possibilities.",
    template: "%s | INFOCUS",
  },
  description:
    "Infocus Consulting Services connects cloud innovation, enterprise applications and intelligent automation to help businesses move forward.",
  openGraph: {
    type: "website",
    siteName: "Infocus Consulting Services",
    images: ["/images/cloud-hero.webp"],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem("infocus-theme")==="dark"?"dark":"light"}catch{}`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <MotionProvider>{children}</MotionProvider>
        <Footer />
        <Assistant />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Infocus Consulting Services",
              url: "https://www.infocuscs.com",
              logo: "https://www.infocuscs.com/brand/infocus-wordmark.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
