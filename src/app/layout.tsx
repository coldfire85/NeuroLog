import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import HeaderNav from "@/components/header-auth";
import { SessionProvider } from "@/components/session-provider";
import ClientBody from "./ClientBody";
import { NotificationProvider } from "@/context/notification-context"; // Add this after other imports
import { AppNotifications } from "@/components/app-notifications"; // Add this after other imports

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroLog - Neurosurgical Procedure Logbook",
  description: "A modern logbook for neurosurgical procedures with elegant glass UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <NotificationProvider> {/* Wrap ClientBody with NotificationProvider */}
            <ClientBody className={inter.className}>
              <div className="min-h-screen">
                {/* Use HeaderNav component which includes our DICOM Viewer link */}
                <HeaderNav />
                <main className="container py-6 md:py-10">{children}</main>
              </div>
              <Toaster />
              <AppNotifications /> {/* Include AppNotifications component */}
            </ClientBody>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
