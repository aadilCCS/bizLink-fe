import { User } from "./user";

export interface Blog {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  isActive: boolean;
  createdBy: User;
  updatedBy: User;
}
