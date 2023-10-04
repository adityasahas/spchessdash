import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const Content = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-left mx-auto">
      <div className="text-left">
        <h1 className="text-5xl font-bold">Welcome to the  sp chess dashboard, <br/> {session?.user?.name || 'Guest'}</h1>
        <p className="text-3xl mt-5">{date.toLocaleString()}</p>
      </div>
    </div>
  );
};
