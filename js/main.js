// Birthday Invitation Website - Main JavaScript

// ============================================
// 1. SMOOTH SCROLL NAVIGATION
// ============================================
function initSmoothScroll() {
  // Handle navigation clicks
  const navButtons = document.querySelectorAll('[data-testid^="nav-"]');
  
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const testId = button.getAttribute('data-testid');
      
      // Map navigation buttons to sections
      const sectionMap = {
        'nav-home': 'hero',
        'nav-countdown': 'countdown',
        'nav-details': 'details',
        'nav-gallery': 'gallery',
        'nav-registry': 'registry',
        'nav-brand': 'hero'
      };
      
      const sectionId = sectionMap[testId];
      
      if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Close mobile menu if open
      closeMobileMenu();
    });
  });
}

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================
let mobileMenuOpen = false;

function initMobileMenu() {
  const menuToggle = document.querySelector('[data-testid="nav-menu-toggle"]');
  const nav = document.querySelector('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      mobileMenuOpen = !mobileMenuOpen;
      
      if (mobileMenuOpen) {
        // Show menu
        nav.classList.remove('hidden');
        nav.classList.add('flex');
        // Update icon to X
        menuToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        `;
      } else {
        closeMobileMenu();
      }
    });
  }
}

function closeMobileMenu() {
  const menuToggle = document.querySelector('[data-testid="nav-menu-toggle"]');
  const nav = document.querySelector('nav');
  
  if (window.innerWidth < 768) {
    mobileMenuOpen = false;
    if (nav) {
      nav.classList.add('hidden');
      nav.classList.remove('flex');
    }
    if (menuToggle) {
      menuToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 12h16"></path>
          <path d="M4 18h16"></path>
          <path d="M4 6h16"></path>
        </svg>
      `;
    }
  }
}

// ============================================
// 3. COUNTDOWN TIMER
// ============================================
function initCountdown() {
  // Set the target date - Niyati's birthday (August 7th, 2026 at 3:00 PM)
  const targetDate = new Date('2026-08-07T15:00:00').getTime();
  
  console.log('Target date:', new Date(targetDate));
  console.log('Current date:', new Date());
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    console.log('Distance (ms):', distance);
    console.log('Distance (days):', distance / (1000 * 60 * 60 * 24));
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Find countdown elements using data-testid attribute
    const daysEl = document.querySelector('[data-testid="countdown-days"]');
    const hoursEl = document.querySelector('[data-testid="countdown-hours"]');
    const minutesEl = document.querySelector('[data-testid="countdown-minutes"]');
    const secondsEl = document.querySelector('[data-testid="countdown-seconds"]');
    
    // Update if elements exist
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // If countdown is over
    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
    }
  }
  
  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================================
// 4. FLOATING BALLOON ANIMATIONS
// ============================================
function initFloatingAnimations() {
  // Target balloon SVG containers in the hero section
  const balloonContainers = document.querySelectorAll('#hero svg[viewBox="0 0 90 112"]');
  
  balloonContainers.forEach((balloon) => {
    // Get the parent div that we'll animate
    const container = balloon.parentElement;
    if (!container) return;
    
    // Different animation parameters for each balloon
    const floatAmount = 15 + Math.random() * 10; // 15-25px vertical float
    const duration = 3 + Math.random() * 2; // 3-5 seconds
    const delay = Math.random() * 2; // 0-2 seconds
    const rotateAmount = 2 + Math.random() * 3; // 2-5 degrees rotation
    
    animateBalloon(container, floatAmount, duration, delay, rotateAmount);
  });
  
  // Also animate star decorations
  const stars = document.querySelectorAll('#hero svg[viewBox="0 0 60 60"]');
  stars.forEach((star) => {
    const container = star.parentElement;
    if (!container) return;
    
    const floatAmount = 8 + Math.random() * 5;
    const duration = 4 + Math.random() * 2;
    const delay = Math.random() * 2;
    const rotateAmount = 5 + Math.random() * 10;
    
    animateBalloon(container, floatAmount, duration, delay, rotateAmount);
  });
}

function animateBalloon(element, floatAmount, duration, delay, rotateAmount) {
  let startTime = null;
  const delayMs = delay * 1000;
  const durationMs = duration * 1000;
  
  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    
    const elapsed = currentTime - startTime;
    
    // Wait for delay
    if (elapsed < delayMs) {
      requestAnimationFrame(animate);
      return;
    }
    
    // Calculate animation progress (0 to 1) with easing
    const adjustedTime = elapsed - delayMs;
    const progress = (adjustedTime % durationMs) / durationMs;
    
    // Use sine wave for smooth up and down motion
    const floatOffset = Math.sin(progress * Math.PI * 2) * floatAmount;
    
    // Use sine wave for gentle rotation
    const rotateOffset = Math.sin(progress * Math.PI * 2) * rotateAmount;
    
    // Apply transform
    element.style.transform = `translateY(${floatOffset}px) rotate(${rotateOffset}deg)`;
    
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
}

