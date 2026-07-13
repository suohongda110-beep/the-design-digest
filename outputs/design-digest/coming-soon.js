(() => {
  const button = document.querySelector('.coming-soon-button');
  const note = document.querySelector('.subscription-note');
  if (!button || !note) return;

  button.addEventListener('click', () => {
    const isOpen = !note.hidden;
    note.hidden = isOpen;
    button.setAttribute('aria-expanded', String(!isOpen));
    if (!isOpen) note.focus();
  });
})();
