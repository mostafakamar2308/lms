"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { FormEvent } from "react";

function RegisterForm() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await axios.post("/api/auth/register", {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
    });
    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" dir="rtl">
      <label className="text-slate-700">الاسم</label>
      <Input className="border border-black" name="name" />
      <label className="text-slate-700">البريد الإلكترونى</label>
      <Input className="border border-black" type="email" name="email" />`
      <label className="text-slate-700">رقم ولى الأمر</label>
      <Input className="border border-black" type="tel" name="phoneNumber" />
      <label className="text-slate-700 mt-2">الرقم السرى</label>
      <Input className="border border-black " type="password" name="password" />
      <Button type="submit" className="mt-4 w-fit text-xl px-6 mx-auto">
        تسجيل
      </Button>
    </form>
  );
}

export default RegisterForm;
