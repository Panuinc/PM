import { Gruppo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--gruppo",
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "Maintenance",
  description: "Maintenance By Alpaca",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
          <link rel="icon" href="/images/images.png" />
        </head>
      <body
        className={`${gruppo.variable} font-[var(--gruppo)] antialiased`}
      >
        <Providers>
          <div
            className="flex items-center justify-center w-full h-screen gap-2 bg-white text-dark
           text-sm font-semibold"
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
