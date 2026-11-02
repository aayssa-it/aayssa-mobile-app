import { router } from 'expo-router';
import { useCallback } from 'react';

import { resolveDestination } from '../lib/urls';
import WebsitePage from './WebsitePage';

export function LiveWebsiteTab({ path, title }: { path: '/calendar' | '/gallery'; title: string }) {
  const close = useCallback(() => router.navigate('/'), []);
  const destination = resolveDestination(path);
  if (destination.kind !== 'website') return null;
  return <WebsitePage url={destination.url} title={title} close={close} embedded />;
}
