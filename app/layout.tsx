import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import ErrorBoundary from "../components/ErrorBoundary";
import AuthFlowGuard from "../components/AuthFlowGuard";
import NotificationPopupWrapper from "../components/NotificationPopupWrapper";
import GlobalThemeProvider from "../components/GlobalThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinguaAI - Smart Language Learning",
  description: "Learn languages with AI-powered adaptive learning, interactive quizzes, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <AuthProvider>
            <SettingsProvider>
              <GlobalThemeProvider>
                <LanguageProvider>
                  <AccessibilityProvider>
                    <NotificationProvider>
                      <NotificationPopupWrapper>
                        {children}
                      </NotificationPopupWrapper>
                    </NotificationProvider>
                  </AccessibilityProvider>
                </LanguageProvider>
              </GlobalThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
