import "./globals.css";
import {
  SupabaseProvider,
  SyncWorkspaceAndGuard,
} from "@/lib/supabase/SupabaseProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <SyncWorkspaceAndGuard>{children}</SyncWorkspaceAndGuard>
          </SupabaseProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
