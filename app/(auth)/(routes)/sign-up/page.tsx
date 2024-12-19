"use client";
import axios from "axios";
import { ChangeEvent, useCallback, useState } from "react";

export default function Page() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
      e.preventDefault();
      console.log(userDetails);
      axios.post("/api/users", userDetails);
      // setUserDetails({
      //   name: "",
      //   email: "",
      //   password: "",
      //   confirmPassword: "",
      // });
    },
    [userDetails]
  );
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center [&>*]:border gap-2"
      >
        <input name="name" value={userDetails.name} onChange={onChange} />
        <input name="email" value={userDetails.email} onChange={onChange} />
        <input
          name="password"
          value={userDetails.password}
          onChange={onChange}
        />
        <input
          name="confirmPassword"
          value={userDetails.confirmPassword}
          onChange={onChange}
        />
        <button type="submit" onSubmit={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
