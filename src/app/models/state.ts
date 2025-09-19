import { Country } from "./country";

export interface State {
    id: string;
    name: string;
    code: string;
    country: Country;
    remarks: string;
    isActive: boolean;
}