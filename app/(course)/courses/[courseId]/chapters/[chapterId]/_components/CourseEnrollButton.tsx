"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

function CourseEnrollButton({
  price,
  courseId,
}: {
  price: number;
  courseId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      const purchase = await axios.post(`/api/courses/${courseId}/enroll`);
      toast.success("Enrolled Successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button disabled={isLoading} onClick={onClick} className="w-full md:w-auto">
      Enrol for {formatPrice(price)} EGP
    </Button>
  );
}

export default CourseEnrollButton;
