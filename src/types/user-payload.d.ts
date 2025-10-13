type UserRole = "ADMINISTRATOR" | "PARENT";
type AuthProvider = "GOOGLE" | "LOCAL";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  verified: boolean;
  provider: AuthProvider;
  is_registered: boolean;
}

export interface UserPayload extends JwtPayload {
  iat: number;
  exp: number;
}

export interface ChildJwtPayload {
  childId: string;
  parentId: string;
}
