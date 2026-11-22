# Portfolio Design Principles

This document is the shared reference for all design and implementation decisions in this portfolio project.

## Core Guidelines

1. **Mobile first**
   Every component, element, layout, interaction, and style starts with the mobile experience. Larger breakpoints enhance the foundation rather than replace it.

2. **Design system first**
   Establish the design system from the approved creative direction before building the broader interface.

3. **Intentional typography**
   Define and use the required font families, weights, sizes, line heights, letter spacing, and responsive type behavior as part of the design system.

4. **System consistency**
   Nothing should fall outside the design system or component library. New visual patterns must be incorporated into the system rather than implemented as isolated exceptions.

5. **Components as needed**
   Build reusable components when the interface calls for them. Avoid premature abstraction and unnecessary components.

6. **Attention to detail**
   Prioritize craft, experience, accessibility, responsiveness, and overall quality throughout design and implementation.

7. **Purposeful, performant animation**
   Animation is an essential part of the experience. Use GSAP thoughtfully, protect runtime performance, avoid unnecessary work, and support reduced-motion preferences.

8. **Reusable CSS tokens**
   Use CSS custom properties for reusable and scalable color, typography, spacing, sizing, elevation, radius, layering, motion, and breakpoint decisions.

9. **Creative collaboration and approval**
   Ask for creative suggestions and approval at meaningful decision points. Do not silently lock in major art-direction or experience choices.

10. **A creative journey**
    Treat the portfolio as an evolving creative collaboration, not merely a product to assemble and finish.

## Working Agreement

- Consult this document before making design-system, component, styling, or animation decisions.
- Present meaningful creative alternatives when a decision benefits from exploration.
- Keep implementation aligned with approved design decisions.
- Discuss proposed exceptions before introducing them.
- Favor cohesive experience and lasting quality over speed alone.

## Layout Foundation

- Target five device ranges: smaller phones (up to 359px), mobile (360–767px), tablet (768–1023px), desktop (1024–1439px), and larger desktop (1440px and up).
- Use the shared breakpoint tokens: `--breakpoint-small-phone`, `--breakpoint-mobile`, `--breakpoint-tablet`, `--breakpoint-desktop`, and `--breakpoint-large-desktop`. Sass breakpoint variables mirror these values for media queries.
- Use a 2-column grid below 768px, 7 columns on tablet, and 12 columns from desktop upward.
- Express design-system measurements in pixels; do not use `rem` or `em` units.
- Keep 24px gutters between columns.
- Use 24px side margins at the mobile-first base and 48px side margins from the desktop breakpoint onward.
- Keep 48px between paired content and images in future sections.
- Center the v2 hero copy in the responsive grid; the portrait is absent from the approved v2 layout.
- Frame the hero with centered hanging ornaments, lotus artwork at the lower left and upper right, and outlined clouds at the upper left and lower right.
- Reserve the center ornament's actual aspect-ratio height plus 48px before hero content. For viewports at most 800px tall (tablet width and above), reduce ornament, lotus and cloud tokens; reduce them further below 600px height. Keep decorative elements clear of the identity text and separate the bottom cloud from the right lotus.
- Stack identity content with an 8px flex gap.
- Use the reusable Button component's filled-cloud variant for Discover, based on the existing cloud artwork. Size it at 184×76px on phones and 200×82px from tablet upward. Keep the label in 16px Abhaya Libre, white on indigo, with a clear blue reading area beneath it. A single soft 4px hover/focus uplift eases in and out over 700ms, with no repeating jiggle or rotation. Disable that movement for reduced motion and while navigating. Clicking retains the two-wave wind transition into the journey view.
- Set the hero title in Belanosima; set the subtitle and button label in Abhaya Libre.
- Decorative scene clouds are outlined, using the lighter 2-unit SVG stroke. The Discover button uses a separate filled variant.
- Scale landing decoration with shared tokens: cloud / side ornament / center ornament / lotus = 72 / 64 / 72 / 260px on smaller phones; 88 / 72 / 80 / 320px on mobile; 160 / 100 / 108 / 360px on tablet; 200 / 104 / 112 / 420px on desktop; and 228 / 117 / 124 / 467px on larger desktop.

## Ambient Motion

