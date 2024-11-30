export type Self = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  verified: boolean;
  phoneNumber: string | null;
  role: Roles;
  createdAt: string;
  updatedAt: string;
};

export enum Roles {
  Teacher = "Teacher",
  Student = "Student",
}

export type LoginWithPasswordResponse = {
  user: Self;
  token: string;
};
