import { UserRole } from "../services/userService";

export interface User {
  username: string;
  password: string;
  role: UserRole;
}
