export interface CatalogItem {
  id: string;
  name: string;
  image: string;
  benefits: string;
  facts: string;
  tips: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  items: CatalogItem[];
}

export interface CatalogData {
  categories: CatalogCategory[];
}
