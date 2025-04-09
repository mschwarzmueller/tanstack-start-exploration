// app/routes/__root.tsx
import type { ReactNode } from 'react';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useNavigate,
} from '@tanstack/react-router';

import '../app.css';
import { authClient } from '../auth-client';
import { createServerFn } from '@tanstack/react-start';
import { auth } from '../auth';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'My first steps!',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const nav = useNavigate();

  const { data: session } = authClient.useSession();

  const isAuthenticated = !!session;

  async function handleLogout() {
    await authClient.signOut();
    nav({ to: '/', replace: true });
  }

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-900 text-gray-100">
        <header>
          <nav>
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
