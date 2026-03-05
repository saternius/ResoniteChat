import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resonite Dash",
  description: "Web dashboard for Resonite - manage friends, sessions, messages, and inventory",
  icons: {
    icon: "/resonite-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
