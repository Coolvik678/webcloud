async function check() {
  const res = await fetch('https://webcloud-corporation.vercel.app');
  const html = await res.text();
  
  const cssMatches = html.match(/href="([^"]+\.css)"/g) || [];
  const jsMatches = html.match(/src="([^"]+\.js)"/g) || [];
  
  console.log('Found CSS:', cssMatches);
  console.log('Sample JS:', jsMatches.slice(0, 5));
  
  for (const m of cssMatches) {
    const urlPath = m.replace('href="', '').replace('"', '');
    const fullUrl = new URL(urlPath, 'https://webcloud-corporation.vercel.app').href;
    const r = await fetch(fullUrl);
    console.log(`CSS: ${fullUrl} -> ${r.status} ${r.headers.get('content-type')}`);
  }

  for (const m of jsMatches.slice(0, 3)) {
    const urlPath = m.replace('src="', '').replace('"', '');
    const fullUrl = new URL(urlPath, 'https://webcloud-corporation.vercel.app').href;
    const r = await fetch(fullUrl);
    console.log(`JS: ${fullUrl} -> ${r.status} ${r.headers.get('content-type')}`);
  }
}
check().catch(console.error);
