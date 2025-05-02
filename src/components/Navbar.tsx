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
    <nav className="md:p-4 shadow-md bg-primary text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonymous Feedback
        </a>
        {session ? (
          <>
            <Button
              onClick={() => signOut()}
              className="bg-white text-indigo-950 w-0.1 hover:bg-indigo-50"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="bg-white text-indigo-950 w-0.1 hover:bg-indigo-50"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;