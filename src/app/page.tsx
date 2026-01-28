"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Herosection } from "@/constants/data";
import LeftCard from "@/components/LeftCard";
import RightCard from "@/components/RightCard";
import Footer from "@/components/Footer";
import UrlMockDemo from "@/components/UrlMockDemo";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import RecentUrlsSection from "@/components/RecentUrlsSection";

import { CardDescription } from "@/constants/data";

import cardone from "@/assets/card/card-one.png";
import cardtwo from "@/assets/card/card-two.png";
import cardthree from "@/assets/card/card-three.png";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();

  const handleAuth = () => {
    router.push("/auth");
  };

  return (
    <div className="dark:bg-bg-primary-dark bg-bg-primary-light">
   <Navbar />
      {/* Hero Section */}
      <section className="md:mt-8">
        <div
          id="home"
          className="flex flex-col gap-10 min-h-screen items-center justify-start pt-12 pb-12 lg:pt-0 md:justify-center
                     dark:bg-bg-primary-dark dark:text-dark-text bg-bg-primary-light md:px-28"
        >
          <div className="w-full px-4 md:px-0">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col justify-center gap-4 lg:w-1/2">
                <div className="text-center lg:text-left font-semibold text-2xl md:text-3xl lg:text-4xl">
                  <span className="text-secondary md:text-primary">
                    Supercharge Every Link with
                  </span>
                  <span className="text-secondary md:text-primary text-transparent bg-linear-90 from-teal-400 to-teal-600 bg-clip-text">
                    {" "}BotrixAI -{" "}
                  </span>
                  <span className="text-secondary md:text-primary">
                    {Herosection.mainContent}
                  </span>
                </div>

                <p className="text-sm md:text-base lg:text-lg text-center lg:text-left dark:text-primary-color">
                  {Herosection.subContent}
                </p>

                <div className="flex justify-center lg:justify-start">
                  <button
                    className="bg-btn-primary hover:bg-btn-hover cursor-pointer w-32 h-12 rounded-lg text-black"
                    onClick={handleAuth}
                  >
                    Get Started
                  </button>
                </div>
              </div>

              <div className="lg:w-1/2">
                <UrlShortenerForm
                  title="Shorten your URL"
                  className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-bg-primary-dark"
                />
              </div>
            </div>
            <RecentUrlsSection className="mt-10 w-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div
          id="features"
          className="bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text
                     px-6 md:px-28 mt-8 scroll-mt-28"
        >
          <div>
            <span className="text-secondary font-semibold">Features in </span>
            <span className="text-secondary text-transparent bg-linear-90 from-teal-400 to-teal-600 bg-clip-text font-semibold">
              URL
            </span>
            <span className="text-secondary font-semibold"> Shortener</span>

            <p className="text-small mt-2">
              Generate short links instantly, personalize them with custom codes,
              set expiry limits, and track everything with link history.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:gap-16">
            <LeftCard img={cardone} desc={CardDescription.card1} />
            <RightCard img={cardtwo} desc={CardDescription.card2} />
            <LeftCard img={cardthree} desc={CardDescription.card3} />
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="mt-14">
        <div
          id="integration"
          className="bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text
                     px-6 md:px-28 mt-4 mb-14 scroll-mt-28"
        >
          <div>
            <span className="text-secondary font-semibold">Implementation of </span>
            <span className="text-secondary text-transparent bg-linear-90 from-teal-400 to-teal-600 bg-clip-text font-semibold">
              URL
            </span>
            <span className="text-secondary font-semibold"> Shortener</span>

            <p className="text-small mt-2">
              Experience how a long link transforms instantly into a simple,
              shareable short URL.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:gap-16">
            <UrlMockDemo />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
