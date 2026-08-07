// celebration.js - Canvas-based Birthday Celebration Effects
// Creates floating balloons, falling confetti, and interactive popping effects.
// Real-time: no page refresh needed — polls every second for the birthday moment.

(function () {
  // ============================================
  // 1. CONFIGURATION & TIME CHECK
  // ============================================
  // Niyati's birthday: Aug 7, 2026 at 3:03 PM AEST (UTC+10) = 05:03 UTC
  const TARGET_TIME      = new Date('2026-08-07T05:03:00Z');
  const END_TIME         = new Date('2026-08-09T00:00:00+10:00');
  const COUNTDOWN_SECS   = 10; // Show countdown for last N seconds before 3:03 PM
  const FORCE_CELEBRATION = false; // Set true to test immediately (bypasses time window)

  const urlParams        = new URLSearchParams(window.location.search);
  const isCelebrateQuery = urlParams.has('celebrate') || urlParams.has('test');

  // ---- Countdown overlay (DOM element, created once) ----
  let countdownOverlay = null;
  let celebrationStarted = false;
  let pollingInterval = null;

  function createCountdownOverlay() {
    if (countdownOverlay) return;
    countdownOverlay = document.createElement('div');
    countdownOverlay.id = 'birthday-countdown';
    Object.assign(countdownOverlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '99999',
      pointerEvents: 'none',
      fontFamily: '"Georgia", serif',
      background: 'transparent',
    });

    const numEl = document.createElement('div');
    numEl.id = 'countdown-number';
    Object.assign(numEl.style, {
      fontSize: 'clamp(160px, 30vw, 320px)',
      fontWeight: '700',
      lineHeight: '1',
      background: 'linear-gradient(135deg, #f472b6 0%, #fcd34d 50%, #fb7185 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: 'none',
      filter: 'drop-shadow(0 0 40px rgba(244,114,182,0.7))',
      transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
      transform: 'scale(1)',
      opacity: '1',
      userSelect: 'none',
    });

    const labelEl = document.createElement('div');
    labelEl.id = 'countdown-label';
    labelEl.textContent = '🎂 Niyati turns one in…';
    Object.assign(labelEl.style, {
      fontSize: 'clamp(18px, 3vw, 32px)',
      color: '#5C564F',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontFamily: '"Georgia", serif',
      marginBottom: '24px',
      fontStyle: 'italic',
      background: 'rgba(249,246,240,0.85)',
      borderRadius: '999px',
      padding: '10px 28px',
      backdropFilter: 'blur(8px)',
    });

    countdownOverlay.appendChild(labelEl);
    countdownOverlay.appendChild(numEl);
    document.body.appendChild(countdownOverlay);
  }

  function updateCountdownDisplay(n) {
    if (!countdownOverlay) createCountdownOverlay();
    const numEl = document.getElementById('countdown-number');
    if (!numEl) return;

    // Pulse animation: scale down then up for each tick
    numEl.style.transform = 'scale(0.7)';
    numEl.style.opacity = '0.6';
    setTimeout(() => {
      numEl.textContent = n;
      numEl.style.transform = 'scale(1.15)';
      numEl.style.opacity = '1';
      setTimeout(() => {
        numEl.style.transform = 'scale(1)';
      }, 180);
    }, 100);
  }

  function removeCountdownOverlay() {
    if (countdownOverlay) {
      countdownOverlay.style.transition = 'opacity 0.6s ease';
      countdownOverlay.style.opacity = '0';
      setTimeout(() => {
        countdownOverlay.remove();
        countdownOverlay = null;
      }, 700);
    }
  }

  // ---- Hero text swap: permanently from birthday onwards ----
  function swapHeroText() {
    const heroSpan = document.querySelector('[x-id="Hero_61_14"]');
    if (heroSpan && heroSpan.textContent.trim() === 'is turning') {
      heroSpan.textContent = 'turned';
    }
  }

  // ---- Main poller: checks every second ----
  function startPoller() {
    pollingInterval = setInterval(() => {
      if (celebrationStarted) {
        clearInterval(pollingInterval);
        return;
      }

      const now          = new Date();
      const msUntil      = TARGET_TIME - now;
      const secsUntil    = Math.ceil(msUntil / 1000);
      const isBirthday   = now >= TARGET_TIME;
      const isWithin     = isBirthday && now < END_TIME;

      // Swap text the moment birthday arrives
      if (isBirthday) swapHeroText();

      // Show countdown overlay in the final COUNTDOWN_SECS seconds
      if (secsUntil > 0 && secsUntil <= COUNTDOWN_SECS) {
        updateCountdownDisplay(secsUntil);
      }

      // Launch celebration when it's time
      if (isWithin && !celebrationStarted) {
        clearInterval(pollingInterval);
        removeCountdownOverlay();
        celebrationStarted = true;
        launchCelebration();
      }

      // Stop polling after end window
      if (now >= END_TIME) {
        clearInterval(pollingInterval);
        removeCountdownOverlay();
      }
    }, 1000);
  }

  // ---- Decide what to do on load ----
  const nowOnLoad      = new Date();
  const isBirthdayNow  = nowOnLoad >= TARGET_TIME;
  const isWithinNow    = isBirthdayNow && nowOnLoad < END_TIME;

  if (isBirthdayNow) swapHeroText();

  if (FORCE_CELEBRATION || isCelebrateQuery) {
    // Instant launch for testing
    celebrationStarted = true;
    // Wrap in small delay so DOM is settled before we start
    setTimeout(launchCelebration, 50);
  } else if (isWithinNow) {
    // Birthday window is already active — launch immediately
    celebrationStarted = true;
    setTimeout(launchCelebration, 50);
  } else if (nowOnLoad < END_TIME) {
    // Not yet — start live polling
    console.log('📅 Birthday celebration scheduled for August 7th, 3:03 PM AEST. Watching…');
    startPoller();
  } else {
    // Past end time — do nothing
    console.log('🎂 Birthday celebration window has ended. Thank you for celebrating!');
  }

  // ============================================
  // 2. THE CELEBRATION (deferred — called by poller or immediately)
  // ============================================
  function launchCelebration() {
  console.log('🎉 Birthday Celebration Effects Active!');

  // Theme Color Palette
  const PALETTE = [
    '#e4c5c4', // Rose
    '#c1d5c9', // Sage
    '#f5e3b8', // Butter
    '#c4dae8', // Sky
    '#fcd34d', // Gold Sparkle
    '#f472b6', // Pink Sweet
    '#fb7185'  // Coral Rose
  ];
  
  // ============================================
  // 2. CANVAS CREATION
  // ============================================
  const canvas = document.createElement('canvas');
  canvas.id = 'celebration-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none'; // Click-through by default
  canvas.style.zIndex = '9998'; // Just below header or very high overlays
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // ============================================
  // 3. SOUND SYNTHESIS
  // ============================================
  function playPopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      // Balloon pop sound design: quick high-to-low frequency pitch sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      console.debug('AudioContext pop sound failed (user gesture required first):', e);
    }
  }
  
  // ============================================
  // 4. ANIMATION ENGINES
  // ============================================
  const balloons = [];
  const confetti = [];
  const explosions = [];
  const fireworks = [];
  const sparks = [];
  let fireworkTimer = 0;
  
  // Confetti Particle Class
  class ConfettiParticle {
    constructor(isBurst = false, x = 0, y = 0) {
      this.reset(isBurst, x, y);
    }
    
    reset(isBurst = false, x = 0, y = 0) {
      this.x = isBurst ? x : Math.random() * width;
      this.y = isBurst ? y : Math.random() * -height - 20;
      this.size = isBurst ? 4 + Math.random() * 6 : 6 + Math.random() * 9;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      
      // Shapes: rect, circle, ribbon, star, heart, swirl, sparkle (graffiti elements)
      const shapes = ['rect', 'circle', 'ribbon', 'star', 'heart', 'swirl', 'sparkle'];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Velocities
      if (isBurst) {
        // Explode outward in a circle
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1.5; // Slight upward bias
      } else {
        // Normal falling drift
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = 1.2 + Math.random() * 2.2;
      }
      
      // Rotations
      this.rotationX = Math.random() * 360;
      this.rotationY = Math.random() * 360;
      this.rotationZ = Math.random() * 360;
      this.rotationSpeedX = (Math.random() - 0.5) * 4;
      this.rotationSpeedY = (Math.random() - 0.5) * 4;
      this.rotationSpeedZ = (Math.random() - 0.5) * 2;
      
      this.opacity = 1;
      this.isBurst = isBurst;
      this.life = isBurst ? 40 + Math.random() * 30 : null; // Burst particles fade out
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Simulate gravity & air resistance for bursts
      if (this.isBurst) {
        this.vy += 0.12; // Gravity
        this.vx *= 0.98; // Friction
        this.vy *= 0.98;
        if (this.life !== null) {
          this.life--;
          this.opacity = Math.max(0, this.life / 60);
        }
      } else {
        // Add natural horizontal sway (wind)
        this.vx += Math.sin(Date.now() / 400 + this.size) * 0.05;
        this.vx = Math.max(-2, Math.min(2, this.vx));
      }
      
      // Update 3D rotations
      this.rotationX += this.rotationSpeedX;
      this.rotationY += this.rotationSpeedY;
      this.rotationZ += this.rotationSpeedZ;
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotationZ * Math.PI / 180);
      
      // 3D perspective simulation by scaling width/height with rotations
      const scaleX = Math.cos(this.rotationX * Math.PI / 180);
      const scaleY = Math.sin(this.rotationY * Math.PI / 180);
      ctx.scale(scaleX, scaleY);
      
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = this.opacity;
      
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'star') {
        drawStar(0, 0, 5, this.size / 2, this.size / 4);
      } else if (this.shape === 'ribbon') {
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.size);
        ctx.bezierCurveTo(-this.size / 2, 0, this.size / 2, -this.size / 2, this.size, this.size);
        ctx.stroke();
      } else if (this.shape === 'heart') {
        ctx.beginPath();
        ctx.moveTo(0, -this.size/4);
        ctx.bezierCurveTo(this.size/2, -this.size, this.size, -this.size/2, 0, this.size/2);
        ctx.bezierCurveTo(-this.size, -this.size/2, -this.size/2, -this.size, 0, -this.size/4);
        ctx.closePath();
        ctx.fill();
      } else if (this.shape === 'swirl') {
        ctx.beginPath();
        ctx.moveTo(-this.size/2, -this.size/2);
        ctx.bezierCurveTo(this.size/2, -this.size/2, -this.size/2, this.size/2, this.size/2, this.size/2);
        ctx.stroke();
      } else if (this.shape === 'sparkle') {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(0, 0, this.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, this.size);
        ctx.quadraticCurveTo(0, 0, -this.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -this.size);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  // Draw star helper
  function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
  
  // Floating Balloon Class
  class Balloon {
    constructor() {
      this.reset();
      // Start balloons randomly distributed vertically initially
      this.y = height + 50 + Math.random() * height;
    }
    
    reset() {
      this.radius = 28 + Math.random() * 15;
      this.width = this.radius * 0.85;
      this.height = this.radius * 1.15;
      this.x = Math.random() * (width - this.radius * 2) + this.radius;
      this.y = height + this.height + 20;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      
      this.speedY = 0.8 + Math.random() * 1.2; // Slightly gentler ascent
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.01 + Math.random() * 0.015; // Frame-based rate (highly fluid)
      this.swayAmount = 15 + Math.random() * 20;
      
      // Floating string swaying attributes
      this.stringPoints = [];
      const segmentCount = 6;
      const segmentLen = (50 + Math.random() * 30) / segmentCount;
      for (let i = 0; i <= segmentCount; i++) {
        this.stringPoints.push({ x: 0, y: i * segmentLen });
      }
    }
    
    update() {
      this.y -= this.speedY;
      
      // Increment sway angle smoothly
      this.swayAngle += this.swaySpeed;
      this.xOffset = Math.sin(this.swayAngle) * this.swayAmount;
      
      // Calculate balloon tilt (rotation angle) for an organic look
      this.tilt = Math.sin(this.swayAngle) * 0.08; // Gentle tilt wobble
      
      // Update string points with sway wobble relative to tilt
      const stringSway = Math.sin(this.swayAngle) * 5;
      for (let i = 1; i < this.stringPoints.length; i++) {
        const factor = i / this.stringPoints.length;
        this.stringPoints[i].x = stringSway * factor * 1.5;
      }
    }
    
    draw() {
      const centerX = this.x + this.xOffset;
      const centerY = this.y;
      
      ctx.save();
      
      // Translate to center and rotate to apply tilt
      ctx.translate(centerX, centerY);
      ctx.rotate(this.tilt);
      
      // Draw string relative to (0, 0)
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      let prevX = 0;
      let prevY = this.height;
      for (let i = 1; i < this.stringPoints.length; i++) {
        const pt = this.stringPoints[i];
        const targetX = pt.x;
        const targetY = this.height + pt.y;
        ctx.quadraticCurveTo(prevX, prevY, (prevX + targetX) / 2, (prevY + targetY) / 2);
        prevX = targetX;
        prevY = targetY;
      }
      ctx.lineTo(prevX, prevY);
      ctx.strokeStyle = 'rgba(85, 85, 85, 0.6)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
      
      // Draw balloon knot (little triangle at bottom)
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      ctx.lineTo(-6, this.height + 8);
      ctx.lineTo(6, this.height + 8);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw balloon body centered at (0, 0)
      ctx.beginPath();
      ctx.moveTo(0, -this.height);
      // Top Right
      ctx.bezierCurveTo(this.width, -this.height, this.width, this.height * 0.6, 0, this.height);
      // Top Left
      ctx.bezierCurveTo(-this.width, this.height * 0.6, -this.width, -this.height, 0, -this.height);
      ctx.closePath();
      
      // Linear radial gradient for shiny 3D look
      const gradient = ctx.createRadialGradient(
        -this.width * 0.3, 
        -this.height * 0.3, 
        this.width * 0.1, 
        0, 
        0, 
        this.height
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, this.color);
      gradient.addColorStop(1, adjustColorBrightness(this.color, -30));
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Balloon shine/highlight ellipse
      ctx.beginPath();
      ctx.ellipse(-this.width * 0.35, -this.height * 0.35, this.width * 0.25, this.height * 0.15, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
      
      // Draw the letter 'N' centered inside the balloon
      ctx.save();
      const fontSize = Math.floor(this.radius * 0.65);
      ctx.font = `bold ${fontSize}px "Outfit", "Inter", -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      
      // Text drop shadow/glow for perfect readability on all colors
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1.5;
      
      ctx.fillText('N', 0, -this.height * 0.05); // centered vertically in the body
      ctx.restore();
      
      ctx.restore();
    }
    
    // Hit test to check if coordinate clicks the balloon
    checkClick(mx, my) {
      const balloonX = this.x + this.xOffset;
      const balloonY = this.y;
      
      // Calculate normalized distances (egg shapes)
      const dx = mx - balloonX;
      const dy = my - balloonY;
      
      // Using balloon hitbox (radius + margin for easy pop)
      const radiusX = this.width * 1.15;
      const radiusY = this.height * 1.15;
      
      return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1.0;
    }
    
    // Play pop animation and sound
    pop() {
      playPopSound();
      
      // Spawn burst of confetti particles
      const particleCount = 15 + Math.floor(Math.random() * 10);
      const balloonX = this.x + this.xOffset;
      for (let i = 0; i < particleCount; i++) {
        explosions.push(new ConfettiParticle(true, balloonX, this.y));
      }
    }
  }
  
  // Helper to adjust color brightness (hex format only)
  function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);
    
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
    
    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;
    
    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`;
  }
  
  // Firework Rocket/Shell Class
  class FireworkShell {
    constructor(startX = null, targetY = null) {
      this.x = startX !== null ? startX : Math.random() * width;
      this.y = height + 10;
      this.targetY = targetY !== null ? targetY : 50 + Math.random() * (height * 0.4);
      this.speed = 10 + Math.random() * 4;
      
      this.vy = -this.speed;
      this.vx = startX !== null ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 1.5;
      this.exploded = false;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.trail = [];
    }
    
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) {
        this.trail.shift();
      }
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Decelerate as it approaches target
      this.vy *= 0.98;
      
      // Explode at peak or when crossing target height
      if (this.vy >= -1.5 || this.y <= this.targetY) {
        this.explode();
        this.exploded = true;
      }
    }
    
    draw() {
      // Draw tail trail
      if (this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw head rocket
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    
    explode() {
      playPopSound();
      
      const particleCount = 140 + Math.floor(Math.random() * 80); // HUGE count (140 to 220 sparks!)
      const style = Math.random() > 0.5 ? 'circle' : 'sparkle';
      
      for (let i = 0; i < particleCount; i++) {
        sparks.push(new FireworkSpark(this.x, this.y, this.color, style));
      }
    }
  }

  // Firework Spark Particle Class
  class FireworkSpark {
    constructor(x, y, color, style) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.style = style;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 3.0 + Math.random() * 11.0; // MASSIVE expansion velocity (screen-spanning)
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity;
      
      this.life = 85 + Math.random() * 65; // long burning lifetime (1.4 to 2.5 seconds)
      this.maxLife = this.life;
      this.alpha = 1;
      this.gravity = 0.045; // lower gravity for floating willow effect
      this.resistance = 0.965; // lower drag to let them expand very wide
      this.size = 1.4 + Math.random() * 2.2;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      this.vx *= this.resistance;
      this.vy *= this.resistance;
      this.vy += this.gravity;
      
      this.life--;
      this.alpha = Math.max(0, this.life / this.maxLife);
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      
      if (this.style === 'sparkle') {
        ctx.beginPath();
        drawStar(this.x, this.y, 4, this.size * 2, this.size * 0.5);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ============================================
  // 5. INITIAL SPAWN
  // ============================================
  const totalConfetti = 160;
  for (let i = 0; i < totalConfetti; i++) {
    confetti.push(new ConfettiParticle(false));
    // Pre-populate particles down the screen
    confetti[i].y = Math.random() * height;
  }
  
  // Spawn initial set of balloons
  const maxBalloons = 16;
  for (let i = 0; i < maxBalloons; i++) {
    balloons.push(new Balloon());
  }
  
  // ============================================
  // 6. INTERACTIVE BALLOON POPPING
  // ============================================
  function handleInteraction(clientX, clientY) {
    // Scan backward so we hit test topmost balloons first
    for (let i = balloons.length - 1; i >= 0; i--) {
      const balloon = balloons[i];
      if (balloon.checkClick(clientX, clientY)) {
        balloon.pop();
        balloon.reset(); // Recycle the balloon to keep the fun going!
        return true; // Stop event so we only pop one at a time
      }
    }
    
    // Launch a firework rocket if no balloon was hit
    if (fireworks.length < 4) {
      fireworks.push(new FireworkShell(clientX, clientY));
    }
    return false;
  }
  
  window.addEventListener('click', (e) => {
    handleInteraction(e.clientX, e.clientY);
  });
  
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  
  // ============================================
  // 7. RENDER & UPDATE LOOP
  // ============================================
  function loop() {
    ctx.clearRect(0, 0, width, height);
    
    // Auto-launch background fireworks (frequent and rich)
    if (Math.random() < 0.035 && fireworks.length < 8) {
      // 18% chance of launching a double-salvo
      if (Math.random() < 0.18 && fireworks.length < 7) {
        fireworks.push(new FireworkShell());
        fireworks.push(new FireworkShell());
      } else {
        fireworks.push(new FireworkShell());
      }
    }
    
    // 1. Confetti
    for (let i = 0; i < confetti.length; i++) {
      const particle = confetti[i];
      particle.update();
      particle.draw();
      
      // If confetti falls off screen, recycle it
      if (particle.y > height + 20) {
        particle.reset(false);
      }
    }
    
    // 2. Popped Explosion Particles
    for (let i = explosions.length - 1; i >= 0; i--) {
      const particle = explosions[i];
      particle.update();
      particle.draw();
      
      // Remove burst particles once faded out
      if (particle.opacity <= 0) {
        explosions.splice(i, 1);
      }
    }
    
    // 3. Fireworks Rockets
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const shell = fireworks[i];
      shell.update();
      shell.draw();
      if (shell.exploded) {
        fireworks.splice(i, 1);
      }
    }
    
    // 4. Firework Sparks (with additive composite mode for glowing effect)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.update();
      spark.draw();
      if (spark.alpha <= 0) {
        sparks.splice(i, 1);
      }
    }
    ctx.restore();
    
    // 5. Floating Balloons
    for (let i = 0; i < balloons.length; i++) {
      const balloon = balloons[i];
      balloon.update();
      balloon.draw();
      
      // Recycle balloon if it floats out of view
      if (balloon.y < -balloon.height * 2) {
        balloon.reset();
      }
    }
    
    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
  
  } // end launchCelebration()

})();
