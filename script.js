/* =====================================================
   1. CONFIG — SEMUA DATA UNDANGAN DIUBAH DI SINI SAJA
   ===================================================== */
const CONFIG = {
  api: "https://script.google.com/macros/s/AKfycbyCEf08XEoZlsdGZDkDKOHsc6ot6Gy_UXIErTzuNdkmUM5iJDac1pea35bKzYeZzj0P7Q/exec",
  date: "2026-11-18T08:00:00+08:00",          // tanggal & jam (dipakai countdown)
  dateText: "Rabu, 18 November 2026",
  music: "assets/music/song.mp3",
  hero: "assets/images/hero.jpg",
  opening: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  bride: { initial: "S", nick: "Selvi", full: "Selvi Rahma Sari", father: "Bapak Edi Imran (alm)", mother: "Ibu Susanti", ig: "selvy_rahmasari", photo: "assets/images/bride.jpeg" },
  groom: { initial: "I", nick: "Ichsan", full: "Teguh Maulana Ichsan", father: "Bapak Zulhifansyah", mother: "Ibu Marsini", ig: "ichsan.2305", photo: "assets/images/groom.png" },
  events: [
    { title: "Akad Nikah", day: "Rabu", date: "18 November 2026", time: "08.00 WIB - selesai", place: "Kediaman Mempelai Wanita", addr: "Jl.TELUK BANO 1 KEC BANGKO PUSAKO KABUPATEN ROKAN HILIR",
      maps: "https://maps.app.goo.gl/Jexj9GFyGWgqDvEA7", start: "2027-03-20T08:00:00+08:00", end: "2027-03-20T10:00:00+08:00", calendar: "" },
    { title: "Resepsi", day: "Rabu", date: "18 November 2026", time: "11.00 - 16.00 WIB", place: "Kediaman Mempelai Wanita", addr: "Jl.TELUK BANO 1 KEC BANGKO PUSAKO KABUPATEN ROKAN HILIR",
      maps: "https://maps.app.goo.gl/Jexj9GFyGWgqDvEA7", start: "2027-03-20T11:00:00+08:00", end: "2027-03-20T14:00:00+08:00", calendar: "" }
  ],
  // story: [
  //   { title: "Pertama Bertemu", year: "2019", text: "[Ceritakan awal pertemuan kalian.]" },
  //   { title: "Menjalin Hubungan", year: "2021", text: "[Ceritakan perjalanan hubungan kalian.]" },
  //   { title: "Lamaran", year: "2026", text: "[Ceritakan momen lamaran.]" },
  //   { title: "Menikah", year: "2027", text: "[Ceritakan harapan di hari pernikahan.]" }
  // ],
  gallery: ["g1", "g2", "g3", "g4", "g5", "g6"].map(n => `assets/images/${n}.jpg`),
  gift: { bank: "Bank [Nama Bank]", no: "1234567890", name: "[Nama Pemilik]", qr: "assets/images/qris.png" }
};

/* =====================================================
   2. UTILITAS
   ===================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const get = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);
const pad = n => String(n).padStart(2, "0");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, props = {}, ...kids) {              // pembuat elemen aman (tanpa innerHTML)
  const e = Object.assign(document.createElement(tag), props);
  kids.forEach(k => e.append(k));
  return e;
}
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2400);
}
const gunungan = () => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("class", "gn"); s.innerHTML = '<use href="#gn"/>'; return s; };
const flower = () => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.innerHTML = '<use href="#fl"/>'; return s; };

/* =====================================================
   3. ISI KONTEN DARI CONFIG
   ===================================================== */
function bindConfig() {
  $$("[data-c]").forEach(n => n.textContent = get(CONFIG, n.dataset.c));
  $$("[data-img]").forEach(n => { n.src = get(CONFIG, n.dataset.img) || CONFIG[n.dataset.img]; });
  document.title = `The Wedding Of ${CONFIG.bride.nick} & ${CONFIG.groom.nick}`;
  [["bride", "Putri dari"], ["groom", "Putra dari"]].forEach(([k, rel]) => {
    const p = CONFIG[k];
    const img = el("img", { src: p.photo, alt: `Foto ${p.full}`, loading: "lazy" });
    const ig = el("a", { href: `https://instagram.com/${p.ig}`, target: "_blank", rel: "noopener", textContent: `@${p.ig}` });
    $("#" + k).append(el("div", { className: "frame" }, gunungan(), img), el("p", { className: "nick", textContent: p.nick }), el("h3", { textContent: p.full }),
      el("p", { textContent: `${rel} ${p.father} & ${p.mother}` }), ig);
  });
}

function renderEvents() {
  const box = $("#events");
  CONFIG.events.forEach(ev => {
    const fmt = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, "");
    const cal = ev.calendar || `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title + " " + CONFIG.bride.nick + " & " + CONFIG.groom.nick)}&dates=${fmt(ev.start)}/${fmt(ev.end)}&location=${encodeURIComponent(ev.place + ", " + ev.addr)}`;
    const mk = (t, h) => el("a", { className: "btn" + (h ? "" : " ghost"), href: h || cal, target: "_blank", rel: "noopener", textContent: t });
    box.append(el("article", { className: "card ev rv" },
      el("h3", { textContent: ev.title }),
      el("p", { className: "meta" }, el("b", { textContent: `${ev.day}, ${ev.date}` }), el("span", { textContent: ev.time }),
        el("br"), el("b", { textContent: ev.place }), el("span", { textContent: ev.addr })),
      el("div", { className: "acts" }, mk("Lihat Lokasi", ev.maps), mk("📅 Simpan ke Kalender", null))));
  });
}

