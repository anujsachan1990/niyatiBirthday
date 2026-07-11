function initRSVPForm() {
  const form = document.querySelector('[data-testid="rsvp-form"]');
  if (!form) return;

  initMobileInputScroll(form);

  const nameInput = form.querySelector('[data-testid="rsvp-name"]');
  const emailInput = form.querySelector('[data-testid="rsvp-email"]');
  const attendingYes = form.querySelector('[data-testid="rsvp-attending-yes"]');
  const attendingNo = form.querySelector('[data-testid="rsvp-attending-no"]');
  const guestCountInput = form.querySelector('[data-testid="rsvp-guest-count"]');
  const guestCountSection = form.querySelector('[data-testid="rsvp-guest-count-section"]');
  const guestCountButtons = form.querySelectorAll('[data-testid^="rsvp-guest-count-option"]');
  const messageInput = form.querySelector('[data-testid="rsvp-message"]');
  const submitButton = form.querySelector('[data-testid="rsvp-submit"]');

  let attending = 'yes';
  let guestCount = 1;

  const selectedAttendingClasses = ['is-selected'];
  const unselectedAttendingClasses = [];
  const selectedGuestClasses = ['is-selected'];
  const unselectedGuestClasses = [];

  const MAX_GUEST_COUNT = 4;

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

    if (guestCountSection) {
      guestCountSection.classList.toggle('is-collapsed', value === 'no');
    }

    if (value === 'no') {
      setGuestCount(0);
    } else if (guestCount < 1) {
      setGuestCount(1);
    }
  }

  function setGuestCount(value) {
    guestCount = Math.min(Math.max(value, 0), MAX_GUEST_COUNT);
    if (guestCountInput) guestCountInput.value = String(guestCount);

    guestCountButtons.forEach((button) => {
      const count = Number(button.textContent.trim());
      const isSelected = count === value;
      button.classList.remove(...selectedGuestClasses, ...unselectedGuestClasses);
      button.classList.add(...(isSelected ? selectedGuestClasses : unselectedGuestClasses));
    });
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

    if (attending === 'yes' && (guestCount < 1 || guestCount > MAX_GUEST_COUNT)) {
      showStatus(`Please select between 1 and ${MAX_GUEST_COUNT} guests.`, 'error');
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

function initMobileInputScroll(form) {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  if (!mobileQuery.matches) return;

  const header = document.querySelector('header');
  let activeInput = null;
  let revealTimer = null;

  function getVisibleBounds() {
    const viewport = window.visualViewport;
    if (!viewport) {
      const headerBottom = header?.getBoundingClientRect().bottom ?? 72;
      return {
        top: headerBottom + 12,
        bottom: window.innerHeight - 24,
      };
    }

    const headerBottom = header?.getBoundingClientRect().bottom ?? 72;
    const top = Math.max(viewport.offsetTop + headerBottom, headerBottom) + 12;
    const bottom = viewport.offsetTop + viewport.height - 16;

    return { top, bottom };
  }

  function revealInput(input) {
    if (!input || !mobileQuery.matches) return;

    const field = input.closest('.rsvp-field') || input;
    const { top, bottom } = getVisibleBounds();
    const rect = field.getBoundingClientRect();

    if (rect.top >= top && rect.bottom <= bottom) return;

    const targetTop = Math.min(top, bottom - rect.height - 8);
    const delta = rect.top - targetTop;

    if (Math.abs(delta) > 4) {
      window.scrollTo({
        top: Math.max(0, window.scrollY + delta),
        left: 0,
        behavior: 'auto',
      });
    }
  }

  function scheduleReveal(input) {
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => revealInput(input), 400);
  }

  form.addEventListener(
    'focusin',
    (event) => {
      const input = event.target.closest('input:not([type="hidden"]), textarea');
      if (!input || !form.contains(input)) return;

      activeInput = input;
      document.body.classList.add('rsvp-input-active');
      scheduleReveal(input);
    },
    true
  );

  form.addEventListener(
    'focusout',
    () => {
      window.setTimeout(() => {
        const focused = document.activeElement;
        if (
          focused &&
          form.contains(focused) &&
          focused.matches('input:not([type="hidden"]), textarea')
        ) {
          return;
        }

        activeInput = null;
        document.body.classList.remove('rsvp-input-active');
        window.clearTimeout(revealTimer);
      }, 120);
    },
    true
  );

  window.visualViewport?.addEventListener('resize', () => {
    if (activeInput) scheduleReveal(activeInput);
  });
}

document.addEventListener('DOMContentLoaded', initRSVPForm);
