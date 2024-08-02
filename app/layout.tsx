import type { Metadata } from "next";
import "./globals.css";

let title = "Llamination – AI Animated SVG Generator";
let description = "Generate your next animated SVG with Llama 3.1 405B";
let url = "https://llamination.vercel.app/";
let ogimage = "https://llamination.vercel.app/og-image.png";
let sitename = "llamination.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* <PlausibleProvider domain="llamacoder.io" /> */}</head>
      <body className="bg-brand antialiased">
        <div className="isolate">{children}</div>
      </body>
    </html>
  );
}
