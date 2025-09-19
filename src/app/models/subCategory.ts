import { User } from "./user";
import { Category } from "./category";

export interface SubCategory {
  id: string;
  name: string;
  productCount: number;
  category?: Category;
  description?: string;
  remarks?: string;
  isActive?: boolean;
  createdBy?: User;
  updatedBy?: User;
}
