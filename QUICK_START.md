# 🎉 Quick Start Guide - Niyati's Birthday Website

## 🚀 Instant Setup (3 Steps)

### Step 1: Open the Website
```bash
# Option 1: Double-click index.html in your file browser
# Option 2: Use a local server
python -m http.server 8000
# Then open: http://localhost:8000
```

### Step 2: Customize the Countdown
Open `js/main.js` and find line ~82:
```javascript
const targetDate = new Date('2026-12-31T15:00:00').getTime();
```
Change to Niyati's actual birthday date and time!

### Step 3: Test It!
Open in browser and verify:
- ✅ Countdown is ticking
- ✅ Balloons are floating
- ✅ Navigation links work
- ✅ Mobile menu works (resize window)

## 🎨 What's Already Working

### ✨ Live Animations
- **Floating Balloons** - Colorful decorations gently float up and down
- **Scrolling Marquee** - "Cake ✿ Confetti ✿ Cuddles" scrolls continuously
- **Parallax Effect** - Elements move at different speeds when scrolling
- **Hover Effects** - Images rotate slightly on mouse hover

### ⏰ Countdown Timer
Real-time countdown showing:
- Days until party
- Hours remaining  
- Minutes left
- Seconds ticking

Updates every second automatically!

### 🧭 Navigation
- Click any nav link → Smooth scroll to section
- Mobile hamburger menu (< 768px screens)
- Auto-closes after clicking a link

### 📱 Fully Responsive
- Works on desktop, tablet, and mobile
- Adapts layout automatically
- Touch-friendly interactions

## 🎯 Key Features Overview

| Feature | Status | Location |
|---------|--------|----------|
| Countdown Timer | ✅ Working | #countdown section |
| Smooth Scroll | ✅ Working | All nav links |
| Mobile Menu | ✅ Working | Top right (mobile) |
| Floating Animations | ✅ Working | Hero section |
| Marquee Scroll | ✅ Working | Below hero |
| Parallax Effect | ✅ Working | On scroll |
| Image Hovers | ✅ Working | Gallery images |
| RSVP Buttons | ✅ Working | Multiple locations |
| Confetti | 🎊 Optional | Can be enabled |

## 📂 File Structure

```
niyatiBirthday/
├── index.html           ← Main page (open this!)
├── js/
│   └── main.js         ← All JavaScript here
├── css/
│   ├── styles.css      ← Styling
│   ├── app.css         ← App styles
│   └── fonts.css       ← Typography
└── README.md           ← Full documentation
```

## 🎨 Color Scheme

The website uses soft, pastel colors:
- 🌸 **Pink**: #E4C5C4 (Soft blush)
- 🌿 **Green**: #C1D5C9 (Sage)
- 🌼 **Yellow**: #F5E3B8 (Buttercream)
- 🌊 **Blue**: #C4DAE8 (Sky)
- 📄 **Cream**: #F9F6F0 (Background)
- 🖤 **Charcoal**: #1F1D1B (Text)

## 🛠️ Common Customizations

### Change Birthday Date & Time
```javascript
// In js/main.js, line 82
const targetDate = new Date('2027-01-25T16:00:00').getTime();
//                          YYYY-MM-DD T HH:mm:ss
```

### Speed Up/Slow Down Marquee
```javascript
// In js/main.js, line 148
const speed = 0.5; // Try 1.0 for faster, 0.2 for slower
```

### Enable Confetti on Load
```javascript
// In js/main.js, uncomment line 284
setTimeout(createConfetti, 1000);
```

### Change Floating Animation Speed
```javascript
// In js/main.js, line 127
const duration = 3 + Math.random() * 4; // Adjust these numbers
//               ↑ min seconds      ↑ additional random seconds
```

## 🐛 Troubleshooting

### Countdown Not Working?
1. Check browser console (F12) for errors
2. Verify date is in future
3. Ensure JavaScript is enabled

### Animations Laggy?
1. Close other browser tabs
2. Try a different browser
3. Check CPU usage

### Mobile Menu Not Showing?
1. Resize browser width < 768px
2. Or use browser DevTools mobile emulator
3. Check for JavaScript errors

### Nothing Works?
1. Check `js/main.js` exists
2. Verify script tag in `index.html`
3. Open browser console (F12) for errors
4. Look for: "🎉 Birthday invitation initialized!"

## 📱 Testing Tips

### Desktop Testing
```
1. Open in Chrome/Firefox/Safari
2. Check all sections scroll smoothly
3. Hover over images
4. Watch countdown tick
5. See balloons float
```

### Mobile Testing
```
1. Resize browser window (< 768px)
2. OR use DevTools mobile emulator (F12)
3. Test hamburger menu
4. Check all sections are readable
5. Verify countdown displays correctly
```

## 🎊 Optional: Enable Confetti

Want confetti when page loads?

1. Open `js/main.js`
2. Go to line ~284
3. Uncomment this line:
```javascript
setTimeout(createConfetti, 1000);
```
4. Save and refresh browser
5. 🎉 Confetti falls!

## ⚡ Performance

All animations are optimized for smooth 60fps:
- ✅ Uses `requestAnimationFrame()`
- ✅ GPU-accelerated CSS transforms
- ✅ Efficient DOM manipulation
- ✅ No jQuery or heavy libraries
- ✅ Minimal JavaScript (12KB)

## 🌐 Browser Support

Works perfectly on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 📖 Need More Help?

Check these files:
- `README.md` - Complete documentation
- `IMPLEMENTATION_NOTES.md` - Technical details
- `CHANGES.md` - Version history

## 🎉 You're Ready!

Everything is set up and working. Just:
1. Update the countdown date
2. Open index.html
3. Enjoy the animations!

Made with ❤️ for Niyati's special day
