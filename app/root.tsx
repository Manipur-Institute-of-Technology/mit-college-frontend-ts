import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { navigationData } from "./mock/navbar";
import Navbar from "./Common/Navbar/Navbar";
import Footer from "./Common/Footer/PublicFooter";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./toast.css"

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {/* Global Toastify Container */}
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          progressClassName = "toast_progress_class"
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div className="fixed bg-slate-700/50 backdrop-blur-md w-[100vw] h-[100vh]">
      <div className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-mono w-fit">
        This is some hydration...
      </div>
    </div>
  );
}

// TODO: Make this a generic error displaying page, which carch all error including non 404
// TODO: add catch all route for cms prefix route
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const backgroundImageUrl = "/404_bg.jpg";

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <>
        <Navbar navigation={navigationData} />
        <main
          className="bg-slate-800  bg-blend-overlay bg-fixed bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        >
          <div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0 border border-black min-h-[100vh]">
            <NotFound />
          </div>
        </main>
        <Footer />
      </>
    );
  } else {
    console.log("Non 404 error occur: ", error);
  }
}

export function _ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
