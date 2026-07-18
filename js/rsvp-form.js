function initRSVPForm() {
  const form = document.querySelector('[data-testid="rsvp-form"]');
  if (!form) return;

  const nameInput = form.querySelector('[data-testid="rsvp-name"]');
  const emailInput = form.querySelector('[data-testid="rsvp-email"]');
  const attendingYes = form.querySelector('[data-testid="rsvp-attending-yes"]');
  const attendingNo = form.querySelector('[data-testid="rsvp-attending-no"]');
  const adultSelect = form.querySelector('[data-testid="rsvp-adult-count"]');
  const kidSelect = form.querySelector('[data-testid="rsvp-kid-count"]');
  const guestCountSection = form.querySelector('[data-testid="rsvp-guest-count-section"]');
  const messageInput = form.querySelector('[data-testid="rsvp-message"]');
  const submitButton = form.querySelector('[data-testid="rsvp-submit"]');

  let attending = 'yes';

  const MAX_ADULT_COUNT = 4;
  const MAX_KID_COUNT = 4;

  function setAttending(value) {
    attending = value;

    [attendingYes, attendingNo].forEach((button) => {
      if (!button) return;
      const isSelected =
        (value === 'yes' && button === attendingYes) ||
        (value === 'no' && button === attendingNo);

      button.classList.toggle('is-selected', isSelected);
    });

    if (guestCountSection) {
      guestCountSection.classList.toggle('is-collapsed', value === 'no');
    }

    const disabled = value === 'no';
    if (adultSelect) adultSelect.disabled = disabled;
    if (kidSelect) kidSelect.disabled = disabled;

    if (value === 'no') {
      if (adultSelect) adultSelect.value = '1';
      if (kidSelect) kidSelect.value = '0';
    } else if (adultSelect && Number(adultSelect.value) < 1) {
      adultSelect.value = '1';
      if (kidSelect) kidSelect.value = '0';
    }
  }

  function showStatus(message, type) {
    const slot = form.querySelector('[data-testid="rsvp-status-slot"]');
    let status = slot?.querySelector('[data-testid="rsvp-status"]');

    if (!status && slot) {
      status = document.createElement('div');
      status.setAttribute('data-testid', 'rsvp-status');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      slot.appendChild(status);
    }

    if (!status) return;

    status.textContent = message;
    status.className = 'rsvp-status';

    if (type === 'error') {
      status.classList.add('rsvp-status--error');
    } else if (type === 'success') {
      status.classList.add('rsvp-status--success');
    } else {
      status.classList.add('rsvp-status--info');
    }
  }

  attendingYes?.addEventListener('click', () => setAttending('yes'));
  attendingNo?.addEventListener('click', () => setAttending('no'));

  setAttending('yes');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim() || null;
    const message = messageInput?.value.trim() || null;
    const adultCount = Number(adultSelect?.value || 1);
    const kidCount = Number(kidSelect?.value || 0);

    if (!name) {
      showStatus('Please enter your name.', 'error');
      nameInput?.focus({ preventScroll: true });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email, or leave it blank.', 'error');
      emailInput?.focus({ preventScroll: true });
      return;
    }

    if (attending === 'yes' && (adultCount < 1 || adultCount > MAX_ADULT_COUNT)) {
      showStatus(`Please select between 1 and ${MAX_ADULT_COUNT} adults.`, 'error');
      return;
    }

    if (attending === 'yes' && (kidCount < 0 || kidCount > MAX_KID_COUNT)) {
      showStatus(`Please select between 0 and ${MAX_KID_COUNT} kids.`, 'error');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      showStatus('RSVP is not configured yet. Please try again later.', 'error');
      return;
    }

    const adults = attending === 'yes' ? adultCount : 0;
    const kids = attending === 'yes' ? kidCount : 0;

    submitButton.disabled = true;
    showStatus('Sending your RSVP...', 'info');

    const { error } = await supabase.from('rsvps').insert({
      name,
      email,
      attending,
      adult_count: adults,
      kid_count: kids,
      guest_count: adults + kids,
      message,
    });

    submitButton.disabled = false;

    if (error) {
      console.error('RSVP submit failed:', error);
      showStatus('Something went wrong. Please try again.', 'error');
      return;
    }

    const wasAttending = attending === 'yes';

    showStatus(
      wasAttending
        ? 'Thank you! We cannot wait to celebrate with you.'
        : 'Thank you for letting us know. You will be missed.',
      'success'
    );

    form.reset();
    setAttending('yes');

    if (typeof createConfetti === 'function' && wasAttending) {
      createConfetti();
    }
  });
}

document.addEventListener('DOMContentLoaded', initRSVPForm);