- On load, ornaments descend from above with a soft bounce. Lotus branches reveal outward from the sides, followed by staggered leaves and petals using SVG masks over the unchanged source artwork.
- The entrance runs once per mount in separate stages: ornaments 0–1.89s; lotus growth 2.14–5.69s; Discover slides up 24px and fades in at 6.04–6.94s using sine in-out easing. Ambient ornament and lotus breeze begin after a further 0.8s pause (7.74s). Clouds keep their quiet continuous drift from mount. Keep the title and subtitle static. Reduced motion skips the entrance and shows the complete artwork immediately.

- A gentle breeze repeats every 3 seconds, with slightly staggered responses.
- Ornaments pivot at their hanging points with a small ambient pendulum swing (1.8 degrees at reference gain).
- Lotus vines remain intact as connected artwork during the ambient breeze. The breeze travels from left to right through coordinated connected layers. All paths remain joined throughout departure; plucking and shedding are disabled for now.
- Lotus branch response is physics-inspired: longer guide branches have more compliance and a slightly slower response; short branches resist the gust. Apply a modestly stronger wind force only through the continuous bend field so the artwork stays joined.
- Clouds drift 16px over 16 seconds, gently reversing direction.
- Use transforms for continuous motion; SVG stroke masks are used only during the brief growth entrance. Pause while the tab is hidden, and show static artwork when reduced motion is preferred.
- Motion values are shared CSS tokens; GSAP timelines clean up on unmount and preference changes.

## Section Navigation

- Present landing, journey, and works as full-width views in a fixed horizontal track. Wheel and touch scrolling never change sections, and the document itself does not scroll. Long content may scroll vertically within its active view; the works carousel remains swipeable on mobile.
- Discover first sends a medium gust through the clouds, hanging ornaments, and connected lotus field. The gust settles before a stronger second wave carries the camera right: the track exits left and the journey enters from the right. Wind propagates left to right, with the left hanging responding before the right.
- Before departure, finish any entrance still underway without accelerating it, then fade ambient displacement out over 0.5s. Pause ambient cycling during departure; gust motion replaces it rather than adding to it. During departure, ornaments and branches share a 2.2s asymmetric pendulum rhythm: stronger rightward pushes and softer leftward returns through rest (0.4 bias with 0.9 oscillation). Ornament high-wave response has 1.25× gain. The breeze remains a single coordinated motion; no independent fast tremor. Share the two wind envelopes across the artwork. Maintain branch-length compliance, fixed vine roots, and pendulum return swing. Vary medium strength within 6% and high strength within 10% per departure, keeping the two-wave timing fixed.
- Keep lotus petals and twigs attached during departure. The fracture prototype remains dormant for later review. The second wave applies a sustained bend with coordinated back-and-forth branch movement with a stronger rightward push, preserving root anchors and branch-length compliance.
- Clouds drift continuously right from mount at 2px/s on phones and 3px/s from tablet upward. Both wave envelopes gently add speed (1.5px/s per pressure unit) and a small lift; neither wave stops or reverses the drift.
- Carry three clouds: the top decoration becomes the top-left “Take me back” button; the filled Discover cloud sheds its label and becomes the outlined drifting middle cloud; the bottom decoration becomes the bottom-right “Explore my work” button. Navigation clouds settle for 6s after camera arrival, then stay fixed. Their labels fade in over 0.5s. The middle cloud stays on its original horizontal route and travels behind the artwork, without fading or moving to the header. This supersedes the earlier all-cloud pause during unlocking.
- Keep cloud controls in reserved header/footer space, at layout side margins and 16px from viewport edges. The title stays outside the scrolling body. Journey content scrolls in the separate center panel so controls never cover the scroll corners or text. Cap the closed motif size by the available panel height as well as its breakpoint size. The middle cloud remains at its departure height, sized 72px on phones and 112px from tablet upward; it stays clear of the history text. Continue its rightward drift with an offscreen wrap. Pause and hide the floating carry layer when the works view is active; restore it on return. Reset source visibility and temporary anchor state when returning to landing.
- Use the reusable outlined cloud Button variant for both journey controls. Keep Abhaya Libre labels and a clear center behind them. Both stay outlined with indigo text; hover and keyboard focus fill the cloud, switch text to white, and lift 4px with a 700ms ease-in-out transition. Reduced motion suppresses lift and flight while retaining usable controls and a static outlined decorative cloud.

