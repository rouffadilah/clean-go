"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Armchair,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Home,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Boxes,
  ChefHat,
} from "lucide-react";
import { cleaningServices, formatRupiah, type CleaningService } from "@/lib/services";
import { supabase } from "@/lib/supabase";

const iconMap = {
  home: Home,
  sparkles: Sparkles,
  building: Building2,
  armchair: Armchair,
  boxes: Boxes,
  "chef-hat": ChefHat,
} as const;

type BookingDraft = {
  serviceId: string;
  address: string;
  date: string;
  time: string;
  propertyType: string;
  notes: string;
  name: string;
  phone: string;
};

const initialDraft: BookingDraft = {
  serviceId: "home-cleaning",
  address: "",
  date: "",
  time: "09:00",
  propertyType: "Rumah",
  notes: "",
  name: "",
  phone: "",
};

function todayString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = useMemo(
    () => cleaningServices.find((service) => service.id === draft.serviceId) ?? cleaningServices[0],
    [draft.serviceId],
  );

  const estimatedPrice = useMemo(() => {
    const multiplier = draft.propertyType === "Apartemen" ? 0.9 : draft.propertyType === "Kantor" ? 1.4 : 1;
    return Math.round(selectedService.startingPrice * multiplier);
  }, [draft.propertyType, selectedService]);

  function openBooking(service?: CleaningService) {
    setDraft((current) => ({
      ...current,
      ...(service ? { serviceId: service.id } : {}),
      date: current.date || todayString(),
    }));
    setSuccessMessage("");
    setBookingOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const bookingRecord = {
      service_id: draft.serviceId,
      service_name: selectedService.name,
      customer_name: draft.name.trim(),
      customer_phone: draft.phone.trim(),
      address: draft.address.trim(),
      booking_date: draft.date,
      booking_time: draft.time,
      property_type: draft.propertyType,
      notes: draft.notes.trim() || null,
      estimated_price: estimatedPrice,
      status: "pending",
    };

    try {
      if (supabase) {
        const { error } = await supabase.from("bookings").insert(bookingRecord);
        if (error) throw error;
        setSuccessMessage("Permintaan booking berhasil dikirim. Tim CleanGo akan menghubungi Anda untuk konfirmasi.");
      } else {
        const draftBookings = JSON.parse(localStorage.getItem("cleango-demo-bookings") || "[]") as typeof bookingRecord[];
        draftBookings.push({ ...bookingRecord, id: crypto.randomUUID(), created_at: new Date().toISOString() });
        localStorage.setItem("cleango-demo-bookings", JSON.stringify(draftBookings));
        setSuccessMessage("Booking demo tersimpan di browser ini. Untuk menyimpan pesanan secara online dan menerima booking dari perangkat lain, hubungkan Supabase terlebih dahulu.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim booking.";
      setSuccessMessage(`Booking belum tersimpan: ${message}. Pastikan tabel bookings dan izin database sudah disiapkan.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateDraft<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#" aria-label="CleanGo beranda">
            <span className="brand-mark">C</span><span>CleanGo<span style={{ color: "var(--green)" }}>.</span></span>
          </a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#layanan">Layanan</a>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#tentang">Tentang Kami</a>
          </nav>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => openBooking()}>Masuk / Pesan</button>
            <button className="btn btn-primary" onClick={() => openBooking()}>Pesan Sekarang <ArrowRight size={16} /></button>
            <button className="btn btn-outline mobile-menu" aria-label="Buka navigasi" onClick={() => setMobileNavOpen((open) => !open)}><Menu size={18} /></button>
          </div>
        </div>
        {mobileNavOpen && (
          <div className="container" style={{ paddingBottom: 16, display: "flex", gap: 18, flexWrap: "wrap", fontSize: 14 }}>
            <a href="#layanan" onClick={() => setMobileNavOpen(false)}>Layanan</a>
            <a href="#cara-kerja" onClick={() => setMobileNavOpen(false)}>Cara Kerja</a>
            <a href="#tentang" onClick={() => setMobileNavOpen(false)}>Tentang Kami</a>
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> CLEAN SPACE, CLEAR MIND</div>
              <h1>Rumah bersih.<br /><span>Pikiran lebih</span><br />tenang.</h1>
              <p className="hero-copy">
                Layanan kebersihan rumah dan kantor yang praktis, transparan, dan terpercaya.
                Temukan mitra cleaning profesional dalam beberapa langkah.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => openBooking()}>Booking layanan <ArrowRight size={17} /></button>
                <a className="btn btn-outline" href="#layanan">Jelajahi layanan <ArrowDownRight size={17} /></a>
              </div>
              <div className="trust-row">
                <span><ShieldCheck size={16} /> Mitra terverifikasi*</span>
                <span><Clock3 size={16} /> Jadwal fleksibel</span>
                <span><BadgeCheck size={16} /> Harga transparan</span>
              </div>
            </div>
            <div className="hero-visual" aria-label="Ilustrasi kartu pemesanan layanan">
              <div className="visual-orb" />
              <div className="float-chip one"><span style={{ color: "#d79b27" }}>★★★★★</span><br />Layanan berkualitas</div>
              <div className="float-chip two">✓ Booking praktis<br /><span style={{ color: "var(--muted)", fontWeight: 400 }}>Mulai dari rumah Anda</span></div>
              <div className="visual-card">
                <div className="visual-top">
                  <div><div className="mini-label">PESANAN ANDA</div><div className="visual-title">Home Cleaning</div></div>
                  <div className="status-pill">Tersedia</div>
                </div>
                <div className="cleaner-art" aria-hidden="true">🧹✨</div>
                <div className="booking-line">
                  <div className="booking-icon"><CalendarDays size={19} /></div>
                  <div><strong>Atur jadwal sesuai kebutuhan</strong><small>Pilih tanggal dan waktu yang nyaman</small></div>
                </div>
                <div className="booking-line">
                  <div className="booking-icon"><ShieldCheck size={19} /></div>
                  <div><strong>Detail layanan jelas</strong><small>Estimasi biaya sebelum memesan</small></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container stats">
          <div className="stat"><strong>6 layanan</strong><span>Pilihan kebersihan</span></div>
          <div className="stat"><strong>Fleksibel</strong><span>Pilih jadwal Anda</span></div>
          <div className="stat"><strong>Transparan</strong><span>Estimasi harga di awal</span></div>
        </div>

        <section className="section" id="layanan">
          <div className="container">
            <div className="section-heading">
              <div className="section-kicker">Layanan CleanGo</div>
              <h2>Perawatan kebersihan yang sesuai kebutuhan</h2>
              <p>Dari rutinitas harian hingga pembersihan detail, pilih layanan dan jadwalkan dengan mudah.</p>
            </div>
            <div className="service-grid">
              {cleaningServices.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Sparkles;
                return (
                  <article className="service-card" key={service.id}>
                    <div className="service-icon"><Icon size={25} color="var(--green)" /></div>
                    <h3>{service.name}{service.popular && <span className="popular">POPULER</span>}</h3>
                    <p>{service.description}</p>
                    <div className="service-meta"><span><Clock3 size={13} style={{ verticalAlign: "middle" }} /> {service.duration}</span><span>Mulai dari</span></div>
                    <div className="service-meta" style={{ marginTop: -8, borderTop: 0, paddingTop: 0 }}><strong className="service-price">{formatRupiah(service.startingPrice)}</strong><span>per sesi</span></div>
                    <button className="btn btn-outline" onClick={() => openBooking(service)}>Pilih layanan <ArrowRight size={15} /></button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-soft" id="cara-kerja">
          <div className="container">
            <div className="section-heading">
              <div className="section-kicker">Cara kerja</div>
              <h2>Bersih tanpa proses yang rumit</h2>
              <p>Alur pemesanan yang dirancang supaya Anda tahu apa yang harus dilakukan di setiap tahap.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card"><div className="step-number">01</div><h3>Pilih layanan</h3><p>Tentukan jenis pembersihan yang dibutuhkan dan lihat estimasi harga awal.</p></div>
              <div className="step-card"><div className="step-number">02</div><h3>Atur jadwal</h3><p>Isi alamat, tanggal, waktu, dan informasi yang membantu persiapan mitra.</p></div>
              <div className="step-card"><div className="step-number">03</div><h3>Konfirmasi pesanan</h3><p>Tim atau mitra layanan mengonfirmasi detail sebelum pekerjaan dimulai.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="tentang">
          <div className="container">
            <div className="cta-panel">
              <div><h2>Lebih banyak waktu untuk hal yang penting.</h2><p>Mulai dari ruang yang lebih bersih. CleanGo membantu Anda merencanakan layanan kebersihan dengan proses yang mudah dipahami.</p></div>
              <button className="btn btn-light" onClick={() => openBooking()}>Mulai booking <ArrowRight size={16} /></button>
            </div>
            <div className="steps-grid" style={{ marginTop: 46 }}>
              <div className="step-card"><div className="step-number"><ShieldCheck size={24} /></div><h3>Lebih terarah</h3><p>Detail pesanan dirangkum agar kebutuhan Anda jelas sejak awal.</p></div>
              <div className="step-card"><div className="step-number"><Star size={24} /></div><h3>Fokus pada kualitas</h3><p>Bangun pengalaman layanan yang konsisten melalui mitra yang dikelola.</p></div>
              <div className="step-card"><div className="step-number"><Users size={24} /></div><h3>Ekosistem mitra</h3><p>Dirancang untuk berkembang menjadi marketplace berbagai penyedia jasa.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div><a className="brand" href="#"><span className="brand-mark">C</span><span>CleanGo.</span></a><p className="footer-copy">Solusi layanan kebersihan yang praktis untuk rumah dan ruang kerja Anda.</p></div>
            <div className="footer-links"><a href="#layanan">Layanan</a><a href="#cara-kerja">Cara Kerja</a><a href="#tentang">Tentang CleanGo</a><button style={{ background: "none", border: 0, color: "inherit", padding: 0 }} onClick={() => openBooking()}>Hubungi / Booking</button></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} CleanGo. Seluruh hak cipta dilindungi.</span><span>Dibuat untuk pengalaman ruang yang lebih bersih.</span></div>
        </div>
      </footer>

      {bookingOpen && (
        <div className="booking-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <div className="modal-head">
              <div><div className="section-kicker">Pesan layanan</div><h2 id="booking-title">Jadwalkan kebersihan Anda</h2><p>Lengkapi detail berikut untuk membuat permintaan booking.</p></div>
              <button className="close-button" aria-label="Tutup formulir" onClick={() => setBookingOpen(false)}><X size={18} /></button>
            </div>
            {successMessage ? (
              <div>
                <div className="form-message"><Check size={17} style={{ verticalAlign: "middle", marginRight: 7 }} />{successMessage}</div>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { setBookingOpen(false); setDraft(initialDraft); }}>Selesai</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="field"><label htmlFor="service">Jenis layanan</label><select id="service" value={draft.serviceId} onChange={(event) => updateDraft("serviceId", event.target.value)}>{cleaningServices.map((service) => <option value={service.id} key={service.id}>{service.name} — mulai {formatRupiah(service.startingPrice)}</option>)}</select></div>
                <div className="form-grid">
                  <div className="field"><label htmlFor="name">Nama lengkap</label><input id="name" required autoComplete="name" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} placeholder="Nama Anda" /></div>
                  <div className="field"><label htmlFor="phone">Nomor WhatsApp</label><input id="phone" required autoComplete="tel" inputMode="tel" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} placeholder="08xxxxxxxxxx" /></div>
                </div>
                <div className="field"><label htmlFor="address">Alamat layanan</label><textarea id="address" required rows={2} value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} placeholder="Alamat lengkap dan patokan lokasi" /></div>
                <div className="form-grid">
                  <div className="field"><label htmlFor="date">Tanggal</label><input id="date" type="date" min={todayString()} required value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} /></div>
                  <div className="field"><label htmlFor="time">Waktu</label><select id="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)}><option value="08:00">08.00</option><option value="09:00">09.00</option><option value="10:00">10.00</option><option value="13:00">13.00</option><option value="15:00">15.00</option></select></div>
                </div>
                <div className="field"><label htmlFor="property">Jenis properti</label><select id="property" value={draft.propertyType} onChange={(event) => updateDraft("propertyType", event.target.value)}><option>Rumah</option><option>Apartemen</option><option>Kantor</option></select></div>
                <div className="field"><label htmlFor="notes">Catatan tambahan (opsional)</label><textarea id="notes" rows={2} value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} placeholder="Misalnya luas ruangan atau kebutuhan khusus" /></div>
                <div className="estimate"><div><span>Estimasi harga awal</span><div style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>Harga final dikonfirmasi sebelum pengerjaan.</div></div><strong>{formatRupiah(estimatedPrice)}</strong></div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isSubmitting}>{isSubmitting ? "Mengirim..." : "Kirim permintaan booking"} <ArrowRight size={16} /></button>
                <p className="form-note">Estimasi ini bukan tagihan final. Harga aktual dapat berubah berdasarkan kondisi, ukuran area, dan konfirmasi mitra. Jangan masukkan informasi rahasia.</p>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
