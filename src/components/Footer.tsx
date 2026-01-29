import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
const Footer = () => {
 const router=useRouter();

 const handleGetStarted = () => {
  router.push('/auth');
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
};

  return (
    <footer className="bg-teal-600 dark:bg-bg-primary-dark text-white py-14 px-7 font-sans antialiased" role="contentinfo">
      <div className="max-w-[1200px] mx-auto">
        {/* TOP ROW: Quick Links (left), HERO (center), Features (right) */}
        <div className="flex flex-wrap gap-10 items-start pb-7 max-md:flex-col max-md:gap-8">
          {/* Quick Links Column */}
          <div className="flex-1 min-w-[200px] max-md:w-full max-md:text-center">
            <h3 className="m-0 mb-4.5 text-[22px] font-bold text-white">Quick Links</h3>
            <nav aria-label="Quick links">
              <ul className="list-none p-0 m-0">
                <li className="my-3.5">
                  <a
                    href="#home"
                    className="text-white no-underline font-medium transition-all hover:text-white/80"
                    aria-label="Navigate to home section"
                  >
                    Home
                  </a>
                </li>
                <li className="my-3.5">
                  <a
                    href="#features"
                    className="text-white no-underline font-medium transition-all hover:text-white/80"
                    aria-label="Navigate to features section"
                  >
                    Features
                  </a>
                </li>
                <li className="my-3.5">
                  <a
                    href="#integration"
                    className="text-white no-underline font-medium transition-all hover:text-white/80"
                    aria-label="Navigate to implementation section"
                  >
                    Implementation
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Center Column - URL SHORTNER */}
          <div className="flex-[1.4] min-w-[300px] max-md:w-full max-md:flex-1 max-md:text-center">
            <h2 className="m-0 mb-3.5 text-[44px] font-extrabold text-center tracking-wide max-md:text-[34px]">
              URL SHORTNER
            </h2>
            <p className="mx-auto mb-5.5 max-w-[720px] text-white/70 leading-normal text-center font-normal text-[15px] max-md:px-4 max-md:text-sm">
              Short your links and share them effortlessly. Take control of your data with customizable
              expiry and tracking. Monitor every click, understand your reach, and grow smarter. Fast, free, and built for creators who value simplicity and power.
            </p>

            <div className="text-center">
              <button
                className="bg-btn-primary text-black py-4 px-10 rounded-2xl border-0 cursor-pointer font-bold text-md shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] focus:outline-3 focus:outline-white/15 focus:outline-offset-3"
                type="button"
                onClick={handleGetStarted}
                aria-label="Get started with URL shortener"
                tabIndex={0}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Features Column */}
          <div className="flex-1 min-w-[200px] max-md:w-full max-md:text-center">
            <h3 className="m-0 mb-4.5 text-[22px] font-bold text-white">Features</h3>
            <nav aria-label="Features">
              <ul className="list-none p-0 m-0">
                <li className="my-3.5">
                  <a
                    href="#features"
                    className="text-white no-underline font-medium transition-all hover:text-white/80"
                    aria-label="Learn about shorten feature"
                  >
                    Shortern
                  </a>
                </li>
                <li className="my-3.5">
                  <a
                    href="#features"
                    className="text-white no-underline font-medium transition-all hover:text-white/80"
                    aria-label="Learn about validity feature"
                  >
                    Validity
                  </a>
                </li>
                <li className="my-3.5">
                  <a
                    href="#features"
                    className="text-white no-underline font-medium transition-all hover:text-white/80"
                    aria-label="Learn about scanner feature"
                  >
                    Scanner
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6 mx-auto max-w-[1200px] " />

        {/* BOTTOM ROW: left text, centered icons, right text */}
        <div className="max-w-[1200px] mx-auto mt-4.5 pt-2 flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:gap-4 max-md:text-center">
          <p className="m-0 text-white/70 font-normal text-sm order-1 max-md:order-3">
            © 2025 BotrixAI - URL Shortener. All rights reserved.
          </p>

          <div className="flex gap-6 items-center justify-center order-2 max-md:order-1" role="navigation" aria-label="Social media links">
            <a
              aria-label="Visit our Facebook page"
              href="https://www.facebook.com/people/Botrixai/61577767733320/#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 text-white transition-all hover:text-white/80 hover:scale-110 no-underline"
              tabIndex={0}
            >
              <FaFacebookF size={20} aria-hidden="true" />
            </a>

            <a
              aria-label="Visit our Instagram page"
              href="https://www.instagram.com/botrixai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 text-white transition-all hover:text-white/80 hover:scale-110 no-underline"
              tabIndex={0}
            >
              <FaInstagram size={20} aria-hidden="true" />
            </a>

            <a
              aria-label="Visit our WhatsApp"
              href="https://wa.me/917294878246?text=Hello%20I%20want%20a%20demo" target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 text-white transition-all hover:text-white/80 hover:scale-110 no-underline"
              tabIndex={0}
            >
              <FaWhatsapp size={20} aria-hidden="true" />
            </a>
          </div>

          <p className="m-0 text-white/70 font-normal text-sm order-3 max-md:order-2">
            Powered by{' '}
            <a
              href="https://botrixai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-white/90 no-underline"
              aria-label="Visit BotrixAI website"
            >
              BotrixAI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
