import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedBooks } from '@/components/home/FeaturedBooks';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CommunityStats } from '@/components/home/CommunityStats';
import { CallToAction } from '@/components/home/CallToAction';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@readrelay/ui';

export default async function HomePage() {
  // Handle missing environment variables during build
  let session = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      session = data.session;

      // If user is authenticated, redirect to dashboard
      if (session) {
        redirect('/dashboard');
      }
    }
  } catch (error) {
    // During build time or when credentials are missing, just render the page
    session = null;
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-16">
        <HeroSection />

        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedBooks />
        </Suspense>

        <HowItWorks />

        <Suspense fallback={<LoadingSpinner />}>
          <CommunityStats />
        </Suspense>

        <CallToAction />
      </div>

      <Footer />
    </main>
  );
}