// ============================================
// 5. MARQUEE ANIMATION
// ============================================
function initMarquee() {
  const marqueeTrack = document.querySelector('.nb-marquee-track');
  
  if (marqueeTrack) {
    let position = 0;
    const speed = 0.5; // pixels per frame
    
    function animate() {
      position -= speed;
      
      // Reset position when first set of items scrolls out
      const firstChild = marqueeTrack.firstElementChild;
      if (firstChild && Math.abs(position) >= firstChild.offsetWidth) {
        position = 0;
      }
      
      marqueeTrack.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    }
    
    animate();
  }
}

// ============================================
// 6. SCROLL ANIMATIONS (Fade in on scroll)
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
      }
    });
  }, observerOptions);
  
  // Observe sections (add IDs to sections in HTML if needed)
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => observer.observe(section));
}

// ============================================
// 7. IMAGE ROTATION ANIMATIONS - DISABLED
// ============================================
function initImageRotations() {
  // Rotation animations disabled per user request
  // Images will use CSS hover effects only
}

// ============================================
// 8. PARALLAX EFFECT ON SCROLL
// ============================================
function initParallax() {
  const decorations = document.querySelectorAll('[class*="absolute"]');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    decorations.forEach((decoration, index) => {
      // Different parallax speeds for different elements
      const speed = 0.1 + (index % 3) * 0.05;
      const yPos = -(scrolled * speed);
      
      // Only apply to decoration elements in hero section
      if (decoration.closest('#hero')) {
        const currentTransform = decoration.style.transform || '';
        if (currentTransform.includes('translateY')) {
          // Preserve existing transforms
          decoration.style.transform = currentTransform.replace(
            /translateY\([^)]+\)/,
            `translateY(${yPos}px)`
          );
        }
      }
    });
  });
}

// ============================================
// 9. RSVP BUTTON HANDLERS
// ============================================
function initRSVPButtons() {
  const rsvpButtons = document.querySelectorAll('[data-testid*="rsvp"], [data-testid*="cta"]');
  
  rsvpButtons.forEach(button => {
    button.addEventListener('click', () => {
      const testId = button.getAttribute('data-testid');
      
      if (testId.includes('rsvp')) {
        const rsvpSection = document.getElementById('rsvp');
        if (rsvpSection) {
          rsvpSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (testId.includes('details')) {
        // Scroll to details section
        const detailsSection = document.getElementById('details');
        if (detailsSection) {
          detailsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ============================================
// 10. CONFETTI EFFECT (Optional enhancement)
// ============================================
function createConfetti() {
  const colors = ['#E4C5C4', '#C1D5C9', '#F5E3B8', '#C4DAE8'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: ${Math.random()};
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    // Animate falling
    const duration = 3 + Math.random() * 2;
    const drift = (Math.random() - 0.5) * 100;
    
    confetti.animate([
      { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(100vh) translateX(${drift}px) rotate(${360 * 2}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => confetti.remove();
  }
}

// Trigger confetti on page load (optional - remove if too much)
// setTimeout(createConfetti, 500);

// ============================================
// 11. RANDOMIZE GALLERY IMAGES
// ============================================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomizeGalleryImages() {
  // List of all available images
  const availableImages = [
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/7.jpg',
    './img/7.jpeg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpeg',
    './img/11.jpg',
    './img/12.jpg',
    './img/13.jpg',
    './img/14.jpg'
  ];
  
  // Get all gallery images
  const galleryImages = document.querySelectorAll('[data-testid^="gallery-item"] img');
  
  // Shuffle the images
  const shuffledImages = shuffleArray(availableImages);
  
  // Assign shuffled images to gallery
  galleryImages.forEach((img, index) => {
    if (index < shuffledImages.length) {
      img.src = shuffledImages[index];
      img.style.objectPosition = `${Math.random() * 30 + 35}% ${Math.random() * 30 + 35}%`;
    }
  });
  
  console.log('🖼️ Gallery images randomized!');
}

// ============================================
// 12. INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎉 Birthday invitation initialized!');
  
  initSmoothScroll();
  initMobileMenu();
  initCountdown();
  initFloatingAnimations();
  initMarquee();
  initScrollAnimations();
  initImageRotations();
  initParallax();
  initRSVPButtons();
  // Gallery uses fixed, size-matched images from ./img/
  
  // Optional: Create confetti on page load
  // setTimeout(createConfetti, 1000);
});

// Reinitialize on window resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    closeMobileMenu();
  }
});
