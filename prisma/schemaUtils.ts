import { IUser } from "@/types";
import { User } from "@prisma/client";

function fromUser(user: User): IUser.Self {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    verified: user.verified,
    phoneNumber: user.phoneNumber,
    role: user.role as IUser.Roles,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const from = {
  user: fromUser,
};
