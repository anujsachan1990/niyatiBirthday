function initRSVPForm() {
  const form = document.querySelector('[data-testid="rsvp-form"]');
  if (!form) return;

  const nameInput = form.querySelector('[data-testid="rsvp-name"]');
  const emailInput = form.querySelector('[data-testid="rsvp-email"]');
  const attendingYes = form.querySelector('[data-testid="rsvp-attending-yes"]');
  const attendingNo = form.querySelector('[data-testid="rsvp-attending-no"]');
  const guestCountInput = form.querySelector('[data-testid="rsvp-guest-count"]');
  const guestCountButtons = form.querySelectorAll('[data-testid^="rsvp-guest-count-option"]');
  const messageInput = form.querySelector('[data-testid="rsvp-message"]');
  const submitButton = form.querySelector('[data-testid="rsvp-submit"]');

  let attending = 'yes';
  let guestCount = 1;

  const selectedAttendingClasses = ['bg-[#C1D5C9]', 'nb-shadow'];
  const unselectedAttendingClasses = ['bg-white', 'hover:bg-[#F5E3B8]/60'];
  const selectedGuestClasses = ['bg-[#1F1D1B]', 'text-[#F9F6F0]'];
  const unselectedGuestClasses = ['bg-white', 'hover:bg-[#F5E3B8]'];

  function setAttending(value) {
    attending = value;

    [attendingYes, attendingNo].forEach((button) => {
      if (!button) return;
      const isSelected =
        (value === 'yes' && button === attendingYes) ||
        (value === 'no' && button === attendingNo);

      button.classList.remove(...selectedAttendingClasses, ...unselectedAttendingClasses);
      button.classList.add(...(isSelected ? selectedAttendingClasses : unselectedAttendingClasses));
    });
  }

  function setGuestCount(value) {
    guestCount = value;
    if (guestCountInput) guestCountInput.value = String(value);

    guestCountButtons.forEach((button) => {
      const count = Number(button.textContent.trim());
      const isSelected = count === value;
      button.classList.remove(...selectedGuestClasses, ...unselectedGuestClasses);
      button.classList.add(...(isSelected ? selectedGuestClasses : unselectedGuestClasses));
    });
  }

  function showStatus(message, type) {
    let status = form.querySelector('[data-testid="rsvp-status"]');
    if (!status) {
      status = document.createElement('p');
      status.setAttribute('data-testid', 'rsvp-status');
      status.className = 'font-mono-nb text-xs uppercase tracking-[0.2em]';
      submitButton.parentNode.insertBefore(status, submitButton);
    }

    status.textContent = message;
    status.className = `font-mono-nb text-xs uppercase tracking-[0.2em] ${
      type === 'error' ? 'text-red-700' : 'text-[#1F1D1B]/70'
    }`;
  }

  attendingYes?.addEventListener('click', () => setAttending('yes'));
  attendingNo?.addEventListener('click', () => setAttending('no'));

  guestCountButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setGuestCount(Number(button.textContent.trim()));
    });
  });

  setAttending('yes');
  setGuestCount(1);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const message = messageInput?.value.trim() || null;

    if (!name) {
      showStatus('Please enter your name.', 'error');
      nameInput?.focus();
      return;
    }

    if (!email) {
      showStatus('Please enter your email.', 'error');
      emailInput?.focus();
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      showStatus('RSVP is not configured yet. Please try again later.', 'error');
      return;
    }

    submitButton.disabled = true;
    showStatus('Sending your RSVP...', 'info');

    const { error } = await supabase.from('rsvps').insert({
      name,
      email,
      attending,
      guest_count: attending === 'yes' ? guestCount : 0,
      message,
    });

    submitButton.disabled = false;

    if (error) {
      console.error('RSVP submit failed:', error);
      showStatus('Something went wrong. Please try again.', 'error');
      return;
    }

    showStatus(
      attending === 'yes'
        ? 'Thank you! We cannot wait to celebrate with you.'
        : 'Thank you for letting us know. You will be missed.',
      'success'
    );

    form.reset();
    setAttending('yes');
    setGuestCount(1);

    if (typeof createConfetti === 'function' && attending === 'yes') {
      createConfetti();
    }
  });
}

document.addEventListener('DOMContentLoaded', initRSVPForm);
