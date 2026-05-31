"use client";

import Image from "next/image";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Camera,
  CheckCircle2,
  Copy,
  FileText,
  Gift,
  Heart,
  Home,
  Instagram,
  MailOpen,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Send,
  Table2,
  Upload,
  UsersRound,
  X
} from "lucide-react";

const eventDate = "Minggu, 02 Agustus 2026";
const eventDateTarget = "2026-08-02T09:00:00+07:00";
const eventLocation = "Jl. Inpres IV, RW.006, Kec. Larangan, Kota Tangerang";

const events = [
  { title: "Akad Nikah", time: "09.00 - 10.00 WIB" },
  { title: "Resepsi", time: "10.00 WIB - Selesai" }
];

const bankAccounts = [
  {
    bank: "BCA",
    number: "604 054 4877",
    plainNumber: "6040544877",
    name: "Muhamad Hamidudin"
  },
  {
    bank: "BCA",
    number: "3450 905 703",
    plainNumber: "3450905703",
    name: "Anggi Lusiana"
  }
];

const stories = [
  {
    date: "Awal Kisah",
    title: "Awal Bertemu",
    body: "Tak ada yang terjadi secara kebetulan di dunia ini. Semua sudah tersusun rapi oleh Sang Maha Kuasa. Kita tidak bisa memilih kepada siapa hati akan jatuh cinta. Kisah pertemuan kami bermula ketika kami dikenalkan oleh kerabat terdekat. Awalnya kami hanya berniat menjalaninya saja, tetapi tanpa diduga pertemuan itu justru membawa kami ke dalam ikatan cinta yang suci."
  }
];

const verseText =
  "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";

type GuestMessage = {
  id?: string;
  name: string;
  status: string;
  message: string;
  created_at?: string;
};

type GiftTransferExport = {
  id: string;
  sender_name: string;
  amount: number;
  proof_bucket: string;
  proof_path: string;
  proof_file_name: string;
  proof_mime_type: string;
  guest_name?: string | null;
  rsvp_status: "Hadir" | "Tidak Hadir" | "Masih Ragu" | "Tidak Jawab";
  created_at: string;
  proof_data_url?: string;
  proof_signed_url?: string;
};

const guestMessages: GuestMessage[] = [
  {
    name: "Rani",
    status: "Hadir",
    message: "Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah."
  },
  {
    name: "Dimas",
    status: "Hadir",
    message: "Turut berbahagia untuk Anggi Lusiana dan Muhamad Hamidudin. Semoga acaranya lancar sampai hari H."
  },
  {
    name: "Maya",
    status: "Tidak Hadir",
    message: "Maaf belum bisa hadir, doa terbaik selalu menyertai kalian berdua."
  }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const giftProofBucket = process.env.NEXT_PUBLIC_SUPABASE_GIFT_BUCKET ?? "gift-proofs";
const giftExportSecretValue = "anggi dan hamid";

const whatsappContacts = [
  {
    label: "WA Pria",
    name: "Muhamad Hamidudin",
    phone: process.env.NEXT_PUBLIC_WA_PRIA ?? "6287876361817"
  },
  {
    label: "WA Wanita",
    name: "Anggi Lusiana",
    phone: process.env.NEXT_PUBLIC_WA_WANITA ?? "6289509930735"
  }
];

const navItems = [
  { id: "opening", label: "Home", icon: Home },
  { id: "couple", label: "Mempelai", icon: UsersRound },
  { id: "date", label: "Tanggal", icon: CalendarDays },
  { id: "event", label: "Acara", icon: MapPin },
  { id: "gallery", label: "Galeri", icon: Camera },
  { id: "family", label: "Keluarga Besar", icon: UsersRound },
  { id: "gift", label: "Gift", icon: Gift },
  { id: "rsvp", label: "RSVP", icon: MessageCircle }
];

function getCountdownParts(targetDate: string) {
  const distance = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return [
    [String(days).padStart(2, "0"), "Hari"],
    [String(hours).padStart(2, "0"), "Jam"],
    [String(minutes).padStart(2, "0"), "Menit"],
    [String(seconds).padStart(2, "0"), "Detik"]
  ];
}

function useCountdown(targetDate: string) {
  const [countdownParts, setCountdownParts] = useState(() =>
    getCountdownParts(targetDate)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdownParts(getCountdownParts(targetDate));
    }, 1000);

    setCountdownParts(getCountdownParts(targetDate));

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return countdownParts;
}

function TypewriterParagraph({
  text,
  className,
  speed = 26,
  startDelay = 250
}: {
  text: string;
  className: string;
  speed?: number;
  startDelay?: number;
}) {
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    const element = paragraphRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    let index = 0;
    let interval: number | undefined;

    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));

        if (index >= text.length && interval) {
          window.clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);

      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isStarted, speed, startDelay, text]);

  return (
    <p ref={paragraphRef} className={`${className} typing-paragraph`} aria-label={text}>
      {visibleText}
      {visibleText.length < text.length ? <span className="typing-caret" aria-hidden="true" /> : null}
    </p>
  );
}

