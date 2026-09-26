// event-over.js
// Controls all "event is over" content changes via a single flag.
//
//   EVENT_OVER = true   -> shows "thank you" state (RSVP hidden, phone removed, etc.)
//   EVENT_OVER = false  -> site appears exactly as before the event
//
(function () {
  // ================================================
  //  MASTER FLAG -- flip this to toggle everything
  // ================================================
  const EVENT_OVER = false;

  if (!EVENT_OVER) return; // Nothing to do -- site renders normally

  // Run all DOM changes after page is fully parsed
  document.addEventListener('DOMContentLoaded', applyEventOverChanges);

  function applyEventOverChanges() {

    // 1. HERO BADGE: "You're Invited · 15th Nov 2026" -> thank-you badge
    const heroBadge = document.querySelector('[x-id="Hero_51_14"]');
    if (heroBadge) {
      heroBadge.textContent = 'Thank you \u00b7 What a beautiful day';
    }

    // 2. HERO HEADING: "is turning" -> "turned" (permanent birthday text)
    const heroTurning = document.querySelector('[x-id="Hero_61_14"]');
    if (heroTurning && heroTurning.textContent.trim() === 'is turning') {
      heroTurning.textContent = 'turned';
    }

    // 3. HERO DESCRIPTION PARAGRAPH
    const heroDesc = document.querySelector('[x-id="Hero_75_12"]');
    if (heroDesc) {
      heroDesc.textContent =
        'He made it \u2014 and so did you. Thank you for being there, for the hugs, the laughter, and for making Prithvi\u2019s very third birthday so unforgettably warm.';
    }

    // 4. HERO BUTTONS: Remove "RSVP now", rename "See details" -> "See memories"
    const heroRsvpBtn = document.querySelector('[data-testid="hero-cta-rsvp"]');
    if (heroRsvpBtn) heroRsvpBtn.remove();

    const heroDetailsBtn = document.querySelector('[data-testid="hero-cta-details"]');
    if (heroDetailsBtn) {
      heroDetailsBtn.textContent = 'See memories';
    }

    // 5. NAV RSVP BUTTON: Hide it
    const navRsvpBtn = document.querySelector('[data-testid="nav-rsvp-cta"]');
    if (navRsvpBtn) navRsvpBtn.remove();

    // 6. NAV LINKS: Hide "RSVP" nav text link
    document.querySelectorAll('nav button').forEach(function(btn) {
      if (btn.textContent.trim().toLowerCase() === 'rsvp') {
        btn.remove();
      }
    });

    // 7. RSVP SECTION: Replace entire section with a heartfelt thank-you card
    const rsvpSection = document.querySelector('#rsvp');
    if (rsvpSection) {
      rsvpSection.innerHTML = [
        '<div style="max-width:1400px;margin:0 auto;padding:96px 40px;display:flex;flex-direction:column;align-items:center;text-align:center;">',

        // Decorative icon
        '<div style="width:72px;height:72px;border-radius:50%;',
        'background:linear-gradient(135deg,#60a5fa,#93c5fd);',
        'display:flex;align-items:center;justify-content:center;',
        'margin-bottom:28px;font-size:34px;flex-shrink:0;">\u{1F382}</div>',

        // Chapter label
        '<p style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;',
        'color:#7BBDE8;margin-bottom:16px;font-family:monospace;">',
        'Chapter 03 \u00b7 With Gratitude</p>',

        // Headline
        '<h2 style="font-size:clamp(40px,8vw,96px);line-height:0.95;',
        'margin:0 0 32px;color:#EFF6FF;font-family:Georgia,serif;font-weight:400;">',
        'Thank you for<br>',
        '<span style="font-style:italic;color:#F5E3B8;">being there.</span>',
        '</h2>',

        // Message para 1
        '<p style="max-width:620px;font-size:1.15rem;line-height:1.75;',
        'color:rgba(239,246,255,0.72);margin-bottom:20px;">',
        'Prithvi\u2019s third birthday was everything we hoped for \u2014 and more \u2014 because of ',
        'the people who filled the room with love. Every smile, every hug, every beautiful ',
        'wish you brought made this day one we will carry in our hearts forever.',
        '</p>',

        // Message para 2
        '<p style="max-width:560px;font-size:1.05rem;line-height:1.7;',
        'color:rgba(239,246,255,0.55);margin-bottom:48px;">',
        'From the bottom of our hearts \u2014 <em>thank you</em> for making Prithvi\u2019s very third ',
        'chapter so extraordinary. He may not remember it yet, but we will remember ',
        'you being there for the rest of our lives.',
        '</p>',

        // Divider line
        '<div style="width:60px;height:1px;background:rgba(249,246,240,0.2);margin-bottom:40px;"></div>',

        // Signature
        '<p style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;',
        'color:#7BBDE8;margin-bottom:12px;font-family:monospace;">With all our love</p>',
        '<p style="font-family:Georgia,serif;font-size:2.8rem;color:#EFF6FF;font-weight:400;">',
        'The Kala Family</p>',

        '</div>'
      ].join('');
    }

    // 8. FOOTER: Remove phone number link entirely
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink) phoneLink.remove();

    // 9. FOOTER "Reach us" label -> "Address"
    const reachUsLabel = document.querySelector('[x-id="Footer_20_10"]');
    if (reachUsLabel) reachUsLabel.textContent = 'Address';

    // 10. FOOTER TAGLINE: Warm post-event message
    const footerDesc = document.querySelector('[x-id="Footer_14_10"]');
    if (footerDesc) {
      footerDesc.textContent =
        'Thank you for making this milestone so memorable. The love you brought will last long after the cake is gone.';
    }

    console.log('\u2705 Event-over state applied. EVENT_OVER = true');
  }

})();
