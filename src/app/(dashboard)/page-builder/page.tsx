import React, { Suspense } from "react";
import HomepageBuilder from "./_component/page-builder";

function page() {
  const API_ENDPOINT = process.env.BASE_URL;
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HomepageBuilder apiEndpoint={API_ENDPOINT as string} />
      </Suspense>
    </>
  );
}

export default page;
