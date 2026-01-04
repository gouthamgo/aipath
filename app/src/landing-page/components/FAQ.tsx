import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../client/components/ui/accordion";
import { Section, SectionHeader } from "./shared";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  href?: string;
}

export default function FAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <Section id="faq" size="md">
      <SectionHeader
        badge="FAQ"
        badgeColor="cyan"
        title={
          <>
            Frequently asked <span className="text-gradient">questions</span>
          </>
        }
        subtitle="Everything you need to know about AI Path and the curriculum."
      />

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={`faq-${faq.id}`}
            className="rounded-xl bg-white/[0.02] border border-white/5 px-6 transition-all hover:border-white/10 data-[state=open]:border-violet-500/30 data-[state=open]:bg-violet-500/5"
          >
            <AccordionTrigger className="text-white hover:text-violet-400 text-left text-base font-medium py-5 transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <p className="text-zinc-400 text-base leading-relaxed">
                {faq.answer}
              </p>
              {faq.href && (
                <a
                  href={faq.href}
                  className="inline-flex items-center gap-1 mt-4 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
