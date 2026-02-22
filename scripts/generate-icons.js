// Simple script to generate placeholder icons
// Run with: node scripts/generate-icons.js
// Requires: npm install canvas (or use online tool)

// Note: This is a placeholder script. For actual icon generation:
// 1. Use an online tool like https://realfavicongenerator.net/
// 2. Or use a design tool to create 192x192 and 512x512 PNG icons
// 3. Or use the canvas package: npm install canvas

console.log(`
Icon Generation Instructions:
============================

Since generating PNG icons requires image processing libraries, please create the icons manually:

1. Create two PNG images:
   - icon-192.png (192x192 pixels)
   - icon-512.png (512x512 pixels)

2. Place them in: public/icons/

3. Simple options:
   - Use an online icon generator (search "PWA icon generator")
   - Use a design tool (Figma, Canva, etc.)
   - Use a simple colored square with text "R" for Running

4. The icons should have:
   - Transparent or solid background
   - Simple design (works well at small sizes)
   - High contrast for visibility

For a quick test, you can create simple colored squares:
- 192x192px solid color PNG
- 512x512px solid color PNG
`)
