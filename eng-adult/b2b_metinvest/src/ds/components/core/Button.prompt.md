Pill-shaped action button — the brand's single most recognisable control; use it for every commit action, from "Записатися на пробний урок" to in-app "Далі".

```jsx
<Button variant="primary" size="lg" onClick={book}>Записатися на пробний урок</Button>
```

- `variant`: `primary` (orange fill, white bold label — one per view), `secondary` (white with 1.5px grey border), `ghost` (orange label, no chrome), `inverse` (white fill on an orange section).
- `size`: `sm` 36px / `md` 44px / `lg` 56px. Marketing heroes use `lg`; in-app toolbars use `sm`.
- Hover deepens the fill one step and adds `--shadow-brand`; press scales to 0.97. Never add a radius override — buttons are always fully round.
