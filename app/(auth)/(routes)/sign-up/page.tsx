import Logo from "@/app/dashboard/(dashboard)/_components/Logo";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/app/(auth)/(routes)/sign-up/SignUpForm";
import Link from "next/link";

export default function Page() {
  return (
    <div className="md:w-1/3 w-5/6 rounded-lg shadow-lg border ">
      <div className=" p-4 text-center flex flex-col gap-4 items-center min-h-[50%]">
        <Logo />
        <div>
          <div className="mt-2">
            <p className="font-semibold text-lg text-slate-900">
              Create Your Account
            </p>
            <p className="text-slate-700">
              {" "}
              Welcome! please fill in the details to get started
            </p>
            <div className="my-2">
              <Button className="w-1/2 my-2" variant={"secondary"}>
                Google
              </Button>
            </div>
            <hr />
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded-b-md">
        <p className="text-center text-slate-800">
          Already Have an Account?{" "}
          <Link href="/sign-in" className="font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
