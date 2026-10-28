import { classifyUrl } from './urls.ts';

export type BrowserState = {
  sourceUrl: string;
  currentUrl: string;
  canGoBack: boolean;
  loading: boolean;
  failedUrl: string | null;
  attempt: number;
};

export type BrowserAction =
  | { type: 'start'; url: string }
  | { type: 'navigate'; url: string; canGoBack: boolean }
  | { type: 'open'; url: string }
  | { type: 'fail'; url?: string }
  | { type: 'finish' }
  | { type: 'retry' };

export function initialBrowserState(url: string): BrowserState {
  return { sourceUrl: url, currentUrl: url, canGoBack: false, loading: true, failedUrl: null, attempt: 0 };
}

export function browserReducer(state: BrowserState, action: BrowserAction): BrowserState {
  switch(action.type) {
    case 'start':
      return { ...state, currentUrl: websiteUrl(action.url, state.currentUrl), loading: true };
    case 'navigate':
      return { ...state, currentUrl: websiteUrl(action.url, state.currentUrl), canGoBack: !state.failedUrl && action.canGoBack };
    case 'open': {
      if(classifyUrl(action.url).kind !== 'website') return state;
      return { ...state, sourceUrl: action.url, currentUrl: action.url, loading: true };
    }
    case 'fail': {
      const failedUrl = websiteUrl(action.url, state.currentUrl);
      return { ...state, currentUrl: failedUrl, failedUrl, loading: false, canGoBack: false };
    }
    case 'finish':
      return { ...state, loading: false };
    case 'retry':
      return { ...state, sourceUrl: state.failedUrl ?? state.currentUrl, currentUrl: state.failedUrl ?? state.currentUrl, failedUrl: null, canGoBack: false, loading: true, attempt: state.attempt + 1 };
  }
}

function websiteUrl(url: string | undefined, fallback: string) {
  return url && classifyUrl(url).kind === 'website' ? url : fallback;
}
