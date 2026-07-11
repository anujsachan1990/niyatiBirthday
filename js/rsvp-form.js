function initRSVPForm() {
  const form = document.querySelector('[data-testid="rsvp-form"]');
  if (!form) return;

  initMobileFormFocus(form);

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

  const selectedAttendingClasses = ['bg-[#C1D5C9]', 'nb-shadow'];
  const unselectedAttendingClasses = ['bg-white', 'hover:bg-[#F5E3B8]/60'];
  const selectedGuestClasses = ['bg-[#1F1D1B]', 'text-[#F9F6F0]'];
  const unselectedGuestClasses = ['bg-white', 'hover:bg-[#F5E3B8]'];

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

function initMobileFormFocus(form) {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  if (!mobileQuery.matches) return;

  const header = document.querySelector('header');
  let activeField = null;

  function getHeaderOffset() {
    return (header?.offsetHeight || 72) + 12;
  }

  function scrollFieldIntoView(field) {
    if (!field || !mobileQuery.matches) return;

    const runScroll = () => {
      const viewport = window.visualViewport;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportTop = viewport?.offsetTop ?? 0;
      const headerOffset = getHeaderOffset();
      const padding = 20;

      const rect = field.getBoundingClientRect();
      const visibleTop = headerOffset;
      const visibleBottom = viewportTop + viewportHeight - padding;

      let delta = 0;

      if (rect.top < visibleTop) {
        delta = rect.top - visibleTop;
      } else if (rect.bottom > visibleBottom) {
        delta = rect.bottom - visibleBottom;
      }

      if (delta !== 0) {
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
      }
    };

    window.requestAnimationFrame(() => {
      runScroll();
      window.setTimeout(runScroll, 120);
      window.setTimeout(runScroll, 320);
    });
  }

  function setKeyboardOpen(isOpen) {
    document.body.classList.toggle('rsvp-keyboard-open', isOpen);
  }

  form.addEventListener(
    'focusin',
    (event) => {
      const field = event.target.closest('input, textarea');
      if (!field || !form.contains(field)) return;

      activeField = field;
      setKeyboardOpen(true);
      scrollFieldIntoView(field);
    },
    true
  );

  form.addEventListener(
    'focusout',
    (event) => {
      const next = event.relatedTarget;
      if (next && form.contains(next) && next.matches('input, textarea')) {
        return;
      }

      window.setTimeout(() => {
        if (document.activeElement && form.contains(document.activeElement)) {
          return;
        }

        activeField = null;
        setKeyboardOpen(false);
      }, 80);
    },
    true
  );

  window.visualViewport?.addEventListener('resize', () => {
    if (activeField) {
      scrollFieldIntoView(activeField);
    }
  });

  window.visualViewport?.addEventListener('scroll', () => {
    if (activeField) {
      scrollFieldIntoView(activeField);
    }
  });

  window.addEventListener('resize', () => {
    if (!mobileQuery.matches) {
      setKeyboardOpen(false);
      activeField = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', initRSVPForm);