- Use the discover motion tokens for wave pressure and timing. Current values: 1.65s medium wave at 1.65× extra pressure, 5.4s high wave at 4.3× beginning at 2.1s, with a sustained pressure plateau. After the 0.5s ambient settle, horizontal movement begins at wind time 5.2s (5.7s after a normal click) and lasts 2s, allowing the branches to visibly load before travel. Departure branch deflection is 10px per pressure unit before compliance; cloud drift is 2px/s on phones and 3px/s from tablet upward. Blend all guide samples with a broad 75px Gaussian neighborhood; do not select the nearest branch or sample. This prevents local influence ridges that wrinkle thin printed stems. Regression-check the actual SVG contours through peak gusts on both mirrored sides, including root anchoring and local stretch bounds.
- Finish the departure timeline with the slide and unlock the journey immediately on camera arrival (7.7s after a normal click). Cloud settling continues independently. Lock repeated navigation while a transition runs. Keep inactive views inert, focus the arriving section heading without scrolling, and pause hidden landing motion. Navigation links provide return and works access.
- Anchor each view's heading and opening artwork to its layout rather than recentering the heading when content expands. Keep section navigation available while long content is read.
- Reduced-motion preferences change views immediately without the wind burst or horizontal travel. Pause active transitions while the browser tab is hidden.

## Journey Introduction

- The journey section follows the landing page with the centered title “My journey so far.” Its square opener is traced from `src/mockups/pattern.png` into a transparent red SVG.
- Scale the journey artwork to 216px on smaller phones, 264px on mobile, 352px on tablet, 420px on desktop laptops, and 480px on larger desktops.
- Only after camera arrival, the artwork fades and scales from 62% to 100% over 1.8s with sine in-out easing, retaining its diamond orientation. It then rests for 1.2s before the existing three-second arrival timer opens it; no entrance overshoot or animation during camera travel. Reduced motion shows the finished state immediately.
- The pattern is a non-interactive image: no hover, click, tooltip, press ripple, or keyboard button behavior. After the journey view has fully arrived and navigation has completed, wait three seconds (`--journey-reveal-delay`) before opening automatically. Pause the wait while the tab is hidden. Leaving before the reveal cancels the pending start; returning to the unopened view gives a fresh three-second wait. A reveal already underway pauses offscreen and resumes on return, and an opened scroll does not replay.
- The pattern rests in a diamond orientation. Its automatic reveal rotates it to a square, fades the entire inner design before any split, separates its top and bottom, then sends the four remaining outer motifs to the scroll corners. The motifs are clipped views of the original SVG, with short open, rounded strand extensions revealed during the inner fade. Corner viewport sizes use `--journey-corner-size`: 72px on smaller phones, 88px on mobile, 104px on tablet, 128px on desktop, and 144px on large desktop. Open corners reposition and resize when the viewport changes. Reduced motion keeps the same three-second viewing pause and then displays the opened surface without the opening motion.
- Keep corner viewports 4px from the paper edges (`--journey-corner-inset`), retaining the original SVG's internal breathing room. Animate the paper on its own layer: history entries never scale with it and stay hidden throughout the structural opening. Once all four corners settle, wait 0.25s, then fade entries in each actual flex row left to right. Use 0.85s fades, a 0.28s entry stagger, and a 0.18s pause between rows. The same sequence adapts to three desktop columns, two tablet columns, and one mobile column. Hidden tabs and inactive views pause the reveal.
- The opened scroll displays responsive history entries from the HistoryContent component.
- Match the pattern SVG's edge finish to Lantern.svg while using pattern.png as the shape reference. Use fitted cubic Bezier outlines and straight lattice edges; retain the original lotus contours, pointed tips, proportions, transparent background, and red ink. Avoid blur filters, decorative corrective outlines, and broad rounding of the petals.
- Center the history content block horizontally and vertically within the paper, capped at 960px wide. Reserve the corner size plus a 32px design gap above and below it so text never sits between the open strands. Use a mobile-first flex layout: one column on phones, two on tablets, and three on desktop. Keep individual entries left-aligned for reading.

## Works Scrolls

- Follow works.png with four tall reusable paper scrolls under a left-aligned “My Works” heading, framed by clouds. Dragon artwork is deferred.
- Use data-driven WorkScroll components. One selected tile widens while its neighbors narrow over 800ms; clicking it again or pressing Escape closes it.
- Mobile uses a horizontal swipeable row and brings the expanded tile into view. Tablet and desktop share the available row width. Honor reduced motion and expose expanded state to assistive technology.
- Paper, rolled ends and subtle shadows are CSS-rendered. Placeholder project labels remain until real content is supplied.

- Cloud navigation labels are “Back” and “Explore”; button silhouettes have no interior swirls. The Discover cloud travels continuously in scene coordinates at 12px/s behind the journey artwork, at its original vertical position. No fade-out, header relocation, or delayed fade-in. Only the decorative cloud continues drifting after arrival.

