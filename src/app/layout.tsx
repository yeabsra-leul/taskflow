import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SupabaseProvider } from "@/lib/supabase/SupabaseProvider";
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SupabaseProvider>{children}</SupabaseProvider>
          </ClerkProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
