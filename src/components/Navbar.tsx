"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { DoorClosedIcon, DoorOpen, DoorOpenIcon, LogOutIcon, LucideMailOpen } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <nav className="p-4 md:p-6 shadow-md bg-indigo-950 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonymous Feedback
        </a>
        {session ? (
          <>
            {/* <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-indigo-100 text-black"
              variant="outline"
            >
              Logout
            </Button> */}
            <DoorClosedIcon onClick={() => signOut()} />
          </>
        ) : (
          <Link href="/sign-in">
            {/* <Button
              className="w-full md:w-auto bg-indigo-100 text-black"
              variant={"outline"}
            >
              Login
            </Button> */}
            <LucideMailOpen />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
