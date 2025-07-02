'use client';

import { Users, BookOpen, Heart, MapPin } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '12,547',
    label: 'Active Members',
    description: 'Book lovers sharing in communities worldwide',
    color: 'blue',
  },
  {
    icon: BookOpen,
    value: '68,392',
    label: 'Books Shared',
    description: 'Physical books exchanged between neighbors',
    color: 'green',
  },
  {
    icon: Heart,
    value: '94%',
    label: 'Satisfaction Rate',
    description: 'Users love their ReadRelay experience',
    color: 'red',
  },
  {
    icon: MapPin,
    value: '247',
    label: 'Cities',
    description: 'Communities across North America and Europe',
    color: 'purple',
  },
];

export function CommunityStats() {
  return (
    <section className="py-24 bg-blue-600 dark:bg-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Growing Communities, Sharing Stories
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of book lovers who are building connections and
            sharing knowledge through ReadRelay.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>

              <div className="text-lg font-semibold text-blue-100 mb-2">
                {stat.label}
              </div>

              <div className="text-sm text-blue-200 leading-relaxed">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-white font-medium">
              Join 12,000+ happy readers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
