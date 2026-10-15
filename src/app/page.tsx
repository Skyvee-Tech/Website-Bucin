import AudioProvider from "@/components/AudioProvider";
import OpenGate from "@/components/OpenGate";
import FloatingControls from "@/components/FloatingControls";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Hero from "@/components/Hero";
import WordMarquee from "@/components/WordMarquee";
import Countdown from "@/components/Countdown";
import MarriageBook from "@/components/MarriageBook";
import Gallery from "@/components/Gallery";
import LoveLetter from "@/components/LoveLetter";
import Divider from "@/components/Divider";
import { site } from "@/content/site";

// ---------------------------------------------------------------------------
// Halaman utama — menyusun semua bagian dari atas ke bawah.
// ---------------------------------------------------------------------------
// AudioProvider membungkus semuanya supaya gate dan tombol mute berbagi satu
// elemen audio. OpenGate & MusicButton melayang di atas konten.
export default function Home() {
  return (
    <AudioProvider>
      <main>
        <Hero />
        <WordMarquee words={site.loveWords} />
        <Countdown />
        <Divider />
        <MarriageBook />
        <Divider />
        <Gallery />
        <Divider />
        <LoveLetter />
      </main>

      {/* Overlay & kontrol melayang (tema + musik) */}
      <OpenGate />
      <FloatingControls />
      {/* Daftarkan service worker (PWA) — hanya produksi, setelah load. */}
      <ServiceWorkerRegister />
    </AudioProvider>
  );
}
