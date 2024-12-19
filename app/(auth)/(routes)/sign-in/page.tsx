import Logo from "@/app/dashboard/(dashboard)/_components/Logo";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import Link from "next/link";

export default function Page() {
  return (
    <div className="md:w-1/3 w-5/6 rounded-lg shadow-lg border ">
      <div className=" p-4 text-center flex flex-col gap-4 items-center min-h-[50%]">
        <Logo />
        <div>
          <div className="mt-2">
            <p className="font-semibold text-lg text-slate-900">
              Sign in to LMS
            </p>
            <p className="text-slate-700">
              Welcome back! please sign in to continue.
            </p>
            <div className="my-2">
              <Button className="w-1/2 my-2" variant={"secondary"}>
                Google
              </Button>
            </div>
            <hr />
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded-b-md">
        <p className="text-center text-slate-800">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
