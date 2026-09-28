# JustSchool Design System

JustSchool is an online English-language school. Teaching happens live on the company's own
platform — one-to-one lessons, small groups, speaking clubs, and a premium tier — for adults
and children, with a free trial lesson as the entry point. The audience is Ukrainian-speaking;
all interface and marketing copy in the source is Ukrainian.

This design system was extracted from a single attached Figma file. It covers two surfaces:

1. **Marketing website** — the redesigned homepage (desktop 1440, MacBook Pro 14 at 1280, and mobile).
2. **Student app** — represented in the file only by the adult student's left sidebar
   (`English_adult_student_menu`, 11 variants). No other app screens exist in the source, so
   `ui_kits/student_app/` shows that sidebar in a composed dashboard and says so plainly.

## Sources

- **`Redesign_MainPage_JustSchool.fig`** — attached and mounted read-only. Pages:
  `Design` (16 frames, incl. `JustSchool_Homepage_desktop` node `312:1428`,
  `JustSchool_Homepage_MacbookPro14`, `JustSchool_Homepage_Mob`, five carousel tracks),
  `UI-Kit` (8 frames: Buttons, Buttons2, Links, Tabs, Text field, Other,
  `UI Kit / Colors Full`, `UI Kit / Typography` node `382:20364`), and `Draft` (5 frames of
  landing-page inventory and Coda/Google references).
- No GitHub repository, codebase, deck, or live URL was provided. Everything here is read
  from the .fig; nothing is inferred from public material about the brand.

## Content fundamentals

**Language.** Ukrainian throughout. Latin script appears only in product names
(`Just Premium`, `Justsmart`, `JustSchool`, `Self - study`, `Speaking Club`, `AppStore`)
and in CEFR levels (`A2`, `B1`).

**Voice.** Plain, concrete, second-person plural — the polite "ви" form, addressed to the
learner: *"Отримайте безкоштовний демо-урок та персональний план розвитку."*,
*"Ви побачите формат уроків зсередини та зрозумієте, чи підходить вам підхід JustSchool."*
The brand never speaks as "we" about itself in body copy; it speaks about what the student
will get and how long it will take.

**Headlines** state the benefit, then name the company: *"Заговоріть англійською вільно з
JustSchool"*, *"JustSchool — онлайн-школа англійської мови, якій довіряють"*. Section
headings are descriptive and SEO-shaped rather than clever — *"Формати вивчення англійської
мови онлайн"*, *"Як розпочати вивчення англійської мови онлайн"*, *"Відгуки наших учнів про
уроки англійської мови"*. They almost always contain the words "англійськ-" and "онлайн".

**Proof is numeric and unrounded-looking.** `100 000+`, `3 800 000+`, `17 000+`, `1 700+`,
`95%`, `4.6/5`, `4.9/5`. Every number is paired with a lowercase caption that completes the
sentence: *"випускників, які досягли своїх цілей"*, *"успішно проведених занять"*.

**Time is always quantified.** Steps carry durations: `1-2 хвилини`, `30-40 хвилин`,
`Старт одразу`, `60 хв`, `Тривалість: 30 хвилин`. Nothing says "quickly" when it can say
"1-2 хвилини".

**Casing.** Sentence case everywhere. The only uppercase is the 10px eyebrow label in the
typography specimen (`DESKTOP`, `MOBILE HEADINGS`, `BODY LARGE · 16PX`) with 0.12em tracking.
No ALL-CAPS buttons or headings.

**Punctuation.** The middot `·` separates metadata (`Онлайн-урок · Speaking Club · A2`).
Em dashes appear in taglines (*"Англійська — це просто, коли з JustSchool"*). Parenthetical
qualifiers sit on their own line under a card title: `(для учнів)`.

**CTAs** are verbs in the imperative: `Спробувати зараз`, `Записатися на пробний урок`,
`Зареєструватися`, `Увійти`, `Дізнатися більше`, `Залиште заявку`.

**No emoji** anywhere in the marketing surfaces. The student sidebar has one layer named
`Emoji+label`, but the glyph in it is a vector icon, not an emoji character.

## Visual foundations

