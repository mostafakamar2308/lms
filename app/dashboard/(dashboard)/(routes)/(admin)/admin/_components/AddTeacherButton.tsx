"use client";

import AddTeacherModal from "@/components/modals/AddNewTeacherModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function () {
  return (
    <AddTeacherModal>
      <Button>
        <PlusCircle className="ml-2" /> أضف مدرس جديد
      </Button>
    </AddTeacherModal>
  );
}
