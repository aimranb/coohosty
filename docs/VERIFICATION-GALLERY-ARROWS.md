# Phone alignment and gallery arrows — 2026-10-02

Removed the rendered thumbnail strip from both Next.js and the visual preview. Ten photographs remain in configuration. Previous/next buttons wrap in both directions and synchronize the laptop photo, three-photo editor stack, title, caption and counter. React uses a functional state update so repeated clicks do not use stale state. Preview stores escaped photo metadata in a data attribute without thumbnail image elements.

The Dynamic Island is positioned relative to the phone with left:50%, right:auto and translateX(-50%), overriding the old left/right:32% rule. Status content has space reserved on both sides. Phone editor layout and title wrapping have explicit sizing rules for mobile and RTL.

Updated `tests/e2e/showcase.spec.ts` covers removal of thumbnails, previous/next wraparound, keyboard activation, device image synchronization and actual island/frame center alignment. Browser tests cannot run until npm dependencies are installed; this is coverage added, not a claim of a passing browser test. Dependency-free gallery checks, syntax checks and served-preview regression checks cover structural behavior. Full Next.js build and visual rendering remain unverified.
