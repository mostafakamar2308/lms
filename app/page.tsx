import Link from "next/link";
import HomeHeader from "./_components/HomeHeader";
import Image from "next/image";
import inprogress from "@/assets/in-progress.png";
import completed from "@/assets/completed.png";
import course from "@/assets/course.png";
import HomeUserCard from "./_components/HomeUserCard";

const Students = [
  {
    name: "Mostafa Kamar",
    description: "First Place",
    imageUrl: "/person1.jpg",
  },
  {
    name: "Mohammed Azzam",
    description: "Second Place",
    imageUrl: "/person2.jpg",
  },
  {
    name: "Mahmoud Abbas",
    description: "Third Place",
    imageUrl: "/person3.jpg",
  },
];

function page() {
  return (
    <div className=" overflow-x-hidden h-full">
      <HomeHeader />
      <div className="h-[80vh] relative">
        <div className="bg-red-600/80   blur-2xl -top-20 right-5 w-20 h-20 md:w-60 md:h-md:60 absolute md:right-20 md:-top-40 -z-10 rounded-full mix-blend-multiply"></div>
        <div className="bg-green-600/80 blur-2xl w-20 h-20 md:w-60 top-0 right-0  md:h-md:60 absolute md:-right-10 md:top-0 -z-10 rounded-full mix-blend-multiply"></div>
        <div className="bg-sky-600/80 blur-2xl w-20 h-20 md:w-60 md:h-60 -top-5 right-16 absolute  md:-right-20 md:-top-40 -z-10 rounded-full mix-blend-multiply"></div>
        <section className="flex items-center justify-center flex-col h-full">
          <h1 className="text-3xl md:text-5xl mb-4 text-center  font-bold">
            Online sessions
            <br className="hidden md:block" /> for busy people
          </h1>
          <p className="text-lg w-11/12 md:w-1/2 text-center">
            An all-in-one space where you can learn everything you need to
            become excellent in your career.
          </p>
          <Link
            href="/dashboard"
            className="md:w-60 w-3/4 mt-2 hover:bg-sky-700 duration-300 bg-black text-white py-2 text-center"
          >
            Join Us Now
          </Link>
        </section>
        <div className="bg-red-700/80 w-24 h-24 bottom-0 -left-4  md:w-60 md:h-60 absolute md:-left-20  md:bottom-20 -z-10 rounded-full mix-blend-multiply"></div>
        <div className="bg-green-700/80 w-20 h-20 bottom-10 left-10 md:w-60 md:h-60 absolute md:-left-10  md:-bottom-20 -z-10 rounded-full mix-blend-multiply"></div>
        <div className="bg-sky-700/80  w-24 h-24 bottom-16 -left-5 md:w-40 md:h-40 absolute md:left-20  md:bottom-20 -z-10 rounded-full mix-blend-multiply"></div>
      </div>
      <div className="flex gap-6 flex-col items-center">
        <p className="uppercase text-xs font-mono">How it works</p>
        <h1 className="text-2xl md:text-4xl md:w-1/2 text-center font-semibold">
          Learn Easily following <br className="hidden md:block" /> these steps
        </h1>
        <div className="grid md:grid-cols-3 font-mono grid-cols-1 gap-4 p-6">
          <div className="border text-center border-slate-400 shadow-md duration-300 hover:border-slate-500 rounded-md  p-4 ">
            <Image
              alt="hi"
              className="aspect-video object-cover object-bottom"
              src={inprogress}
            />
            <h2 className="text-xl mt-4 text-black/90">Buy Course</h2>
            <p className="text-slate-600 text-sm">
              Buy a course online by sending money via Vodafone Cash
            </p>
          </div>
          <div className="border text-center border-slate-400 shadow-md duration-300 hover:border-slate-500 rounded-md  p-4 ">
            <Image
              alt="hi"
              className="aspect-video object-cover"
              src={course}
            />
            <h2 className="text-xl mt-4 text-black/90">Watch Course</h2>
            <p className="text-slate-600 text-sm">
              Watch the course Online in your free time
            </p>
          </div>
          <div className="border text-center border-slate-400 shadow-md duration-300 hover:border-slate-500 rounded-md  p-4 ">
            <Image
              alt="hi"
              className="aspect-video object-cover object-bottom"
              src={completed}
            />
            <h2 className="text-xl mt-4 text-black/90">Complete Course</h2>
            <p className="text-slate-600 text-sm">
              Finished the course? You win!!{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-6 flex-col items-center p-4">
        <p className="uppercase text-xs font-mono">Our Top Students</p>
        <h1 className="text-2xl md:text-4xl md:w-1/2 text-center font-semibold">
          These are our top <br className="hidden md:block" /> students
        </h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 ">
          {Students.map((student) => (
            <HomeUserCard key={student.name} {...student} />
          ))}
        </div>
        <Link
          href="/dashboard"
          className="md:w-80 mt-2 w-3/4 hover:bg-sky-700 duration-300 bg-black text-white py-2 text-center"
        >
          Be One of Them
        </Link>
      </div>
      <footer className="flex justify-between p-4 bg-black/95 text-white py-2">
        <p>
          Copyright©{" "}
          <a
            href="https://www.facebook.com/MediwebTech"
            className="underline underline-offset-4 hover:text-white/70"
          >
            Mediweb tech
          </a>
        </p>
        <p>2024</p>
      </footer>
    </div>
  );
}

export default page;
