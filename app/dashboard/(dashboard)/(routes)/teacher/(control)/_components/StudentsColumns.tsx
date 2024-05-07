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

export type CoursesWithStudents = {
  title: string;
  students: number;
  id: string;
};

export const StudentColumns: ColumnDef<CoursesWithStudents>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          className="mx-auto flex"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الكورس
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "students",
    header: ({ column }) => {
      return (
        <Button
          className="flex mx-auto"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الطلاب
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const students = parseFloat(row.getValue("students") || "0");

      return (
        <div className=" mx-auto text-center">
          {students} {students === 1 ? "طالب" : "طلاب"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">طلاب الكورس</div>,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Link
          href={`/dashboard/teacher/students/${id}`}
          className="flex justify-center"
        >
          <Pencil className="h-4 w-4 mr-2" />
        </Link>
      );
    },
  },
];
