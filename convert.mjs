#!/usr/bin/env node

/**
 * Alifbo Konverter CLI - Oʻzbek tili uchun fayllarni oʻgirish vositasi
 * Formatlar: .txt, .srt, .docx, .md, .html, .json
 * 
 * Ishlatish:
 *   node convert.mjs input.txt output.txt --from lotin-old --to lotin-new
 *   node convert.mjs input.docx output.docx --from lotin-old --to lotin-new
 *   node convert.mjs input.srt output.srt --from cyrillic --to lotin-new
 *   node convert.mjs --dir ./hujjatlar --from lotin-old --to lotin-new
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const APOS = "[\u02BB\u02BC'\u2018\u2019`\u00B4\u02B9\u2032]";

// Transliteration Engine
export function transliterate(text, from = 'lotin-old', to = 'lotin-new') {
  if (!text) return { text: '', count: 0 };
  if (from === to) return { text, count: 0 };

  let count = 0;
  const mark = (s) => {
    count++;
    return s;
  };

  let t = text;

  // 1. LOTIN-OLD -> LOTIN-NEW
  if (from === 'lotin-old' && to === 'lotin-new') {
    const mapApos = { 'O': 'Ö', 'o': 'ö', 'G': 'Ğ', 'g': 'ğ' };
    t = t.replace(new RegExp('([OoGg])' + APOS, 'g'), (m, c) => mark(mapApos[c]));
    t = t.replace(/SH/g, () => mark('Ş'));
    t = t.replace(/Sh/g, () => mark('Ş'));
    t = t.replace(/sh/g, () => mark('ş'));
    t = t.replace(/sH/g, () => mark('ş'));
    t = t.replace(/CH/g, () => mark('Ç'));
    t = t.replace(/Ch/g, () => mark('Ç'));
    t = t.replace(/ch/g, () => mark('ç'));
    t = t.replace(/cH/g, () => mark('ç'));
  }

  // 2. LOTIN-NEW -> LOTIN-OLD
  else if (from === 'lotin-new' && to === 'lotin-old') {
    t = t.replace(/(\p{Lu})Ş/gu, (m, p1) => p1 + mark('SH'));
    t = t.replace(/Ş(\p{Lu})/gu, (m, p1) => mark('SH') + p1);
    t = t.replace(/(\p{Lu})Ç/gu, (m, p1) => p1 + mark('CH'));
    t = t.replace(/Ç(\p{Lu})/gu, (m, p1) => mark('CH') + p1);
    
    t = t.replace(/Ş/g, () => mark('Sh'));
    t = t.replace(/ş/g, () => mark('sh'));
    t = t.replace(/Ç/g, () => mark('Ch'));
    t = t.replace(/ç/g, () => mark('ch'));
    t = t.replace(/Ö/g, () => mark('O\u02BB'));
    t = t.replace(/ö/g, () => mark('o\u02BB'));
    t = t.replace(/Ğ/g, () => mark('G\u02BB'));
    t = t.replace(/ğ/g, () => mark('g\u02BB'));
  }

  // 3. CYRILLIC -> LOTIN
  else if (from === 'cyrillic' && (to === 'lotin-new' || to === 'lotin-old')) {
    const isNew = (to === 'lotin-new');
    const cyrVowels = "аоуиэеёюяўАOYИЭЕЁЮЯЎъьЪЬ";

    t = t.replace(/(^|[^а-яА-ЯёЁўЎғҒқҚҳҲ])Е(?=[А-ЯЁЎҒҚҲ])/gu, (m, p) => p + mark('YE'));
    t = t.replace(/(^|[^а-яА-ЯёЁўЎғҒқҚҳҲ])Е/gu, (m, p) => p + mark('Ye'));
    t = t.replace(/(^|[^а-яА-ЯёЁўЎғҒқҚҲҳ])е/gu, (m, p) => p + mark('ye'));
    t = t.replace(new RegExp('([' + cyrVowels + '])Е(?=[А-ЯЁЎҒҚҲ])', 'gu'), (m, p) => p + mark('YE'));
    t = t.replace(new RegExp('([' + cyrVowels + '])Е', 'gu'), (m, p) => p + mark('Ye'));
    t = t.replace(new RegExp('([' + cyrVowels + '])е', 'gu'), (m, p) => p + mark('ye'));

    const multiRules = [
      { r: /Ё(?=[А-ЯЁЎҒҚҲ])/gu, rep: 'YO' }, { r: /Ё/gu, rep: 'Yo' }, { r: /ё/gu, rep: 'yo' },
      { r: /Ю(?=[А-ЯЁЎҒҚҲ])/gu, rep: 'YU' }, { r: /Ю/gu, rep: 'Yu' }, { r: /ю/gu, rep: 'yu' },
      { r: /Я(?=[А-ЯЁЎҒҚҲ])/gu, rep: 'YA' }, { r: /Я/gu, rep: 'Ya' }, { r: /я/gu, rep: 'ya' },
      { r: /Ц(?=[А-ЯЁЎҒҚҲ])/gu, rep: 'TS' }, { r: /Ц/gu, rep: 'Ts' }, { r: /ц/gu, rep: 'ts' },
      { r: /Ч(?=[А-ЯЁЎҒҚҲ])/gu, rep: isNew ? 'Ç' : 'CH' },
      { r: /Ч/gu, rep: isNew ? 'Ç' : 'Ch' },
      { r: /ч/gu, rep: isNew ? 'ç' : 'ch' },
      { r: /Ш(?=[А-ЯЁЎҒҚҲ])/gu, rep: isNew ? 'Ş' : 'SH' },
      { r: /Ш/gu, rep: isNew ? 'Ş' : 'Sh' },
      { r: /ш/gu, rep: isNew ? 'ş' : 'sh' },
      { r: /Щ(?=[А-ЯЁЎҒҚҲ])/gu, rep: isNew ? 'Ş' : 'SH' },
      { r: /Щ/gu, rep: isNew ? 'Ş' : 'Sh' },
      { r: /щ/gu, rep: isNew ? 'ş' : 'sh' },
      { r: /Ў/gu, rep: isNew ? 'Ö' : 'O\u02BB' },
      { r: /ў/gu, rep: isNew ? 'ö' : 'o\u02BB' },
      { r: /Ғ/gu, rep: isNew ? 'Ğ' : 'G\u02BB' },
      { r: /ғ/gu, rep: isNew ? 'ğ' : 'g\u02BB' }
    ];

    for (const rule of multiRules) {
      t = t.replace(rule.r, () => mark(rule.rep));
    }

    const cyr2lat = {
      'А':'A', 'а':'a', 'Б':'B', 'б':'b', 'В':'V', 'в':'v', 'Г':'G', 'г':'g',
      'Д':'D', 'д':'d', 'Е':'E', 'е':'e', 'Ж':'J', 'ж':'j', 'З':'Z', 'з':'z',
      'И':'I', 'и':'i', 'Й':'Y', 'й':'y', 'К':'K', 'к':'k', 'Л':'L', 'л':'l',
      'М':'M', 'м':'m', 'Н':'N', 'н':'n', 'О':'O', 'о':'o', 'П':'P', 'п':'p',
      'Р':'R', 'р':'r', 'С':'S', 'с':'s', 'Т':'T', 't':'t', 'У':'U', 'у':'u',
      'Ф':'F', 'ф':'f', 'Х':'X', 'х':'x', 'Ҳ':'H', 'ҳ':'h', 'Қ':'Q', 'қ':'q',
      'Э':'E', 'э':'e', 'Ъ':'\u02BB', 'ъ':'\u02BB', 'Ь':'', 'ь':''
    };

    t = t.replace(/[А-Яа-яЁёЎўҒғҚқҲҳ]/gu, (c) => cyr2lat[c] !== undefined ? mark(cyr2lat[c]) : c);
  }

  // 4. LOTIN -> CYRILLIC
  else if ((from === 'lotin-new' || from === 'lotin-old') && to === 'cyrillic') {
    t = t.replace(new RegExp(APOS, 'g'), '\u02BB');

    t = t.replace(/O\u02BB/g, () => mark('Ў')).replace(/o\u02BB/g, () => mark('ў'));
    t = t.replace(/G\u02BB/g, () => mark('Ғ')).replace(/g\u02BB/g, () => mark('ғ'));
    t = t.replace(/Ö/g, () => mark('Ў')).replace(/ö/g, () => mark('ў'));
    t = t.replace(/Ğ/g, () => mark('Ғ')).replace(/ğ/g, () => mark('ғ'));

    t = t.replace(/SH/g, () => mark('Ш')).replace(/Sh/g, () => mark('Ш')).replace(/sh/g, () => mark('ш')).replace(/sH/g, () => mark('ш'));
    t = t.replace(/CH/g, () => mark('Ч')).replace(/Ch/g, () => mark('Ч')).replace(/ch/g, () => mark('ч')).replace(/cH/g, () => mark('ч'));
    t = t.replace(/Ş/g, () => mark('Ш')).replace(/ş/g, () => mark('ш'));
    t = t.replace(/Ç/g, () => mark('Ч')).replace(/ç/g, () => mark('ч'));

    t = t.replace(/YO/g, () => mark('Ё')).replace(/Yo/g, () => mark('Ё')).replace(/yo/g, () => mark('ё'));
    t = t.replace(/YU/g, () => mark('Ю')).replace(/Yu/g, () => mark('Ю')).replace(/yu/g, () => mark('ю'));
    t = t.replace(/YA/g, () => mark('Я')).replace(/Ya/g, () => mark('Я')).replace(/ya/g, () => mark('я'));
    t = t.replace(/YE/g, () => mark('Е')).replace(/Ye/g, () => mark('Е')).replace(/ye/g, () => mark('е'));
    t = t.replace(/TS/g, () => mark('Ц')).replace(/Ts/g, () => mark('Ц')).replace(/ts/g, () => mark('ц'));

    t = t.replace(/(^|[^a-zA-Z\u02BBÖöĞğŞşÇç])E(?=[A-ZÖĞŞÇ])/gu, (m, p) => p + mark('Э'));
    t = t.replace(/(^|[^a-zA-Z\u02BBÖöĞğŞşÇç])E/gu, (m, p) => p + mark('Э'));
    t = t.replace(/(^|[^a-zA-Z\u02BBÖöĞğŞşÇç])e/gu, (m, p) => p + mark('э'));

    t = t.replace(/\u02BB/g, () => mark('ъ'));

    const lat2cyr = {
      'A':'А', 'a':'а', 'B':'Б', 'b':'б', 'D':'Д', 'd':'д', 'E':'Е', 'e':'е',
      'F':'Ф', 'f':'ф', 'G':'Г', 'g':'г', 'H':'Ҳ', 'h':'ҳ', 'I':'И', 'i':'и',
      'J':'Ж', 'j':'ж', 'K':'К', 'k':'к', 'L':'Л', 'l':'л', 'M':'М', 'm':'м',
      'N':'Н', 'n':'н', 'O':'О', 'o':'о', 'P':'П', 'p':'п', 'Q':'Қ', 'q':'қ',
      'R':'Р', 'r':'р', 'S':'С', 's':'с', 'T':'Т', 't':'t', 'U':'У', 'u':'u',
      'V':'В', 'v':'в', 'X':'Х', 'x':'x', 'Y':'Й', 'y':'й', 'Z':'З', 'z':'z'
    };

    t = t.replace(/[a-zA-Z]/g, (c) => lat2cyr[c] !== undefined ? mark(lat2cyr[c]) : c);
  }

  return { text: t, count };
}

// Convert .srt subtitle file (preserves numbers and timestamp lines)
export function convertSrt(content, from, to) {
  const lines = content.split(/\r?\n/);
  let totalCount = 0;
  const resultLines = lines.map((line) => {
    const trimmed = line.trim();
    // Check if line is subtitle index number (e.g. "1", "24")
    if (/^\d+$/.test(trimmed)) {
      return line;
    }
    // Check if line is timestamp line (e.g. "00:00:20,000 --> 00:00:24,400")
    if (/-->/.test(line)) {
      return line;
    }
    // Normal subtitle dialogue
    const res = transliterate(line, from, to);
    totalCount += res.count;
    return res.text;
  });

  return { text: resultLines.join('\n'), count: totalCount };
}

// Convert .docx Word document
export async function convertDocx(buffer, from, to) {
  // Load JSZip
  let JSZip;
  try {
    const jszipModule = require('./jszip.min.js');
    JSZip = jszipModule.default || jszipModule;
  } catch (err) {
    throw new Error('jszip kutubxonasi topilmadi: ' + err.message);
  }

  const zip = await JSZip.loadAsync(buffer);
  let totalCount = 0;

  // Search and convert all xml parts in word/
  const xmlTargets = [
    'word/document.xml',
    'word/header1.xml', 'word/header2.xml', 'word/header3.xml',
    'word/footer1.xml', 'word/footer2.xml', 'word/footer3.xml',
    'word/footnotes.xml', 'word/endnotes.xml'
  ];

  for (const xmlPath of xmlTargets) {
    const file = zip.file(xmlPath);
    if (file) {
      const xml = await file.async('string');
      // Transliterate only text inside <w:t>...</w:t>
      const convertedXml = xml.replace(/(<w:t(?:\s+[^>]*)?>)([\s\S]*?)(<\/w:t>)/g, (match, openTag, textContent, closeTag) => {
        const res = transliterate(textContent, from, to);
        totalCount += res.count;
        return openTag + res.text + closeTag;
      });
      zip.file(xmlPath, convertedXml);
    }
  }

  const outBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return { buffer: outBuffer, count: totalCount };
}

// CLI Execution Handler
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║               ALIFBO KONVERTER - FAYLLAR BILAN ISHLASH               ║
╚══════════════════════════════════════════════════════════════════════╝

Foydalanish:
  node convert.mjs <kirish_fayl> [chiqish_fayl] [parametrlar]

Parametrlar:
  --from <alifbo>   Qaysi alifbodan: 'lotin-old' (standart), 'lotin-new', 'cyrillic'
  --to <alifbo>     Qaysi alifboga: 'lotin-new' (standart), 'lotin-old', 'cyrillic'
  --dir <papka>     Papkadagi barcha fayllarni oʻgirish

Qoʻllab-quvvatlanadigan formatlar:
  .docx  (Word hujjati — jadvallar, ranglar, shriftlar saqlanadi)
  .srt   (Subtitrlar — vaqt kodlariga tegmasdan faqat matn oʻgiriladi)
  .txt   (Oddiy matn fayllari)
  .md    (Markdown fayllari)
  .json, .csv, .html

Misollar:
  node convert.mjs kitob.docx kitob_yangi.docx --from lotin-old --to lotin-new
  node convert.mjs film.srt film_yangi.srt --from cyrillic --to lotin-new
  node convert.mjs maqola.txt --from lotin-old --to lotin-new
  node convert.mjs --dir ./hujjatlar --from lotin-old --to lotin-new
    `);
    process.exit(0);
  }

  let from = 'lotin-old';
  let to = 'lotin-new';
  let dirPath = null;
  let inputFile = null;
  let outputFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from' && args[i + 1]) {
      from = args[++i];
    } else if (args[i] === '--to' && args[i + 1]) {
      to = args[++i];
    } else if (args[i] === '--dir' && args[i + 1]) {
      dirPath = args[++i];
    } else if (!inputFile && !args[i].startsWith('--')) {
      inputFile = args[i];
    } else if (!outputFile && !args[i].startsWith('--')) {
      outputFile = args[i];
    }
  }

  // Single file conversion
  if (inputFile) {
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ Xatolik: "${inputFile}" fayli topilmadi!`);
      process.exit(1);
    }

    const ext = path.extname(inputFile).toLowerCase();
    if (!outputFile) {
      const base = path.basename(inputFile, ext);
      outputFile = path.join(path.dirname(inputFile), `${base}_${to}${ext}`);
    }

    console.log(`⏳ Konvertatsiya boshlanmoqda: [${inputFile}] (${from} ➔ ${to})`);
    const startTime = Date.now();

    if (ext === '.docx') {
      const inputBuf = fs.readFileSync(inputFile);
      const res = await convertDocx(inputBuf, from, to);
      fs.writeFileSync(outputFile, res.buffer);
      console.log(`✅ Word hujjati tayyor: [${outputFile}]`);
      console.log(`📊 Oʻzgartirilgan harflar: ${res.count} ta | Vaqt: ${Date.now() - startTime}ms`);
    } else if (ext === '.srt') {
      const content = fs.readFileSync(inputFile, 'utf-8');
      const res = convertSrt(content, from, to);
      fs.writeFileSync(outputFile, res.text, 'utf-8');
      console.log(`✅ Subtitr fayli tayyor: [${outputFile}]`);
      console.log(`📊 Oʻzgartirilgan harflar: ${res.count} ta | Vaqt: ${Date.now() - startTime}ms`);
    } else {
      const content = fs.readFileSync(inputFile, 'utf-8');
      const res = transliterate(content, from, to);
      fs.writeFileSync(outputFile, res.text, 'utf-8');
      console.log(`✅ Fayl tayyor: [${outputFile}]`);
      console.log(`📊 Oʻzgartirilgan harflar: ${res.count} ta | Vaqt: ${Date.now() - startTime}ms`);
    }
  } else if (dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Xatolik: "${dirPath}" papkasi topilmadi!`);
      process.exit(1);
    }
    const files = fs.readdirSync(dirPath);
    console.log(`📂 Papka: [${dirPath}], Jami fayllar: ${files.length} ta`);
    for (const f of files) {
      const fullPath = path.join(dirPath, f);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        const ext = path.extname(f).toLowerCase();
        if (['.docx', '.srt', '.txt', '.md', '.html', '.json'].includes(ext)) {
          const outName = path.join(dirPath, `${path.basename(f, ext)}_${to}${ext}`);
          try {
            if (ext === '.docx') {
              const res = await convertDocx(fs.readFileSync(fullPath), from, to);
              fs.writeFileSync(outName, res.buffer);
            } else if (ext === '.srt') {
              const res = convertSrt(fs.readFileSync(fullPath, 'utf-8'), from, to);
              fs.writeFileSync(outName, res.text, 'utf-8');
            } else {
              const res = transliterate(fs.readFileSync(fullPath, 'utf-8'), from, to);
              fs.writeFileSync(outName, res.text, 'utf-8');
            }
            console.log(`  ✓ ${f} ➔ ${path.basename(outName)}`);
          } catch (e) {
            console.error(`  ✗ ${f}: ${e.message}`);
          }
        }
      }
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('convert.mjs')) {
  main().catch(console.error);
}
