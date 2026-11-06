Chip used for filter rows (subject, level, format) and for interest pickers in onboarding.

```jsx
<Tag selected onClick={toggle}>Англійська</Tag>
<Tag removable onRemove={drop}>Business</Tag>
```

Selected state is an orange 1.5px border on `--orange-25`, not a solid fill — reserve solid orange for buttons.