function escapeCalendarText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function downloadCalendarInvite() {
  const title = "Pernikahan Anggi & Hamid";
  const description =
    "Akad Nikah: 09.00 - 10.00 WIB\\nResepsi: 10.00 WIB - Selesai";
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//Anggi Hamid//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:anggi-hamid-wedding-20260802@wedding-invitation",
    `DTSTAMP:${now}`,
    "DTSTART:20260802T020000Z",
    "DTEND:20260802T100000Z",
    `SUMMARY:${escapeCalendarText(title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(eventLocation)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const file = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "pernikahan-anggi-hamid.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function HomePage() {
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [giftExportSecret, setGiftExportSecret] = useState("");
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("opening");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest =
      params.get("to") ||
      params.get("nama") ||
      params.get("kepada") ||
      params.get("export-history-transfer") ||
      params.get("name") ||
      params.get("tamu");

    if (guest) {
      setGuestName(guest.replace(/\+/g, " ").trim());
    }

    setGiftExportSecret(
      params.get("secret-export-history-transfer")?.replace(/\+/g, " ").trim() ?? ""
    );
  }, []);

  useEffect(() => {
    if (!isInvitationOpen) {
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [isInvitationOpen]);

  useEffect(() => {
    if (!isInvitationOpen) {
      return;
    }

    const sections = document.querySelectorAll<HTMLElement>(".page-section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.35, 0.55, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isInvitationOpen]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  if (!isInvitationOpen) {
    return (
      <main className="min-h-screen bg-[#34363b] text-[#4f6980]">
        <CoverInvitation
          guestName={guestName}
          onOpen={() => setIsInvitationOpen(true)}
        />
      </main>
    );
  }

  return (
    <main className="fixed-invitation-backdrop min-h-screen bg-[#34363b] text-[#1f2730]">
      <div className="invitation-scroll relative z-10 mx-auto w-full max-w-[430px] overflow-hidden bg-transparent  shadow-2xl shadow-black/30">
        <OpeningSection />
        <VerseSection />
        <BrideGroomSection />
        <SaveDateSection />
        <EventSection />
        <LoveStorySection />
        <GallerySection />
        <FamilySection />
        <GiftSection
          guestName={guestName}
          giftExportSecret={giftExportSecret}
        />
        <RsvpSection guestName={guestName} />
      </div>
      <BottomNav activeSection={activeSection} onSelect={scrollToSection} />
      <MusicButton />
    </main>
  );
}

function SectionFloralFrame() {
  return (
    <div className="section-floral-frame" aria-hidden="true">
      <RootDivider position="top" />
      <RootDivider position="bottom" />
    </div>
  );
}

function RootDivider({ position }: { position: "top" | "bottom" }) {
  return (
    <div className={`section-root-wood section-root-wood-${position}`}>
      <span className="root-divider-rail" />
      <span className="root-vine root-vine-main" />
      <span className="root-vine root-vine-back" />
      <span className="root-vine root-vine-front" />
      <span className="root-tendril root-tendril-left" />
      <span className="root-tendril root-tendril-right" />
      <span className="root-wrap root-wrap-left" />
      <span className="root-wrap root-wrap-right" />
    </div>
  );
}

function CornerBucketSet() {
  const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];

  return (
    <>
      {corners.map((corner) => (
        <div key={corner} className={`corner-bucket corner-bucket-${corner}`} aria-hidden="true">
          <Image
            src="/images/luxury-blue-java-corner-blue-lavender.png"
            alt=""
            fill
            className="corner-bucket-art object-contain"
            sizes="170px"
          />
          <span className="corner-bucket-tip corner-bucket-tip-primary" />
          <span className="corner-bucket-tip corner-bucket-tip-secondary" />
          <span className="corner-bucket-tip corner-bucket-tip-tertiary" />
        </div>
      ))}
    </>
  );
}

function CoverInvitation({
  guestName,
  onOpen
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <section className="invitation-paper relative mx-auto flex min-h-screen w-full max-w-[430px] overflow-hidden px-7 py-9 text-center">
      <SectionFloralFrame />
      <Image
        src="/images/art-blue-java-cover.png"
        alt="Ilustrasi Art Blue Java untuk cover undangan"
        fill
        priority
        className="object-cover"
        sizes="430px"
      />
      <div className="absolute inset-0 bg-white/18" />
      <div className="java-label-frame absolute inset-x-8 top-[15%] bottom-[16%] z-10" />

      <div className="relative z-20 flex min-h-[88vh] w-full flex-col items-center justify-center">
        <div className="mt-auto">
          <p className="cover-eyebrow font-body">
            The Wedding Of
          </p>

          <div className="cover-photo-scene relative mx-auto mt-8">
            <div className="cover-photo-frame relative z-20 mx-auto overflow-hidden bg-white shadow-xl shadow-[#30475d]/25">
              <Image
                src="/images/anggi-hamid.jpeg"
                alt="Foto pasangan"
                fill
                priority
                className="object-cover"
                sizes="170px"
              />
            </div>
            <div className="cover-kayon-curtain pointer-events-none absolute inset-0 z-30">
              <div className="cover-kayon cover-kayon-left">
                <Image
                  src="/images/gunungan-wayang-art-blue-java.png"
                  alt=""
                  fill
                  priority
                  className="object-contain"
                  sizes="190px"
                />
              </div>
              <div className="cover-kayon cover-kayon-right">
                <Image
                  src="/images/gunungan-wayang-art-blue-java.png"
                  alt=""
                  fill
                  priority
                  className="object-contain"
                  sizes="190px"
                />
              </div>
            </div>
          </div>

          <h1 className="cover-name mt-7 font-script">
            Anggi
          </h1>
          <p className="cover-amp my-4 font-display">&</p>
          <h2 className="cover-name font-script">
           Hamid
          </h2>
          <p className="cover-date mt-6 font-body">
            {eventDate}
          </p>
        </div>

        <div className="mt-auto w-full pb-4">
          <p className="cover-guest font-display">
            Kepada Yth. {guestName}
          </p>
          <button
            onClick={onOpen}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4f6980] px-7 py-3 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-xl shadow-[#30475d]/25 transition hover:bg-[#34495b]"
          >
            <MailOpen size={16} aria-hidden="true" />
            Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}

function OpeningSection() {
  return (
    <section id="opening" className="page-section home-section relative overflow-hidden px-7 py-10 text-center text-white">
      <SectionFloralFrame />
      <CornerBucketSet />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center">
        <p data-reveal="up" className="home-eyebrow font-body">
          The Wedding Of
        </p>

        <div data-reveal="zoom" className="home-wayang-card relative mt-7 h-[21rem] w-full max-w-[21rem]">
          <div className="home-wayang-layer home-wayang-left pointer-events-none absolute top-0 h-[19rem]">
            <Image
              src="/images/gunungan-wayang-art-blue-java.png"
              alt="Gunungan wayang kiri"
              fill
              className="object-contain"
              sizes="190px"
              priority
            />
          </div>
          <div className="home-wayang-layer home-wayang-right pointer-events-none absolute top-0 h-[19rem]">
            <Image
              src="/images/gunungan-wayang-art-blue-java.png"
              alt="Gunungan wayang kanan"
              fill
              className="object-contain"
              sizes="190px"
              priority
            />
          </div>

          <div className="home-couple-medallion absolute left-1/2 top-[6.2rem] h-40 w-32 -translate-x-1/2 overflow-hidden rounded-t-full rounded-b-[4rem] border-[3px] border-white/90 bg-white shadow-xl shadow-[#1f2730]/25">
            <Image
              src="/images/anggi-hamid.jpeg"
              alt="Foto pasangan"
              fill
              priority
              className="object-cover"
              sizes="128px"
            />
          </div>
        </div>

        <div className="relative z-10 -mt-3">
          <h1 data-reveal="name" className="home-couple-name font-script">
            Anggi
          </h1>
          <div data-reveal="zoom" className="mx-auto my-1 flex w-44 items-center gap-3 text-white/88">
            <span className="h-px flex-1 bg-white/50" />
            <span className="font-display text-4xl leading-none">&</span>
            <span className="h-px flex-1 bg-white/50" />
          </div>
          <h2 data-reveal="name" className="home-couple-name font-script">
           Hamid
          </h2>
          <p data-reveal="up" className="home-date mt-4 font-body">
            {eventDate}
          </p>
        </div>

        <p data-reveal="up" className="mx-auto mt-8 max-w-xs font-display text-lg italic leading-7 text-white/88">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
      </div>
    </section>
  );
}

function VerseSection() {
  return (
    <section id="verse" className="page-section verse-section relative overflow-hidden px-6 py-12 text-center text-white">
      <SectionFloralFrame />
      <div className="absolute inset-0 opacity-95">
        <Image
          src="/images/art-blue-java-cover.png"
          alt=""
          fill
          className="object-cover"
          sizes="430px"
        />
      </div>
      <div className="absolute inset-0 bg-[#2f4f67]/42" />

      <div className="verse-card relative z-10 mx-auto w-full max-w-[22rem] px-6 py-8">
        <div data-reveal="zoom" className="verse-photo relative mx-auto overflow-hidden bg-white">
          <Image
            src="/images/anggi-hamid2.jpeg"
            alt="Foto bersama pasangan"
            fill
            className="object-cover"
            sizes="176px"
          />
        </div>

        <p data-reveal="up" className="mt-7 font-body text-[10px] font-bold uppercase tracking-[0.28em] text-[#eaf2f2]/80">
          We Found
        </p>
        <h2 data-reveal="name" className="mt-1 font-script text-[3.75rem] leading-none text-[#fbfaf7]">
          Love
        </h2>
        <LuxuryDivider />
        <TypewriterParagraph
          text={`"${verseText}"`}
          className="mt-5 font-display text-[1.22rem] font-semibold italic leading-8 text-[#fbfaf7]"
          speed={42}
          startDelay={350}
        />
        <p data-reveal="up" className="mt-6 font-body text-[12px] font-bold uppercase tracking-[0.18em] text-[#eaf2f2]/88">
          QS Ar-Rum : 21
        </p>
      </div>
    </section>
  );
}

function BrideGroomSection() {
  return (
    <section id="couple" className="page-section side-floral-bg px-5 py-9">
      <SectionFloralFrame />
      <div className="relative overflow-hidden rounded-[2rem] border border-[#4f6980]/45 bg-[#fbfaf7]/95 px-5 py-8 text-center shadow-2xl shadow-[#30475d]/20">
        <CornerBucketSet />

        <h2 data-reveal="up" className="relative z-10 font-display text-[2.35rem] uppercase leading-tight tracking-[0.13em] text-[#4f6980]">
          Bride & Groom
        </h2>
        <LuxuryDivider tone="blue" />
        <p data-reveal="up" className="relative z-10 mx-auto mt-4 max-w-[20rem] font-display text-lg italic leading-7 text-[#1f2730]/82">
          Assalamualaikum Wr. Wb. Dengan memohon Rahmat & Ridho Allah SWT, kami
          bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara
          pernikahan Muhamad Hamidudin-Anggi Lusiana kami:
        </p>

        <div className="relative z-10 mt-7 space-y-5">
          <ProfileCard
            image="/images/art-blue-java-bride.png"
            name="Anggi Lusiana"
            label="Mempelai Wanita"
            role="Bpk.Roni Taufik (alm) & Ibu Warini"
          />
          <div data-reveal="zoom" className="mx-auto flex w-44 items-center gap-3 text-[#4f6980]">
            <span className="h-px flex-1 bg-[#4f6980]/45" />
            <span className="font-display text-4xl font-semibold leading-none">&</span>
            <span className="h-px flex-1 bg-[#4f6980]/45" />
          </div>
          <ProfileCard
            image="/images/art-blue-java-groom.png"
            name="Muhamad Hamidudin"
            label="Mempelai Pria"
            role="Bpk. Ujid Juhari & Ibu Ekoh "
          />
        </div>
      </div>
    </section>
  );
}

function ProfileCard({
  image,
  name,
  label,
  role
}: {
  image: string;
  name: string;
  label: string;
  role: string;
}) {
  return (
    <article data-reveal="up" className="relative overflow-hidden rounded-2xl border border-[#d8dee0] bg-white text-center shadow-xl shadow-[#30475d]/12">
      <div className="absolute inset-x-0 top-0 h-24 bg-[#4f6980]" />
      <div className="profile-garland absolute inset-x-0 top-0 h-24 opacity-30">
        <Image
          src="/images/luxury-blue-java-garland-blue-lavender.png"
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="360px"
        />
      </div>
      <div className="relative mx-auto mt-5 h-52 w-36 overflow-hidden rounded-t-full rounded-b-[4.5rem] border-[3px] border-white bg-white shadow-xl shadow-[#24384c]/25">
        <Image src={image} alt={name} fill className="object-cover" sizes="144px" />
      </div>
      <div className="px-5 pb-6 pt-4">
        <p className="mx-auto inline-flex rounded-full bg-[#4f6980]/10 px-4 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4f6980]">
          {label}
        </p>
        <h3 data-reveal="name" className="mt-4 font-script text-[3.15rem] leading-none text-[#4f6980]">
        {name}
        </h3>
        <p className="mx-auto mt-3 max-w-[16rem] font-display text-lg font-semibold leading-6 text-[#1f2730]/82">
          {role}
        </p>
        <div className="mx-auto mt-5 flex justify-center gap-3">
          {["ig", "f", "tk", "yt"].map((item) => (
            <span
              key={item}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4f6980] font-body text-[11px] font-bold uppercase text-white shadow-md shadow-[#4f6980]/20"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function SaveDateSection() {
  const countdownParts = useCountdown(eventDateTarget);

  return (
    <section id="date" className="page-section save-date-section relative overflow-hidden bg-[#4f6980] px-6 py-12 text-center text-white">
      <SectionFloralFrame />
      <CornerBucketSet />
      <div data-reveal="zoom" className="save-date-card relative z-10 mx-auto w-full max-w-sm px-5 py-10">
        <div className="relative z-10">
          <p data-reveal="up" className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-white/72">
            Menuju Hari Bahagia
          </p>
          <h2 data-reveal="name" className="mt-3 font-script text-[4.1rem] leading-none">
            Save The Date
          </h2>
          <LuxuryDivider />
          <p data-reveal="up" className="mx-auto mt-2 max-w-[16rem] font-display text-xl font-semibold leading-7 text-white/92">
            Minggu, 02 Agustus 2026
          </p>

          <div className="mt-8 grid grid-cols-4 gap-2">
            {countdownParts.map(([value, label]) => (
              <div
                data-reveal="up"
                key={label}
                className="save-count-tile rounded-xl px-2 py-3 font-body"
              >
                <p className="text-3xl font-bold leading-none">{value}</p>
                <p className="mt-1 text-[12px] font-semibold leading-none text-white/78">{label}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-reveal="up"
            onClick={downloadCalendarInvite}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white px-7 py-3 font-body text-sm font-bold uppercase tracking-[0.08em] text-[#4f6980] shadow-xl shadow-[#24384c]/18 transition hover:bg-[#f4f8f8]"
          >
            <CalendarDays size={17} aria-hidden="true" />
            Simpan di Kalender
          </button>
        </div>
      </div>
    </section>
  );
}

function EventSection() {
  return (
    <section id="event" className="page-section event-section side-floral-bg px-5 py-9">
      <SectionFloralFrame />
      <div className="relative z-10 mx-auto w-full max-w-sm">
        <h2 data-reveal="up" className="text-center font-display text-[2.3rem] uppercase tracking-[0.13em] text-white">
          Wedding Event
        </h2>
        <LuxuryDivider />
        <div className="mt-6 space-y-5">
      {events.map((event) => (
        <article
          data-reveal="up"
          key={event.title}
          className="event-card overflow-hidden rounded-2xl bg-[#fbfaf7] text-center shadow-2xl shadow-[#24384c]/25"
        >
          <div className="event-card-header relative bg-[#4f6980] px-5 pb-10 pt-8 text-white">
            <div className="event-card-flower event-card-flower-left">
              <Image
                src="/images/luxury-blue-java-corner-blue-lavender.png"
                alt=""
                fill
                className="object-contain"
                sizes="120px"
              />
            </div>
            <div className="event-card-flower event-card-flower-right">
              <Image
                src="/images/luxury-blue-java-corner-blue-lavender.png"
                alt=""
                fill
                className="object-contain"
                sizes="120px"
              />
            </div>
            <div className="relative z-10">
              <Heart className="mx-auto fill-white text-white" size={38} />
              <h3 data-reveal="name" className="mt-3 font-script text-[3.55rem] leading-none text-white">
                {event.title}
              </h3>
              <div className="event-card-divider mx-auto mt-4" />
            </div>
          </div>
          <div className="-mt-5 px-5 pb-6">
            <div className="relative z-10 rounded-2xl border border-[#d9dee0] bg-white px-5 py-5 shadow-xl shadow-[#30475d]/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#4f6980]/8 px-3 py-4 text-[#4f6980]">
                  <CalendarDays className="mx-auto" size={22} aria-hidden="true" />
                  <p className="mt-2 font-body text-[10px] font-semibold uppercase tracking-[0.16em]">
                    Tanggal
                  </p>
                  <p className="mt-1 font-display text-lg font-bold leading-5">
                    02 Agustus 2026
                  </p>
                </div>
                <div className="rounded-xl bg-[#4f6980]/8 px-3 py-4 text-[#4f6980]">
                  <MapPin className="mx-auto" size={22} aria-hidden="true" />
                  <p className="mt-2 font-body text-[10px] font-semibold uppercase tracking-[0.16em]">
                    Waktu
                  </p>
                  <p className="mt-1 font-display text-lg font-bold leading-5">
                    {event.time}
                  </p>
                </div>
              </div>
              <div className="mt-5 text-[#4f6980]">
                <p className="font-display text-2xl font-bold">
                  Gedung Serbaguna
                </p>
                {/* <p className="mt-1 font-display text-lg leading-6">
                  {eventLocation}
                </p> */}
              </div>
              <div data-reveal="zoom">
                <MapMock />
              </div>
            </div>
          </div>
        </article>
      ))}
        </div>
      </div>
    </section>
  );
}

function MapMock() {
  return (
    <div className="google-map-card relative mx-auto mt-7 h-64 overflow-hidden bg-[#d8e8ed] text-left shadow-inner ring-1 ring-[#4f6980]/20">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2155643745714!2d106.72406807541353!3d-6.235291461061298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f0a7ad998203%3A0x3cb147c30e60f997!2sJl.%20Inpres%20IV%2C%20RW.006%2C%20Kec.%20Larangan%2C%20Kota%20Tangerang%2C%20Banten%2015154!5e0!3m2!1sid!2sid!4v1780025794216!5m2!1sid!2sid"
        title="Lokasi acara pernikahan"
        className="google-map-iframe h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="google-map-search">
        <MapPin size={15} aria-hidden="true" />
        <span>Gedung Serbaguna</span>
      </div>
      <div className="google-map-controls" aria-hidden="true">
        <span>+</span>
        <span>-</span>
      </div>
      <div className="google-map-place">
        <span className="google-map-pin">
          <MapPin size={18} aria-hidden="true" />
        </span>
        <span>
          <strong>Gedung Serbaguna</strong>
          <small>{eventLocation}</small>
        </span>
      </div>
    </div>
  );
}

function LoveStorySection() {
  const story = stories[0];

  return (
    <section id="story" className="page-section love-story-section relative overflow-hidden px-5 py-10 text-white">
      <SectionFloralFrame />
      <CornerBucketSet />

      <div className="relative z-10">
        <p data-reveal="up" className="text-center font-body text-[10px] font-bold uppercase tracking-[0.34em] text-white/70">
          Chapter One
        </p>
        <h2 data-reveal="up" className="mt-2 text-center font-display text-[2.7rem] uppercase leading-none tracking-[0.12em]">
          Love Story
        </h2>
        <LuxuryDivider />

        <article data-reveal="up" className="love-story-card relative mt-7 overflow-hidden p-4 text-[#1f2730]">
          <div className="grid gap-4">
            <div className="love-story-photo relative mx-auto overflow-hidden bg-white">
              <Image
                src="/images/anggi-hamid.jpeg"
                alt={story.title}
                fill
                className="object-contain object-top"
                sizes="280px"
              />
            </div>

            <div className="relative px-2 pb-2 text-center">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#4f6980]/10 px-4 py-2 text-[#4f6980]">
                <CalendarDays size={15} aria-hidden="true" />
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.18em]">
                  {story.date}
                </span>
              </div>
              <h3 data-reveal="name" className="mt-4 font-script text-[3.5rem] leading-none text-[#3f5f77]">
                {story.title}
              </h3>
              <div className="mx-auto my-4 h-px w-40 bg-[#4f6980]/35" />
              <TypewriterParagraph
                text={story.body}
                className="mx-auto max-w-[18rem] text-left font-display text-[1.08rem] font-semibold leading-7 text-[#1f2730]/82"
                speed={40}
                startDelay={250}
              />
            </div>
          </div>
        </article>

        <div data-reveal="zoom" className="love-story-strip mt-4 grid grid-cols-2 gap-3">
          <div className="relative h-28 overflow-hidden rounded-t-full rounded-b-xl border-2 border-white/75">
            <Image
              src="/images/anggi-hamid2.jpeg"
              alt="Momen bersama Anggi dan Hamid"
              fill
              className="object-contain object-top"
              sizes="160px"
            />
          </div>
          <div className="flex items-center justify-center rounded-xl border border-white/35 bg-white/12 px-4 text-center backdrop-blur">
            <p className="font-display text-xl italic leading-7 text-white">
              Kisah kecil yang tumbuh menjadi janji sehidup semati.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const galleryItems = [
    { src: "/images/art-blue-java-story.jpg", alt: "Foto prewedding pasangan" },
    { src: "/images/art-blue-java-couple.png", alt: "Foto pasangan bersama" },
    { src: "/images/couple-hero.png", alt: "Potret pasangan" },
    { src: "/images/22.png", alt: "Momen galeri pasangan" }
  ];

  return (
    <section id="gallery" className="page-section gallery-section relative overflow-hidden px-5 py-10 text-white">
      <SectionFloralFrame />
      <CornerBucketSet />

      <div className="relative z-10">
        <p data-reveal="up" className="text-center font-body text-[10px] font-bold uppercase tracking-[0.34em] text-white/70">
          Our Memories
        </p>
        <h2 data-reveal="up" className="mt-2 text-center font-display text-[2.65rem] uppercase leading-none tracking-[0.12em]">
          Gallery
        </h2>
        <LuxuryDivider />

        <div className="gallery-board mt-7 p-3">
          <div data-reveal="zoom" className="gallery-hero relative overflow-hidden">
            <Image
              src="/images/art-blue-java-gallery.png"
              alt="Galeri pernikahan"
              fill
              className="object-cover"
              sizes="380px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f2730]/70 to-transparent px-4 pb-4 pt-16 text-left">
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
                Anggi & Hamid
              </p>
              {/* <p className="mt-1 font-display text-2xl italic text-white">
                Cerita indah yang kami abadikan
              </p> */}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {galleryItems.map((item, index) => (
              <div
                data-reveal="up"
                key={item.src}
                className={`gallery-tile relative overflow-hidden ${
                  index === 1 ? "translate-y-5" : ""
                } ${index === 2 ? "-translate-y-2" : ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="90px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftSection({
  guestName,
  giftExportSecret
}: {
  guestName: string;
  giftExportSecret: string;
}) {
  const [giftProofFile, setGiftProofFile] = useState<File | null>(null);
  const [giftProofFileName, setGiftProofFileName] = useState("");
  const [giftSenderName, setGiftSenderName] = useState(
    guestName && guestName !== "Tamu Undangan" ? guestName : ""
  );
  const [giftAmount, setGiftAmount] = useState("");
  const [giftUploadStatus, setGiftUploadStatus] = useState("");
  const [isGiftUploading, setIsGiftUploading] = useState(false);
  const [isGiftFailureOpen, setIsGiftFailureOpen] = useState(false);
  const [isGiftSuccessOpen, setIsGiftSuccessOpen] = useState(false);
  const [isGiftUploadComplete, setIsGiftUploadComplete] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState("");
  const [giftTransferHistory, setGiftTransferHistory] = useState<GiftTransferExport[]>([]);
  const [giftExportStatus, setGiftExportStatus] = useState("");
  const [isGiftExportLoading, setIsGiftExportLoading] = useState(false);
  const giftProofInputRef = useRef<HTMLInputElement | null>(null);
  const isGiftExportMode = giftExportSecret === giftExportSecretValue;
  const hasGuestParameter = guestName !== "Tamu Undangan";
  const giftTransferTotal = giftTransferHistory.reduce(
    (total, transfer) => total + transfer.amount,
    0
  );

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);

  const formatTransferDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(date));

  const escapeExportHtml = (value: string | number | null | undefined) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const normalizeExportName = (name?: string | null) =>
    (name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const normalizeRsvpStatus = (
    status?: string | null
  ): GiftTransferExport["rsvp_status"] => {
    if (status === "Hadir" || status === "Tidak Hadir" || status === "Masih Ragu") {
      return status;
    }

    return "Tidak Jawab";
  };

  useEffect(() => {
    if (hasGuestParameter) {
      setGiftSenderName(guestName);
    }
  }, [guestName, hasGuestParameter]);

  const copyText = async (text: string, accountId: string) => {
    await navigator.clipboard?.writeText(text);
    setCopiedAccount(accountId);
    window.setTimeout(() => {
      setCopiedAccount((currentAccount) =>
        currentAccount === accountId ? "" : currentAccount
      );
    }, 5000);
  };

  const getGiftProofObjectUrl = (transfer: GiftTransferExport) => {
    const encodedPath = transfer.proof_path
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");

    return `${supabaseUrl}/storage/v1/object/${transfer.proof_bucket}/${encodedPath}`;
  };

  const getGiftProofDataUrl = async (transfer: GiftTransferExport) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return "";
    }

    try {
      const response = await fetch(getGiftProofObjectUrl(transfer), {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      });

      if (!response.ok) {
        return "";
      }

      const blob = await response.blob();

      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  };

  const getGiftProofSignedUrl = async (transfer: GiftTransferExport) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return "";
    }

    try {
      const encodedPath = transfer.proof_path
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/sign/${transfer.proof_bucket}/${encodedPath}`,
        {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 7 })
        }
      );

      if (!response.ok) {
        return "";
      }

      const data = (await response.json()) as {
        signedURL?: string;
        signedUrl?: string;
      };
      const signedPath = data.signedURL || data.signedUrl || "";

      if (!signedPath) {
        return "";
      }

      if (signedPath.startsWith("http")) {
        return signedPath;
      }

      if (signedPath.startsWith("/storage/v1/")) {
        return `${supabaseUrl}${signedPath}`;
      }

      const normalizedPath = signedPath.startsWith("/")
        ? signedPath
        : `/${signedPath}`;

      return `${supabaseUrl}/storage/v1${normalizedPath}`;
    } catch {
      return "";
    }
  };

  const loadGiftTransferHistory = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setGiftExportStatus("Supabase belum tersedia.");
      return;
    }

    setIsGiftExportLoading(true);
    setGiftExportStatus("Memuat history transfer...");

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/export_gift_transfers`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ export_secret: giftExportSecret })
      });

      if (!response.ok) {
        throw new Error("Gift transfer export failed");
      }

      const rows = (await response.json()) as GiftTransferExport[];
      const rsvpResponse = await fetch(
        `${supabaseUrl}/rest/v1/rsvp_messages?select=name,status,created_at&order=created_at.desc&limit=1000`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`
          }
        }
      );
      const rsvpRows = rsvpResponse.ok
        ? ((await rsvpResponse.json()) as Pick<GuestMessage, "name" | "status" | "created_at">[])
        : [];
      const rsvpStatusByName = new Map<string, string>();

      rsvpRows.forEach((message) => {
        const key = normalizeExportName(message.name);

        if (key && !rsvpStatusByName.has(key)) {
          rsvpStatusByName.set(key, message.status);
        }
      });

      const rowsWithImages = await Promise.all(
        rows.map(async (transfer) => {
          const guestNameForMatch =
            normalizeExportName(transfer.guest_name) === "tamu undangan"
              ? ""
              : transfer.guest_name;
          const matchedStatus =
            rsvpStatusByName.get(normalizeExportName(guestNameForMatch)) ||
            rsvpStatusByName.get(normalizeExportName(transfer.sender_name)) ||
            transfer.rsvp_status;

          return {
            ...transfer,
            rsvp_status: normalizeRsvpStatus(matchedStatus),
            proof_data_url: await getGiftProofDataUrl(transfer),
            proof_signed_url: await getGiftProofSignedUrl(transfer)
          };
        })
      );

      setGiftTransferHistory(rowsWithImages);
      setGiftExportStatus(
        rowsWithImages.length
          ? `Berhasil memuat ${rowsWithImages.length} transfer.`
          : "Belum ada history transfer."
      );
    } catch {
      setGiftTransferHistory([]);
      setGiftExportStatus("Gagal memuat history transfer. Pastikan SQL Supabase sudah dijalankan.");
    } finally {
      setIsGiftExportLoading(false);
    }
  };

  useEffect(() => {
    if (isGiftExportMode) {
      loadGiftTransferHistory();
    }
  }, [isGiftExportMode, giftExportSecret]);

  const buildGiftTransferReportHtml = (exportType: "pdf" | "excel") => {
    const rsvpGroups: GiftTransferExport["rsvp_status"][] = [
      "Hadir",
      "Tidak Hadir",
      "Masih Ragu",
      "Tidak Jawab"
    ];
    const sections = rsvpGroups
      .map((status) => {
        const transfers = giftTransferHistory.filter(
          (transfer) => transfer.rsvp_status === status
        );
        const groupTotal = transfers.reduce(
          (total, transfer) => total + transfer.amount,
          0
        );
        const rows = transfers.length
          ? transfers
              .map((transfer, index) => {
                const imageUrl = transfer.proof_signed_url || "";

                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${escapeExportHtml(formatTransferDate(transfer.created_at))}</td>
                    <td>${escapeExportHtml(transfer.sender_name)}</td>
                    <td>${escapeExportHtml(transfer.guest_name || "-")}</td>
                    <td>${escapeExportHtml(formatRupiah(transfer.amount))}</td>
                    <td class="proof-cell">
                      <div class="proof-file-name">${escapeExportHtml(transfer.proof_file_name)}</div>
                      ${
                        imageUrl
                          ? `<a class="proof-link" href="${imageUrl}">${escapeExportHtml(imageUrl)}</a>`
                          : `<div class="proof-empty">Link gambar tidak tersedia</div>`
                      }
                    </td>
                  </tr>
                `;
              })
              .join("")
          : `
              <tr>
                <td colspan="6" class="empty-group">Belum ada transfer pada grup ini.</td>
              </tr>
            `;

        return `
          <h2>${escapeExportHtml(status)}</h2>
          <div class="group-summary">
            <span>Jumlah Transfer: ${transfers.length}</span>
            <span>Total: ${escapeExportHtml(formatRupiah(groupTotal))}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Pengirim</th>
                <th>Nama Tamu</th>
                <th>Nominal</th>
                <th>File / Bukti Transfer</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `;
      })
      .join("");

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>History Transfer Wedding Gift</title>
          <style>
            body { font-family: Arial, sans-serif; color: #263341; margin: 24px; }
            h1 { margin: 0 0 8px; font-size: 24px; }
            h2 { margin: 24px 0 8px; color: #3f5f77; font-size: 18px; }
            p { margin: 0 0 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 18px; }
            th, td { border: 1px solid #b9c8d2; padding: 8px; vertical-align: top; }
            th { background: #4f6980; color: #fff; }
            .summary { display: flex; gap: 18px; margin: 18px 0; font-weight: 700; }
            .group-summary { display: flex; gap: 14px; margin: 0 0 8px; font-size: 12px; font-weight: 700; }
            .proof-cell { min-width: 170px; }
            .proof-file-name { font-size: 11px; font-weight: 700; color: #3f5f77; word-break: break-word; }
            .proof-empty { color: #994a43; font-size: 11px; margin-top: 6px; }
            .proof-link { display: block; margin-top: 6px; font-size: 11px; color: #0052a2; word-break: break-all; }
            .empty-group { color: #6f7f88; font-style: italic; text-align: center; }
            @media print { body { margin: 12mm; } }
          </style>
        </head>
        <body>
          <h1>History Transfer Wedding Gift</h1>
          <p>Anggi & Hamid</p>
          <div class="summary">
            <span>Total Transfer: ${giftTransferHistory.length}</span>
            <span>Total Nominal: ${escapeExportHtml(formatRupiah(giftTransferTotal))}</span>
          </div>
          ${sections}
        </body>
      </html>
    `;
  };

  const exportGiftTransfersPdf = () => {
    if (!giftTransferHistory.length) {
      setGiftExportStatus("Tidak ada data untuk diexport.");
      return;
    }

    const html = buildGiftTransferReportHtml("pdf").replace(
      "</body>",
      `<script>
        window.addEventListener("load", function () {
          window.setTimeout(function () {
            window.focus();
            window.print();
          }, 700);
        });
      </script></body>`
    );
    const file = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const printWindow = window.open(url, "_blank", "width=1100,height=800");

    if (!printWindow) {
      URL.revokeObjectURL(url);
      setGiftExportStatus("Popup browser diblokir. Izinkan popup untuk export PDF.");
      return;
    }

    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  const exportGiftTransfersExcel = () => {
    if (!giftTransferHistory.length) {
      setGiftExportStatus("Tidak ada data untuk diexport.");
      return;
    }

    const html = buildGiftTransferReportHtml("excel");
    const file = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "history-transfer-wedding-gift.xls";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const buildWhatsappLink = (phone: string, recipientName: string) => {
    const senderName = giftSenderName.trim() || (guestName && guestName !== "Tamu Undangan" ? guestName : "Tamu Undangan");
    const amountText = giftAmount ? `Nominal: Rp ${giftAmount}` : "";
    const message = [
      `Assalamualaikum ${recipientName}, saya ${senderName} ingin mengirim bukti transfer wedding gift untuk kalian.`,
      amountText,
      "Terima kasih."
    ]
      .filter(Boolean)
      .join("\n");

    const target = phone ? phone.replace(/\D/g, "") : "";
    return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
  };

  const showGiftUploadFailure = (message: string) => {
    setGiftUploadStatus(message);
    setIsGiftFailureOpen(true);
  };

  const clearGiftProofSelection = () => {
    setGiftProofFile(null);
    setGiftProofFileName("");

    if (giftProofInputRef.current) {
      giftProofInputRef.current.value = "";
    }
  };

  const handleSendAnotherGiftProof = () => {
    clearGiftProofSelection();
    setGiftUploadStatus("");
    setIsGiftUploadComplete(false);
    setIsGiftSuccessOpen(false);
  };

  const handleGiftAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setGiftAmount("");
      return;
    }

    setGiftAmount(new Intl.NumberFormat("id-ID").format(Number(digits)));
  };

  const handleGiftProofSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setGiftProofFileName(file.name);
    setGiftProofFile(null);
    setGiftUploadStatus("");
    setIsGiftFailureOpen(false);

    if (!file.type.startsWith("image/")) {
      showGiftUploadFailure("File harus berupa gambar bukti transfer.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showGiftUploadFailure("Ukuran gambar maksimal 5MB.");
      event.target.value = "";
      return;
    }

    setGiftProofFile(file);
    setGiftUploadStatus("Bukti transfer siap dikirim.");
  };

  const handleGiftProofSend = async () => {
    const cleanSenderName = giftSenderName.trim();
    const cleanAmount = giftAmount.replace(/\D/g, "");

    if (!cleanSenderName) {
      setGiftUploadStatus("Nama pengirim wajib diisi.");
      return;
    }

    if (!cleanAmount) {
      setGiftUploadStatus("Nominal rupiah wajib diisi.");
      return;
    }

    if (!giftProofFile) {
      setGiftUploadStatus("Pilih foto bukti transfer terlebih dahulu.");
      return;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      showGiftUploadFailure("Upload belum tersedia. Silakan kirim bukti transfer melalui WhatsApp.");
      clearGiftProofSelection();
      return;
    }

    setIsGiftUploading(true);
    setGiftUploadStatus("Mengirim bukti transfer...");

    try {
      const safeFileName = giftProofFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const safeSenderName = cleanSenderName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const filePath = `transfer-${Date.now()}-${safeSenderName}-rp${cleanAmount}-${safeFileName}`;
      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/${giftProofBucket}/${filePath}`,
        {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": giftProofFile.type,
            "x-upsert": "false"
          },
          body: giftProofFile
        }
      );

      if (!response.ok) {
        throw new Error("Gift proof upload failed");
      }

      const metadataResponse = await fetch(`${supabaseUrl}/rest/v1/gift_transfers`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          sender_name: cleanSenderName,
          amount: Number(cleanAmount),
          proof_bucket: giftProofBucket,
          proof_path: filePath,
          proof_file_name: giftProofFile.name,
          proof_mime_type: giftProofFile.type,
          guest_name: hasGuestParameter ? guestName : cleanSenderName
        })
      });

      if (!metadataResponse.ok) {
        throw new Error("Gift transfer metadata failed");
      }

      setGiftUploadStatus("Bukti transfer berhasil dikirim.");
      clearGiftProofSelection();
      setIsGiftUploadComplete(true);
      setIsGiftSuccessOpen(true);
    } catch {
      clearGiftProofSelection();
      showGiftUploadFailure("Upload bukti transfer gagal. Silahkan Kirim ulang atau kirim lewat WhatsApp agar tetap bisa kami cek.");
    } finally {
      setIsGiftUploading(false);
    }
  };

  return (
    <>
      <section id="gift" className="page-section gift-section relative overflow-hidden px-5 py-10 text-white">
        <SectionFloralFrame />
        <CornerBucketSet />

        <div className="relative z-10 mx-auto w-full max-w-sm">
          <p data-reveal="up" className="text-center font-body text-[10px] font-bold uppercase tracking-[0.34em] text-white/70">
            Tanda Kasih
          </p>
          <h2 data-reveal="up" className="mt-2 text-center font-display text-[2.55rem] uppercase leading-none tracking-[0.12em]">
            Wedding Gift
          </h2>
          <LuxuryDivider />
          <p data-reveal="up" className="mx-auto mt-3 max-w-[18rem] text-center font-display text-xl italic leading-7 text-white/90">
            Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin
            berbagi tanda kasih, dapat melalui rekening berikut.
          </p>

       

        <div className="mt-4 space-y-4">
          {bankAccounts.map((account) => (
            <article data-reveal="up" key={account.plainNumber} className="space-y-3">
              <div className="bca-card relative overflow-hidden p-5 text-left text-white">
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-bold italic leading-none">
                      Paspor
                    </p>
                    <p className="mt-1 font-body text-[11px] font-black lowercase tracking-[0.08em] text-white/92">
                      debit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-[2rem] font-black italic leading-none tracking-[-0.02em] text-white">
                      {account.bank}
                    </p>
                    <p className="mt-1 font-body text-[8px] font-bold uppercase tracking-[0.14em] text-white/78">
                      Wedding Gift
                    </p>
                  </div>
                </div>

                <div className="bank-chip bca-chip relative z-10 mt-8" />
                <div className="bank-card-number-row relative z-10 mt-5">
                  <p className="font-body text-[1.35rem] font-black tracking-[0.13em] text-white bank-card-number">
                    {account.number}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(account.plainNumber, account.plainNumber)}
                    className={`bank-card-copy ${copiedAccount === account.plainNumber ? "bank-card-copy-success" : ""}`}
                    aria-label={`Salin nomor rekening ${account.bank}`}
                  >
                    {copiedAccount === account.plainNumber ? (
                      <CheckCircle2 size={17} aria-hidden="true" />
                    ) : (
                      <Copy size={17} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div className="relative z-10 mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-body text-[8px] font-bold uppercase tracking-[0.2em] text-white/72">
                      A/n.
                    </p>
                    <p className="mt-1 font-body text-[0.78rem] font-black uppercase tracking-[0.12em] text-white">
                      {account.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-[7px] font-bold uppercase leading-3 tracking-[0.16em] text-white/72">
                      Valid
                      <br />
                      Thru
                    </p>
                    <p className="font-body text-[0.86rem] font-black tracking-[0.12em] text-white">
                      08/26
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
         <div data-reveal="zoom" className="gift-envelope mt-6 px-5 py-6 text-center">
          <Gift className="mx-auto text-[#4f6980]" size={38} aria-hidden="true" />
          <p className="mt-4 font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#4f6980]/70">
            Cashless Gift
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-[#3f5f77]">
            {isGiftExportMode
              ? "Export History Transfer"
              : isGiftUploadComplete
              ? "Terima kasih atas kebaikan dan dukunganya"
              : "Dukungan anda merupakan do'a dan kebahagiaan bagi kami. Silahkan kirim bukti transfer anda yuk"}
          </p>
          {isGiftExportMode ? (
            <div className="gift-export-box mt-5">
              <div className="gift-export-summary">
                <span>Total Transfer</span>
                <strong>{giftTransferHistory.length}</strong>
              </div>
              <div className="gift-export-summary">
                <span>Total Nominal</span>
                <strong>{formatRupiah(giftTransferTotal)}</strong>
              </div>
              <p className="gift-export-status">
                {giftExportStatus || "History transfer siap diexport."}
              </p>
              <div className="gift-export-actions">
                <button
                  type="button"
                  className="gift-proof-send"
                  onClick={exportGiftTransfersPdf}
                  disabled={isGiftExportLoading || !giftTransferHistory.length}
                >
                  <FileText size={16} aria-hidden="true" />
                  <span>Export PDF</span>
                </button>
                <button
                  type="button"
                  className="gift-proof-send"
                  onClick={exportGiftTransfersExcel}
                  disabled={isGiftExportLoading || !giftTransferHistory.length}
                >
                  <Table2 size={16} aria-hidden="true" />
                  <span>Export Excel</span>
                </button>
              </div>
              <button
                type="button"
                className="gift-export-refresh"
                onClick={loadGiftTransferHistory}
                disabled={isGiftExportLoading}
              >
                {isGiftExportLoading ? "Memuat..." : "Refresh History"}
              </button>
            </div>
          ) : isGiftUploadComplete ? (
            <div className="gift-proof-thanks mt-5">
              <CheckCircle2 size={24} aria-hidden="true" />
              <p>Bukti transfer berhasil dikirim.</p>
              <button
                type="button"
                className="gift-proof-send gift-proof-send-again"
                onClick={handleSendAnotherGiftProof}
              >
                <Upload size={16} aria-hidden="true" />
                <span>Kirim Bukti Lagi</span>
              </button>
            </div>
          ) : (
            <div className="gift-proof-box mt-5 text-left">
              <div className="gift-proof-fields">
                <label className="gift-proof-field">
                  <span>Nama Pengirim</span>
                  <input
                    type="text"
                    value={giftSenderName}
                    onChange={(event) => setGiftSenderName(event.target.value)}
                    readOnly={hasGuestParameter}
                    aria-readonly={hasGuestParameter}
                    placeholder="Nama Anda"
                    className={hasGuestParameter ? "gift-proof-field-readonly" : ""}
                    disabled={isGiftUploading}
                  />
                </label>
                <label className="gift-proof-field">
                  <span>Nominal Rupiah</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={giftAmount}
                    onChange={(event) => handleGiftAmountChange(event.target.value)}
                    placeholder="50.000"
                    disabled={isGiftUploading}
                  />
                </label>
              </div>
              <label className="gift-proof-upload" htmlFor="gift-proof-upload">
                <span className="gift-proof-icon">
                  <Upload size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-body text-[10px] font-black uppercase tracking-[0.18em] text-[#4f6980]/68">
                    Upload Bukti Transfer
                  </span>
                  <span className="mt-1 block font-body text-sm font-bold leading-5 text-[#3f5f77]">
                    {giftProofFileName || "Pilih foto / screenshot transfer"}
                  </span>
                </span>
                <input
                  id="gift-proof-upload"
                  ref={giftProofInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleGiftProofSelect}
                  disabled={isGiftUploading}
                />
              </label>
              <p className="mt-3 text-center font-body text-[11px] font-semibold leading-5 text-[#4f6980]/72">
                {giftUploadStatus || "Format gambar JPG/PNG, maksimal 5MB."}
              </p>
              <button
                type="button"
                className="gift-proof-send"
                onClick={handleGiftProofSend}
                disabled={isGiftUploading || !giftProofFile}
              >
                {isGiftUploading ? (
                  <span className="gift-loading-dot" aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                <span>{isGiftUploading ? "Mengirim..." : "Kirim Bukti"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      </section>

      {isGiftFailureOpen ? (
        <div className="gift-upload-modal" role="dialog" aria-modal="true" aria-labelledby="gift-upload-failed-title">
          <div className="gift-upload-modal-card">
            <button
              type="button"
              className="gift-upload-close"
              onClick={() => setIsGiftFailureOpen(false)}
              aria-label="Tutup popup upload gagal"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="gift-upload-alert">
              <AlertTriangle size={24} aria-hidden="true" />
            </div>
            <h3 id="gift-upload-failed-title" className="gift-upload-kicker">
              Upload Gagal
            </h3>
            <p className="gift-upload-title">
              Kirim bukti transfer lewat WhatsApp
            </p>
            <p className="gift-upload-copy">
              {giftUploadStatus}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {whatsappContacts.map((contact) => (
                <a
                  key={contact.label}
                  href={buildWhatsappLink(contact.phone, contact.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="gift-wa-button"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>{contact.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isGiftSuccessOpen ? (
        <div className="gift-upload-modal" role="dialog" aria-modal="true" aria-labelledby="gift-upload-success-title">
          <div className="gift-upload-modal-card gift-upload-modal-card-success">
            <button
              type="button"
              className="gift-upload-close"
              onClick={() => setIsGiftSuccessOpen(false)}
              aria-label="Tutup popup upload berhasil"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="gift-upload-alert gift-upload-success-alert">
              <CheckCircle2 size={25} aria-hidden="true" />
            </div>
            <h3 id="gift-upload-success-title" className="gift-upload-kicker">
              Bukti Terkirim
            </h3>
            <p className="gift-upload-title">
              Terima kasih atas kebaikan dan dukunganya
            </p>
            <p className="gift-upload-copy">
              Bukti transfer berhasil kami terima.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function RsvpSection({ guestName }: { guestName: string }) {
  const [messages, setMessages] = useState<GuestMessage[]>(guestMessages);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSupabaseReady = Boolean(supabaseUrl && supabaseAnonKey);
  const hasGuestParameter = guestName !== "Tamu Undangan";

  useEffect(() => {
    if (hasGuestParameter) {
      setName(guestName);
    }
  }, [guestName, hasGuestParameter]);

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    const loadMessages = async () => {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/rsvp_messages?select=id,name,status,message,created_at&order=created_at.desc&limit=30`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Gagal memuat ucapan");
        }

        const data = (await response.json()) as GuestMessage[];
        setMessages(data.length ? data : guestMessages);
      } catch {
        setMessages(guestMessages);
      }
    };

    loadMessages();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      message: message.trim(),
      status
    };

    if (!payload.name || !payload.message || !payload.status) {
      setFormStatus("Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran.");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("");

    try {
      if (supabaseUrl && supabaseAnonKey) {
        const response = await fetch(`${supabaseUrl}/rest/v1/rsvp_messages`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Gagal menyimpan ucapan");
        }

        const [savedMessage] = (await response.json()) as GuestMessage[];
        setMessages((current) => [savedMessage, ...current]);
      } else {
        setMessages((current) => [
          { ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() },
          ...current
        ]);
      }

      setName(hasGuestParameter ? guestName : "");
      setMessage("");
      setStatus("");
      setFormStatus(
        isSupabaseReady
          ? "Terima kasih, ucapan Anda sudah tersimpan."
          : "Preview lokal: isi env Supabase agar ucapan tersimpan permanen."
      );
    } catch {
      setFormStatus("Maaf, ucapan belum terkirim. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="page-section rsvp-section relative overflow-hidden bg-[#4f6980] px-5 py-10 text-center text-white">
      <SectionFloralFrame />
      <CornerBucketSet />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-sm flex-col justify-center">
        <p data-reveal="up" className="font-body text-[10px] font-bold uppercase tracking-[0.34em] text-white/70">
          Buku Tamu
        </p>
        <h2 data-reveal="up" className="mt-2 font-display text-[2.45rem] uppercase leading-tight tracking-[0.13em]">
          RSVP & Ucapan
        </h2>
        <LuxuryDivider />
        <p data-reveal="up" className="mx-auto mt-3 max-w-[18rem] font-display text-xl italic leading-7 text-white/92">
          Sampaikan doa dan ucapan terbaik Anda
        </p>
        <form
          data-reveal="up"
          onSubmit={handleSubmit}
          className="rsvp-card mt-6 overflow-hidden text-left text-[#1f2730]"
        >
          <div className="rsvp-card-header px-5 py-5 text-center">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#4f6980]/70">
              Konfirmasi Kehadiran
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-[#3f5f77]">
              {messages.length} Ucapan
            </p>
          </div>
          <div className="space-y-4 p-5">
            <input
              value={name}
              onChange={(event) => {
                if (!hasGuestParameter) {
                  setName(event.target.value);
                }
              }}
              readOnly={hasGuestParameter}
              aria-readonly={hasGuestParameter}
              className={`rsvp-field ${hasGuestParameter ? "rsvp-field-readonly" : ""}`}
              placeholder={hasGuestParameter ? guestName : "Nama Anda"}
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="rsvp-field min-h-24 resize-none"
              placeholder="Tulis ucapan dan doa terbaik"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rsvp-field text-[#4f5660]"
            >
              <option value="">Konfirmasi Kehadiran</option>
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>
            <button
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#4f6980] px-8 py-4 font-body text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#4f6980]/22 transition hover:bg-[#34495b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
            </button>
            {formStatus ? (
              <p className="text-center font-body text-xs font-semibold leading-5 text-[#4f6980]">
                {formStatus}
              </p>
            ) : null}
          </div>
        </form>
        <ChatList messages={messages} />
        <WeddingFooter />
      </div>
    </section>
  );
}

function ChatList({ messages }: { messages: GuestMessage[] }) {
  return (
    <div data-reveal="up" className="guest-chat mt-5 p-3 text-left">
      <div className="mb-3 flex items-center justify-between px-1 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} aria-hidden="true" />
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em]">
            Ucapan Tamu
          </p>
        </div>
        <span className="rounded-full bg-white/18 px-2 py-1 font-body text-[10px]">
          {messages.length}
        </span>
      </div>
      <div className="max-h-44 space-y-3 overflow-y-auto pr-1">
        {messages.map((item, index) => (
          <article key={item.id ?? `${item.name}-${index}`} className="guest-bubble px-4 py-3 text-[#1f2730]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-body text-sm font-bold text-[#3f5f77]">
                {item.name}
              </h3>
              <span className="shrink-0 rounded-full bg-[#4f6980]/10 px-2 py-1 font-body text-[10px] font-bold uppercase tracking-[0.08em] text-[#4f6980]">
                {item.status}
              </span>
            </div>
            <p className="mt-2 font-display text-[1.02rem] font-semibold italic leading-6 text-[#1f2730]/78">
              {item.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function WeddingFooter() {
  return (
    <footer data-reveal="up" className="wedding-footer mt-5 text-center">
      <p className="font-script text-[2.15rem] leading-none text-white">
        Anggi & Hamid
      </p>
      <p className="mt-2 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-white/72">
        Terima kasih atas doa dan restunya
      </p>
      <div className="mx-auto my-3 h-px w-28 bg-white/20" />
      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
        Created by Malik Fajar
      </p>
      <a
        href="https://www.instagram.com/malixxfjr"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 font-body text-[8px] font-bold uppercase tracking-[0.1em] text-white/70 transition hover:bg-white/18"
      >
        <Instagram size={11} aria-hidden="true" />
        malixxfjr
      </a>
    </footer>
  );
}

function FamilySection() {
  const invitedFamilies = [
    "Kel. Besar Bpk. Drs. H. John Sudjupno",
    "Kel. Besar Bpk. (Alm) Roni Taufik",
    "Kepala sekolah dan dewan guru TK Islam Permata Hati",
    "Kel. Besar Bpk. Ujid Juhari",
    "Kel. Besar Bpk. Sarwan (Alm)",
    "Kel. Besar Pon Pes Jam'iyatul Mubtadi Tsani 2",
    "Kel. Besar Majlis Ta'lim Darussalam",
    "Team Hadroh Masjid Darussalam",
    "Team Work Garasi Motor",
    "Team PB +62 Big Wood"
  ];

  return (
    <section id="family" className="page-section side-floral-bg">
      <SectionFloralFrame />
      {/* <div className="relative h-28 overflow-hidden">
        <Image
          src="/images/luxury-blue-java-garland-blue-lavender.png"
          alt=""
          fill
          className="object-cover object-bottom opacity-95"
          sizes="430px"
        />
      </div> */}
      <div className="family-section-panel bg-[#4f6980] px-6 py-12 text-center text-white">
        <p data-reveal="up" className="font-body text-[10px] font-bold uppercase tracking-[0.34em] text-white/70">
          Keluarga Besar
        </p>
        <h2 data-reveal="name" className="mt-2 font-display text-[2.45rem] uppercase leading-none tracking-[0.12em]">
          Restu Keluarga
        </h2>
        <LuxuryDivider />

        <div className="mt-7 grid gap-4">
          <article data-reveal="up" className="family-parent-card family-parent-card-groom">
            <div className="family-card-ornament" aria-hidden="true" />
            <p className="family-card-label">Keluarga Besar</p>
            <h3 className="family-card-title">Mempelai Pria</h3>
            <div className="family-card-line" />
            <p className="family-card-parents">
              Bpk. Ujid Juhari
              <span>&</span>
              Ibu Ekoh
            </p>
          </article>

          <article data-reveal="up" className="family-parent-card">
            <div className="family-card-ornament" aria-hidden="true" />
            <p className="family-card-label">Keluarga Besar</p>
            <h3 className="family-card-title">Mempelai Wanita</h3>
            <div className="family-card-line" />
            <p className="family-card-parents">
              Bpk. Roni Taufik (Alm)
              <span>&</span>
              Ibu Warini
            </p>
          </article>
        </div>

        <div className="mx-auto my-9 h-px w-52 bg-white/75" />
        <p data-reveal="up" className="font-display text-xl italic">Turut Mengundang:</p>
        <ul data-reveal="up" className="mx-auto mt-5 max-w-[21rem] space-y-2 text-left font-display text-lg italic leading-6">
          {invitedFamilies.map((family) => (
            <li key={family} className="flex gap-2">
              <span className="mt-[0.48rem] h-1.5 w-1.5 shrink-0 rounded-full bg-white/82" />
              <span>{family}</span>
            </li>
          ))}
        </ul>
        <p data-reveal="up" className="mt-6 font-display text-xl italic leading-7">
          Dan seluruh keluarga lainnya.
        </p>
      </div>
    </section>
  );
}

function LuxuryDivider({ tone = "light" }: { tone?: "light" | "blue" }) {
  return (
    <div
      data-reveal="zoom"
      className={`relative mx-auto mt-4 h-12 w-44 opacity-85 ${
        tone === "blue" ? "mix-blend-multiply" : ""
      }`}
    >
      <Image
        src="/images/luxury-blue-java-divider-blue-lavender.png"
        alt=""
        fill
        className="object-contain"
        sizes="176px"
      />
    </div>
  );
}

function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.volume = 0.42;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    playMusic();

    const playAfterInteraction = () => {
      playMusic();
      window.removeEventListener("pointerdown", playAfterInteraction);
      window.removeEventListener("keydown", playAfterInteraction);
      window.removeEventListener("touchstart", playAfterInteraction);
    };

    window.addEventListener("pointerdown", playAfterInteraction);
    window.addEventListener("keydown", playAfterInteraction);
    window.addEventListener("touchstart", playAfterInteraction);

    return () => {
      window.removeEventListener("pointerdown", playAfterInteraction);
      window.removeEventListener("keydown", playAfterInteraction);
      window.removeEventListener("touchstart", playAfterInteraction);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await playMusic();
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/nuca-cut.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={toggleMusic}
        className={`floating-control fixed bottom-24 right-[calc(50%-205px)] z-30 ${
          isPlaying ? "floating-control-active" : ""
        }`}
        aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
        title={isPlaying ? "Jeda musik" : "Putar musik"}
      >
        <Music2 size={20} aria-hidden="true" />
      </button>
    </>
  );
}

function BottomNav({
  activeSection,
  onSelect
}: {
  activeSection: string;
  onSelect: (sectionId: string) => void;
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSelect = (sectionId: string) => {
    onSelect(sectionId);
    setIsNavOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsNavOpen((current) => !current)}
        className="floating-control fixed bottom-10 right-[calc(50%-205px)] z-50"
        aria-label={isNavOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={isNavOpen}
        title={isNavOpen ? "Tutup menu" : "Buka menu"}
      >
        {isNavOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      <nav
        className={`fixed bottom-10 z-40 rounded-2xl border border-white/18 bg-[#4f6980]/78 p-2 shadow-2xl shadow-black/18 backdrop-blur-md transition-all duration-500 ease-out ${
          isNavOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[115%] opacity-0"
        }`}
        style={{
          left: "max(0.75rem, calc(50% - 205px))",
          width: "min(calc(100vw - 5rem), 348px)"
        }}
      >
        <div className="grid grid-cols-8 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`flex h-11 items-center justify-center rounded-xl transition ${
                  isActive
                    ? "bg-white/90 text-[#4f6980]"
                    : "bg-white/8 text-white/86 hover:bg-white/16"
                }`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={17} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