- Departure wave pressures: medium 1.85 and high 4.4 (about 12% and 2% stronger respectively). Preserve wave timing and branch flexibility; validate contour strain at maximum randomized pressure.

- The second wind wave starts at 1.8s after wind begins, reducing the inter-wave gap from 450ms to 150ms. Camera travel starts at 4.9s, preserving the stronger wave’s lead-in.

- Departure travel starts at wind time 4.65s, aligned with the strongest rightward push across the hanging ornaments. Use power2.out for the wind-driven slide so its highest speed coincides with the push and then settles; other navigation retains sine.inOut.

- Wind experience: preserve the early back-and-forth swing, then blend into a sustained rightward load with gentle flutter. The heavy gust is established for at least 0.6s across delayed elements before camera travel begins at wind time 6.1s. Travel takes 2.4s with sine.inOut acceleration; the 8.4s second wave holds pressure through the crossing. This replaces the previous peak-triggered power2.out departure.

- Stronger wind revision: second-wave pressure 6 (up from 4.4), carrying bias 1.05 with 0.22 flutter, and carrying buildup at 1.4–2.2s into that wave. Travel starts at wind time 4.8s and crosses in 1.8s; high-wave duration is 6.4s. Broaden the connected lotus material field to 140 SVG units and root compliance ramp to 160 units so increased pressure bends continuously without localized pinching. Real-contour distortion checks cover the stronger maximum randomized gust. This supersedes the slower 6.1s / 2.4s timing.

- Breeze correction: restore the original 75-unit material neighborhood and 65-unit root ramp. Remove the sustained carrying bias and repetitive flutter; use the shared asymmetric pendulum with branch propagation delays again. Keep pressure 6 for the stronger gust, but use smooth stem stiffening (55 * tanh(force / 55)) so stronger force cannot introduce local wrinkles. This replaces the 140/160 broad-field revision, which made the plant move like a rolling surface.

- Discover begins the first gust at click time 0, even during the button entrance or final idle pause. Fade the current ambient displacement out concurrently over 0.5s; do not wait for it before starting wind. If ambient motion has not started, its contribution stays zero. Camera travel is measured directly from the click (4.8s), with no entrance or settle offset.

- Discover entrance: begin 0.1s after lotus growth finishes and slide up over 0.65s, making the button fully visible 0.5s sooner than the previous 0.35s gap / 0.9s entrance.

- Discover now starts appearing at 3s from page load and is fully visible at 3.65s, overlapping the later lotus growth. Its start is independent of the full lotus reveal duration; this replaces the post-growth entrance gap.

- Sound: use the reviewed synthesized click on all button activations (including keyboard activation). Discover plays the subtle breeze with the first wind wave and heavy wind at the second wave’s start. Wind playback follows the GSAP gust clock, stops when hidden or interrupted, and resumes at the matching sample offset. Audio only unlocks on a button interaction; reduced-motion navigation plays the click without a wind sequence. Use restrained gains (click 0.65, breeze 0.5, heavy 0.6); the heavier sample is already louder. Keep the short click as WAV; deliver the band-limited wind samples as 22.05kHz stereo WAV at half the original file size.

- Crossfade wind audio: let the subtle sample extend 0.65s beyond the second-wave start, overlapping the heavy sample’s soft attack. Both voices follow the same GSAP clock, including pause/resume; no silence or abrupt replacement at the boundary.

- Wind audio level alignment: level the reviewed wind textures so their baked-in swells do not compete with the live animation. Drive runtime gain from current gust pressure and the average absolute hanging response (lags 0, 0.08, 0.16s), including randomized pressure. Smooth level changes over 50ms. Breeze maximum gain 0.3; heavy maximum 0.68 with a softer recovery and low pressure bed. Preserve the 0.65s overlap. With current tokens, sound gain and visible response peak at 4.63s; the rendered 100ms audio peak is at about 4.7s. Heavy crest is about 7dB above the subtle crest, with a mixed sample peak of -13dBFS. This supersedes fixed breeze/heavy gains of 0.5/0.6.

- Gentle sound arrival: extend the heavy air texture to 7.2s, preserving its active gust and blending additional matching noise into its tail. At slide arrival (6.6s after Discover), release the current wind gain smoothly over 2.2s into the journey. Continue the same source rather than restart a gust. Stop it promptly if the tab is hidden, navigation changes, or the app unmounts. The release ends before the artwork’s 3s reveal delay completes.

