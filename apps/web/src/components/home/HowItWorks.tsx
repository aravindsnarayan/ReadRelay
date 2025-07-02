'use client';

import { Search, MessageCircle, RefreshCw } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover Books',
    description:
      "Search for books available in your neighborhood. Filter by genre, author, or distance to find exactly what you're looking for.",
    color: 'blue',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Chat',
    description:
      'Message book owners to coordinate pickup times and locations. Build connections with fellow book lovers in your community.',
    color: 'green',
  },
  {
    icon: RefreshCw,
    title: 'Exchange & Repeat',
    description:
      'Meet in person to exchange books safely. Rate your experience and keep the cycle of sharing going strong.',
    color: 'purple',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            How ReadRelay Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Sharing books with your community is simple. Just three steps to
            start building connections through literature.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                    ${
                      step.color === 'blue'
                        ? 'bg-blue-600'
                        : step.color === 'green'
                          ? 'bg-green-600'
                          : 'bg-purple-600'
                    }
                  `}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`
                  mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 mt-4
                  ${
                    step.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : step.color === 'green'
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-purple-100 dark:bg-purple-900'
                  }
                `}
                >
                  <step.icon
                    className={`
                    w-8 h-8
                    ${
                      step.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : step.color === 'green'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-purple-600 dark:text-purple-400'
                    }
                  `}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Free to Use
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Local
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Community Focus
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Safe
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Verified Users
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Always Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
