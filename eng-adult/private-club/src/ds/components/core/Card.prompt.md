The workhorse surface — course tiles, teacher profiles, pricing plans, dashboard panels.

```jsx
<Card variant="raised" padding="lg" interactive onClick={open}>…</Card>
```

`raised` (white + `--shadow-sm`) is the default. `warm` uses `--orange-25` for zebra'd content sections; `brand` and `inverse` are for full-bleed promo blocks. Radius is always `--radius-xl` (24px) — never a colored left border.
