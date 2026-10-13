import AudioProvider from "@/components/AudioProvider";
import OpenGate from "@/components/OpenGate";
import MusicButton from "@/components/MusicButton";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Timeline from "@/components/Timeline";
import LoveLetter from "@/components/LoveLetter";
import Reasons from "@/components/Reasons";
import Closing from "@/components/Closing";

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
        <Countdown />
        <Gallery />
        <Timeline />
        <LoveLetter />
        <Reasons />
        <Closing />
      </main>

      {/* Overlay & kontrol audio */}
      <OpenGate />
      <MusicButton />
    </AudioProvider>
  );
}
