export type CTA = { label: string; href: string };

export type Advantage = { icon?: string; title: string; text: string };

export type Step = { title: string; text: string };

export type Stat = { value: string; label: string };

export type Testimonial = { quote: string; author: string };

export type Homepage = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    ctaPrimary: CTA;
    ctaSecondary: CTA;
  };
  announcement: string;
  // The differentiator cards (personal program / nutrition / tracking / technique).
  advantages: Advantage[];
  intro: {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    image: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    text: string;
    steps: Step[];
  };
  stats: Stat[];
  gallery: {
    eyebrow: string;
    title: string;
    text: string;
    images: string[];
  };
  // Rotating 3D cube of studio photos (6 faces).
  cube: {
    eyebrow: string;
    title: string;
    text: string;
    images: string[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: Testimonial[];
  };
  faq?: { q: string; a: string }[];
};

// Maps a stored image path to a CSS object-position value so the admin can
// choose which part of each photo stays visible inside cropping frames.
export type ImageFocusMap = Record<string, string>;

export type Site = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  whatsappText: string;
  email: string;
  address: string;
  city: string;
  hours: string;
  mapEmbedUrl?: string;
  instagram: string;
  certifications: string[];
};
