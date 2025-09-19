import { User } from "./user";

export interface ReturnOrder {
    id: string;
    orderId: string;
    reason: string;
    comment: string;
    pickupAddress: string;
    pickupDate: Date;
    pickupStatus: string;
    pickupContact: {
        name: string;
        phone: string;
    };
    returnStatus: string;
    returnMethod: string;
    refundAmount: number;
    refundMethod: string;
    refundDate: Date;
    adminNotes: string;
    isActive: boolean;
    createdBy: User;
    updatedBy: User;
}