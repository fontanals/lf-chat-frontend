export type User = {
  id: string;
  name: string;
  email: string;
  displayName: string;
  customPreferences?: string | null;
  createdAt?: Date;
};
