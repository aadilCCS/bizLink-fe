import { State } from "./state";
import { Country } from "./country";

export interface City {
    id: string;
    name: string;
    code: string;
    state: State;
    country: Country;
    remarks: string;
    isActive: boolean;
}