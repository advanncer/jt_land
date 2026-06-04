import fs from 'fs';

let html = fs.readFileSync('eng-adult/main/index.html', 'utf8');

// Simple string replacements for key headings and texts
// Hero
html = html.replace(/№1 онлайн-школа английского языка/g, 'Уроки англійської мови онлайн у JustSchool');
html = html.replace(/Хочу на вводный урок/g, 'Спробувати зараз');
html = html.replace(/Занимайтесь один на один с&nbsp;опытным преподавателем/g, 'Заговоріть англійською вже на першому уроці. Персональний підхід, гнучкий графік.');

// Stats
html = html.replace(/893 627/g, '14 000+');
html = html.replace(/учеников из 45 стран/g, 'Активних студентів');
html = html.replace(/15 045/g, '1 500+');
html = html.replace(/преподавателей со всего мира/g, 'Викладачів');
html = html.replace(/50 530 040/g, '1 000 000+');
html = html.replace(/занятий с 2012 года/g, 'Проведених занять');

// Courses
html = html.replace(/Программы для любых целей с&nbsp;гарантией результата/g, 'Курси англійської мови для всіх вікових груп');
html = html.replace(/\+1&nbsp;уровень английского/g, 'Англійська для дошкільнят');
html = html.replace(/за&nbsp;3&nbsp;месяца/g, 'Вік: 4–5 років');

// Formats
html = html.replace(/Добейтесь реальных результатов с нашей экосистемой/g, 'Формати вивчення англійської мови онлайн');

// Teachers
html = html.replace(/15 045 преподавателей со всего мира/g, '1 500+ сертифікованих викладачів');

// Feedback
html = html.replace(/Истории наших учеников/g, 'Відгуки наших учнів');

// FAQ
html = html.replace(/Популярные вопросы/g, 'Поширені питання про онлайн-уроки');

// Logo replacement (finding the SVG and replacing its source or using a text/img tag)
// This is more robust via regex
html = html.replace(/https:\/\/cdn-user84632\.skyeng\.ru\/shared\/large-media\/skysmart\/layout\/logo\/skyeng-logo-dark-no-p\.svg/g, 'https://justschool.me/images/logo-uk.svg');
html = html.replace(/https:\/\/cdn-user84632\.skyeng\.ru\/shared\/large-media\/skysmart\/layout\/logo\/skyeng-logo-dark\.svg/g, 'https://justschool.me/images/logo-uk.svg');

fs.writeFileSync('eng-adult/main/index.html', html);
