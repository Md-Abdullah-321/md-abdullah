export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  businessProblem: string;
  context: string;
  solution: string;
  workflow: string;
  architecture: string;
  beforeAfter: {
    before: string;
    after: string;
  };
  outcome: string;
  technologies: string[];
  images: CaseStudyImage[];
  videos: CaseStudyVideo[];
  testimonial: string | null;
  featured: boolean;
  order: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface CaseStudyVideo {
  id: string;
  videoId: string;
  provider: "youtube" | "loom";
  title: string;
  description?: string;
  order: number;
}

export type CaseStudyListItem = Pick<
  CaseStudy,
  | "id"
  | "title"
  | "slug"
  | "shortDescription"
  | "technologies"
  | "featured"
  | "order"
  | "publishedAt"
>;
