import { Product } from "./product";
import { User } from "./user";

export interface Order {
    id: string;
    userId: User;
    item: [
        {
            model: [
                {
                    modelDetails: any;
                    modelId: string;
                    quantity: number;
                }
            ],
            productId: Product;
            quantity: number;
            rate: number;
            subTotal: number;
            gstTotal: number;
            grandTotal: number;
        }
    ],
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    shippingAddress: string;
    billingAddress: string;
    orderDate: string;
    deliveryDate: string;
    deliveryStatus: string;
    trackingNumber: string;
    trackingUrl: string;
    returnRequest: string;
    returnReason: string;
    returnComment: string;
    returnPickupAddress: string;
    returnPickupDate: string;
    returnPickupStatus: string;
    returnPickupComment: string;
    returnPickupDateTime: string;
    returnPickupContact: string;
    returnStatus: string;
    returnRequestDate: string;
    isActive: boolean;
}