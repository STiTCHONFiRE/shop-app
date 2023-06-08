export interface Product {
  id: string;
  productState: string;
  productType: string;
  productProducer: string;
  tittle: string;
  characteristicsShort: string;
  characteristics: string;
  description: string;
  price: number;
  n: number;
  imagesIds: string[];
  creationTimestamp: Date
}
