'use client';

import Link from 'next/link';
import { Button } from '@readrelay/ui';
import { ArrowRight, BookOpen, Users } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 lg:px-20 lg:py-24">
            <div className="max-w-4xl mx-auto text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-8">
                <BookOpen className="w-8 h-8 text-white" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Sharing?
              </h2>

              {/* Description */}
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of book lovers in your community. Share your
                favorite reads, discover new stories, and build lasting
                connections through the power of books.
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-6 mb-10 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Local Community</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Free to Use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span>Safe & Secure</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto group shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/browse">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Browse Books First
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm text-blue-200 mb-4">
                  Trusted by book lovers in 247+ cities
                </p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="text-xs text-blue-200">🔒 SSL Secured</div>
                  <div className="text-xs text-blue-200">📱 Mobile App</div>
                  <div className="text-xs text-blue-200">🌟 4.8/5 Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
