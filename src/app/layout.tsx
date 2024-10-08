import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import { Toaster } from "~/app/_components/ui/sonner";

export const metadata: Metadata = {
  title: "rec",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-stone-100 text-stone-900">
        <TRPCReactProvider>
          <HydrateClient>
            {children}
            <Toaster />
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
