export interface AddToCart {
    id?: number;
    userId?: string;
    model: any;
    // variant: any;
    productId: string;
    subTotal: string;
    gstTotal: string;
    grandTotal: string;
}