import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";

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

export const metadata: Metadata = {
  title: "Untuk Kamu",
  description: "Sebuah halaman kecil yang dibuat khusus untuk seseorang yang spesial.",
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
  themeColor: "#fff7fa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${poppins.variable} antialiased`}
    >
      <body className="min-h-[100dvh]">
        {/* MotionProvider mengatur perilaku animasi global (lihat file-nya). */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
