import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oumi RL Studio - Fine-tune LLMs with Reinforcement Learning",
  description: "Fine-tune language models with reinforcement learning using Oumi's GRPO algorithm. No PhD required. Train, evaluate, and deploy custom LLMs through an intuitive web interface.",
  keywords: ["Oumi", "Reinforcement Learning", "LLM Fine-tuning", "GRPO", "RLHF", "Language Models", "Machine Learning", "AI Training"],
  authors: [{ name: "Oumi RL Studio Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Oumi RL Studio",
    description: "Fine-tune LLMs with Reinforcement Learning - No PhD Required",
    url: "https://oumi-rl-studio.vercel.app",
    siteName: "Oumi RL Studio",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 32,
        height: 32,
        alt: "Oumi RL Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oumi RL Studio",
    description: "Fine-tune LLMs with Reinforcement Learning - No PhD Required",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
