import React from "react";

type Props = {
  elapsedSec: number;
  totalSec: number | null;
};

export default function ElapsedTimeTracker({ ...props }: Props) {
  const elapsedMin = Math.floor(props.elapsedSec / 60);
  const elapsedSec = Math.floor(props.elapsedSec % 60);

  return (
    <div className="flex items-center font-[600] gap-1 transtion  p-0">
      <div className="flex justify-end">
        <p className="font-[600] text-white">{elapsedMin}:</p>
        <p className="font-[600] text-white">
          {elapsedSec.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
