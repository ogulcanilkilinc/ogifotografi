const fs = require('fs');
const path = require('path');

const galleryPath = path.join(__dirname, 'gallery.html');
const siteGalleryDir = path.join(__dirname, 'assets', 'images', 'gallery');
const jsonPath = path.join(siteGalleryDir, 'curated_master.json');

const masterData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Title generators per category
function getTitle(cat, idx, origin) {
  const num = String(idx).padStart(2, '0');
  if (cat === 'voleybol') return `Voleybol — Kare ${num}`;
  if (cat === 'basketbol') return `Basketbol — Kare ${num}`;
  if (cat === 'tenis') return `Tenis — Kare ${num}`;
  if (cat === 'buz-hokeyi') return `Buz Hokeyi — Kare ${num}`;
  if (cat === 'futsal') return `Futsal — Kare ${num}`;
  if (cat === 'quidditch') return `Quidditch — Kare ${num}`;
  if (cat === 'sualti') return `Sualtı / Dalış — Kare ${num}`;
  if (cat === 'solotork') return `Solotürk — Kare ${num}`;
  if (cat === 'hayvan') return `Hayvan & Doğa — Kare ${num}`;
  if (cat === 'kayak') return `Erciyes Kayak — Kare ${num}`;
  if (cat === 'mimari') return `Mimari & Kültür — Kare ${num}`;
  if (cat === 'portre') return `Portre — Kare ${num}`;
  if (cat === 'sokak') return `Sokak & Şehir — Kare ${num}`;
  return `${cat.toUpperCase()} — Kare ${num}`;
}

const allCards = [];

// First include existing Manzara and Mezuniyet photos if present
const manzaraJsonPath = path.join(siteGalleryDir, 'manzara', 'photos.json');
if (fs.existsSync(manzaraJsonPath)) {
  const mPhotos = JSON.parse(fs.readFileSync(manzaraJsonPath, 'utf8').replace(/^\uFEFF/, ''));
  mPhotos.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const title = `Çamkoru Doğa Yürüyüşü — Kare ${num}`;
    const exif = p.exif.replace(/Â/g, '').trim();
    allCards.push(`      <figure class="photo-card" data-cat="manzara">
        <div class="photo-img-wrap">
          <img src="assets/images/gallery/manzara/${p.fileName}" alt="${title}" loading="lazy" class="photo-img">
        </div>
        <figcaption>
          <span class="cap-title">${title}</span>
          <span class="cap-exif">${exif}</span>
        </figcaption>
      </figure>`);
  });
}

const mezuniyetJsonPath = path.join(siteGalleryDir, 'mezuniyet', 'photos.json');
if (fs.existsSync(mezuniyetJsonPath)) {
  const mPhotos = JSON.parse(fs.readFileSync(mezuniyetJsonPath, 'utf8').replace(/^\uFEFF/, ''));
  mPhotos.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const title = `Mezuniyet — Kare ${num}`;
    const exif = p.exif.replace(/Â/g, '').trim();
    allCards.push(`      <figure class="photo-card" data-cat="mezuniyet">
        <div class="photo-img-wrap">
          <img src="assets/images/gallery/mezuniyet/${p.fileName}" alt="${title}" loading="lazy" class="photo-img">
        </div>
        <figcaption>
          <span class="cap-title">${title}</span>
          <span class="cap-exif">${exif}</span>
        </figcaption>
      </figure>`);
  });
}

// Now include all curated master categories
for (const [catKey, items] of Object.entries(masterData)) {
  items.forEach((item, i) => {
    const title = getTitle(catKey, i + 1, item.folderOrigin);
    const exif = item.exif || 'f/2.8 · 1/1000s · ISO 400';
    allCards.push(`      <figure class="photo-card" data-cat="${catKey}">
        <div class="photo-img-wrap">
          <img src="assets/images/gallery/${catKey}/${item.fileName}" alt="${title}" loading="lazy" class="photo-img">
        </div>
        <figcaption>
          <span class="cap-title">${title}</span>
          <span class="cap-exif">${exif}</span>
        </figcaption>
      </figure>`);
  });
}

let galleryHtml = fs.readFileSync(galleryPath, 'utf8');

const gridStartStr = '<div class="gallery-grid" id="galleryGrid">';
const gridEndStr = '</section>';

const gridContent = `${gridStartStr}\n${allCards.join('\n')}\n    </div>\n  `;

const updatedGallery = galleryHtml.replace(/<div class="gallery-grid" id="galleryGrid">[\s\S]*?<\/div>\s*<\/section>/, `${gridContent}</section>`);

fs.writeFileSync(galleryPath, updatedGallery, 'utf8');
console.log(`Successfully updated gallery.html with TOTAL ${allCards.length} curated photos across all categories!`);
