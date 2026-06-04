import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('eng-adult/main/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// 1. Replace Logo
const logoImg = document.querySelector('header img[alt="Skyeng"]');
if (logoImg) {
    logoImg.setAttribute('src', 'https://justschool.me/images/logo-uk.svg');
    logoImg.setAttribute('alt', 'JustSchool');
}

// 2. Add Hamburger Menu (if not present or visible)
// The original site usually has a mobile menu. Let's ensure a prominent one exists.
// We'll inject a simple hamburger if it's not clear.
const headerRight = document.querySelector('.header-right') || document.querySelector('header div:last-child');
if (headerRight && !document.querySelector('.js-hamburger')) {
    const hamburger = document.createElement('button');
    hamburger.className = 'js-hamburger xl:hidden p-2 ml-4';
    hamburger.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    headerRight.appendChild(hamburger);
}

// 3. Update Hero Section
const h1 = document.querySelector('h1');
if (h1) {
    h1.innerHTML = 'Заговоріть англійською<br>вже на першому уроці';
}

const heroSubtext = document.querySelector('cism-home-top-form .subtitle') || document.querySelector('h1 + p') || document.querySelector('h1').parentElement.querySelector('.description');
// Finding the hero paragraph is tricky in the messy cloned HTML. Let's try to find based on content or proximity.
// For Skyeng specifically, it might be in a different component.
const heroFormTitle = document.querySelector('cism-home-top-form .title');
if (heroFormTitle) {
    // Usually "№1 онлайн-школа..."
}

// JustSchool marketing text mapping:
const sections = [
    {
        title: 'Уроки англійської мови онлайн у JustSchool',
        sub: 'Заговоріть англійською вже на першому уроці. Персональний підхід, гнучкий графік, сертифіковані викладачі та сучасні формати навчання для дітей і дорослих.'
    }
];

// Helper to replace text in specific blocks
function replaceText(selector, newText) {
    const el = document.querySelector(selector);
    if (el) el.textContent = newText;
}

// Replacing Statistics
const stats = document.querySelectorAll('.buble .title');
const labels = document.querySelectorAll('.buble .subtitle');
if (stats.length >= 4) {
    stats[0].textContent = '8+ років'; labels[0].textContent = 'Досвіду';
    stats[1].textContent = '14 000+'; labels[1].textContent = 'Активних студентів';
    stats[2].textContent = '1 000 000+'; labels[2].textContent = 'Занять';
    stats[3].textContent = '1 500+'; labels[3].textContent = 'Викладачів';
}

// Replacing Course Cards
const courseTitles = document.querySelectorAll('cism-programs-cms-component .aside-item-title');
const courseDescs = document.querySelectorAll('cism-programs-cms-component .aside-item-description');
const courseContentTitles = document.querySelectorAll('cism-programs-cms-component .title');

if (courseContentTitles[0]) courseContentTitles[0].textContent = 'Курси англійської мови для всіх вікових груп';

const courses = [
    { t: 'Англійська для дошкільнят', d: 'Вік: 4–5 років | Рівень: Pre-A1' },
    { t: 'Англійська для дітей та підлітків', d: 'Вік: 6–17 років | Рівень: A1–B2' },
    { t: 'Англійська для дорослих', d: 'Вік: 18+ | Рівень: A1–C1' },
    { t: 'Підготовка до іспитів', d: 'IELTS / TOEFL / НМТ / ЄВІ' }
];

courseTitles.forEach((el, i) => {
    if (courses[i]) {
        el.textContent = courses[i].t;
        if (courseDescs[i]) courseDescs[i].textContent = courses[i].d;
    }
});

// Replace "How it works" or "Why us"
const ecosystemTitle = document.querySelector('h2.title'); // This is very generic, need more specific
// Find by text content
const allH2 = Array.from(document.querySelectorAll('h2'));
const ecoH2 = allH2.find(h => h.textContent.includes('Добейтесь реальных результатов'));
if (ecoH2) {
    ecoH2.textContent = 'Що входить в уроки англійської мови в JustSchool';
}

// Pricing
const prices = document.querySelectorAll('.card-price'); // Hypothetical, need actual selector from file
// Since we don't have exact selectors, we'll try to find the "Стоимость обучения" section
const priceH2 = allH2.find(h => h.textContent.includes('Стоимость обучения'));
if (priceH2) {
    priceH2.textContent = 'Вартість уроків англійської мови в JustSchool';
}

// Final output
fs.writeFileSync('eng-adult/main/index.html', dom.serialize());
