'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { signInSchema } from '../../../schemas/signinSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Incorrect username or password');
      } else {
        toast.error(result.error || 'An unknown error occurred');
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      {/* 🔹 FULL-SCREEN BACKGROUND VIDEO */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src="/video/backend-1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay over whole page */}
      <div className="pointer-events-none absolute inset-0 bg-black/55" />

      {/* 🔹 Foreground content */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-16 px-8 py-12 md:flex-row md:items-center md:justify-center">
        {/* LEFT: CLOAK CHAT with video INSIDE text */}
        <div className="hidden md:flex flex-1 flex-col space-y-4">
         {/* Plain text logo */}
          <h1
            className="
              text-[7vw] lg:text-[5vw]
              font-black tracking-[0.25em] uppercase leading-tight
              text-white
            "
          >
            CLOAK
            <br />
            CHAT
          </h1>


          <p className="max-w-md text-sm md:text-base text-slate-200">
            Share and receive anonymous thoughts without losing trust.
            Honest conversations, beautifully hidden.
          </p>
        </div>

        {/* RIGHT: sign-in card */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md rounded-xl bg-slate-950/85 p-8 shadow-2xl border border-slate-800 backdrop-blur-xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Sign in to continue your secret conversations
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email / Username</FormLabel>
                      <Input
                        {...field}
                        className="bg-slate-900/80 border-slate-700 focus-visible:ring-sky-400"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        {...field}
                        className="bg-slate-900/80 border-slate-700 focus-visible:ring-sky-400"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full bg-sky-500 hover:bg-sky-400 text-black font-semibold"
                  type="submit"
                >
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="text-center mt-5 text-sm text-slate-300">
              <p>
                Not a member yet?{' '}
                <Link
                  href="/sign-up"
                  className="font-semibold text-sky-300 hover:text-sky-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
