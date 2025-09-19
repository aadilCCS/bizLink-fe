import { User } from "./user";

export interface Banner {
  id: string;
  title: string;
  subTitle: string;
  image: string;
  remarks: string;
  isActive: boolean;
  createdBy: User;
  updatedBy: User;
}
