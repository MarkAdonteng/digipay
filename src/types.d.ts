declare module 'bcryptjs' {
  export function hash(data: string, saltRounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
  }
} 