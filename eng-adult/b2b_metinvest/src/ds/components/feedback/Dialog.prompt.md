Modal for booking a trial lesson, confirming a cancellation, or a short form.

```jsx
<Dialog open={o} title="Скасувати урок?" description="Викладач отримає повідомлення." onClose={close}
  footer={<><Button variant="secondary" onClick={close}>Назад</Button><Button onClick={cancel}>Скасувати</Button></>}/>
```

The scrim is `rgba(20,20,20,.48)` with a 4px blur — the only place the system uses backdrop blur.