- Transition direction: retain the early pendulum recoil, then smoothly slow its second forward swing toward the positive crest using a continuous time warp. All hanging ornaments and delayed branches remain loaded to the right throughout the 4.8–6.6s crossing. Do not continue a repeating pendulum cycle that reverses mid-slide. Keep original local lotus compliance and shared sound-force coupling; no added broad surface wave or repetitive flutter.

- Save dated visual snapshots under `src/assets/history`, with a state index and viewport metadata. The October 26, 2026 set captures all three sections and the journey/works interaction states at 1280 × 720.

- Cloud artwork revision: use `Cloud-outline.svg`, traced as four clean Bézier paths from the supplied curled cloud reference. Transparent fill, indigo #406E8E stroke, 5.5 source units, round caps/joins. Apply across landing, journey, and works. Button versions share the outer path with interior curls omitted for label clarity; Discover now starts outlined too. Retain the approved hover lift/fill interaction. Preserve the new 625:430 proportions: button boxes are 144×99px on phones and 160×110px from tablet. Flight clouds stay outlined throughout, with the same geometry when docking.

- Smaller clouds and text CTA: reduce landing decorative cloud sizes by 25% at every breakpoint (54/66/120/150/171px, plus height-specific overrides). Reduce works clouds from 112/160px to 84/120px. Discover is now a text-only button in Abhaya Libre with its existing click sound, entrance, and wind navigation. Its former cloud no longer travels to the journey; the two decorative clouds still become Back and Explore. Name navigation cloud dimensions `--cloud-button-width/height`, independent of Discover.

- Increase the new cloud outline stroke from 5.5 to 7.5 SVG units so it stays legible at the reduced decorative sizes; use the same weight on cloud button outlines.

