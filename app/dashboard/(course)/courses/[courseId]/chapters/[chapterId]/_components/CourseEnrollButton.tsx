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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {price ? (
        <EnrollModal onConfirm={onClick} price={price} title={title}>
          <Button disabled={isLoading} className="w-full md:w-auto">
            اشترك في الكورس بسعر {formatPrice(price)}
          </Button>
        </EnrollModal>
      ) : (
        <Button className="w-full md:w-auto" onClick={onClick}>
          اشترك مجانا
        </Button>
      )}
    </>
  );
}

export default CourseEnrollButton;
