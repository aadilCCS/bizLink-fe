import { User } from "./user";

export interface Wishlist {
    id?: string;
    userId?: string;
    productId?: string;
    createdBy?: User;
    updatedBy?: User;
}
