# Native content sources

Verified October 30, 2026 against the official AAYSSA website before writing the native summaries in `src/data/organization.ts`.

| Native content | Official source | Verified information |
| --- | --- | --- |
| Home introduction and About | https://atlantaayyappasevasangam.org/ and https://atlantaayyappasevasangam.org/about-us | Unity, devotion, spiritual growth, seva, pilgrimages, and volunteer support for home pooja and bhajans. |
| Maaladharana | https://atlantaayyappasevasangam.org/maaladharana | Guruswamy guidance and help arranging a maala. |
| Padi pooja | https://atlantaayyappasevasangam.org/padi-pooja | Guruswamy-led worship; family support for setup, Abhishegam, bhajans, and Annadhanam; homes or another chosen location. |
| Irumudi / Kettu Nira | https://atlantaayyappasevasangam.org/irumudi%2F-kettu-nira | Sacred preparation for yatra, Guruswamy preparation and pooja, and help with items and coordination. |
| Annadhanam | https://atlantaayyappasevasangam.org/annadhanam | Food preparation at pooja, special events, and nonprofit gatherings; volunteer participation. |
| Contact | https://atlantaayyappasevasangam.org/contact-us | Official contact form and Shiloh Road, Cumming, Georgia location. |

These are brief paraphrases, not full copies of website pages. No dates, temple hours, booking availability, prices, or annual registration announcements are bundled. Each seva has a button to its live source page. The general About page and the dedicated Irumudi page differ in their historical yatra details; the native Irumudi summary uses the dedicated page and leaves destinations and arrangements live.

The official site's navigation still links to `/calendar`, `/gallery`, `/member-login`, `/member-registration`, and `/maaladharan-registration`. The existing calendar alias was checked directly: https://portal.atlantaayyappasevasangam.org/home-pooja-calendar.html returns the live AAYSSA Calendar with Home Pooja availability and RSVP controls. Existing registration and membership destinations are preserved. Form submission and authenticated flows require device testing; no registrations or bookings were submitted during verification.

Calendar and Gallery are dedicated in-app WebView tabs on iOS/Android. The browser preview retains the existing explicit external website button because embedded website framing is unreliable on web. Source buttons always open the live website; native app shortcuts open the new app screens.

Navigation uses Expo Router's existing JavaScript tabs. Below 400 points (adjusted for text scale), the Contact Us tab item is hidden from the tab bar while its route remains navigable and remains a full-width button immediately after the Home hero. Events/seva and membership use secondary stack screens reachable from Home; the member icon still opens membership. These routes retain their existing deep links.

Refresh these summaries when the organization changes its descriptions. Preserve the separation between descriptive text and live operational information.
