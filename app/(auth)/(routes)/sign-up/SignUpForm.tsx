"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        console.log(userDetails);

        if (userDetails.password !== userDetails.confirmPassword)
          return toast.error("Passwords do not match");
        await axios.post("api/users", userDetails);
        toast.success("Account created successfully");
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
        label="Name"
        id="name"
        placeholder="Your Name"
        optional={false}
        type="text"
        name="name"
        value={userDetails.name}
        onChange={handleChange}
      />
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
      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        optional={false}
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        value={userDetails.confirmPassword}
        onChange={handleChange}
      />
      <Button
        disabled={isLoading}
        className="bg-slate-700 text-white"
        type={"submit"}
        onSubmit={onSubmit}
      >
        Create Account
      </Button>
    </form>
  );
}
