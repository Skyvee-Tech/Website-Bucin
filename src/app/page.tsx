import AudioProvider from "@/components/AudioProvider";
import OpenGate from "@/components/OpenGate";
import MusicButton from "@/components/MusicButton";
import Hero from "@/components/Hero";
import WordMarquee from "@/components/WordMarquee";
import Countdown from "@/components/Countdown";
import MarriageBook from "@/components/MarriageBook";
import Gallery from "@/components/Gallery";
import LoveLetter from "@/components/LoveLetter";
import Reasons from "@/components/Reasons";
import Closing from "@/components/Closing";
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
        <Divider />
        <Reasons />
        <Divider />
        <Closing />
      </main>

      {/* Overlay & kontrol audio */}
      <OpenGate />
      <MusicButton />
    </AudioProvider>
  );
}
