import type { Metadata } from "next";
import { Figtree, Lexend } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const figtree = Figtree({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const lexend = Lexend({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DataPivots - AI-Powered Healthcare Document Analysis",
  description:
    "Transform manual data extraction from medical reports, invoices, and patient notes into automated, structured insights.",
  keywords: [
    "healthcare",
    "document analysis",
    "AI",
    "medical reports",
    "data extraction",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} ${lexend.variable} antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="datapivots-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
