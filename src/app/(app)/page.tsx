'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-white">

      {/* ===== Background VIDEO (fills screen) ===== */}
      <video
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
        src="/video/bg-1.mp4"     
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* ===== Content above video ===== */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-200 drop-shadow">
            Cloak Chat - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel */}
        <div className="relative w-full max-w-lg md:max-w-xl">
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-md shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-100">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 text-sky-400" />
                      <div>
                        <p className="text-slate-100">{message.content}</p>
                        <p className="text-xs text-slate-400">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-4 md:p-6 bg-black/70 backdrop-blur-sm text-slate-300 text-sm">
        © {new Date().getFullYear()} Cloak Chat. All rights reserved.
      </footer>
    </div>
  );
}
