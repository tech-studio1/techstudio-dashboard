import { LoaderCircle } from 'lucide-react';
import React from 'react';

const SmallLoader = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <LoaderCircle className="animate-spin text-primary transition-all duration-500 ease-in-out" />
    </div>
  );
};

export default SmallLoader;
