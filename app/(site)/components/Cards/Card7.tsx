import React from 'react';

export default function Card7() {
  return (
    <div className="flex justify-center items-center min-h-[500px] bg-[#303030] p-8 font-sans">
      <div className="group relative w-[300px]">
        
        {/* Face 1 (Top / Front) */}
        <div className="relative w-[300px] h-[200px] bg-[#333] flex justify-center items-center z-10 transition-all duration-400 translate-y-[100px] group-hover:translate-y-0 group-hover:shadow-[inset_0_0_60px_whitesmoke,inset_20px_0_80px_#f0f,inset_-20px_0_80px_#0ff,inset_20px_0_300px_#f0f,inset_-20px_0_300px_#0ff,0_0_50px_#fff,-10px_0_80px_#f0f,10px_0_80px_#0ff]">
          <div className="opacity-20 transition-opacity duration-500 text-center flex flex-col items-center group-hover:opacity-100">
            {/* Windows SVG Icon */}
            <svg 
              viewBox="0 0 88 88" 
              className="w-12 h-12 text-white mb-3"
            >
              <path 
                fill="currentColor" 
                d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L0 75.44V46.126zm4.326-39.02L87.314 0v41.527l-47.318.376zm47.329 39.349L87.314 88l-47.307-6.704V46.546z"
              />
            </svg>
            <h3 className="text-[1.2em] text-white font-semibold m-0">Windows</h3>
          </div>
        </div>

        {/* Face 2 (Bottom / Hidden Info) */}
        <div className="relative w-[300px] h-[200px] bg-[#f5f5f5] flex items-center justify-center p-5 box-border shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-400 -translate-y-[100px] group-hover:translate-y-0 z-0">
          <div className="text-center">
            <p className="text-[10pt] text-[#333] m-0 p-0 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ab repudiandae, explicabo voluptate et hic
              cum ratione a. Officia delectus illum perferendis maiores quia molestias.
            </p>
            <a 
              href="#" 
              className="inline-block no-underline text-black box-border outline outline-1 outline-dashed outline-[#333] p-[10px] mt-[15px] text-[10pt] transition-all duration-500 hover:bg-[#333] hover:text-[#f5f5f5] hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
            >
              Read More
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}