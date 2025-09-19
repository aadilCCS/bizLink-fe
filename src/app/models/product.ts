import { User } from "./user";
import { Category } from "./category";
import { SubCategory } from "./subCategory";

export interface Product {
  id: string;
  name: string;
  image: [];
  model: any;
  price: number;
  stock: number;
  ratings: number | string;
  mainCategory: Category;
  subCategory: SubCategory;
  description: string;
  remarks: string;
  isActive: boolean;
  createdBy: User;
  updatedBy: User;
}
