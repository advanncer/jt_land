import os
import sys
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials

SPREADSHEET_ID = '12i6aYTfTqXyCTYwOw4PvlWLmQcuJdSExI6_5B9p5zN0'
CREDENTIALS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ga-credentials.json')

CATEGORIES = [
    {
        "category": "👦 АНГЛІЙСЬКА ДЛЯ ДІТЕЙ (English for Children)",
        "items": [
            {
                "id": "eng-child/quiz-plan",
                "product": "Англійська для дітей",
                "audience": "Батьки дітей 4–17 років",
                "url": "https://lp.justschool.me/eng-child/quiz-plan/?leadType=english-for-children",
                "lead_type": "english-for-children",
                "description": "13-кроковий квіз-план з динамічною персоналізацією за іменем дитини, вибором статі, віку, рівня знань, мети та інтенсивності занять.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead, Purchase\nCRM: qa, utm_subject=Child"
            },
            {
                "id": "eng-child/quiz-bo-v1",
                "product": "Англійська для дітей",
                "audience": "Батьки дітей шкільного віку",
                "url": "https://lp.justschool.me/eng-child/quiz-bo-v1/?leadType=english-for-children",
                "lead_type": "english-for-children",
                "description": "13-кроковий класичний квіз з виявленням шкільних труднощів, мовного бар'єру та підбором викладача.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-child/quiz-bo-v1-white",
                "product": "Англійська для дітей",
                "audience": "Батьки дітей (A/B тест)",
                "url": "https://lp.justschool.me/eng-child/quiz-bo-v1-white/?leadType=english-for-children",
                "lead_type": "english-for-children",
                "description": "Світла колірна варіація квізу quiz-bo-v1 для спліт-тестування візуалу та конверсії.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-child/lp-js-child",
                "product": "Англійська для дітей",
                "audience": "Батьки школярів",
                "url": "https://lp.justschool.me/eng-child/lp-js-child/?leadType=english-for-children",
                "lead_type": "english-for-children",
                "description": "Швидкий квіз-лендинг із фокусом на подолання мовного бар'єру та підвищення оцінок у школі.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            }
        ]
    },
    {
        "category": "💻 ПРОГРАМУВАННЯ ДЛЯ ДІТЕЙ (Programming for Children)",
        "items": [
            {
                "id": "prog/quiz-plan",
                "product": "Програмування для дітей",
                "audience": "Батьки дітей 6–17 років (Roblox, Python, Сайти, Game Design)",
                "url": "https://lp.justschool.me/prog/quiz-plan/?leadType=programming-for-children",
                "lead_type": "programming-for-children",
                "description": "10-кроковий тест із реальними MP4 відео-прев'ю робіт учнів, підбором курсу (Scratch, Roblox, Python, Web) та персоналізацією плану.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead, Purchase\nCRM: qa, utm_subject=programming"
            }
        ]
    },
    {
        "category": "👨‍💼 АНГЛІЙСЬКА ДЛЯ ДОРОСЛИХ (English for Adults)",
        "items": [
            {
                "id": "eng-adult/quiz-plan",
                "product": "Англійська для дорослих",
                "audience": "Дорослі студенти (18+)",
                "url": "https://lp.justschool.me/eng-adult/quiz-plan/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "12-кроковий квіз-план з інтерактивним тестом слів на матриці, оцінкою рівня знань, мети (робота, подорожі, переїзд) та графіка занять.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead, Purchase\nCRM: qa, utm_subject=English"
            },
            {
                "id": "eng-adult/120-days",
                "product": "Англійська для дорослих",
                "audience": "Дорослі (інтенсивний курс)",
                "url": "https://lp.justschool.me/eng-adult/120-days/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Промо-лендинг флагманської програми «Англійська за 120 днів» з формою швидкої заявки.",
                "analytics": "GA4: form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp-check-up",
                "product": "Англійська для дорослих",
                "audience": "Дорослі (комплексний тест)",
                "url": "https://lp.justschool.me/eng-adult/lp-check-up/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Комплексний мовний чек-ап із детальним тестом граматики, словникового запасу та аудіювання.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp-check-up-dark",
                "product": "Англійська для дорослих",
                "audience": "Дорослі (A/B темна тема)",
                "url": "https://lp.justschool.me/eng-adult/lp-check-up-dark/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Преміум темна версія мовного чек-апу для спліт-тестування конверсії.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp-reviews",
                "product": "Англійська для дорослих",
                "audience": "Дорослі (соціальний доказ)",
                "url": "https://lp.justschool.me/eng-adult/lp-reviews/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Квіз-лендинг із великою кількістю відгуків реальних учнів, кейсів та інтерактивних запитань.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp-js-adult",
                "product": "Англійська для дорослих",
                "audience": "Дорослі початківці",
                "url": "https://lp.justschool.me/eng-adult/lp-js-adult/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Швидкий базовий квіз із сегментацією за цілями (робота, переїзд, подорожі, розмовна практика).",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp1",
                "product": "Англійська для дорослих",
                "audience": "Загальна доросла аудиторія",
                "url": "https://lp.justschool.me/eng-adult/lp1/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Класичний 15-кроковий квіз JustSchool із детальною кваліфікацією ліда.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp1-tg",
                "product": "Англійська для дорослих",
                "audience": "Трафік на Telegram-воронку",
                "url": "https://lp.justschool.me/eng-adult/lp1-tg/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Квіз із перенаправленням та видачею подарунка через Telegram-бота після проходження.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/lp_pains",
                "product": "Англійська для дорослих",
                "audience": "Аудиторія з мовними бар'єрами",
                "url": "https://lp.justschool.me/eng-adult/lp_pains/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Глибокий 22-кроковий квіз, що детально розбирає та закриває ключові страхи учнів.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "eng-adult/main",
                "product": "Англійська для дорослих",
                "audience": "Органічний / Прямий трафік",
                "url": "https://lp.justschool.me/eng-adult/main/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Головна презентаційна сторінка школи для дорослих з описом методики та формою запису на пробний урок.",
                "analytics": "GA4, FB Pixel"
            }
        ]
    },
    {
        "category": "🎁 БЕЗКОШТОВНІ ПРОДУКТИ / СПЕЦПРОЄКТИ / ЛІД-МАГНІТИ",
        "items": [
            {
                "id": "blogger/lp1",
                "product": "Англійська (Блогери)",
                "audience": "Трафік від інфлюенсерів",
                "url": "https://lp.justschool.me/blogger/lp1/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Спеціальний квіз-лендинг під блогерські інтеграції та промокоди.",
                "analytics": "GA4: quiz_step_reach, form_success\nFB Pixel: Lead"
            },
            {
                "id": "free-products/astro-english",
                "product": "Гейміфікація / Промо",
                "audience": "Широка розважальна аудиторія",
                "url": "https://lp.justschool.me/free-products/astro-english/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Інтерактивний астрологічний квіз «Астро-Англійська» (гороскоп + підбір формату навчання).",
                "analytics": "GA4, FB Pixel: Lead"
            },
            {
                "id": "free-products/combo-lead-magnit",
                "product": "Безкоштовний лід-магніт",
                "audience": "Холодний трафік на корисні матеріали",
                "url": "https://lp.justschool.me/free-products/combo-lead-magnit/?leadType=english-for-adults",
                "lead_type": "english-for-adults",
                "description": "Лендинг роздачі комбо-паку безкоштовних навчальних гайдів та матеріалів в обмін на контакти.",
                "analytics": "GA4, FB Pixel: Lead"
            }
        ]
    }
]

def sync():
    scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SPREADSHEET_ID)
    ws = sh.worksheet('Лист1')
    
    # Clear sheet
    ws.clear()
    
    headers = [
        "Назва / ID воронки",
        "Продукт / Напрямок",
        "Цільова аудиторія",
        "URL лендингу",
        "leadType (CRM тег)",
        "Опис та механіка воронки",
        "Аналітика та трекінг",
        "Останнє оновлення"
    ]
    
    rows = [headers]
    category_row_indices = []
    
    updated_at = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    for cat in CATEGORIES:
        category_row_indices.append(len(rows) + 1)
        rows.append([cat["category"], "", "", "", "", "", "", ""])
        for item in cat["items"]:
            rows.append([
                item["id"],
                item["product"],
                item["audience"],
                item["url"],
                item["lead_type"],
                item["description"],
                item["analytics"],
                updated_at
            ])
        rows.append(["", "", "", "", "", "", "", ""]) # Spacer
        
    ws.update(rows, 'A1')
    
    # Apply formatting
    sheet_id = ws.id
    
    requests = [
        # Format Header Row
        {
            "repeatCell": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "endRowIndex": 1,
                    "startColumnIndex": 0,
                    "endColumnIndex": 8
                },
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": {"red": 0.15, "green": 0.15, "blue": 0.25},
                        "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}, "fontSize": 10},
                        "horizontalAlignment": "CENTER",
                        "verticalAlignment": "MIDDLE",
                        "wrapStrategy": "WRAP"
                    }
                },
                "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)"
            }
        },
        # Freeze Top Header Row
        {
            "updateSheetProperties": {
                "properties": {
                    "sheetId": sheet_id,
                    "gridProperties": {
                        "frozenRowCount": 1
                    }
                },
                "fields": "gridProperties.frozenRowCount"
            }
        }
    ]
    
    # Format Category Rows
    for r_idx in category_row_indices:
        requests.append({
            "repeatCell": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": r_idx - 1,
                    "endRowIndex": r_idx,
                    "startColumnIndex": 0,
                    "endColumnIndex": 8
                },
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": {"red": 0.93, "green": 0.94, "blue": 0.98},
                        "textFormat": {"bold": True, "foregroundColor": {"red": 0.2, "green": 0.2, "blue": 0.5}, "fontSize": 11},
                        "verticalAlignment": "MIDDLE"
                    }
                },
                "fields": "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
            }
        })
        # Merge category header cells across columns
        requests.append({
            "mergeCells": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": r_idx - 1,
                    "endRowIndex": r_idx,
                    "startColumnIndex": 0,
                    "endColumnIndex": 8
                },
                "mergeType": "MERGE_ALL"
            }
        })

    # Set column widths
    col_widths = [180, 160, 200, 360, 180, 320, 220, 130]
    for col_idx, width in enumerate(col_widths):
        requests.append({
            "updateDimensionProperties": {
                "range": {
                    "sheetId": sheet_id,
                    "dimension": "COLUMNS",
                    "startIndex": col_idx,
                    "endIndex": col_idx + 1
                },
                "properties": {
                    "pixelSize": width
                },
                "fields": "pixelSize"
            }
        })

    sh.batch_update({"requests": requests})
    print("SUCCESS: Google Sheet updated and styled successfully!")

if __name__ == "__main__":
    sync()
