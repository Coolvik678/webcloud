with open(r'c:\Artificial_Intelligence_Local\metic_clone\_next\static\chunks\45ad1bg1mn7jr.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = 'function r1(e){try{console.error("HYDRATION FAILED AT:", e?.type, e?.memoizedProps, e?.stateNode?.textContent || e?.stateNode?.nodeName);}catch(err){};var t=Error(u(418'
orig = 'function r1(e){var t=Error(u(418'

if target in js:
    js = js.replace(target, orig, 1)
    with open(r'c:\Artificial_Intelligence_Local\metic_clone\_next\static\chunks\45ad1bg1mn7jr.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Cleaned 45ad1bg1mn7jr.js successfully')
else:
    print('Target not found')
