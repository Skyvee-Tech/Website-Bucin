import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import { withBase } from "@/lib/withBase";

// ---------------------------------------------------------------------------
// FONT
// ---------------------------------------------------------------------------
// Playfair Display (judul) dan Poppins (teks isi), dihosting otomatis oleh
// Next.js (tanpa gambar/permintaan ke Google saat runtime). Masing-masing
// menghasilkan CSS variable yang dipakai di globals.css.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

// Origin situs (TANPA base path). Next menambahkan base path sendiri ke aset
// metadata (mis. opengraph-image.png), jadi jangan dobel di metadataBase.
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://skyvee-tech.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Skyvee Tech",
  description: "Sebuah halaman kecil yang dibuat khusus untuk seseorang yang spesial.",
  // Halaman ini bersifat pribadi — minta mesin pencari TIDAK mengindeksnya.
  robots: { index: false, follow: false },
  // Pratinjau saat link dibagikan (mis. WhatsApp/IG). Gambarnya dari
  // src/app/opengraph-image.png (dipakai otomatis oleh Next).
  openGraph: {
    type: "website",
    title: "Untuk Kamu",
    description: "Sebuah halaman kecil yang dibuat khusus untuk seseorang yang spesial.",
    url: withBase("/"),
    siteName: "Untuk Kamu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Untuk Kamu",
    description: "Sebuah halaman kecil yang dibuat khusus untuk seseorang yang spesial.",
  },
};

// ---------------------------------------------------------------------------
// VIEWPORT
// ---------------------------------------------------------------------------
// viewportFit: "cover" wajib supaya kita bisa memakai env(safe-area-inset-*)
// (menghindari notch/poni & gesture bar di HP).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Warna bilah browser mengikuti setelan sistem (dua meta dengan media query).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1218" },
  ],
};

// ---------------------------------------------------------------------------
// SKRIP TEMA (anti-kedip)
// ---------------------------------------------------------------------------
// Dijalankan sinkron sebagai anak pertama <body>, SEBELUM konten dilukis, jadi
// tema yang benar sudah terpasang saat frame pertama (tidak ada kedipan putih).
// Logikanya cerminan dari resolveTheme() di src/lib/theme.ts (yang diuji).
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${poppins.variable} antialiased`}
      // Skrip tema mengubah atribut data-theme di <html> sebelum hydration,
      // jadi perbedaan atribut ini memang disengaja.
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh]">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* MotionProvider mengatur perilaku animasi global (lihat file-nya). */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