function renderStory() {
  const ol = $("#timeline");
  CONFIG.story.forEach(s => ol.append(el("li", { className: "rv" }, flower(),
    el("h3", { textContent: s.title }), el("time", { textContent: s.year }), el("p", { textContent: s.text }))));
}

/* =====================================================
   4. GALERI & LIGHTBOX
   ===================================================== */
let lbIndex = 0;
function renderGallery() {
  const g = $("#gallery");
  CONFIG.gallery.forEach((src, i) => {
    const b = el("button", { type: "button", ariaLabel: `Buka foto ${i + 1}` }, el("img", { src, alt: `Foto galeri ${i + 1}`, loading: "lazy" }));
    b.className = "rv"; b.onclick = () => openLb(i); g.append(b);
  });
}
function showLb(i) {
  lbIndex = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
  const img = $("#lbImg"); img.src = CONFIG.gallery[lbIndex]; img.alt = `Foto galeri ${lbIndex + 1}`;
}
function openLb(i) { showLb(i); $("#lb").hidden = false; document.body.classList.add("locked"); $(".lb-b.x").focus(); }
function closeLb() { $("#lb").hidden = true; document.body.classList.remove("locked"); }
function initLightbox() {
  $(".lb-b.x").onclick = closeLb; $(".lb-b.p").onclick = () => showLb(lbIndex - 1); $(".lb-b.n").onclick = () => showLb(lbIndex + 1);
  $("#lb").onclick = e => { if (e.target.id === "lb") closeLb(); };
  addEventListener("keydown", e => {
    if ($("#lb").hidden) return;
    if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") showLb(lbIndex - 1); if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });
}

/* =====================================================
   5. COUNTDOWN
   ===================================================== */
function initCountdown() {
  const target = new Date(CONFIG.date).getTime();
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) { $("#cd").hidden = true; const m = $("#cd-msg"); m.hidden = false; m.textContent = "Acara telah berlangsung. Terima kasih atas doa dan kehadiran Anda."; return clearInterval(timer); }
    $("#cd-d").textContent = pad(Math.floor(diff / 864e5)); $("#cd-h").textContent = pad(Math.floor(diff / 36e5) % 24);
    $("#cd-m").textContent = pad(Math.floor(diff / 6e4) % 60); $("#cd-s").textContent = pad(Math.floor(diff / 1e3) % 60);
  };
  const timer = setInterval(tick, 1000); tick();
}

/* =====================================================
   6. FORM: VALIDASI, RSVP, UCAPAN
   ===================================================== */
function setErr(input, msg) {
  const s = input.closest("label,fieldset").querySelector(".err"); if (s) s.textContent = msg;
  input.classList?.toggle("bad", !!msg);
}

/* ===== KIRIM & AMBIL DATA (Google Sheets lewat Apps Script) ===== */
async function send(type, data) {
  if (!CONFIG.api) {                                   // mode demo tanpa database
    const k = type === "rsvp" ? "rsvp" : "wishes", l = JSON.parse(localStorage.getItem(k) || "[]");
    l.unshift({ ...data, at: Date.now() }); localStorage.setItem(k, JSON.stringify(l.slice(0, 100))); return;
  }
  const r = await fetch(CONFIG.api, { method: "POST", body: JSON.stringify({ type, ...data }) });
  if (!r.ok) throw new Error("gagal");
}
async function loadWishes() {
  if (!CONFIG.api) return JSON.parse(localStorage.getItem("wishes") || "[]");
  return (await fetch(CONFIG.api)).json();
}
// nama tamu dari link (?to=...) dipakai untuk mengisi form RSVP
const guestName = () => (new URLSearchParams(location.search).get("to") || "").trim().slice(0, 60);

