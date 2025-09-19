import { User } from "./user";
import { SubCategory } from "./subCategory";

export interface Category {
    id: string;
    category: string;
    subCategory: SubCategory[];
    name?: string;
    image?: string;
    description?: string;
    remarks?: string;
    isActive?: boolean;
    createdBy?: User;
    updatedBy?: User;
}
