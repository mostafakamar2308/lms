"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

function CourseEnrollButton({
  price,
  courseId,
}: {
  price: number;
  courseId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = () => {};
  return (
    <Button className="w-full md:w-auto">
      Enrol for {formatPrice(price)} EGP
    </Button>
  );
}

export default CourseEnrollButton;
