import AudioProvider from "@/components/AudioProvider";
import OpenGate from "@/components/OpenGate";
import MusicButton from "@/components/MusicButton";
import ThemeToggle from "@/components/ThemeToggle";
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

      {/* Overlay & kontrol audio */}
      <OpenGate />
      <MusicButton />
      {/* Tombol tema ditaruh di atas gate (z-51) agar bisa dipakai kapan saja. */}
      <ThemeToggle />
    </AudioProvider>
  );
}
