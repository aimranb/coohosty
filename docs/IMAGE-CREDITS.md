# Destination photographs and platform artwork

The listing demo uses [Modern Living Room by Taryn Elliott on Pexels](https://www.pexels.com/video/modern-living-room-3769951/), a ten-second 1920 × 1080 clip, under the [Pexels license](https://www.pexels.com/license/). The editable remote video and poster URLs are in `src/config/listing-media.json`. The clip is streamed directly from Pexels with user-triggered controls and `preload="none"`; no file was uploaded to a third-party account. Attribution is visible below the devices. Actual media playback has not been verified in this network-restricted environment.

The editable asset manifest is `src/config/destinations.json`. Local photographs can replace its image URLs without changing the components. Pexels delivery URLs request up to 3840 pixels; responsive image sizes deliver smaller assets on small screens. The original pixel dimensions of every external photograph could not be verified from this environment; do not describe every photograph as native 4K until verified.

- Casablanca: [Hassan II Mosque, Pexels](https://www.pexels.com/photo/hassan-ii-mosque-in-casablanca-morocco-32880203/).
- Fes: [Bab Bou Jeloud, Pexels](https://www.pexels.com/fr-fr/photo/la-porte-bleue-emblematique-de-la-medina-de-fes-au-maroc-35036526/).
- Meknes: [Bab El Mansour, bobistraveling / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bab_El_Mansour_Gate_Meknes_Morocco_165357_(49682259918).jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Original dimensions 2160 × 3840. Displayed with a crop. Attribution and license links are present in the gallery’s expandable photo credits.
- Agadir: [Coastline and city, Pexels](https://www.pexels.com/fr-fr/photo/vue-aerienne-de-la-ville-et-de-la-plage-d-agadir-35627666/).
- Tangier: [Cityscape, Pexels](https://www.pexels.com/photo/cityscape-of-tangier-morocco-20890428/).
- Rabat: [Street scene, Pexels](https://www.pexels.com/photo/charming-moroccan-street-scene-in-rabat-31741321/).

Pexels photographs are supplied under the [Pexels license](https://www.pexels.com/license/). Photo source links are included on the website.

The Airbnb, Booking.com and Vrbo SVG artwork is linked from the respective Wikimedia Commons file pages recorded in the manifest. Artwork colors and proportions are preserved; movement applies to the containing element. The website identifies these as compatible platforms and states that the service is independent. These names and marks belong to their respective owners.

External imagery requires an internet connection in the browser. This sandbox cannot download the originals. For production, download approved artwork to `public/images` and `public/platforms`, preserve attribution, and update the manifest. Next.js optimizes city photographs with responsive sizes; SVG platform artwork is delivered without rasterization.
