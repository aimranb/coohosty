# Property photography

The hero image URL is centralized in `src/config/site.ts`. Replace it with `/images/hero.webp` and place your licensed original here. Next/Image handles responsive output. The temporary Unsplash photo is decorative property inspiration, not a claim of a COHOSTY-managed property.

Customer property photos are not stored here; they are authenticated Cloudinary assets served through protected admin routes.

## Property gallery

The ten temporary villa and apartment photographs are configured in `src/config/property-gallery.json`. They use Unsplash image URLs and Next/Image responsive optimization. The [Unsplash license](https://unsplash.com/license) permits commercial use of these free stock images. The gallery identifies them as illustrative photography, not properties managed by COOHOSTY or a single property's photo set.

Replace each `src` with a licensed local asset such as `/images/properties/villa-pool.webp`, and update the corresponding `showcase.photoAlts` entry in all three translation files. Keep source/license information with replacement photography. No video is used by this gallery.

## Homepage hero

`hero-airbnb.webp` is a locally optimized illustrative interior photo, selected for the warm cognac sofa and natural daylight. Source: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 (also used in the existing property gallery). License: https://unsplash.com/license . It is not represented as a COOHOSTY-managed property. The homepage uses one preloaded photo instead of the city carousel.
