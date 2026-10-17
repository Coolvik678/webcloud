import os, glob, re

root = r'c:\Artificial_Intelligence_Local\metic_clone'

SAFE_EXCLUSIONS = {
    'arithmetic', 'automatic', 'automatically', 'dramatic', 
    'mathematical', 'programmatic', 'vmathematical', 'chromaticities',
    'metic_clone', '__meticgsap'
}

def clean_brand_text(text):
    original = text

    # Direct phrase replacements
    direct_subs = [
        ('https://metic.studio', 'https://webcloud.studio'),
        ('https://matic.studio', 'https://webcloud.studio'),
        ('metic.studio_official', 'webcloud_coorp'),
        ('metic.studio', 'webcloud.studio'),
        ('matic.studio', 'webcloud.studio'),
        ('@MeticStudio', '@WebCloud'),
        ('MeticStudio', 'WebCloud'),
        ('office@metic.studio', 'myovik@gmail.com'),
        ('hello@metic.studio', 'myovik@gmail.com'),
        ('+43 677 62054960', '+91 90768 88172'),
        ('+43 677 620 549 60', '+91 90768 88172'),
        ('closer \u2192 meticulous \u2192 metic.', 'digital \u2192 engineering \u2192 webcloud.'),
        ('closer \u2192 meticulous \u2192 metic', 'digital \u2192 engineering \u2192 webcloud'),
        ('closer &rarr; meticulous &rarr; metic.', 'digital &rarr; engineering &rarr; webcloud.'),
        ('genau \u2192 meticulous \u2192 metic.', 'pr\u00e4zise \u2192 architektur \u2192 webcloud.'),
        ('genau &rarr; meticulous &rarr; metic.', 'pr\u00e4zise &rarr; architektur &rarr; webcloud.'),
        ('metic. comes from meticulous: precise to the detail.', 'WebCloud: digital architecture engineered with precision.'),
        ('metic. from meticulous: precise to the detail.', 'WebCloud: digital architecture engineered with precision.'),
        ('metic. kommt von meticulous: detailgetreu.', 'WebCloud: digitale Architektur mit h\u00f6chster Pr\u00e4zision.'),
        ('metic. von meticulous: detailgetreu.', 'WebCloud: digitale Architektur mit h\u00f6chster Pr\u00e4zision.'),
        ('meticulous: too precise, some say.', 'WebCloud: engineered with precision.'),
        ('meticulous: zu genau, sagen manche.', 'WebCloud: mit Pr\u00e4zision gebaut.'),
        ('meticulous: zu genau', 'WebCloud: mit Pr\u00e4zision'),
        ('meticulous: too precise', 'WebCloud: engineered with precision'),
        ('New on YouTube: This is metic.', 'New on Instagram: This is WebCloud.'),
        ('New on YouTube, this is Magic', 'New on Instagram: This is WebCloud.'),
        ('New on YouTube, this is Matic', 'New on Instagram: This is WebCloud.'),
        ('New on YouTube: This is Matic', 'New on Instagram: This is WebCloud.'),
        ('metic. is now on YouTube.', 'WebCloud is now on Instagram.'),
        ('metic-first-edition', 'webcloud-first-edition'),
        ('Manuel Mayrhofer', 'WebCloud Corporation'),
        ('Linden 118, 4372 St. Georgen am Walde', 'WebCloud Digital Architecture Studio'),
        ('St. Georgen am Walde, Upper Austria', 'WebCloud Digital Architecture Studio'),
        ('St. Georgen am Walde, Ober\u00f6sterreich', 'WebCloud Digital Architecture Studio'),
        ('Design and software studio from Upper Austria. One person, both sides: design and code.', 'Web and digital architecture studio. Bespoke high-performance digital experiences and 3D web applications.'),
        ('Design und Software-Studio aus dem M\u00fchlviertel. Entwurf und Code aus einer Hand.', 'Web- und Digitalagentur. Besondere digitale Erlebnisse und ma\u00dfgeschneiderte Webanwendungen.'),
    ]

    for old, new in direct_subs:
        text = text.replace(old, new)

    # Word boundary regex replacements for metic and matic
    def replace_word(m):
        full = m.group(0)
        word = m.group(1)
        if word.lower() in SAFE_EXCLUSIONS:
            return full
        if word == 'Metic': return 'WebCloud'
        if word == 'metic': return 'webcloud'
        if word == 'METIC': return 'WEBCLOUD'
        if word == 'Matic': return 'WebCloud'
        if word == 'matic': return 'webcloud'
        if word == 'MATIC': return 'WEBCLOUD'
        return full

    text = re.sub(r'\b(m[ea]tic)\b', replace_word, text)
    return text

# Process all html and js files
count_modified = 0
for ext in ['*.html', '*.js']:
    for p in glob.glob(os.path.join(root, '**', ext), recursive=True):
        if any(skip in p for skip in ['.git', 'node_modules', '.vercel', 'scratch']):
            continue
        try:
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            cleaned = clean_brand_text(content)
            if cleaned != content:
                with open(p, 'w', encoding='utf-8') as f:
                    f.write(cleaned)
                count_modified += 1
                print(f'Cleaned: {os.path.relpath(p, root)}')
        except Exception as e:
            print(f'Error processing {p}: {e}')

print(f'\nTotal files modified: {count_modified}')
