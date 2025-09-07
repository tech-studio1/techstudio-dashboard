import { LoaderCircle } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center space-y-10">
      <LoaderCircle className="size-20 animate-spin text-primary transition-all duration-500 ease-in-out" />
      <div className="-ml-7">
        <picture>
          <img src="/FullBlack.svg" alt="logo" className="h-full w-64" />
        </picture>
      </div>
    </div>
  );
};

export default Loading;