**Colour.** One brand hue carries everything: orange. The file draws it in three near-identical
values — `#F46600` for UI controls, `#F56600` for headlines and icon glyphs, `#F16600` for
links, pill tabs and social circles — and the token set keeps all three rather than collapsing
them. Interaction states are hand-picked rather than algorithmic: hover lightens to `#F5AC72`,
pressed darkens to a muted brown-orange `#BF6823`, disabled goes fully neutral to `#E5E5E5`.
Text is `#09090A` or pure black; secondary text runs through a long grey ladder
(`#65676B`, `#747474`, `#858585`, `#8F8F8F`). The Figma variable collection adds five 11-step
ramps — orange, hot orange, yellow, green, violet — used almost entirely at the 50–200 end as
pastel fills. Both variable modes carry identical values, so there is no dark theme.

**Type.** Montserrat is the brand face and does nearly all the work, across 32 named styles
from 8px Nano to 56px Desktop H1. Roboto appears only inside the older UI-Kit control labels
(buttons, cells, frame titles); Inter only in micro-copy. Headings are always Bold; the two
largest sit at 110% line-height and everything else is "Auto", with 135% reserved for
multi-line Regular body text. There is no serif, no display face, and no italic.

**Layout.** Desktop pages are 1440 wide with 140px side gutters and an 1152px content column;
the teachers band drops to 120px. Sections are 80px top and bottom (48px for the proof grid),
with a 33px gap between heading and content. Carousels are horizontal tracks with a 16px gap
and cards that stretch to equal height. The header is a 1440 × 123 white bar with a 24px
radius and sits above the hero.

**Backgrounds.** Overwhelmingly plain white. Two warm tints do the accenting (`#FFFAF7`,
`#FFF5EB`); one grey panel (`#F5F5F5`) holds the FAQ; the footer legal bar is `#E9E9E9`.
Exactly two gradients exist: the CTA orange (`#F16600 → #F34500` at 69.559°) and the amber
stat card (`#FFC233 → #FFA500`, vertical). No repeating patterns, no textures, no noise.

**Imagery.** Warm, bright, daylight photography of students and teachers — real faces, shallow
depth of field, no colour grading toward cool. The hero composes a cut-out portrait over a
painterly brush-stroke bitmap that is masked into a hand-drawn polygon and tinted with a `hue`
blend layer — a deliberately crafted, slightly illustrative edge rather than a clean rectangle.
Photos are always inside rounded containers.

**Corners.** A wide, deliberately un-systematised radius set: 5, 8, 10, 12, 14, 16, 20, 22, 24,
32, plus the 100px pill and full circles. Text buttons are pills; header buttons are 10px;
cards are 20 or 24; the FAQ panel and pill-tab track are 24; small badges are 5 or 8.

**Cards** are white, radius 20–24, and carry the signature asymmetric shadow
`-2px 4px 9px 1px rgba(0,0,0,0.09)` — offset left and down, which is unusual and is the most
recognisable elevation cue in the system. They have no border. Four other shadows exist: the
header's wide soft `0 4px 32px rgba(0,0,0,0.04)`, a `0 2px 8px rgba(0,0,0,0.08)` soft lift, a
`0 4px 8px rgba(0,0,0,0.08)` lifted state, and the CTA's `0 4px 32px rgba(0,0,0,0.09)`. The
pastel hero chips use an *inner* white glow instead: `inset 0 0 15.9px rgba(255,255,255,0.74)`.

**Borders** are 1px inset box-shadows rather than CSS borders in the source geometry, which is
why control sizes stay exact. Field and button hairlines step `#E5E5E5 → #CDCDCD → #747474`
across idle, hover and pressed.

**Interaction.** Hover lightens (primary fill to `#F5AC72`, link to `#FF8B36`, social circles
to 80% alpha); press darkens (`#BF6823`). Secondary controls change only their hairline.
Nothing scales, shrinks, or bounces. Links underline on hover only in the large arrow-link
variant. The file specifies no easing curves or durations — the tokens here
(`--duration-base: 200ms`, a standard cubic-bezier) are a neutral addition, flagged below.

**Transparency and blur.** Used sparingly and never as glass: a 30% orange for inactive
pagination dots, 50% apricot for the hero's soft background ellipse, 80% alpha on social
hover, and the inner white glow on chips. No backdrop-filter anywhere.

**Decorative geometry.** The hero tilts its four pastel stat chips by 3–9° and floats a large
blurred-looking ellipse behind the portrait. This is the only place in the system where things
sit off-axis, and it is intentional.

## Components

Built from the source's component inventory, grouped by concern.

