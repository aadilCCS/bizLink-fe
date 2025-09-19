export interface Review {
    id?: string;
    rating: number;
    comment: string;
    userId?: string;
    productId: string;
    message?:string;
}