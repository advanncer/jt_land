import fs from 'fs';
import { JSDOM } from 'jsdom';
import https from 'https';

async function downloadPage() {
  console.log("Fetching skyeng.ru...");
  const html = await new Promise((resolve, reject) => {
    https.get('https://skyeng.ru/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  console.log("Parsing HTML with JSDOM...");
  const dom = new JSDOM(html);
  const document = dom.window.document;

  console.log("Cleaning up scripts and tracking...");
  const scripts = document.querySelectorAll('script');
  scripts.forEach(s => s.remove());

  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(i => i.remove());

  const noscripts = document.querySelectorAll('noscript');
  noscripts.forEach(n => n.remove());

  const links = document.querySelectorAll('link[href]');
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      l.setAttribute('href', 'https://skyeng.ru' + href);
    }
  });

  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && src.startsWith('/') && !src.startsWith('//')) {
      img.setAttribute('src', 'https://skyeng.ru' + src);
    }
  });

  const styles = document.querySelectorAll('style');
  styles.forEach(style => {
    if (style.textContent) {
      style.textContent = style.textContent.replace(/url\(\//g, 'url(https://skyeng.ru/');
    }
  });

  console.log("Writing to eng-adult/main/index.html...");
  fs.writeFileSync('eng-adult/main/index.html', dom.serialize());
  console.log("Done.");
}

downloadPage().catch(console.error);