- **Buttons** — `Button`, `ActionButton`, `CircleButton`, `AddAction`
- **Forms** — `TextField`, `Checkbox`
- **Navigation** — `Tabs`, `Link`, `NavItem`, `HeaderButton`, `Pagination`, `StudentMenu`
- **Cells** — `CellMain`, `CellHeadline`, `CellTextRightIcon`
- **Brand** — `Logo`
- **Icons** — `Icon`
- **Media** — `SocialLinks`
- **Site blocks** — `SectionHeading`, `FeatureItem`, `TrustChip`, `StatChip`, `StatCard`,
  `FormatCard`, `StepCard`, `FaqRow`, `CtaPanel`

Each directory holds `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and one `@dsCard` HTML.

### Mapping to the source's component families

| Source family | Built as |
| --- | --- |
| `Button_primary_*` / `Button_secondary_*` (10 symbols), `Button_primary` (3 variants) | `Button` |
| `action_button_primary_*` / `action_button_secondary_*` (8 symbols) | `ActionButton` |
| `Circle button_m_*`, `Circle button_s_default` (6 symbols) | `CircleButton` |
| `action_button add_default` (4 variants) | `AddAction` |
| Text field states in the `Text field` frame | `TextField` |
| `CheckBox` in the `Other` frame | `Checkbox` |
| `Frame 41591` / `Frame 41597` in the `Tabs` frame | `Tabs` |
| `Link` (2 variants), `Frame 1175` (×2, = `Property 1=Variant2`), the 21px arrow link | `Link` |
| `Frame 1174` / `Frame 1176` header items | `NavItem` |
| `a` (×4) — header anchors | `HeaderButton` |
| `Ellipse 7` pagination row in `Other` | `Pagination` |
| `English_adult_student_menu` (11 variants) | `StudentMenu` |
| `cell_main`, `cell_headline`, `cell_text+ right icon` | three `components/cells` files |
| `Logo justschool` + four brand-supplied lockups | `Logo` + `assets/brand/*.svg` |
| `ic16x16 arrow`, `favorite_border`, `fi:chevron-right`, `homework`, `ic24x24 volume-2`, `ic24x24/arrow-drop-down`, `star`, plus the supplied 46-icon 24px set | `Icon` (`components/icons/icon-data.js`) |
| `Group 4` / `Group 42` social rows in `Other` | `SocialLinks` |
| `format-card`, `feature-item`, `Frame 1321316600`, step/stat/FAQ/CTA frames on the homepage | `components/site/*` |

### Not built

- **`btn`, `button`, `Frame 41615`, `Group 1154`, `Group 40212`, `Group 41628`, `Group 610`** —
  auto-named two-to-four-variant sets with no resolvable instances anywhere in the extracted
  JSX, so there is nothing to recreate faithfully. Point me at them in Figma and I will build them.
- **Store buttons** (App Store / Google Play badges in the `Other` frame) — drawn as 45 + 15
  undecodable vector fragments; no usable geometry or SVG export came out of the file. These are
  third-party badges and should come from Apple's and Google's own asset kits.
- **Six icons** — `close`, `ic_support`, `icons/angle-left`, `icons/gift`, `Icons/profile`,
  `Icons_lessons/dumbbell_sport` — are boolean-operation vectors in the .fig that did not decode.
  Four of them now have close equivalents in the supplied 24px brand set (`ShieldCheck`/`Check`,
  `ChevronRight`, `UserCircle`, `Dumbbell`), so use those instead.

### Intentional additions

- `Icon` — a thin wrapper over the extracted glyph map; the source has loose symbols, not an
  icon component.
- `SectionHeading` — the 42/110% black section title is a repeated text style rather than a
  named component, promoted here because every marketing section uses it.
- `--duration-*` and `--ease-standard` tokens — the file specifies no motion; these are neutral
  defaults so consumers have something consistent to reach for.

## Iconography

There is **no icon font and no sprite sheet**. Icons are individual SVGs, drawn on a 24 × 24
grid at roughly 2px stroke weight, single-colour, almost always in brand orange. A few sit at
16 × 16 (`ic16x16 arrow`) and 18 × 18 (inline checks, chip glyphs). Inside cards, icons sit in a
tinted disc: 44px at `--radius-icon-wrap` filled `#FFF5EB` for format cards, 36px filled with a
per-chip pastel in the hero strip.

Two sources feed one map (`components/icons/icon-data.js`, rendered via
`<Icon name="…" size={…} />`, names in `Icon.d.ts`):

- **Nine glyphs extracted from the .fig** — `favorite_border`, `fi:chevron-right`, `homework`,
  `ic16x16 arrow` (two variants), `ic24x24/arrow-drop-down`, `ic24x24 volume-2`, `star`, and the
  logo. These follow `currentColor`.
- **The 46-icon brand set** supplied separately as a single 24px sheet — people, education,
  communication, time, social and chevron glyphs. Split out into `assets/icons/set24/` one file
  per icon (kebab-case names) and added to the same map. Their strokes are **hard-coded
  `#F46600`**, so they ignore `currentColor`; edit the file if you need another colour.

Names for the brand set are descriptive, not authored — the sheet carries no layer names, so
`Brain`, `Teacher`, `Translate`, `Diamond` and `Asterisk` are a best reading of the glyph.

Other raw SVGs copied out of the .fig live in `assets/icons/`: section glyphs
(`message-circle.svg`, `hero-vector.svg`, `glyph-2…8.svg`, `back.svg`), the checkbox tick, the
social globe, and the student-sidebar nav glyphs.

`assets/brand/` holds five lockups — `logo.svg` (the mark extracted from the .fig, used in the
header), plus the brand-supplied `logo-horizontal-black.svg`, `logo-horizontal-white.svg`,
`logo-vertical.svg` and `logo-sticker.svg` — and `justsmart.svg`, the JustSmart sub-brand mark
from the footer.

**Emoji are never used as icons.** Unicode characters are used as punctuation only — the
middot `·` in metadata, the em dash in taglines, `©` in the footer.

## Index

```
readme.md                  this file
SKILL.md                   agent-skill entry point
styles.css                 global CSS entry — @import list only
thumbnail.html             homepage tile
tokens/
  fonts.css                @font-face for the self-hosted Montserrat + Roboto variable fonts
  fig-tokens.css           58 Figma Variables, both modes
  fig-typography.css       generated (the file defines no Figma text styles)
  colors.css               literal palette + semantic aliases
  typography.css           type scale + one utility class per named style
  layout.css               spacing, radii, shadows, page metrics, motion
  base.css                 element defaults and link colours
components/
  brand/     Logo
  buttons/   Button, ActionButton, CircleButton, AddAction
  cells/     CellMain, CellHeadline, CellTextRightIcon
  forms/     TextField, Checkbox
  icons/     Icon + icon-data.js (55 glyphs)
  media/     SocialLinks
  navigation/ Tabs, Link, NavItem, HeaderButton, Pagination, StudentMenu
  site/      SectionHeading, FeatureItem, TrustChip, StatChip, StatCard,
             FormatCard, StepCard, FaqRow, CtaPanel
guidelines/                25 foundation specimen cards (Colors, Type, Spacing, Brand)
templates/
  website/                 "Marketing homepage" template (Website.dc.html)
  student-app/             "Student dashboard" template (StudentApp.dc.html)
ui_kits/
  website/                 JustSchool homepage recreation — see its README.md
  student_app/             Student dashboard around the source sidebar — see its README.md
assets/
  brand/                   logo.svg (.fig mark), logo-horizontal-black/white.svg,
                           logo-vertical.svg, logo-sticker.svg, justsmart.svg
  fonts/                   Montserrat + Roboto variable TTFs and their OFL licences
  icons/                   SVGs copied verbatim from the file
  icons/set24/             the 46-icon 24px brand set, one file per icon
  icons/                   SVGs copied verbatim from the file
  imagery/                 hero portrait, brush bitmap, photos, student avatar
```

## Caveats

- **Fonts are self-hosted.** Montserrat and Roboto were supplied by the user as variable-font
  TTFs and live in `assets/fonts/`, declared in `tokens/fonts.css` (SIL Open Font License texts
  alongside them). **Inter was not supplied** — it is used only for micro-copy in the source, and
  `--font-micro` falls back to the system UI stack. Send an Inter file if that matters.
- **The logo is real, and there are five lockups.** `assets/brand/` carries the mark extracted
  from the .fig plus the four brand-supplied files you sent (horizontal black, horizontal white,
  vertical, sticker). Nothing here is drawn or approximated.
- **Brand-set icon names are my reading of the glyphs**, since the supplied sheet has no layer
  names. Correct any that are wrong and they can be renamed.
- **Both Figma variable modes are identical**, so there is no dark or alternate theme to ship.
- **No Figma text styles exist** in the file — the 32-style scale was read from the
  `UI Kit / Typography` specimen frame, not from bound styles, so `fig-typography.css` is empty
  and the scale lives in `tokens/typography.css`.
