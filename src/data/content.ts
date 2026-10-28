import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export type Resource = {
  title: string;
  subtitle: string;
  path: string;
  icon: IconName;
};

export const resources: Resource[] = [
  { title: 'Bhajan book', subtitle: 'Devotional songs for your practice', path: '/bhajan-book', icon: 'musical-notes-outline' },
  { title: 'Vratham guidelines', subtitle: 'Prepare for your spiritual journey', path: '/vratham-guidelines', icon: 'sunny-outline' },
  { title: 'Pooja items', subtitle: 'A guide to preparing for worship', path: '/pooja-items', icon: 'sparkles-outline' },
  { title: 'Namaskara slokam', subtitle: 'Prayers and devotional verses', path: '/namaskara-slokam', icon: 'book-outline' },
];

export const services: Resource[] = [
  { title: 'Maaladharana', subtitle: 'Explore the tradition and guidance', path: '/maaladharana', icon: 'flower-outline' },
  { title: 'Padi pooja', subtitle: 'Learn about worship and seva', path: '/padi-pooja', icon: 'sparkles-outline' },
  { title: 'Irumudi / Kettu Nira', subtitle: 'Find guidance on the official website', path: '/irumudi%2F-kettu-nira', icon: 'leaf-outline' },
  { title: 'Annadhanam', subtitle: 'Service through sharing food', path: '/annadhanam', icon: 'heart-outline' },
];

export const communityLinks: Resource[] = [
  { title: 'Photo gallery', subtitle: 'Moments from the community', path: '/gallery', icon: 'images-outline' },
  { title: 'About AAYSSA', subtitle: 'Our organization and seva activities', path: '/about-us', icon: 'information-circle-outline' },
  { title: 'Contact the organizers', subtitle: 'Questions, volunteering, and assistance', path: '/contact-us', icon: 'mail-outline' },
  { title: 'Share feedback', subtitle: 'Reach the website team', path: '/feedback', icon: 'chatbubble-outline' },
];

export const shortcuts: { title: string; subtitle: string; path: string; icon: IconName }[] = [
  { title: 'Calendar', subtitle: 'Plan your next visit', path: '/calendar', icon: 'calendar-outline' },
  { title: 'Gallery', subtitle: 'Moments from our Sangam', path: '/gallery', icon: 'images-outline' },
  { title: 'Member login', subtitle: 'Your Sangam membership', path: '/member-login', icon: 'person-outline' },
  { title: 'Contact us', subtitle: 'We’re here to help', path: '/contact-us', icon: 'mail-outline' },
];

const labels: Record<string, string> = {
  '/calendar': 'Calendar',
  '/member-login': 'Member login',
  '/member-registration': 'Become a member',
  '/maaladharan-registration': 'Maaladharan registration',
};

export function pageTitle(path: string) {
  return [...resources, ...services, ...communityLinks, ...shortcuts].find(item => item.path === path)?.title
    ?? labels[path]
    ?? 'AAYSSA';
}
