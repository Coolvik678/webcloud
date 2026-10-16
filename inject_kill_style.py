import os

for filepath in [
    r'c:\Artificial_Intelligence_Local\metic_clone\en\index.html',
    r'c:\Artificial_Intelligence_Local\metic_clone\index.html'
]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    kill_style = '<style id="kill-black-screen">.preloader,html.intro .preloader,.intro .preloader{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html.intro{overflow:auto!important}body{overflow:auto!important;background-color:#f4f4f2!important}</style>'
    
    if 'id="kill-black-screen"' not in content:
        content = content.replace('</head>', kill_style + '</head>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected kill-black-screen style into {filepath}")
    else:
        print(f"kill-black-screen already present in {filepath}")
