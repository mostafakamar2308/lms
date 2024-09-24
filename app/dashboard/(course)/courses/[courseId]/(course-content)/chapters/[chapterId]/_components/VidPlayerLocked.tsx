import { Lock } from "lucide-react";

function VidPlayerLocked() {
  return (
    <div className="relative aspect-video">
      <div className=" absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
        <Lock className="h-8 w-8" />
        <p className="text-lg">
          يجب مشاهدة جميع الحصص السابقة قبل مشاهدة هذه الحصة
        </p>
      </div>
    </div>
  );
}

export default VidPlayerLocked;
