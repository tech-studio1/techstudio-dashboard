import React from "react";
import { Card } from "@/components/ui/card";
import SigninForm from "@/modules/signin/signin-form";
import ThemeHeader from "@/components/layouts/theme-header";

function SigninPage() {
  return (
    <>
      <div className="container h-svh flex flex-col bg-card lg:max-w-none lg:px-0">
        <ThemeHeader />
        <div className="mx-auto flex w-full h-full  flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center">
            <svg
              width="42"
              height="30"
              viewBox="0 0 42 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28.8688 3.83032L28.5432 5.92116L27.8234 10.5313L27.6606 11.551L26.1867 20.4884L26.1524 20.7198L25.1156 26.8723L18.0376 30L21.7223 6.08397C24.1644 5.31276 26.5894 4.54155 28.8688 3.83032Z"
                fill="#1878FF"
              />
              <mask
                id="mask0_7_41"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="42"
                height="21"
              >
                <path
                  d="M28.8689 3.83034C25.4584 4.90146 21.7309 6.07541 18.1234 7.22366C8.72322 10.2057 0.128535 12.9735 0 13.0249C6.75236 12.168 12.7249 11.5767 17.4893 11.1483C22.3222 10.7112 26.0069 10.4199 27.8749 10.1885H27.8835L26.1354 20.7455L26.1611 20.7198L41.4653 0.00856886L41.4739 0C39.7172 0.462725 34.7644 1.97944 28.8689 3.83034Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_7_41)">
                <path
                  d="M49.0061 17.5236L6.45255 35.7755L-7.51489 3.22194L35.0301 -15.0386L49.0061 17.5236Z"
                  fill="url(#paint0_linear_7_41)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_7_41"
                  x1="41.5863"
                  y1="1.43676"
                  x2="15.3942"
                  y2="12.6732"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#17A2FF" />
                  <stop offset="1" stopColor="#2654FF" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-xl font-medium">TechStudio Admin</h1>
          </div>
          <Card className="p-6 space-y-4">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your mobile and password below <br />
                to log into your account
              </p>
            </div>
            <SigninForm />
          </Card>
        </div>
      </div>
    </>
  );
}

export default SigninPage;
