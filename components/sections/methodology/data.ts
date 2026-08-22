export interface MethodologyStep {
  id: string;
  number: string;
  title: string;
  description: string;
  visualLabel: string;
}

export const steps: MethodologyStep[] = [
  {
    id: "understand",
    number: "01",
    title: "Understand",
    description:
      "I learn what the business is trying to do, how the team works today, and what is getting in the way.",
    visualLabel: "Understanding the business",
  },
  {
    id: "map",
    number: "02",
    title: "Map",
    description:
      "I trace how information and people move through the process today. I look for where things break or slow down.",
    visualLabel: "Mapping the process",
  },
  {
    id: "design",
    number: "03",
    title: "Design",
    description:
      "We decide what should run automatically, what stays with the team, and how the parts should connect.",
    visualLabel: "Designing the system",
  },
  {
    id: "build",
    number: "04",
    title: "Build",
    description:
      "I build the workflows, integrations, backend logic, or custom software the process needs.",
    visualLabel: "Building the workflow",
  },
  {
    id: "connect",
    number: "05",
    title: "Connect",
    description:
      "I connect the systems so the right information reaches the right place without someone moving it by hand.",
    visualLabel: "Connecting the systems",
  },
  {
    id: "improve",
    number: "06",
    title: "Improve",
    description:
      "I test it in real conditions, fix what is not working, and keep improving until the workflow holds up.",
    visualLabel: "System running",
  },
];
