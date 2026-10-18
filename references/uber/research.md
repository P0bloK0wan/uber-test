# Uber visual and motion evidence — 2026-10-18

## What is now genuinely available

This folder contains three **actual Uber typefaces referenced by the official Uber Design site**, six **public recordings of the real iOS rider app published by 60fps**, six **official Base Web SVG icons**, official Base Web motion/typography source, and eleven **unaltered complete Lottie assets from the supplied Uber APK**. App code has not been modified.

Evidence hierarchy matters: the APK is Android `com.ubercab` version `4.652.10004` (318515); the 60fps material is third-party recording of iOS with India-specific products/prices, **not an Uber-produced recording and not verified as the APK's version**. Its recording date/version are not exposed. Do not treat it as a Brazilian Android pixel-perfect target. No third-party recreation is used here.

## Official typography and icon assets

Source: https://www.uber.design/ (HTTP 200, saved `uber-design.txt`). Its inline `font-faces-jmzbxz` CSS directly declares:

| Genuine family/weight | Local file | Origin |
|---|---|---|
| Uber Move Bold / 700 | `assets/uber-move-bold.woff2` | `https://www.uber.design/_user_fonts/v1/58fe8b650f7528290bdf96a750de8d9f423703fc` |
| Uber Move Text Medium / 500 | `assets/uber-move-text-medium.woff2` | `https://www.uber.design/_user_fonts/v1/cfcdb1e79186df6bedb68c589ee32f7ed2d6aaf9` |
| Uber Move Text Regular / 400 | `assets/uber-move-text-regular.woff2` | `https://www.uber.design/_user_fonts/v1/181a1224f264ad8c784019e692fc8e67077160bd` |

All three responses have font/woff2 MIME and `wOF2` signature. Exact byte sizes/hashes in `asset-downloads.json`. `assets/uber-fonts-reference.css` defines local family mapping for reference use. These are genuine official-site assets, not previously substituted Inter/DM Sans. The source page does not state a redistributable font license; no license is invented.

Official Base Web source is pinned to commit `ed21081e33f7db2770922b4e04d16dcf5bbdfa85` (API tree saved). Downloaded search, calendar, arrow-left, chevron-right, check and plus SVGs to `assets/baseweb-*.svg`; provenance in `baseweb-assets.json`. MIT license copied to `assets/baseweb-LICENSE`. These are official web design-system icons, not a claim that their paths are identical to every native rider icon.

The official typography source (`baseweb-typography.txt`, fetched from main) declares UberMoveText for body, UberMove for headings. Concrete tokens: body 14/20 and 16/24 px; medium label 16/20 px weight 500; heading XS 20/28 px weight 700, small 24/32, medium 28/36. These are source tokens, not measured screen pixels in videos.

## Public video reference matrix

Index: https://60fps.design/apps/uber (saved `60fps.txt`). Its metadata describes six Uber interactions recorded frame-by-frame. Only the six public visible entries were downloaded; no PRO-only entries were accessed. Public CDN source URLs and SHA-256 digests are in `asset-downloads.json`. Technical frame counts/durations are measured by ffprobe and preserved in `video-metadata.json`. All six streams are 60 fps; clip lengths **are not transition durations**.

Contact sheets are in `frames/*-sheet.jpg`; detailed 10 fps samples in `frames/detail/*.jpg`. Contact sheet timestamps denote nominal sampling bins and have approximately ±0.1 s uncertainty for detailed observations. Video wrappers include a phone mockup and watermark, so media dimensions are not native device viewport sizes.

| Recording / local video | Screen/state actually seen | Measured clip | Observed motion / approximate timing | Unknown |
|---|---|---|---|---|
| `ride-picker.mp4` | iOS product picker: Uber Auto, Request any, Uber Go, Go Sedan, Moto; cash and black Choose button | 4.550 s, 273 frames, 2000² | Selected product gains outlined rounded card, expands vertically, car image shifts from inline thumbnail to top illustration; previous card collapses, siblings reposition, CTA label updates. First change begins around 0.25–0.30 s and is substantially settled around 0.5–0.6 s: roughly 250–350 ms. Later selections repeat same morph. | Exact input timestamp, easing, native dimensions, APK parity |
| `verified-tick.mp4` | Modal sheet “Your ride is verified”; hand holding phone, OK button, Learn More | 2.633 s, 158 frames, 2000² | Phone dots form check, hold; around 1.6 s a blue circle expands from check/phone center, fills illustration panel by ~1.9 s (about 300 ms); white shield fades/scales in, inner check draws after ~2.0 s. Text/actions remain fixed. | Whether the recovered Android PIN asset matches playback speed/segment selection |
| `dropoff.mp4` | Home feed while on trip, fixed blue “Dropoff by 12:03 PM” mini-card immediately above bottom navigation | 12.000 s, 720 frames, 2160² | Mini map/car thumbnail animates while text/nav remain static. At ~10 s page scrolls behind persistent trip mini-card. Embedded illustration should not become a full-screen random map animation. | Loop boundary/easing; relationship to Android trip_tracker asset is plausible, unproven |
| `search-border.mp4` | Dark home: Uber/Parcel tabs, destination search pill, For you grid | 4.483 s, 269 frames, 2160² | Subtle search-border highlight; input placeholder changes to “Hi, Prabhu” near final second. No actual destination-page transition is captured. | Highlight cycle period and exact easing not resolved from sampled frames |
| `loading.mp4` | White loading screen, two/three black geometric marks, “Loading buses and trains” plus supporting text | 4.700 s, 282 frames, 2160² | Small marks morph/swap; text crossfades around 2.5–3.0 s while indicator repeats. This is a transit-loading state, **not evidence for generic ride request loading**. | Exact loop frequency/keyframe path |
| `uber-one.mp4` | Seasonal Member Days Uber splash into home | 2.018 s, 120 video frames, 2000² | Branded splash fades into home/skeleton content approximately 0.7–1.1 s (~400 ms), underlying header/search becomes visible progressively; home content follows. | Generic splash behavior, region/date/version, actual launch/network time |

