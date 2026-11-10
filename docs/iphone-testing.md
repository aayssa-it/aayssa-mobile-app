# iPhone test checklist

From the separate `aayssa-mobile-app` clone on `feature/navigation-static-content`:

```sh
npm start -- --port 8081 --lan
```

Use an SDK 58-compatible Expo Go installation. Keep the Mac and iPhone on the same Wi-Fi network. Scan the terminal QR code with the iPhone Camera and open it in Expo Go. If the app is already open, reload from the new server; an older server may still serve the ZIP copy.

- Home shows a native introduction and links to About, Events & seva, and Membership & community.
- About opens native text. Switch to airplane mode after loading the app and confirm About and all four seva descriptions still work. Re-enable internet before testing the website.
- At every tested width: Home, Calendar, Resources, Gallery, and Contact Us remain visible. Check labels at your preferred text size and with VoiceOver.
- Calendar loads the live Home Pooja calendar inside the app. Check scrolling, date controls, browser Back/Done, and tab switching. Do not create an RSVP merely to test navigation.
- Gallery loads inside the app. Open a photo and return; confirm the bottom tabs stay reachable.
- Events & seva opens from Home. Each of the four seva rows opens its native description; its current-details button opens the official live page. Maaladharana also links to live registration.
- Home registration, Member login, and Become a member still open live pages. Check login/logout using your own account without sharing credentials in chat. Avoid submitting registrations while checking navigation.
- Contact Us opens its native screen from its tab, then opens the live organizer contact form. Return to Home.
- Resources has a book tab icon; searching and opening devotional documents still work.
- Offline website loading offers Try again and Open in browser. Reconnect and retry; use Done to return to the app.

Report the iPhone model, iOS version, and any failing step. Physical-device acceptance is pending until these steps are confirmed. The user reviewed the changes and authorized pushing the feature branch on October 30, 2026. Continue device testing during PR review; do not push to main or merge.
