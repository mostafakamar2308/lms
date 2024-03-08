"use client";

import { formatPrice } from "@/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface EnrollModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  price: number;
  title: string;
}
function EnrollModal({ children, onConfirm, price, title }: EnrollModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs md:max-w-2xl ">
        <AlertDialogHeader>
          <AlertDialogTitle className="md:text-2xl">
            Enroll in {title}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-800 md:text-lg text-left">
            <ul className="list-disc list-inside grid gap-2">
              <li>
                Send {formatPrice(price)} to{" "}
                <a
                  href="tel:+201018303125"
                  className="underline hover:text-sky-700 underline-offset-4"
                  target="_blank"
                >
                  +201018303125
                </a>{" "}
                on Vodafone Cash
              </li>
              <li>
                Send screen shot of the transaction on whatsapp to with your
                name and email to{" "}
                <a
                  href={`https://wa.me/201018303125?text=I'm%20interested%20in%20${encodeURI(
                    title
                  )}`}
                  className="underline hover:text-sky-700 underline-offset-4"
                  target="_blank"
                >
                  +201018303125
                </a>{" "}
              </li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EnrollModal;
