import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "AB_DEV_NODE_07 | Ahmed Ben Abdallah",
  description: "A secure terminal diagnostic link managed by Ahmed Ben Abdallah. [ACCESS_RESTRICTED] - Authorization required.",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "AB_DEV_NODE_07",
    description: "Secure Node Connection Established. Created by Ahmed Ben Abdallah.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AB_DEV_NODE_07",
    description: "Connection Pending... System by AB_DEV",
    images: ["/og-image.png"],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black overflow-hidden">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
