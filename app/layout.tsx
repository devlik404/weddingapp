import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://undangan-anggi-hamid.vercel.app").replace(/\/$/, "");
const invitationTitle = "Undangan Pernikahan Hamid & Anggi";
const invitationDescription =
  "Dengan penuh cinta, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu di hari bahagia kami.";
const ogImage = "/og-image.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: invitationTitle,
  description: invitationDescription,
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: invitationTitle,
    description: invitationDescription,
    url: siteUrl,
    siteName: invitationTitle,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Foto sampul undangan pernikahan Hamid dan Anggi"
      }
    ],
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: invitationTitle,
    description: invitationDescription,
    images: [ogImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
