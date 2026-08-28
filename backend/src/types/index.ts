interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface JwtPayload {
  userId: string;
}

interface AIResult {
  title: string;
  summary: string;
  tags: string[];
}

export type { AuthUser, JwtPayload, AIResult };
