with open(r'c:\Artificial_Intelligence_Local\metic_clone\_next\static\chunks\45ad1bg1mn7jr.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = 'function r1(e){var t=Error(u(418'
replacement = 'function r1(e){try{console.error("HYDRATION FAILED AT:", e?.type, e?.memoizedProps, e?.stateNode?.textContent || e?.stateNode?.nodeName);}catch(err){};var t=Error(u(418'

if target in js:
    js = js.replace(target, replacement, 1)
    with open(r'c:\Artificial_Intelligence_Local\metic_clone\_next\static\chunks\45ad1bg1mn7jr.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Successfully patched 45ad1bg1mn7jr.js')
else:
    print('Target not found')
