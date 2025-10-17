"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  Users,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: LayoutGrid,
      title: "Visual Boards",
      description:
        "Organize tasks with beautiful, intuitive boards that make project management effortless.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates and powerful collaboration tools.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Built for speed. Experience instant updates and smooth interactions across all devices.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Enterprise-grade security keeps your data safe with end-to-end encryption.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track progress with detailed analytics and make data-driven decisions.",
    },
    {
      icon: Sparkles,
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and focus on what matters most to your team.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Teams" },
    { value: "2M+", label: "Tasks Completed" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute opacity-40 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Sparkles className="h-3 w-3 mr-2 inline" />
              New: Advanced Analytics Dashboard
            </Badge>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance">
              Project management
              <br />
              <span className="text-muted-foreground">made simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
              TaskFlow helps teams organize, track, and manage their work with
              beautiful boards and powerful collaboration tools.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="text-base px-8 h-12" asChild>
                <Link href="/dashboard">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 bg-transparent"
              >
                Watch demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <Card className="overflow-hidden border-2">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-muted to-muted/50 p-12 min-h-[500px] flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                        >
                          <Card className="h-32 bg-card hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 h-full flex flex-col justify-between">
                              <div className="h-3 w-3 rounded-full bg-primary" />
                              <div className="space-y-2">
                                <div className="h-2 bg-muted rounded w-3/4" />
                                <div className="h-2 bg-muted rounded w-1/2" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-muted/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Powerful features to help your team stay organized and productive
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-foreground/10">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-foreground text-background magicpattern">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-background/70 mb-10 text-balance leading-relaxed">
            Join thousands of teams already using TaskFlow to manage their
            projects more effectively.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 h-12"
              asChild
            >
              <Link href="/dashboard">
                Get started for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 bg-transparent text-background border-background/20 hover:bg-background/10"
            >
              Contact sales
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-background/60">
            <CheckCircle2 className="h-4 w-4" />
            <span>No credit card required</span>
            <span className="mx-2">•</span>
            <CheckCircle2 className="h-4 w-4" />
            <span>Free forever plan</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-foreground rounded flex items-center justify-center">
                <span className="text-background font-bold text-sm">T</span>
              </div>
              <span className="font-semibold">TaskFlow</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 TaskFlow. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
