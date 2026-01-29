import { useState, useEffect } from "react";
import { FaHandPointer } from "react-icons/fa";
import { FaArrowPointer, FaScissors } from "react-icons/fa6";
import { ImScissors } from "react-icons/im";

export default function UrlMockDemoCursor() {
  const [longUrl, setLongUrl] = useState("");
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");
  const [clicked, setClicked] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervals: Array<ReturnType<typeof setInterval>> = [];
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];
    const fakeUrl = "https://www.super-long-site-example.com/blog/post/54321";
    const fakeCode = "secret";
    const fakeDate = "2030-01-20";

    if (step === 0) {
      let i = 0;
      const t = setInterval(() => {
        setLongUrl(fakeUrl.slice(0, i));
        i++;
        if (i > fakeUrl.length) {
          clearInterval(t);
          setStep(1);
        }
      }, 30);
      intervals.push(t);
    }

    if (step === 1) {
      let j = 0;
      const t = setInterval(() => {
        setCode(fakeCode.slice(0, j));
        j++;
        if (j > fakeCode.length) {
          clearInterval(t);
          const next = setTimeout(() => setStep(2), 300);
          timeouts.push(next);
        }
      }, 60);
      intervals.push(t);
    }

    if (step === 2) {
      let k = 0;
      const t = setInterval(() => {
        setDate(fakeDate.slice(0, k));
        k++;
        if (k > fakeDate.length) {
          clearInterval(t);
          const next = setTimeout(() => setStep(3), 500);
          timeouts.push(next);
        }
      }, 40);
      intervals.push(t);
    }

    if (step === 3) {
      const start = setTimeout(() => {
        setClicked(true);
        const show = setTimeout(() => {
          setGenerated(true);
          const reset = setTimeout(() => {
            setClicked(false);
            setGenerated(false);
            setLongUrl("");
            setCode("");
            setDate("");
            setStep(0);
          }, 2500);
          timeouts.push(reset);
        }, 250);
        timeouts.push(show);
      }, 700);
      timeouts.push(start);
    }

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [step]);

  return (
    <section className="w-full shadow-md rounded-md dark:shadow-[0_0_12px_rgba(59,130,246,0.25)] md:py-16 bg-bg-primary-light dark:bg-bg-primary-dark">
      <div className="max-w-md mx-auto relative">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 space-y-4 border dark:border-gray-700 relative z-10">
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            <ImScissors className="inline mr-2" />
            URL Shortener
          </span>

          <Field label="Enter Long URL" value={longUrl} />
          <Field label="Enter Custom Code (Optional)" value={code} />
          <FieldDate label="Choose Expiry Date" value={date} />

          <button
            disabled
            className={`relative z-20 w-full bg-btn-primary text-black py-2 rounded-lg font-semibold transition-all ${
              clicked ? "scale-95 bg-btn-hover" : ""
            }`}
          >
            Get Short URL
          </button>

          {/* FIX — reserved container so no shifting */}
          <div className="h-[60px] flex items-center">
            {generated && (
              <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg animate-bounce shadow w-full">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Short URL:{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-300">
                    https://botrixAI.com/{code}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cursor icon */}
        {!generated && (
          <FaArrowPointer
            size={18}
            className="text-gray-800 dark:text-white drop-shadow-lg absolute z-30 transition-all duration-700 ease-in-out"
            style={{
              left: step === 3 ? "65%" : "25%",
              top: step === 3 ? "72%" : "38%",
            }}
          />
        )}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600 dark:text-gray-300">{label}</label>
      <input
        type="text"
        readOnly
        value={value}
        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600"
      />
    </div>
  );
}

function FieldDate({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600 dark:text-gray-300">{label}</label>
      <input
        type="text"
        readOnly
        value={value}
        placeholder="YYYY-MM-DD"
        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 font-mono"
      />
    </div>
  );
}
