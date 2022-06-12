export interface ConfigInterface {
  production: boolean;
  secret: string;
  db: string;
  expiresIn: number;
  mail: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    },
    from: string;
  },
  url: string;
}
