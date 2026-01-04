import { useState } from "react";
import { Section, SectionHeader, Card } from "./shared";

interface Testimonial {
  name: string;
  role: string;
  avatarSrc: string;
  socialUrl: string;
  quote: string;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [expanded, setExpanded] = useState(false);
  const displayCount = expanded ? testimonials.length : Math.min(6, testimonials.length);

  return (
    <Section id="testimonials" size="full">
      <SectionHeader
        badge="Testimonials"
        badgeColor="emerald"
        title={
          <>
            What our <span className="text-gradient">students</span> say
          </>
        }
        subtitle="Join thousands of developers who have leveled up their AI engineering skills."
      />

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {testimonials.slice(0, displayCount).map((testimonial, i) => (
          <Card key={i} className="mb-6 break-inside-avoid p-6">
            {/* Quote */}
            <blockquote className="mb-6">
              <div className="text-violet-500/50 text-4xl font-serif leading-none mb-3">"</div>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {testimonial.quote}
              </p>
            </blockquote>

            {/* Author */}
            <a
              href={testimonial.socialUrl}
              className="group flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <img
                src={testimonial.avatarSrc}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full ring-2 ring-white/10 group-hover:ring-violet-500/30 transition-all"
              />
              <div>
                <div className="text-white font-medium text-sm group-hover:text-violet-400 transition-colors">
                  {testimonial.name}
                </div>
                <div className="text-zinc-500 text-xs">
                  {testimonial.role}
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>

      {testimonials.length > 6 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium"
          >
            {expanded ? "Show Less" : `Show ${testimonials.length - 6} More`}
          </button>
        </div>
      )}
    </Section>
  );
}
