"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MathExpression } from "@/components/MathExpression";

/**
 * The formula reference available during the Math section. The formulas are
 * standard mathematical facts rather than anyone's copyrighted material.
 */
const GROUPS: { title: string; items: { label: string; expression: string }[] }[] = [
  {
    title: "Area and circumference",
    items: [
      { label: "Circle area", expression: "A = πr^2" },
      { label: "Circle circumference", expression: "C = 2πr" },
      { label: "Rectangle area", expression: "A = ℓw" },
      { label: "Triangle area", expression: "A = ½bh" },
    ],
  },
  {
    title: "Volume",
    items: [
      { label: "Rectangular prism", expression: "V = ℓwh" },
      { label: "Cylinder", expression: "V = πr^2h" },
      { label: "Sphere", expression: "V = ⁴⁄₃πr^3" },
      { label: "Cone", expression: "V = ⅓πr^2h" },
    ],
  },
  {
    title: "Triangles",
    items: [
      { label: "Pythagorean theorem", expression: "a^2 + b^2 = c^2" },
      { label: "Special right triangle", expression: "30° − 60° − 90° : x, x√3, 2x" },
      { label: "Special right triangle", expression: "45° − 45° − 90° : x, x, x√2" },
    ],
  },
  {
    title: "Angles",
    items: [
      { label: "Degrees in a circle", expression: "360" },
      { label: "Radians in a circle", expression: "2π" },
      { label: "Angles in a triangle", expression: "180" },
    ],
  },
];

export function ReferenceSheet({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Reference sheet</DialogTitle>
        <DialogDescription>
          Available throughout the Math section.
        </DialogDescription>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
                {group.title}
              </h3>
              <dl className="mt-3 space-y-3">
                {group.items.map((item) => (
                  <div key={`${group.title}-${item.label}-${item.expression}`}>
                    <dt className="text-meta text-ink-muted">{item.label}</dt>
                    <dd>
                      <MathExpression expression={item.expression} className="my-0 text-[17px]" />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
