import os, sys, time, json, subprocess, urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
USER_DATA = r"C:\Artificial_Intelligence_Local\metic_clone\.chrome_test_profile"

# Start Chrome with remote debugging
proc = subprocess.Popen([
    CHROME,
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    f"--user-data-dir={USER_DATA}",
    "--window-size=1440,900"
])

time.sleep(2)

try:
    # Get WebSocket debugger URL
    resp = urllib.request.urlopen("http://127.0.0.1:9222/json/version")
    ver_info = json.loads(resp.read().decode())
    print("Chrome version:", ver_info.get("Browser"))

    # Create new target / get pages
    resp_list = urllib.request.urlopen("http://127.0.0.1:9222/json/list")
    targets = json.loads(resp_list.read().decode())
    print(f"Active targets: {len(targets)}")
finally:
    proc.terminate()
