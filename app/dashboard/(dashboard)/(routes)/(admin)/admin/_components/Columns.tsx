"use client";

import { Button } from "@/components/ui/button";
// import { User } from "@clerk/nextjs/server";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type User = {
  id: string;
  emailAddress: string;
  name: string;
  createdAt: number;
  numOfStudents: number;
  numOfCourses: number;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="mx-auto flex"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم المدرس <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "numOfCourses",
    header: ({ column }) => {
      return (
        <Button
          className="mx-auto flex"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الكورسات
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("numOfCourses")}</div>;
    },
  },
  {
    accessorKey: "numOfStudents",
    header: ({ column }) => {
      return (
        <Button
          className="mx-auto flex"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الطلاب <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("numOfStudents")}</div>;
    },
  },
  // {
  //   id: "actions",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="mx-auto flex">
  //         خصائص الكورس
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const { id } = row.original;
  //     return (
  //       <Link href={`/dashboard/teacher/courses/${id}`} className="">
  //         <Pencil className="h-4 w-4 mx-auto" />
  //       </Link>
  //     );
  //   },
  // },
];
