"use client";

import { useRef, useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { steps } from "./data";
import { MethodologyVisual } from "./visual";

export function Methodology() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
          }
        },
        { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Methodology
          </p>
          <H2 className="mt-2">
            I start with the process, not the tool
          </H2>
          <p className="mt-3 max-w-[720px] text-base leading-relaxed text-muted-foreground">
            I don&apos;t start by asking which tool we should use. First I want to
            understand how the business works today. Then I look at where things
            get stuck, decide what should be automated, and build from there.
          </p>
        </div>

        {/* Desktop: two-column with sticky visual */}
        <div className="mt-12 hidden lg:grid lg:grid-cols-[36%_1fr] lg:gap-16">
          {/* LEFT: Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => { stepRefs.current[index] = el; }}
                className="min-h-[220px] py-6 first:pt-0"
              >
                <div className={cn(
                  "transition-opacity duration-300",
                  activeStep === index ? "opacity-100" : "opacity-35"
                )}>
                  <span className={cn(
                    "font-mono text-xs font-bold",
                    activeStep === index ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.number}
                  </span>
                  <h3 className="mt-1 font-heading text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Sticky visual */}
          <div className="relative">
            <div className="sticky top-24">
              <MethodologyVisual activeStep={activeStep} />
            </div>
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="mt-10 space-y-10 lg:hidden">
          {steps.map((step, index) => (
            <div key={step.id}>
              <span className="font-mono text-xs font-bold text-primary">
                {step.number}
              </span>
              <h3 className="mt-1 font-heading text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <div className="mt-4">
                <MethodologyVisual activeStep={index} className="max-w-full md:max-w-[340px]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
