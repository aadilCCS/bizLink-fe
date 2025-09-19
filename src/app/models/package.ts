import { Category } from "./category";
import { User } from "./user";

export interface Package {
    id:string;
    name: string;
    description: string
    category: Category;
    topSeller: number;
    trendingProductLimit: number;
    featuredProductsLimit: number;
    yearlySubscriptionCost: number;
    remarks: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: User;
    updatedBy: User;
}