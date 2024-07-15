import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name, phoneNumber } = await request.json();
    //validate email and pass
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json({ msg: "Email already exists" });
    }
    const hashedPassword = await hash(password, 10);

    const user = await db.user.create({
      data: { email, password: hashedPassword, name, phoneNumber },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log({ error });
    return new NextResponse("Something wrong has Happened");
  }
}
