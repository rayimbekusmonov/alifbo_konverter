# 🇺🇿 Alifbo Konverter 2.0 (Uzbek Alphabet Converter)

Oʻzbek lotin (amaldagi 1995-yilgi va yangi isloh qilingan loyiha) hamda kirill alifbolari oʻrtasida matnlar va fayllarni (`.docx`, `.srt`, `.txt`, `.md`, `.json`, `.csv`) xatosiz, tezkor va formatini buzmasdan oʻgiruvchi zamonaviy tizim.

---

## ✨ Imkoniyatlar va Yangiliklar

### 1. 🔤 6 xil konvertatsiya yoʻnalishi
- **Eski Lotin ⇄ Yangi Lotin:** `Gʻ gʻ ⇄ Ğ ğ`, `Oʻ oʻ ⇄ Ö ö`, `Sh sh ⇄ Ş ş`, `Ch ch ⇄ Ç ç`, `Ng ng` (oʻzgarmaydi).
- **Kirillitsa ⇄ Yangi Lotin:** `Ў, Ғ, Ш, Ч, Ц, Ю, Я, Е, Ё, Ъ` kabi barcha harflar toʻgʻri fonetik qoidalar bilan yangi lotinga oʻgiriladi.
- **Kirillitsa ⇄ Eski Lotin:** Amaldagi rasmiy 1995-yilgi standartga toʻliq mos oʻgirish.
- **⇄ Swap (Almashtirish):** Birgina bosish orqali yoʻnalishni teskarisiga oʻgirish.

### 2. 📁 Fayllar bilan ishlash (Hujjatlar konvertori)
- **Word (.docx):** Hujjat ichidagi barcha jadvallar, sarlavhalar, boʻyoqlar, shriftlar va qalin/qiya formatlashlarni **100% buzmasdan saqlagan holda** faqat matnni oʻgiradi va tayyor `.docx` qilib yuklab beradi!
- **Subtitrlar (.srt):** Vaqt kodlari (`00:00:20,000 --> 00:00:24,000`) va raqamlar buzilmaydi, faqat aktyorlar/ovoz nutqi oʻgiriladi.
- **Matnli fayllar:** `.txt`, `.md` (Markdown), `.json`, `.csv`, `.html`.
- **Batch rejim:** Bir nechta fayllarni birdaniga sudrab tashlash (drag & drop) va hammasini bir bosishda yuklab olish imkoniyati.

### 3. 🧠 Lingvistik qoidalar va xatolar toʻgʻrilangan
- **ALL CAPS (Bosh harflar) xatosi yechilgan:** `ŞAHRINGIZ` soʻzi orqaga oʻgirilganda `ShAHRINGIZ` emas, balki toʻliq `SHAHRINGIZ` yoki `CHINOR` boʻlib chiqadi.
- **Kontekstual `Е/е`:** Soʻz boshida va unlilardan keyin `Ye/ye`, undoshlardan keyin esa `E/e` tarzida aniq oʻgiriladi (`Ер` → `Yer`, `Келди` → `Keldi`).
- **Apostroflar xilma-xilligi:** `O‘`, `O’`, `Oʻ`, `O'`, ``O` `` kabi belgilar bir xil tanib olinadi va rasmiy `ʻ` belgisiga standartlanadi.

### 4. 🎨 Zamonaviy UI/UX
- **Yorugʻ va Qorongʻu rejim (Dark/Light mode):** Tizimga moslashadi va qoʻlda almashtirish mumkin.
- **Oʻzgarishlarni belgilash (Highlight):** Natijada faqat oʻzgargan harflarni rangli qilib ajratish imkoniyati.
- **Kengaytirilgan statistika:** Belgilar soni (boʻshliqli va boʻshliqsiz), soʻzlar soni, qatorlar soni va taxminiy oʻqish vaqti.
- **100% Maxfiy va Offline:** Barcha hisob-kitoblar brauzer ichida ishlaydi, maʼlumotlar hech qayerga joʻnatilmaydi.

---

## 🚀 Ishga tushirish

### A. Brauzer orqali (Grafik interfeys)
Hech qanday oʻrnatish shart emas! Shunchaki:
1. `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) oching.
2. Matnni kiriting yoki fayllarni sudrab tashlang.

### B. Terminal orqali (CLI - Node.js)
Dasturchilar va serverlar uchun qulay konsol vositasi mavjud:

```bash
# Yordam maʼlumotlarini koʻrish
node convert.mjs --help

# Word (.docx) faylini yangi lotinga oʻgirish
node convert.mjs kitob.docx kitob_yangi.docx --from lotin-old --to lotin-new

# Subtitr (.srt) faylini oʻgirish
node convert.mjs film.srt film_yangi.srt --from cyrillic --to lotin-new

# Oddiy matn faylini oʻgirish
node convert.mjs maqola.txt --from lotin-old --to lotin-new

# Butun boshli papkadagi barcha fayllarni oʻgirish
node convert.mjs --dir ./hujjatlar --from lotin-old --to lotin-new
```

---

## ⌨️ Tezkor klaviatura tugmalari (Hotkeys)
- `Ctrl + Enter` — Natijadan nusxa olish.
- `Alt + S` — Yoʻnalishni almashtirish (Swap).
- `Esc` — Matn maydonini tozalash yoki modallarni yopish.
