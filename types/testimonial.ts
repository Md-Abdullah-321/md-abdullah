export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  projectSlug?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}
