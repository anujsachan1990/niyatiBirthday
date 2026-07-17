function initRSVPForm() {
  const form = document.querySelector('[data-testid="rsvp-form"]');
  if (!form) return;

  initMobileInputScroll(form);

  const nameInput = form.querySelector('[data-testid="rsvp-name"]');
  const emailInput = form.querySelector('[data-testid="rsvp-email"]');
  const attendingYes = form.querySelector('[data-testid="rsvp-attending-yes"]');
  const attendingNo = form.querySelector('[data-testid="rsvp-attending-no"]');
  const adultCountInput = form.querySelector('[data-testid="rsvp-adult-count"]');
  const kidCountInput = form.querySelector('[data-testid="rsvp-kid-count"]');
  const adultDropdown = form.querySelector('[data-testid="rsvp-adult-dropdown"]');
  const kidDropdown = form.querySelector('[data-testid="rsvp-kid-dropdown"]');
  const guestCountSection = form.querySelector('[data-testid="rsvp-guest-count-section"]');
  const messageInput = form.querySelector('[data-testid="rsvp-message"]');
  const submitButton = form.querySelector('[data-testid="rsvp-submit"]');

  let attending = 'yes';
  let adultCount = 1;
  let kidCount = 0;

  const selectedAttendingClasses = ['is-selected'];
  const unselectedAttendingClasses = [];

  const MAX_ADULT_COUNT = 4;
  const MAX_KID_COUNT = 4;

  function closeAllDropdowns(except) {
    form.querySelectorAll('[data-rsvp-dropdown].is-open').forEach((dropdown) => {
      if (dropdown === except) return;
      setDropdownOpen(dropdown, false);
    });
  }

  function setDropdownOpen(dropdown, open) {
    if (!dropdown) return;
    const trigger = dropdown.querySelector('[data-rsvp-dropdown-trigger]');
    const menu = dropdown.querySelector('[data-rsvp-dropdown-menu]');
    dropdown.classList.toggle('is-open', open);
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menu) menu.hidden = !open;
  }

  function setDropdownValue(dropdown, hiddenInput, value) {
    if (!dropdown || !hiddenInput) return;
    const options = dropdown.querySelectorAll('[role="option"]');
    const match = Array.from(options).find((option) => option.dataset.value === String(value));
    if (!match) return;

    hiddenInput.value = String(value);
    const label = dropdown.querySelector('[data-rsvp-dropdown-label]');
    if (label) label.textContent = match.textContent.trim();

    options.forEach((option) => {
      option.setAttribute('aria-selected', option === match ? 'true' : 'false');
    });
  }

  function setDropdownDisabled(dropdown, disabled) {
    if (!dropdown) return;
    const trigger = dropdown.querySelector('[data-rsvp-dropdown-trigger]');
    dropdown.classList.toggle('is-disabled', disabled);
    if (trigger) trigger.disabled = disabled;
    if (disabled) setDropdownOpen(dropdown, false);
  }

  function initDropdown(dropdown, hiddenInput, onChange) {
    if (!dropdown || !hiddenInput) return;

    const trigger = dropdown.querySelector('[data-rsvp-dropdown-trigger]');
    const menu = dropdown.querySelector('[data-rsvp-dropdown-menu]');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', () => {
      if (trigger.disabled) return;
      const willOpen = !dropdown.classList.contains('is-open');
      closeAllDropdowns(dropdown);
      setDropdownOpen(dropdown, willOpen);
    });

    menu.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option || !menu.contains(option)) return;
      const value = Number(option.dataset.value);
      onChange(value);
      setDropdownOpen(dropdown, false);
      trigger.focus();
    });
  }

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

    setDropdownDisabled(adultDropdown, value === 'no');
    setDropdownDisabled(kidDropdown, value === 'no');

    if (value === 'no') {
      adultCount = 0;
      kidCount = 0;
      closeAllDropdowns();
    } else if (adultCount < 1) {
      setAdultCount(1);
      setKidCount(0);
    }
  }

  function setAdultCount(value) {
    adultCount = Math.min(Math.max(value, 1), MAX_ADULT_COUNT);
    setDropdownValue(adultDropdown, adultCountInput, adultCount);
  }

  function setKidCount(value) {
    kidCount = Math.min(Math.max(value, 0), MAX_KID_COUNT);
    setDropdownValue(kidDropdown, kidCountInput, kidCount);
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

  initDropdown(adultDropdown, adultCountInput, setAdultCount);
  initDropdown(kidDropdown, kidCountInput, setKidCount);

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-rsvp-dropdown]')) return;
    closeAllDropdowns();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllDropdowns();
  });

  setAttending('yes');
  setAdultCount(1);
  setKidCount(0);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim() || null;
    const message = messageInput?.value.trim() || null;

    if (!name) {
      showStatus('Please enter your name.', 'error');
      nameInput?.focus();
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email, or leave it blank.', 'error');
      emailInput?.focus();
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
    setAdultCount(1);
    setKidCount(0);

    if (typeof createConfetti === 'function' && wasAttending) {
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
