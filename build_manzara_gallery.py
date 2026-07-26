# -*- coding: utf-8 -*-
import json
import re

json_path = r"C:\Users\user\.gemini\antigravity\scratch\ogifotografi\assets\images\gallery\manzara\photos.json"
gallery_path = r"C:\Users\user\.gemini\antigravity\scratch\ogifotografi\gallery.html"
index_path = r"C:\Users\user\.gemini\antigravity\scratch\ogifotografi\index.html"

with open(json_path, 'r', encoding='utf-8') as f:
    photos = json.load(f)

cards_html = []
for idx, p in enumerate(photos, 1):
    exif_clean = p['exif'].replace('Â', '').strip()
    card = f'''      <figure class="photo-card" data-cat="manzara">
        <div class="photo-img-wrap">
          <img src="assets/images/gallery/manzara/{p['fileName']}" alt="Çamkoru Doğa Yürüyüşü — Kare {idx:02d}" loading="lazy" class="photo-img">
        </div>
        <figcaption>
          <span class="cap-title">Çamkoru Doğa Yürüyüşü — Kare {idx:02d}</span>
          <span class="cap-exif">{exif_clean}</span>
        </figcaption>
      </figure>'''
    cards_html.append(card)

manzara_block = "\n".join(cards_html)

with open(gallery_path, 'r', encoding='utf-8') as f:
    gallery_content = f.read()

pattern = r'<figure class="photo-card" data-cat="manzara">.*?</figure>'
gallery_updated = re.sub(pattern, manzara_block, gallery_content, flags=re.DOTALL)

with open(gallery_path, 'w', encoding='utf-8') as f:
    f.write(gallery_updated)

print("Successfully updated gallery.html with 15 Çamkoru photos!")
