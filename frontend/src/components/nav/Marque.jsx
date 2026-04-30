import React from "react";

const Marque = () => {
  return (
    <div className="w-full overflow-hidden border-b border-black/10 bg-white">
      <div className="whitespace-nowrap flex animate-marquee text-xs tracking-wide text-black/60 py-2">
        <span className="mx-6">Try Creatdiv now →</span>
        <span className="mx-6">Generate images instantly →</span>
        <span className="mx-6">Rewrite smarter with AI →</span>
        <span className="mx-6">Analyze resumes in seconds →</span>

        {/* duplicate for seamless loop */}
        <span className="mx-6">Try Creatdiv now →</span>
        <span className="mx-6">Generate images instantly →</span>
        <span className="mx-6">Rewrite smarter with AI →</span>
        <span className="mx-6">Analyze resumes in seconds →</span>
      </div>
    </div>
  );
};

export default Marque;