function initRSVP() {
  const f = $("#rsvpForm"), btn = $("#rsvpBtn");
  f.name.value = guestName();                        // nama otomatis dari ?to=
  f.name.readOnly = !!guestName();                   // hapus baris ini kalau nama boleh diubah tamu
  f.onsubmit = async e => {
    e.preventDefault();
    const name = f.name.value.trim(), status = f.status.value, count = +f.count.value; let ok = true;
    setErr(f.name, name.length < 2 ? "Isi nama minimal 2 huruf." : ""); ok = ok && name.length >= 2;
    setErr(f.querySelector("input[name=status]"), status ? "" : "Pilih status kehadiran."); ok = ok && !!status;
    setErr(f.count, count >= 1 && count <= 10 ? "" : "Jumlah tamu 1-10 orang."); ok = ok && count >= 1 && count <= 10;
    if (!ok) return;
    btn.disabled = true; btn.textContent = "Mengirim...";
    try {
      await send("rsvp", { name, status, count, note: f.note.value.trim() });
      f.reset(); f.name.value = guestName() || name;
      toast("Konfirmasi terkirim. Terima kasih!");
    } catch { toast("Gagal mengirim. Coba lagi."); }
    btn.disabled = false; btn.textContent = "Kirim Konfirmasi";
  };
}
async function renderWishes() {
  const box = $("#wishes"); box.replaceChildren(el("p", { textContent: "Memuat ucapan..." }));
  let list = [];
  try { list = await loadWishes(); } catch { return box.replaceChildren(el("p", { textContent: "Ucapan belum bisa dimuat." })); }
  box.replaceChildren();
  if (!list.length) return box.append(el("p", { textContent: "Jadilah yang pertama mengirim ucapan." }));
  list.forEach(w => box.append(el("div", { className: "card" }, el("b", { textContent: w.name }),
    el("time", { textContent: new Date(w.at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) }), el("p", { textContent: w.msg }))));
}
function initWishes() {
  const f = $("#wishForm"), btn = f.querySelector("button");
  f.onsubmit = async e => {
    e.preventDefault();
    const name = f.name.value.trim(), msg = f.msg.value.trim();
    setErr(f.name, name ? "" : "Isi nama Anda."); setErr(f.msg, msg ? "" : "Tulis ucapan atau doa.");
    if (!name || !msg) return;
    btn.disabled = true; btn.textContent = "Mengirim...";
    try { await send("wish", { name, msg }); f.reset(); renderWishes(); toast("Ucapan terkirim. Terima kasih!"); }
    catch { toast("Gagal mengirim. Coba lagi."); }
    btn.disabled = false; btn.textContent = "Kirim Ucapan";
  };
  renderWishes();
}

/* =====================================================
   7. GIFT, MUSIK, NAVIGASI, SCROLL
   ===================================================== */
function initGift() {
  const t = $("#giftToggle"), box = $("#giftBox");
  t.onclick = () => { box.hidden = !box.hidden; t.setAttribute("aria-expanded", !box.hidden); t.textContent = box.hidden ? "Lihat Informasi Rekening" : "Sembunyikan Rekening"; };
  $("#copyBtn").onclick = async () => {
    try { await navigator.clipboard.writeText(CONFIG.gift.no); }
    catch { const i = el("input", { value: CONFIG.gift.no }); document.body.append(i); i.select(); document.execCommand("copy"); i.remove(); }
    toast("Nomor rekening berhasil disalin");
  };
}
function initMusic() {
  const a = $("#bgm"), b = $("#musicBtn"); a.src = CONFIG.music;
  const sync = () => { b.classList.toggle("playing", !a.paused); };
  b.onclick = () => { a.paused ? a.play().catch(() => toast("File musik belum tersedia")) : a.pause(); };
  a.onplay = a.onpause = sync;
  return () => { b.hidden = false; a.play().catch(() => {}); };   // dipanggil saat undangan dibuka
}
function initNav() {
  const links = $$("#nav a"), ids = links.map(l => l.hash);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ids.forEach(h => io.observe($(h)));
  const top = $("#topBtn");
  addEventListener("scroll", () => { top.hidden = scrollY < 600; }, { passive: true });
  top.onclick = () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2, rootMargin: "0px 0px -8% 0px" });
  $$(".rv").forEach(n => io.observe(n));
}

/* Bunga merah yang melayang pelan di cover & hero (hanya transform/opacity, ringan) */
function initPetals() {
  const n = matchMedia("(max-width:600px)").matches ? 6 : 10;
  ["#cover", ".hero"].forEach(sel => {
    const box = el("div", { className: "petals", ariaHidden: "true" });
    for (let i = 0; i < n; i++) {
      const f = flower();
      f.style.cssText = `--x:${Math.random() * 94}%;--s:${14 + Math.random() * 18}px;--d:${12 + Math.random() * 10}s;--l:${-Math.random() * 20}s;--w:${(Math.random() - .5) * 120}`;
      box.append(f);
    }
    $(sel).prepend(box);
  });
}

/* =====================================================
   8. COVER, NAMA TAMU, INISIALISASI
   ===================================================== */
function initGuest() {
  const name = new URLSearchParams(location.search).get("to");
  if (name && name.trim()) $("#guest").textContent = name.trim().slice(0, 60);   // textContent = aman dari XSS
}
function initCover(startMusic) {
  $("#openBtn").onclick = () => {
    $("#cover").classList.add("open"); document.body.classList.remove("locked");
    startMusic(); setTimeout(() => { $("#cover").hidden = true; scrollTo(0, 0); }, 1000);
  };
}
document.addEventListener("DOMContentLoaded", () => {
  bindConfig(); renderEvents(); renderGallery();
  initGuest(); initLightbox(); initCountdown(); initRSVP(); initWishes(); initGift();
  initCover(initMusic()); initNav(); initReveal(); initPetals();
  addEventListener("load", () => setTimeout(() => $("#loader").classList.add("off"), 500), { once: true });
  if (document.readyState === "complete") setTimeout(() => $("#loader").classList.add("off"), 500);
});
