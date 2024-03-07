import { Loader2 } from "lucide-react";

function loading() {
  return (
    <div className="bg-black flex items-center justify-center h-screen">
      <Loader2 className="text-white h-10 w-10 animate-spin" />
    </div>
  );
}

export default loading;
