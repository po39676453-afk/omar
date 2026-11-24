import { useState } from 'react';
import AdminDemo from '@/pages/AdminDemo';
import Login from '@/pages/Login';
import Waiting from '@/pages/Waiting';
import WheelPage from '@/pages/WheelPage';

type Route = 'wheel' | 'login' | 'waiting' | 'admin';

type SearchState = {
  prize: string | null;
  appId: string | null;
  reason: string | null;
};

function readSearch(): SearchState {
  const params = new URLSearchParams(window.location.search);
  return {
    prize: params.get('prize'),
    appId: params.get('appId'),
    reason: params.get('reason'),
  };
}

function pushSearch(state: SearchState) {
  const params = new URLSearchParams();
  if (state.prize) params.set('prize', state.prize);
  if (state.appId) params.set('appId', state.appId);
  if (state.reason) params.set('reason', state.reason);
  const query = params.toString();
  window.history.pushState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
}

function currentRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/login') return 'login';
  if (path === '/waiting') return 'waiting';
  if (path === '/admin') return 'admin';
  return 'wheel';
}

export default function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const [search, setSearch] = useState<SearchState>(readSearch);

  const navigate = (next: Route, state: SearchState) => {
    setSearch(state);
    const path = next === 'wheel' ? '/' : `/${next}`;
    window.history.pushState({}, '', path);
    pushSearch(state);
    setRoute(next);
  };

  if (route === 'admin') {
    return <AdminDemo />;
  }

  if (route === 'login') {
    return (
      <Login
        prize={search.prize}
        reason={search.reason}
        onSubmitted={() => navigate('waiting', { prize: search.prize, appId: null, reason: null })}
      />
    );
  }

  if (route === 'waiting') {
    return (
      <Waiting
        prize={search.prize}
        appId={search.appId}
        onApproved={() => navigate('wheel', { prize: null, appId: null, reason: null })}
        onRejected={(reason) => navigate('login', { prize: search.prize, appId: search.appId, reason })}
      />
    );
  }

  return (
    <WheelPage
      onPrize={(prize) => navigate('login', { prize, appId: null, reason: null })}
    />
  );
}
