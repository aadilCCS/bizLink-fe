import { Address } from "./address";

export interface User {
  id: string;
  name: string;
  email: string;
  gstNo: string;
  phoneNo: number;
  role: string;
  sessionToken: string;
  forcePasswordChange: boolean;
  isActive: boolean;
  fcmToken: string;
  password: string;
  accessControls: Array<string>;
  address : Address;
  businessInfo : any;
  latitude?: number;
  longitude?: number;
  radius?: number;

  //TODO: temp variables remove later
  avatar?: string;
  status?: string;
}

export interface AccessControlList {
  modules: Array<AccessControlCategory>;
}

export interface AccessControlCategory {
  category: string;
  accessControls: Array<AccessControl>;
}

export interface AccessControl {
  label: string;
  value: string;
}
