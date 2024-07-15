import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/login";
function LoginForm() {
  return (
    <form action={login} className="flex flex-col" dir="rtl">
      <label className="text-slate-700">البريد الإلكترونى</label>
      <Input className="border border-black" type="email" name="email" />`
      <label className="text-slate-700 mt-2">الرقم السرى</label>
      <Input className="border border-black " type="password" name="password" />
      <Button type="submit" className="mt-4 w-fit text-xl px-6 mx-auto">
        تسجيل
      </Button>
    </form>
  );
}

export default LoginForm;
