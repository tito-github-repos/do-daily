import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "Do Daily - Train Your Brain",
  description: "Train your brain. 10 minutes a day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Navbar />
          <main style={{ flex: 2 }}>{children}</main>
          <Footer />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}