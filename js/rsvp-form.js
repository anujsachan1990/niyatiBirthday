function initRSVPForm() {
  const form = document.querySelector('[data-testid="rsvp-form"]');
  if (!form) return;

  initMobileKeyboardScroll(form);

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
    dropdown.classList.remove('is-drop-up');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menu) menu.hidden = !open;

    if (open && menu) {
      requestAnimationFrame(() => positionDropdown(dropdown, trigger, menu));
    }
  }

  function positionDropdown(dropdown, trigger, menu) {
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    const viewport = window.visualViewport;
    const viewBottom = viewport
      ? viewport.offsetTop + viewport.height
      : window.innerHeight;
    const viewTop = viewport ? viewport.offsetTop : 0;

    const triggerRect = trigger.getBoundingClientRect();
    const spaceBelow = viewBottom - triggerRect.bottom;
    const menuHeight = menu.offsetHeight || 180;

    // Open upward when there isn't enough room under the trigger
    if (spaceBelow < menuHeight + 12) {
      dropdown.classList.add('is-drop-up');
    }

    const menuRect = menu.getBoundingClientRect();
    let delta = 0;
    if (menuRect.bottom > viewBottom - 10) {
      delta = menuRect.bottom - viewBottom + 16;
    } else if (menuRect.top < viewTop + 10) {
      delta = menuRect.top - viewTop - 16;
    }

    if (Math.abs(delta) > 4) {
      window.scrollBy({ top: delta, left: 0, behavior: 'smooth' });
    }
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
      trigger.focus({ preventScroll: true });
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

/**
 * Mobile RSVP scroll: pre-position fields before the keyboard opens so iOS
 * doesn't bounce the page, then do at most one quiet correction.
 */
function initMobileKeyboardScroll(form) {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  if (!mobileQuery.matches) return;

  let activeInput = null;
  let settleTimer = null;
  let corrected = false;

  function viewBounds() {
    const viewport = window.visualViewport;
    if (!viewport) {
      return { top: 12, bottom: window.innerHeight - 12, height: window.innerHeight };
    }
    return {
      top: viewport.offsetTop + 12,
      bottom: viewport.offsetTop + viewport.height - 12,
      height: viewport.height,
    };
  }

  function placeElement(el, preferredRatio) {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const { top, bottom, height } = viewBounds();
    if (height < 80) return;

    const targetTop = top + height * preferredRatio;
    const delta = rect.top - targetTop;

    // Only move when the field is clearly in the wrong place
    if (rect.bottom > bottom - 8 || rect.top < top + 8 || Math.abs(delta) > 48) {
      window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
    }
  }

  function scheduleKeyboardSettle() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (!activeInput || corrected) return;

      const viewport = window.visualViewport;
      // Keyboard still closed — wait for the next resize
      if (viewport && viewport.height > window.innerHeight * 0.82) return;

      placeElement(activeInput, 0.28);
      corrected = true;
    }, 120);
  }

  // Pre-position on touch so when the keyboard rises the field is already high
  form.addEventListener(
    'touchstart',
    (event) => {
      const input = event.target.closest('input:not([type="hidden"]), textarea');
      if (!input || !form.contains(input)) return;

      placeElement(input, 0.2);
    },
    { passive: true }
  );

  form.addEventListener(
    'focusin',
    (event) => {
      const input = event.target.closest('input:not([type="hidden"]), textarea');
      if (!input || !form.contains(input)) return;

      activeInput = input;
      corrected = false;
      scheduleKeyboardSettle();
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
        corrected = false;
        window.clearTimeout(settleTimer);
      }, 80);
    },
    true
  );

  window.visualViewport?.addEventListener('resize', () => {
    if (activeInput && !corrected) scheduleKeyboardSettle();
  });
}

document.addEventListener('DOMContentLoaded', initRSVPForm);
