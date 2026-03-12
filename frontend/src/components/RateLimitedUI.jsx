import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-5 pt-6">
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] px-5 py-4 flex items-center gap-4">


        <div className="size-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
          <ZapIcon className="size-4 text-yellow-400/70" />
        </div>

        <div>
          <h3 className="text-[13px] font-semibold text-yellow-300/80 mb-0.5">
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