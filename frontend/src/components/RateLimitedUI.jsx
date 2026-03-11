import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-5 pt-6">
      <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.05] px-5 py-4 flex items-center gap-4">

        {/* Icon */}
        <div className="size-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <ZapIcon className="size-4 text-amber-400/70" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-[13px] font-semibold text-amber-300/80 mb-0.5">
            Too many requests
          </h3>
          <p className="text-[12px] text-white/30 leading-relaxed">
            You're sending requests too quickly. Please wait a moment and try again.
          </p>
        </div>

      </div>
    </div>
  );
};

export default RateLimitedUI;