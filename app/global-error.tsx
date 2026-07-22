"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself, which
 * `app/error.tsx` cannot — it renders *inside* that layout. React replaces the
 * whole document here, so this file must ship its own <html> and <body> and
 * cannot rely on the app's fonts, providers or Tailwind layer being mounted.
 * Hence the inline styles: they are the only thing guaranteed to apply.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f8f6f1",
          color: "#101418",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#36a1df",
            }}
          >
            Southeast Media
          </p>
          <h1 style={{ margin: "0.75rem 0", fontSize: "1.875rem", fontWeight: 600 }}>
            The site failed to load
          </h1>
          <p style={{ margin: "0 0 1.5rem", lineHeight: 1.6, color: "#5b6470" }}>
            Something went wrong at the root of the application. Please try again, or write to{" "}
            <a href="mailto:studio@southeastmedia.com" style={{ color: "#1951a8" }}>
              studio@southeastmedia.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: "pointer",
              borderRadius: "9999px",
              border: "none",
              background: "#1951a8",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9375rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
