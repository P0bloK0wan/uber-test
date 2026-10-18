# Uber APK static findings

## Source integrity and REA provenance
- Original: `originals/Uber.apk`, 3,355,080 bytes, SHA-256 `8b65c1bc07b091e277c73da324c439707bb11123600f7116aeb6c2bd735f0421`.
- Original is truncated: no ZIP central directory or end marker. REA 6.5.0 / JADX MCP 0.7.1 rejects it (`uber-package.json`, full failure evidence).
- Supplemental sequential ZIP-local-header inspection recovered **1,715 complete entries**, each decompressed and CRC verified. Inventory: `uber-local-entries.json`. First incomplete entry `classes.dex` starts at byte 2,709,080, declares 5,483,620 bytes but has only 646,000 available. No complete DEX, Android resource table, layouts or fonts can be recovered.
- Complete entries repackaged into **analysis-only derivative** `uber-recovered-partial.apk` (also `.zip`), SHA-256 `945217023e9244e9cce768cc0fc92ed339c06730b136c110e09d942b8379d877`. This is not repaired installable software. Original untouched; neither APK executed.
- REA successfully read derivative manifest and declarations: full evidence `uber-recovered-package.json`; decoded manifest `uber-recovered-manifest.xml`; selected identity `uber-identity.json`. REA's reported class_count 1 is generated/resource context, not recovered application code.

## Identity / technology verified from recovered manifest
- Package `com.ubercab`; version `4.652.10004`, versionCode `318515`; min SDK 29, target/compile SDK 36.
- Application `com.ubercab.presidio.PresidioApplication`; root activity `com.ubercab.presidio.app.core.root.RootActivity`; 36 declared activities.
- Required split types `base__abi,base__density`. Additional split APKs would be needed even if this base archive were complete.
- This is consistent with a truncated native Uber rider base package, not a tiny standalone WebView wrapper. Kotlin/coroutines and AndroidX Compose metadata are present. Native host includes embedded web payment/account flows. No complete source code is present to establish exact implementation.

## Actual home-screen configuration (CRC-verified asset content, supplemental parsing)
`uber-default_cx_home_screen_v2.json` preserves fallback/server-driven home composition:
1. `rides_shortcuts_list_home_v1_0` shortcut block.
2. `homescreen_navgrids`: heading **Services**, tappable **Get a ride** item. Ride image reference `https://mobile-content.uber.com/launch-experience/ride.png` (reference only, not downloaded).
3. `fallback` block; wayfinding and location-dependent utility blocks (`ring.home.wayfinding`, `ring.home.utility.location.authorization.denied.fallback`).
4. Location-denied fallback card: **Welcome to Uber**, **Book a location**, 160-unit height, 16-unit margins, 12-unit rounded corners, green `GREEN_800` background and `CONTENT_ON_COLOR` text.
- Grid outer margins 16 horizontal / 8 top / 4 bottom; label font token `LABEL_DEFAULT`, weight `MEDIUM`; backgrounds `BACKGROUND_PRIMARY`, `BACKGROUND_SECONDARY`; border tokens `BORDER_OPAQUE`, `BORDER_TRANSPARENT`.
- Home configuration has conditional readiness/location bindings and remote server feature identifiers. These assets describe fallback composition, not necessarily the actual logged-in home screen for a specific user/location.
- `uber-default_cx_services_screen.json`: heading **Go anywhere, get anything** (`HEADING_X_SMALL`, `MEDIUM`, `CONTENT_PRIMARY`), followed by mobility and delivery grids `navigation_grid_services_menu_mobility_v1_0` and `navigation_grid_services_menu_delivery_v1_0`.
- Also recovered on-trip and simplified home configurations. Focused path/value detail in `uber-home-details.json`.

## Verified screen names and useful reconstruction scope
`uber-uistate_mapping_rule.json` (mapping version 392) contains **395 distinct named states**; list in `uber-ui-state-names.json`. The following concrete screen families are present:
- Home, Services, Activity, Account tabs (`home_screen`, `services_tab`, `activity_tab`, `account_tab`).
- Pickup edit; multiple-destination address entry; pickup/destination refinement.
- Product confirmation (`CSBottomSheetComponent`); payment selection; reserve date/time picker.
- Pre-trip (`PreTrip`, `PreTripV2`), on-trip (`TripHome` with trip_state=on_trip), cancellation modal, fare breakdown, trip details, trip rating (`RatingDetailV4`).
- Wallet, add card/payment, add funds/promo/gift card, saved places, help, security and account settings.
- Shared rides, group rides, intercity, bike/scooter, delivery and Eats states also exist; presence does not establish availability in Brazil or active business logic.

## Evidence boundaries / proposed web approximation
A practical principal-feature recreation can connect **Home → pickup/destination search → product choice → payment choice → confirm → driver arrival/on-trip → completion/rating**, plus **Activity**, **Wallet**, **Account**, **Reserve**. These transitions are a reconstruction proposal from named states, not a recovered call graph. Rates, routes, drivers, histories and payments must be explicit local demo data unless separately integrated.

No screen was rendered. Exact fonts, resolved palette hex values, icons, Portuguese strings, current dynamic grid contents and pixel-perfect visual equivalence cannot be verified from this truncated artifact. Use familiar Uber black/white rounded UI as an acknowledged visual approximation, or obtain complete APK sets and reference screenshots for exact verification. Asset configuration should inform spacing, sections and state coverage without claiming identical rendering.