- Discover text button typography: Abhaya Libre, 24px (`--font-size-discover`), dark ink (`--color-text`, #191919).

- Discover has no padding, margin, or button minimum height; it uses the identity stack’s shared gap for spacing.

- Discover is now the primary button: palette red #BF1931, white text, radius 8px, 24px Abhaya Libre. Use the shared primary variant with 12px/24px internal padding, a 48px minimum height, and zero external margin. This replaces the text-only Discover treatment.

- Discover button external spacing: 16px top margin (`--space-4`), zero on the other sides.

- Primary button hover/focus: darken the palette red with 15% ink via `--color-accent-primary-hover`, using the shared background transition.

- Landing CTA label: “Experience”, 18px Abhaya Libre. Keep the primary red styling, hover treatment, 16px top margin, and existing wind transition.

- Lotus artwork now uses palette jade green #08A045. Bind its semantic token `--color-lotus` to `--color-jade`; the standalone SVG uses the same color.

- Darken lotus jade with 30% palette ink: `--color-lotus` uses 70% jade / 30% ink, approximately #0D7838. The standalone SVG matches.

- Lotus color refinement: use the selected dark green #085B29 for the semantic lotus token and standalone SVG.

- Lotus color refinement: #0E7939 is the current selected green for both the semantic token and standalone SVG.

- Restore the original muted lotus green #667E64 in the semantic token and standalone SVG; the jade and dark-green color trials are superseded.

- Current lotus color trial: botanical green #47734B, applied to the semantic token and standalone artwork.

- Journey artwork print refinement: replace the traced, irregular filled contours with precise Bézier-and-line geometry, uniform 7.2-unit strands, evenly spaced central lattice, and rotationally matched outer motifs. Retain the interlaced lotus composition, pointed petals, red ink, original 488×464 viewBox, and existing four-corner transition. The pre-refinement SVG is preserved in `src/assets/history/2026-10-26/pattern-square-before-print-polish.svg`.
- Open-corner strand endings are filled contours with true 45° cuts, not rounded SVG caps. Keep all three stepped horizontal and vertical strand lengths. `src/artwork/patternStrands.ts` derives their centers from the same rotated diagonal braid lines as the source pattern, avoiding gaps or mismatched widths at the join.

- Artwork scale continuity: rotate into the square while gently growing to 105% over 1.65s, then split at that exact size. Remove the old 105% → 100% settle. Compute the four starting viewports from the enlarged dimensions and centered offset so the handoff introduces no scale jump.

- Remove clouds throughout the live portfolio: no decorative clouds, cloud-shaped controls, drifting layers, or cloud transfer animation. Journey Back/Explore now use the same plain scene navigation as Works. Remove cloud-only variants, styling, motion plumbing, and tokens. Preserve existing wind/lotus/ornament motion, audio, scene transitions, and archived artwork/screenshots. Journey spacing uses the actual navigation height instead of reserving cloud-sized controls.

- Works panels: plain, straight-edged paper panels with no rolled/folded ends. Use a shared 12px panel gap instead of the 24px grid gutter, and remove the old wrapper insets so the visible panels stay close. Preserve the sliding expansion and neighboring-panel compression.

- Works dragon, static review phase: one continuous dark-ink vector composition across the four panels, with clean curves, regular scales, pointed fins and articulated named parts for future animation. Reveal the same source through measured paper masks, retaining a quieter drawing across the gaps. Keep project labels above the artwork. No dragon animation yet.

- Replace the Works dragon with upright lotus arrangements rooted at the foot of each panel. Reuse the original pointed flower contours unchanged, with new upright stems and restrained leaves, varied across four arrangements. Reserve the upper 38% for project content; use existing lotus green with red/paper petal mixes. Plant groups remain separate for later animation. No motion added in this art review phase. Dragon SVG is retained as an unused draft.

- Works botanical consistency: share all original lotus contours with the landing through LotusContours. Preserve the full connected vine, including fine stems, leaves, buds and pointed petals, in the same green. Middle panels rise from below; outer panels grow inward from the sides. Keep the upper content reserve and scale uniformly without distorting the artwork. This supersedes the simplified stems and contrasting petal colors.

- Works composition refinement: mix detailed original side vines on the outer panels with sparse upright plants in the middle. Second panel has a tall red flower and small pale flower; third has two lower flowers at different heights. Restore green foliage with muted red/paper blossoms throughout. Preserve the original flower contours and content reserve; avoid four rotations of the same vine.

- Enrich Works plants with clusters of smaller original vines, including their leaves, buds and branching stems: two varied clusters under each middle arrangement and one inward-growing cluster on each outer panel. Lower panel two’s main blossom from y76 to y135 and reduce its scale to 0.76. Preserve the mixed upright/branching composition, blossom colors and upper content reserve.

- Correct Works repetition: four individually drawn botanical compositions with distinct stem routes and branch junctions. Reuse individual lotus flower motifs only; remove every complete-vine copy. Keep six clean stems per panel, restrained pointed leaves, two varied blossoms, inward side growth at the ends, and lower upright growth in the middle. Preserve red/pale flowers and green foliage.

- Works lotus garden direction: the reference is a planted lotus pond across Japanese sliding screens, with broad peltate leaves, folded/cupped leaf views, overlapping foliage and blossoms nestled among leaves. Four independently composed gardens replace bare-stalk arrangements and copied landing vines. Keep crisp flat vector silhouettes, delicate radial veins, no painted texture, green palette-derived leaf tones, and the existing muted red/pale flower colors. Reuse only individual pointed blossom contours from the landing. Render stems behind all foliage. Preserve upper content space; anchor the end compositions to their respective sides during panel expansion. Each plant has an identifier for future motion. A standalone art review lives at /art-review/lotus-garden.html.
- Place the Works expand/collapse indicator in the clear upper corner so it stays legible above the denser foliage.

- Works scroll panels use flat paper surfaces: remove both the outer drop shadow and inset edge shading.

- Final section: “I post my creations on” with LinkedIn, Dribbble and Substack icon controls. Grey accent darkens to ink on hover/focus, using 56px controls, shared 8px corners and spacing tokens. Works links to this fourth scene through Elsewhere; final navigation returns to Works or the landing. Personal profile destinations await supplied URLs; keep unconfigured controls non-navigating.

- Social profile destinations: LinkedIn https://www.linkedin.com/in/pratikchvn/, Dribbble https://dribbble.com/neutronian, Substack https://substack.com/@neutronian. Open these external links in new tabs.

- Works scroll categories: Design — Interfaces with intention.; Engineering — Ideas built into working systems.; Visualizations — Making complex things clear.; Experiments — Following curiosity through code. Store these as shared category data; each project later has one primary category plus secondary tags. Keep the My Works section heading pending creative choice. Adjust scroll-title type at panel-width thresholds to fit longer category names while panels compress.

- Simplify work scroll controls: remove numbering and plus/minus markers throughout. Center category titles vertically in the full panel; keep full-panel keyboard/click controls and aria-expanded. Place expanded descriptions beneath the centered title and reserve the bottom 48% for the garden to avoid text/art collisions.

- Work section heading approved: “The Art of Creating”.
