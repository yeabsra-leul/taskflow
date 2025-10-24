import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase/SupabaseProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { RouteGuard } from "@/components/RouteGuard";
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
            <RouteGuard>{children}</RouteGuard>
          </SupabaseProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
