import { User } from "../models/User";

export enum UserRole {
  ADMIN = 1,
  CLIENTE = 2,
}

export const UserRoleDescriptions: { [key in UserRole]: string } = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.CLIENTE]: "Cliente",
};

export const getUserRoleDescription = (role: UserRole): string => {
  return UserRoleDescriptions[role];
};

let users: User[] = [
  { username: "admin", password: "a", role: UserRole.ADMIN },
  { username: "cliente", password: "c", role: UserRole.CLIENTE },
];

export const addUser = (username: string, password: string, role: UserRole) => {
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    throw new Error("Usuário já existe!");
  }
  users.push({ username, password, role });
};

export const loginUser = (username: string, password: string): User | null => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user || null;
};

export const getUsers = () => {
  return users;
};

export const changePassword = (
  username: string,
  currentPassword: string,
  newPassword: string
): boolean => {
  const user = users.find(
    (user) => user.username === username && user.password === currentPassword
  );

  if (!user) {
    throw new Error("Usuário ou senha atual incorretos!");
  }

  user.password = newPassword;
  return true;
};
