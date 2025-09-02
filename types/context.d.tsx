// src/types/context.d.ts

// Context cho xác thực
export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  setRefreshToken: (refreshToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

// Payload của JWT
export interface JwtPayload {
  readonly exp: number;
}

// Context cho Header
export interface HeaderContextProps {
  title: string;
  setTitle: (t: string) => void;
}
