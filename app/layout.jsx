import { Gruppo } from "next/font/google";
import "@/style/globals.css"
import { Providers } from "./providers";
import { SessionProviders } from "./sessionProvider";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--gruppo",
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "CHH Industry",
  description: "CHH Industry Internal System By Alpaca",
};

export default function RootLayout({ children }) {
  return (
    <SessionProviders>
      <html lang="en">
        <head>
          <link rel="icon" href="/images/logo.png" />
        </head>
        <body className={`${gruppo.variable} font-[var(--gruppo)] antialiased`}>
          <Providers>
            <div
              className="flex items-center justify-center w-full h-screen gap-2 bg-background
           text-sm font-semibold"
            >
              {children}
            </div>
          </Providers>
        </body>
      </html>
    </SessionProviders>
  );
}
