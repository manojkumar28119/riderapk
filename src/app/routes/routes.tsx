// routes.tsx
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { Dashboard, Settings } from "../pages/main/index";
import NotFound from "../pages/not-found";
import MainLayout from "@/components/layout/MainLayout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout/AuthLayout";
import SignIn from "@/features/auth/pages/SignIn";

/**
 * SessionExpiryProvider wraps authenticated routes only (MainLayout)
 * NOT around unauthenticated routes (AuthLayout/login)
 *
 * WHY THIS PLACEMENT:
 * - Session expiry monitoring only needed for logged-in users
 * - Avoids running hooks on login/signup pages
 * - Isolates session logic to authenticated part of app
 */
const routes: RouteObject[] = [
    {
    element: <AuthLayout />,
    children: [ { path: "/signin", element: <SignIn /> }],
  },
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/settings", element: <Settings /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];

export const router = createBrowserRouter(
  routes.map((route) => ({
    ...route,
    element: route.element ? (
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        }
      >
        {route.element}
      </Suspense>
    ) : (
      route.element
    ),
  })),
);
