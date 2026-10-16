import os

for filepath in [
    r'c:\Artificial_Intelligence_Local\metic_clone\en\index.html',
    r'c:\Artificial_Intelligence_Local\metic_clone\index.html'
]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_theme = "if(sessionStorage.getItem('metic-intro')!=='1'&&!matchMedia('(prefers-reduced-motion: reduce), (min-height: 3000px)').matches){d.classList.add('intro')}"
    new_theme = "d.classList.remove('intro');try{sessionStorage.setItem('metic-intro','1');}catch(e){}"

    if old_theme in content:
        content = content.replace(old_theme, new_theme)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")
