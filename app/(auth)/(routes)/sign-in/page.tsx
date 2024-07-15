import LoginForm from "./_components/LoginForm";

export default function Page() {
  return (
    <div className="w-full  px-4 ">
      <h2 className="text-slate-800 font-bold text-3xl text-center mb-5">
        تسجيل الدخول
      </h2>
      <div className="flex justify-center items-center">
        <div className="bg-green-200 sm:w-1/2 sm:h-1/2 p-8 rounded-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
