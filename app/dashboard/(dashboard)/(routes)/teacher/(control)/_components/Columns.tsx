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
    header: "Course",
  },
  {
    accessorKey: "purchases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchases
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const students = parseFloat(row.getValue("purchases") || "0");

      return (
        <div className="ml-4">
          {students} {students === 1 ? "Enrollment" : "Enrollments"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <Link href={`/dashboard/teacher/enrollment/${id}`}>
              <DropdownMenuItem className="flex items-center p-2 bg-white border rounded-md hover:outline-none hover:bg-white/90">
                <Pencil className="h-4 w-4 mr-2" />
                See enrollment
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
