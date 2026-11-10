// Summarized from the official pages on 2026-10-30. See docs/content-sources.md.
// Keep dates, availability, fees, registration, and membership on the live website.
export const organization = {
  introduction: 'Atlanta Ayyappa Seva Sangam (AAYSSA) brings Ayyappa devotees together through devotion, spiritual growth, and community service.',
  description: 'Our Sangam organizes seva activities, spiritual gatherings, and pilgrimages that strengthen our community and deepen our connection with Lord Ayyappa. Compassion, selfless service, and unity guide this shared journey.',
  homeSeva: 'AAYSSA volunteers help families organize Ayyappa Swamy Pooja and bhajans at home. Support includes pooja setup, essential worship items, music, and help preparing food, so families can focus on worship.',
  source: '/about-us',
};

export const sevaDescriptions = [
  {
    id: 'maaladharana', title: 'Maaladharana', path: '/maaladharana',
    description: 'AAYSSA supports devotees taking Maaladharana, with guidance from the Guruswamy. Devotees can contact the Sangam to discuss arrangements and the maala they need.',
  },
  {
    id: 'padi-pooja', title: 'Padi pooja', path: '/padi-pooja',
    description: 'A traditional, Guruswamy-led Ayyappa Padi Pooja brings worship into devotees’ homes. AAYSSA members help families with pooja setup, Abhishegam, bhajans, and Annadhanam preparation. Families can also worship together at another chosen location.',
  },
  {
    id: 'irumudi', title: 'Irumudi / Kettu Nira', path: '/irumudi%2F-kettu-nira',
    description: 'Irumudi is a sacred preparation for the holy yatra, undertaken with devotion and purity. The Guruswamy prepares and ties the Irumudi and performs the Irumudi Pooja before the journey and offering to Lord Ayyappa. AAYSSA can help with the bag, required items, and yatra coordination.',
  },
  {
    id: 'annadhanam', title: 'Annadhanam', path: '/annadhanam',
    description: 'Annadhanam is service through preparing and sharing food. AAYSSA provides Annadhanam at Padi Pooja and special events, and helps other nonprofit groups with food preparation. Volunteers are welcome to participate in preparing food for these gatherings.',
  },
] as const;
