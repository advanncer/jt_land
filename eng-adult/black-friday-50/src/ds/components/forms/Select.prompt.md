Dropdown for subject, level, timezone and lesson-length pickers.

```jsx
<Select label="Рівень" options={['A1','A2','B1','B2']} value={lvl} onChange={setLvl}/>
```

Matches `Input` metrics exactly (48px, 12px radius, 1.5px border). The open panel uses `--shadow-lg` and highlights the current row in `--orange-25`.
