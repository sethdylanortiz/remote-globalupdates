import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// components
import Navbar from '@/components/navbar/Navbar';

// styling
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Remote Configuration Console",
    description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className = "h-full">

        <body className = "h-full font-sans">

            <main className = "min-h-screen">

                <Navbar/>
                    {children}

            </main>
        </body>
    </html>
  )
}