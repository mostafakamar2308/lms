import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Facebook, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

function HomeUserCard({
  imageUrl,
  name,
  description,
}: {
  imageUrl: string;
  name: string;
  description: string;
}) {
  return (
    <Card className="max-w-md flex shadow">
      <CardHeader>
        <Image
          height={100}
          width={100}
          src={imageUrl}
          className="overflow-hidden rounded-lg"
          alt={name}
        />
      </CardHeader>
      <CardContent className="py-8 ">
        <h1 className="text-xl tracking-normal md:text-base font-semibold transition line-clamp-2">
          {name}
        </h1>
        <p className="flex gap-2 text-slate-700">{description}</p>
        <div className="mt-2 flex gap-4">
          <button className="hover:bg-slate-700 group duration-300 rounded-full p-2">
            <Facebook className="text-slate-700 h56 w56 duration-300 group-hover:text-white" />
          </button>
          <button className="hover:bg-slate-700 group duration-300 rounded-full p-2">
            <Twitter className="text-slate-700 h-5 w-5 duration-300 group-hover:text-white" />
          </button>
          <button className="hover:bg-slate-700 group duration-300 rounded-full p-2">
            <Youtube className="text-slate-700 h-5 w-5 duration-300 group-hover:text-white" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default HomeUserCard;
