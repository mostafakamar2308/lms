"use client";
import { ColumnDef } from "@tanstack/react-table";

export type CoursesWithEnrollment = {
  title: string;
  purchases: number;
};

export const columns: ColumnDef<CoursesWithEnrollment>[] = [
  {
    accessorKey: "title",
    header: "Course",
  },
  {
    accessorKey: "purchases",
    header: "Enrollment",
  },
];