## Original Android motion assets and exact timings

Recovered files are byte-for-byte entries from `evidence/uber-recovered-partial.apk`, which contains only complete CRC-verified members of the truncated user APK. Original APK SHA-256 `8b65c1bc07b091e277c73da324c439707bb11123600f7116aeb6c2bd735f0421`, derivative `945217023e9244e9cce768cc0fc92ed339c06730b136c110e09d942b8379d877`. Source package version is `4.652.10004`. `lottie-assets.json` contains member names, SHA-256, dimensions, frame intervals and metadata. Duration is `(op-ip)/fr` at playback speed 1; app runtime may select subsegments or change speed. Names indicate intended domain, not proved code-level routing.

| Local file under assets/ | FPS | In–out frame | Exact metadata duration | Canvas |
|---|---:|---:|---:|---|
| `activity_pulsing_dot.json` | 60 | 0–91 | 1.516667 s | 60 × 60 |
| `location_pulsing_dot.json` | 60 | 0–91 | 1.516667 s | 60 × 60 |
| `dot-pulse.json` | 30 | 0–90 | 3.000000 s | 12 × 12 |
| `dots.json` | 24 | 0–24 | 1.000000 s | 33 × 8 |
| `loading_white.json` | 60 | 0–48 | 0.800000 s | 24 × 6 |
| `circle_check.json` | 60 | 0–61 | 1.016667 s | 640 × 640 |
| `clock_animation.json` | 60 | 0–61 | 1.016667 s | 640 × 640 |
| `safety-shield-animation.json` | 60 | 0–71 | 1.183333 s | 240 × 277 |
| `trip_tracker_map_loop.json` | 60 | 0–601.12 | 10.018667 s | 290 × 290 |
| `pin_confirmation.json` | 12 | 0–60 | 5.000000 s | 375 × 143 |
| `ub__credits_purchase_checkmark_animation.json` | 29.97 | 96–120 | 0.800801 s | 116 × 116 |

Particularly actionable verified details from `location_pulsing_dot.json`:
- Canvas 60 × 60; fixed center circle 27.75 diameter at (30,30).
- Source fill RGB rounds to **#266EF1** (both layers).
- Outer circle shape 61 diameter, scale 0→100% over frames 0→90, i.e. **1500 ms**.
- Its scale easing uses outgoing `(0.22,1)` / incoming `(0.36,1)`, matching **cubic-bezier(0.22,1,0.36,1)** for x/y.
- Outer opacity 60%→0% over frames 0→60 (**1000 ms**, linear), remaining invisible through the tail. Full timeline 91/60 = 1516.667 ms.
- `activity_pulsing_dot.json` is byte-identical to the location version.

`dots.json` has a 1000 ms timeline, centers x=4.84/16.84/28.84 at y=4. Three blue dots have staggered opacity peaks at frames 6/12/18 (250/500/750 ms at 24 fps); first dot runs 20%→100%→70%→20% at frames 0/6/12/18. `loading_white.json` has 800 ms timeline, centers x=3/12/21 at y=3, white dots and 8-frame staggering (133.333 ms at 60 fps).

`trip_tracker_map_loop.json` and `pin_confirmation.json` include embedded data-URI images; those bytes remain inside JSON, no external asset requests are required. All extracted selected Lotties have no external image paths. Use the original JSON to retain exact shape geometry/keyframes instead of drawing generic replacements.

## Official motion constants (supporting evidence, not native duration proof)

Pinned https://github.com/uber/baseweb/blob/ed21081e33f7db2770922b4e04d16dcf5bbdfa85/src/themes/shared/animation.ts saved at `assets/baseweb-animation.ts`:

- Enter/decelerate: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Exit/accelerate: `cubic-bezier(0.64, 0, 0.78, 0)`.
- Accelerate/decelerate: `cubic-bezier(0.83, 0, 0.17, 1)`.
- Responsive acceleration: `cubic-bezier(0.11, 0, 0.5, 0)`.
- Linear opacity/color: `cubic-bezier(0, 0, 1, 1)`.
- Timing tokens include 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 3000, 5000, 7000 ms.

## Implementation consequences grounded in evidence

1. Replace approximation font families with the genuine reference families if usage scope permits; headings Uber Move 700, body Uber Move Text 400/500. This changes glyph widths, line wrapping and visual identity materially.
2. Product selection should morph card height, artwork position and sibling layout together; roughly 300 ms is the measured candidate from the iOS recording, and must be validated against it rather than claimed exact Android timing.
3. Use recovered native location pulse and applicable original check/loading Lottie keyframes. Do not apply transit-loading or seasonal splash visuals indiscriminately to ride booking.
4. Keep on-trip summary anchored above four-item bottom navigation as visible in dropoff clip. Menu labels in recording: Home / Services / Activity / Account. Brazil localization must be supplied separately.
5. A pixel identity claim still needs matching platform/version/state screenshots. Current evidence substantially improves real font/icon/motion fidelity but does not establish every screen, gesture, theme or Brazilian localization.
