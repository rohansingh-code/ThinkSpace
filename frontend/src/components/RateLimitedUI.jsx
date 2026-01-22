import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-primary/5 border border-primary/20 rounded-md">
        <div className="flex flex-col md:flex-row items-center gap-5 p-6">

          {/* Icon */}
          <div className="bg-primary/10 p-4 rounded-full">
            <ZapIcon className="size-8 text-primary" />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-base-content mb-1">
              Too many requests
            </h3>
            <p className="text-sm text-base-content/70">
              You’re sending requests too quickly. Please wait a moment and try again.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
