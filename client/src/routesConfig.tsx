import { lazy } from 'react';

const routes = [
  {
    path: '/',
    element: lazy(() => import('./pages/Home/Homepage')),
  },
  {
    path: '/join',
    element: lazy(() => import('./pages/Auth/Join')),
  },
  {
    path: '/client-signup',
    element: lazy(() => import('./pages/Auth/Client/ClientSignup')),
  },
  {
    path: '/user-signup',
    element: lazy(() => import('./pages/Auth/User/UserSignup')),
  },
  {
    path: '/login',
    element: lazy(() => import('./pages/Auth/Login')),
  },
  {
    path: '/adashboard',
    element: lazy(() => import('./pages/Users/Admin/AdminDashboard')),
  },
  {
    path: '/cdashboard',
    element: lazy(() => import('./pages/Users/Client/CDashboard')),
  },
  {
    path: '/dashboard',
    element: lazy(() => import('./pages/Users/User/UserDashboard')),
  },
  {
    path: '/cdetail/:id',
    element: lazy(() => import('./pages/Users/Client/HackathonDetail')),
  },
  {
    path: '/cdetail/:id/payout',
    element: lazy(() => import('./pages/Users/Client/Payout')),
  },
  {
    path: '/admin/hacks/:id',
    element: lazy(() => import('./pages/Users/Admin/AdminHackathonDetail')),
  },
  {
    path: '/admin/hacks/edit/:id',
    element: lazy(() => import('./pages/Users/Admin/AdminEditHackathon')),
  },
  {
    path: '/hackathons',
    element: lazy(() => import('./pages/Hackathons/AllHackathons')),
  },
  {
    path: '/atransactions',
    element: lazy(
      () => import('./pages/History/Admin/AdminTransactionHistory'),
    ),
  },
  {
    path: '/history',
    element: lazy(() => import('./pages/History/Users/HackathonHistory')),
  },
  {
    path: '/aevents',
    element: lazy(() => import('./pages/Event/Admin/AdminEvents')),
  },
  {
    path: '/arequests',
    element: lazy(() => import('./pages/Users/Admin/AdminRequests')),
  },
  {
    path: '/settings',
    element: lazy(() => import('./pages/Auth/ProfileSettings')),
  },
  {
    path: '/ctransactions',
    element: lazy(() => import('./pages/History/Client/AllTransactions')),
  },
  {
    path: '/hacks/:id',
    element: lazy(() => import('./pages/Users/User/UserHackathonDetail')),
  },
  {
    path: '/recover-password',
    element: lazy(() => import('./pages/Auth/RecoverPassword')),
  },
  {
    path: '/reset-password',
    element: lazy(() => import('./pages/Auth/UpdatePassword')),
  },
  {
    path: '/create-hackathon',
    element: lazy(() => import('./pages/Users/Client/CreateHackathon')),
  },
  {
    path: '/aeventdetail',
    element: lazy(() => import('./pages/Event/Admin/AdminEventDetail')),
  },
  {
    path: 'terms-and-conditions',
    element: lazy(() => import('./pages/Others/Terms')),
  },
  {
    path: 'imprint',
    element: lazy(() => import('./pages/Others/Imprint')),
  },
  {
    path: '*',
    element: lazy(() => import('./pages/Errors/Notfound')),
  },
];

export default routes;
