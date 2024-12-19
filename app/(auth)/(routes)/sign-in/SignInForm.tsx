"use client";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        e.preventDefault();
        setIsLoading(true);

        await axios.post("api/auth/login", userDetails);
        toast.success("logged in successfully.");
      } catch (error) {
        if (error instanceof Error) return toast.error(error.message);
        toast.error("An error has occured");
      } finally {
        setIsLoading(false);
      }
    },
    [userDetails]
  );

  return (
    <form className="flex flex-col gap-2 py-3" onSubmit={onSubmit}>
      <Input
        label="Email address"
        placeholder="Your Email"
        optional={false}
        type="text"
        name="email"
        id="email"
        value={userDetails.email}
        onChange={handleChange}
      />
      <Input
        label="Password"
        placeholder="Your Password"
        optional={false}
        type="password"
        name="password"
        id="password"
        value={userDetails.password}
        onChange={handleChange}
      />
      <Button
        disabled={isLoading}
        className="bg-slate-700 text-white"
        type={"submit"}
        onSubmit={onSubmit}
      >
        Sign In
      </Button>
    </form>
  );
};
