export interface SubcategoriesCount {
  count: number;
}

export interface Category {
  created_at: string;
  description: string;
  id: string;
  medias: string[];
  slug: string;
  status: string; // You might want to use an enum here if status has specific values
  title: string;
  updated_at: string;
}
