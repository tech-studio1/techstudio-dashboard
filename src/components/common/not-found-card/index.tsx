import React from 'react';

const NotFoundCard = () => {
  return (
    <div className="flex min-h-[80dvh] w-full flex-col items-center justify-center space-y-10">
      <p className="text-2xl font-semibold">Product Not Found!</p>
      <div className="-ml-7">
        <picture>
          <img src="/FullBlack.svg" alt="logo" className="h-full w-64" />
        </picture>
      </div>
    </div>
  );
};

export default NotFoundCard;
