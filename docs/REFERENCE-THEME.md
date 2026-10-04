# Screenshot-inspired theme

The supplied reference guides cream (#faf7f2), nearly black (#15120f) and warm orange accents. The service cards use broad rounded corners, numbered headers and a dark COHOST card. The wider website adopts the same colors, including pricing, contact, tools, proof section and gallery controls.

Inter replaces Poppins via next/font, retaining the legacy CSS variable name to keep all existing typography declarations consistent. SVG wordmarks and visual preview use Inter too. A raster screenshot cannot identify the original font reliably, so this is a close typographic interpretation, not a verified exact font match. Arabic falls back to suitable installed Arabic glyph fonts.

`reference-theme.css` is the last stylesheet layer. Existing image navigation, centered phone hardware, eye gaze and city animations remain. No real testimonial or client metric was supplied; service-proof data remains empty and the explicit pending state remains. Do not populate it with fictional business endorsements or an estimated client count.

Dependency-free preview and translation/gallery checks pass. The full Next build remains unverified because dependencies are not installed. Browser font downloads, screenshots and device rendering were not verified.
