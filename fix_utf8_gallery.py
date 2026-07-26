# -*- coding: utf-8 -*-
with open(r"C:\Users\user\.gemini\antigravity\scratch\ogifotografi\gallery.html", "rb") as f:
    content = f.read().decode("utf-8", errors="ignore")

content = content.replace("FotoÄŸraflar yakÄ±nda eklenecek â€” aÅŸaÄŸÄ±daki kartlar yer tutucudur. Kategoriye gÃ¶re filtreleyebilirsiniz.", "Fotoğraflar yakında eklenecek — aşağıdaki kartlar yer tutucudur. Kategoriye göre filtreleyebilirsiniz.")
content = content.replace("â†  Ana Sayfaya DÃ¶n", "← Ana Sayfaya Dön")
content = content.replace("TÃ¼mÃ¼", "Tümü")
content = content.replace("Buz Hokeyi", "Buz Hokeyi")

with open(r"C:\Users\user\.gemini\antigravity\scratch\ogifotografi\gallery.html", "wb") as f:
    f.write(content.encode("utf-8"))

print("Fixed gallery.html UTF-8 successfully!")
