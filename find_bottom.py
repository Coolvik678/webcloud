import re

html = open(r'c:\Artificial_Intelligence_Local\metic_clone\dump.html', encoding='utf-8').read()
matches = re.findall(r'class="([^"]*bottom[^"]*)"', html)
for m in set(matches):
    if 'fixed' in m or 'absolute' in m or 'pill' in m or 'rounded' in m:
        print(m)
