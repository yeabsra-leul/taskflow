"use client"

import { Mail, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/useAuth"

export default function ConfirmEmailPage() {
    const {email} =useAuth()
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-primary/10 rounded-full p-6">
              <CheckCircle2 className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Created!</h1>
          <p className="text-lg text-muted-foreground">We&apos;re excited to have you on board.</p>
        </div>

        {/* Email Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
              <Mail className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">Confirmation email sent to</p>
              <p className="text-foreground font-semibold break-all">{email || "your email"}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-8">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Check your inbox</p>
                <p className="text-xs text-muted-foreground">Look for an email from us</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Click the confirmation link</p>
                <p className="text-xs text-muted-foreground">Verify your email address</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">You&apos;re all set!</p>
                <p className="text-xs text-muted-foreground">Start using your account</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full h-11 text-base">
            <Link href="/">
              Back to Home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Didn&apos;t receive the email?{" "}
            <button className="text-primary hover:underline font-medium">Resend confirmation</button>
          </p>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Check your spam folder if you don&apos;t see the email within a few minutes.
          </p>
        </div>
      </div>
    </main>
  )
}
