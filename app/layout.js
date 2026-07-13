import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import AppFrame from "@/components/AppFrame";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hakgyoNalgae = localFont({
  src: "../font/Hakgyoansim_NalgaeR.ttf",
  variable: "--font-hakgyo-nalgae",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "몽글몽글",
  description: "우울은 비 같은 것 — 그 스며듦을 색으로 시각화하는 앱",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${hakgyoNalgae.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-gray-100">
        <AppFrame>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
          <BottomNav />
        </AppFrame>
      </body>
    </html>
  );
}
