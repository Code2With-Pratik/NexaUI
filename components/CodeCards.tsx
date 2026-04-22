"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const CodeCards: React.FC<{ className?: string }> = ({ className }) => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Path Animation
      gsap.to("body", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const scrollProgress = -(2400 * self.progress);
            document.body.style.setProperty('--strokeDashoffset', `${scrollProgress}px`);
          },
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      className={className ?? "font-sans selection:bg-purple-500/30"}
    >
      <style>{`
        :root { --strokeDashoffset: 0; }
        
        .card-wrapper {
          position: relative;
          width: 300px;
          height: 450px;
          border-radius: 20px;
          margin: 50px 0;
        }

        .card-wrapper::before {
          position: absolute;
          content: "";
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          background-color: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(8px);
        }

        .card-wrapper::after {
          position: absolute;
          inset: 0;
          z-index: 0;
          content: "";
          border-radius: 20px;
          background-image: url('data:image/svg+xml,<svg width="300" height="450" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cl2" gradientTransform="rotate(45)"><stop offset="20%" stop-color="%23b169db"/><stop offset="45%" stop-color="%23f7d152"/><stop offset="65%" stop-color="%2346cf71"/><stop offset="85%" stop-color="%230fbffa"/></linearGradient></defs><path fill="url(%23cl2)" d="M 20,0C 9,0 0,9 0,20v 410c 0,11 9,20 20,20h 260c 11,0 20,-9 20,-20V 20C 300,9 291,0 280,0Zm 1,1h 161l 95,2c 12,1 19,10 19,20L 299,175v 254c 0,11 -9,20 -20,20H 118l -95,-3c -10,0 -20,-8 -20,-20L 1,275V 22C 1,11 10,1 21,1Z" /></svg>');
          filter: blur(1px) saturate(1.2) brightness(1.2);
          opacity: 0.85;
        }

        .inner-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          position: relative;
          z-index: 10;
          mask-composite: subtract;
          background: radial-gradient(closest-corner, rgba(44, 44, 48, 0.05) 10%, rgba(44, 44, 48, 0.7) 90%);
        }

        .inner-card::before {
          position: absolute;
          inset: 0;
          z-index: -1;
          content: "";
          background: linear-gradient(-45deg, #912acd 20%, #e6b71d, #16a242, #03b0ea 70%);
          opacity: 0.6;
        }

        #codepen { mask-image: url(#block), url(#codepenMask); }
        #codepen::before { mask: url(#codepenMask2); }
        #html { mask-image: url(#block), url(#htmlMask); }
        #html::before { mask: url(#htmlMask2); }
        #css { mask-image: url(#block), url(#cssMask); }
        #css::before { mask: url(#cssMask2); }
        #js { mask-image: url(#block), url(#jsMask); }
        #js::before { mask: url(#jsMask2); }

        .gradient-text {
          background: linear-gradient(-45deg, #912acd 20%, #e6b71d, #16a242, #03b0ea 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Source Code Pro', monospace;
          text-shadow: 3px 3px 5px rgba(0,0,0,0.2);
          text-align: center;
          padding: 20px;
        }
        
        .svg-path-style {
          fill: none;
          stroke: url(#cl1);
          stroke-linecap: round;
          stroke-dashoffset: var(--strokeDashoffset);
          transition: stroke-width 0.3s ease;
        }
      `}</style>

      <main className="relative flex w-[740px] justify-center pt-20">
        {/* Animated Background SVG */}
        <svg id="svgPaths" className="absolute top-[75px] z-0" width="740" height="2000">
          <use href="#linePath01" className="svg-path-style" style={{ strokeWidth: '20px', strokeDasharray: '20px 50px 120px 50px 20px 50px 300px 50px 20px 50px 150px 50px 20px 20000px' }} />
          <use href="#linePath02" className="svg-path-style" style={{ strokeWidth: '34px', strokeDasharray: '34px 60px 120px 60px 34px 60px 300px 60px 34px 60px 150px 60px 34px 20000px' }} />
          <use href="#linePath03" className="svg-path-style" style={{ strokeWidth: '25px', strokeDasharray: '25px 40px 120px 40px 25px 40px 250px 40px 25px 40px 150px 40px 25px 20000px' }} />
          <use href="#linePath04" className="svg-path-style" style={{ strokeWidth: '40px', strokeDasharray: '40px 70px 100px 70px 40px 70px 200px 70px 40px 20000px' }} />
        </svg>

        {/* Cards Container */}
        <div className="z-10 w-[300px]">
          {/* Card 1: CodePen */}
          <div className="card-wrapper">
            <div id="codepen" className="inner-card">
              <header className="gradient-text text-[34px] font-semibold leading-tight">
                The best place to build, test, and discover front-end code.
              </header>
            </div>
          </div>

          {/* Card 2: HTML */}
          <div className="card-wrapper">
            <div id="html" className="inner-card p-6">
              <code className="gradient-text text-[14px] leading-5 block">
                &lt;svg id="svgPaths" width="740" height="2000"&gt;
                <div className="pl-5">
                  &lt;use href="#linePath01" /&gt;<br />
                  &lt;use href="#linePath02" /&gt;<br />
                  &lt;use href="#linePath03" /&gt;
                </div>
                &lt;/svg&gt;
              </code>
            </div>
          </div>

          {/* Card 3: CSS */}
          <div className="card-wrapper">
            <div id="css" className="inner-card p-6">
              <code className="gradient-text text-[14px] leading-5 block text-left">
                * {'{ box-sizing: border-box; }'}<br /><br />
                html, body {'{'}<br />
                <span className="pl-5 block">
                  width: 100%;<br />
                  margin: 0;<br />
                </span>
                {'}'}
              </code>
            </div>
          </div>

          {/* Card 4: JS */}
          <div className="card-wrapper">
            <div id="js" className="inner-card p-6">
              <code className="gradient-text text-[14px] leading-5 block text-left">
                scrollTrigger: {'{'}<br />
                <span className="pl-5 block">
                  trigger: "body",<br />
                  start: "top top",<br />
                  onUpdate: (self) =&gt; {'{'}<br />
                  <span className="pl-5 block">
                    gsap.set("body", ...);
                  </span>
                  {'}'}
                </span>
                {'}'}
              </code>
            </div>
          </div>
        </div>

        {/* Global SVG Definitions */}
        <svg className="hidden">
          <defs>
            <path id="linePath01" d="m 106,45h 375c 114,0 226,128 226,235v 236c 0,136 -122,222 -224,221l -182,-2c -89,1 -141,42 -142,158l -2,204c -1,117 37,173 134,173h 186c 110,-3 230,111 230,220v 242c 0,113 -125,225 -248,225H 105" />
            <path id="linePath02" d="m 33,85h 444c 96,0 190,107 190,201v 224c 0,116 -98,188 -190,187l -192,-2c -92,0 -166,75 -166,168v 278c 0,94 74,169 166,169h 194c 92,0 188,94 188,188v 228c 0,94 -104,191 -214,191H 105" />
            <path id="linePath03" d="m 155,127h 308c 94,0 162,86 162,177v 178c 0,109 -50,174 -166,173L 277,653C 158,653 77,762 77,849v 302c 0,118 107,196 180,197l 204,4c 92,0 164,67 164,160v 200c 0,91 -89,163 -188,163H 105" />
            <path id="linePath04" d="m 283,173c 2,0 165,0 165,0C 544,175 577,238 577,330v 156c 0,94 -48,126 -140,125L 269,609C 167,602 29,702 29,851v 312c 0,111 101,235 242,235h 162c 109,1 144,49 144,136v 162c 0,73 -53,130 -118,130l -353,1" />
            
            <path id="codepenIcon" d="m 214,306 -57,37c -1,0 -2,2 -2,3v 40c 0,1 1,2 2,3l 57,40c 2,1 6,1 7,0l 58,-40c 1,0 2,-1 2,-3v -40c 0,-2 -2,-3 -2,-3l -57,-37c -4,-3 -8,0 -8,0zm -2,13 1,26 -24,16 -19,-14zm 10,0 43,28 -19,14 -24,-16zm -6,35 19,14 -19,14 -19,-14zm -52,3 14,9 -14,9zm 106,0v 19l -14,-9zm -84,15 24,16v 26l -42,-28zm 59,0 17,14 -42,28v -26z" />
            <path id="htmlIcon" d="m 94,318v 109h 16v -47h 12v 47h 16V 318h -16v 45h -12v -45zm 47,0v 18h 14v 92h 15v -92h 14v -18zm 45,0v 109h 15v -54l 7,41h 12l 5,-42v 55h 15V 318h -16l -11,72 -11,-72zm 62,0 1,109h 34v -19h -19v -91z" />
            
            <mask id="block"><path fill="#FFFFFF" d="M 0,0 H 300 V 450 H 0 Z" /></mask>
            <mask id="codepenMask"><use href="#codepenIcon" fill="#FFFFFF" /></mask>
            <mask id="htmlMask"><use href="#htmlIcon" fill="#FFFFFF" /></mask>
            <mask id="codepenMask2"><use href="#codepenIcon" stroke="#FFFFFF" strokeWidth="4" fill="none" /></mask>
            <mask id="htmlMask2"><use href="#htmlIcon" stroke="#FFFFFF" strokeWidth="4" fill="none" /></mask>

            <linearGradient id="cl1" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
              <stop offset="20%" stopColor="#b169db"/>
              <stop offset="45%" stopColor="#f7d152"/>
              <stop offset="65%" stopColor="#46cf71"/>
              <stop offset="85%" stopColor="#0fbffa"/>
            </linearGradient>
          </defs>
        </svg>
      </main>
    </div>
  );
};

export default CodeCards;