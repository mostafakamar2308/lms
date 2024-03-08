"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import EnrollModal from "@/components/modals/EnrollModal";

function CourseEnrollButton({
  price,
  courseId,
  title,
}: {
  price: number;
  courseId: string;
  title: string;
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
    <EnrollModal onConfirm={onClick} price={price} title={title}>
      <Button disabled={isLoading} className="w-full md:w-auto">
        Enrol for {formatPrice(price)} EGP
      </Button>
    </EnrollModal>
  );
}

export default CourseEnrollButton;
