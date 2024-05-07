"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

export type CoursesWithEnrollment = {
  title: string;
  purchases: number;
  id: string;
};

export const columns: ColumnDef<CoursesWithEnrollment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <div className="flex mx-auto">الكورس</div>;
    },
  },
  {
    accessorKey: "purchases",
    header: ({ column }) => {
      return (
        <Button
          className="flex mx-auto"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          طلبات الانضمام
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const students = parseFloat(row.getValue("purchases") || "0");

      return (
        <div className="text-center">
          {students} {students === 1 ? "طلب" : "طلبات"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return <div className="flex mx-auto">طلبات الانضمام</div>;
    },
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Link
          href={`/dashboard/teacher/enrollment/${id}`}
          className="block mx-auto"
        >
          <Pencil className="h-4 w-4 mr-6" />
        </Link>
      );
    },
  },
];
