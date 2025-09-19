export interface Address {
    fullName?: String;
    phoneNo?: Number;
    address1: String
    address2: String
    pinCode: String,
    country: {
        id : String,
        name: String
    },
    state: {
        id : String,
        name: String
    },
    city: {
        id : String,
        name: String
    },
}