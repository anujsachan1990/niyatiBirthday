# 🎉 Niyati's First Birthday Invitation

A beautiful, interactive birthday invitation website with smooth animations, countdown timer, and modern UI.

## ✨ Features

### 1. **Countdown Timer** ⏰
- Real-time countdown to the birthday party
- Displays Days, Hours, Minutes, and Seconds
- Automatically updates every second
- Located in the "Countdown" section

### 2. **Smooth Scroll Navigation** 🚀
- Click navigation links to smoothly scroll to different sections
- Works on both desktop and mobile
- Sections: Story, Countdown, Details, Gallery, Registry

### 3. **Mobile Menu** 📱
- Responsive hamburger menu for mobile devices
- Toggles navigation visibility
- Closes automatically when navigating to a section

### 4. **Floating Balloon Animations** 🎈
- Decorative elements float up and down
- Each balloon has unique movement patterns
- Subtle rotation effects for natural movement
- Using `requestAnimationFrame` for smooth 60fps animations

### 5. **Marquee Scrolling** 🎪
- Continuous horizontal scrolling text
- Features words like "Cake", "Confetti", "Cuddles", "Celebrations"
- Infinite loop animation
- Perfect smooth scrolling

### 6. **Image Hover Effects** 🖼️
- Images subtly rotate on hover
- Smooth transitions
- Enhances user interaction

### 7. **Parallax Scrolling** 🌊
- Decorative elements move at different speeds while scrolling
- Creates depth and dimension
- Only applies to hero section decorations

### 8. **Scroll Animations** 📜
- Sections fade in as you scroll
- Uses Intersection Observer API
- Smooth appearance animations

### 9. **RSVP Functionality** 💌
- RSVP buttons throughout the site
- Form with validation
- Guest count selector
- Message input for Niyati

### 10. **Confetti Effect** 🎊 (Optional)
- Celebratory confetti animation
- Can be triggered on page load
- Colorful falling particles
- Currently commented out (can be enabled)

## 🎨 Color Palette

- **Cream Background**: `#F9F6F0`
- **Dark Text**: `#1F1D1B`
- **Pink Pastel**: `#E4C5C4`
- **Green Pastel**: `#C1D5C9`
- **Yellow Pastel**: `#F5E3B8`
- **Blue Pastel**: `#C4DAE8`

## 🚀 How to Use

1. **Open the website**
   - Simply open `index.html` in a web browser
   - Or use a local server: `python -m http.server 8000`

2. **Update the countdown date**
   - Open `js/main.js`
   - Find line with `const targetDate = new Date('2026-12-31T15:00:00')`
   - Change the date to Niyati's actual birthday

3. **Customize content**
   - All text is in the HTML file
   - Colors are defined in CSS files
   - Update images in the `Img` folder

## 📁 File Structure

```
niyatiBirthday/
├── index.html              # Main HTML file
├── js/
│   └── main.js            # All JavaScript functionality
├── css/
│   ├── app.css           # Application styles
│   ├── fonts.css         # Font definitions
│   ├── styles.css        # Main styles (Tailwind)
│   └── sonner.css        # Toast notification styles
├── fonts/                 # Custom font files
└── README.md             # This file
```

## 🛠️ JavaScript Functions

### Core Functionality

1. **initSmoothScroll()** - Handles smooth scrolling navigation
2. **initMobileMenu()** - Mobile hamburger menu toggle
3. **initCountdown()** - Real-time countdown timer
4. **initFloatingAnimations()** - Balloon float animations
5. **initMarquee()** - Horizontal scrolling text
6. **initScrollAnimations()** - Scroll-triggered fade-ins
7. **initImageRotations()** - Hover effects on images
8. **initParallax()** - Parallax scrolling effect
9. **initRSVPButtons()** - RSVP form handlers
10. **createConfetti()** - Confetti celebration effect

## 🎯 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 📱 Responsive Design

- Fully responsive design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🔧 Customization Tips

### Change Countdown Target Date
```javascript
// In js/main.js, line ~82
const targetDate = new Date('2027-01-25T16:00:00').getTime();
```

### Enable Confetti on Page Load
```javascript
// In js/main.js, uncomment line at bottom
setTimeout(createConfetti, 1000);
```

### Adjust Animation Speeds
```javascript
// Floating animation duration (seconds)
const duration = 3 + Math.random() * 4; // 3-7 seconds

// Marquee speed (pixels per frame)
const speed = 0.5;
```

## 🎨 Design Credits

- Design Style: Modern, minimalist, pastel-themed
- Typography: Custom heading and mono fonts
- Icons: Lucide Icons
- Layout: CSS Grid and Flexbox

## 💡 Tips

1. **Test the countdown**: Set the target date to a few minutes in the future to see it in action
2. **Mobile testing**: Use browser dev tools to test responsive design
3. **Performance**: All animations use `requestAnimationFrame` for optimal performance
4. **Accessibility**: All interactive elements have proper ARIA labels

## 🐛 Troubleshooting

**Countdown not working?**
- Check that the target date in `js/main.js` is in the future
- Ensure JavaScript is enabled in your browser

**Animations not smooth?**
- Check browser performance
- Close other tabs to free up resources

**Mobile menu not working?**
- Ensure screen width is < 768px
- Check browser console for errors

## 📄 License

Personal use for Niyati's birthday invitation.

---

Made with ❤️ for Niyati's First Birthday
