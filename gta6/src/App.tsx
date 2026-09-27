import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

function App() {
  const [showContent, setShowContent] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "power4.inOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "expo.inOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          const svgEl = document.querySelector<HTMLElement>(".svg");
          if (svgEl) svgEl.style.display = "none";
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: -1,
      ease: "expo.inOut",
    });

    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "expo.inOut",
    });

    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "expo.inOut",
    });

    gsap.to(".character", {
      scale: 1.1,
      xPercent: -50,
      bottom: "-38%",
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "expo.inOut",
    });

    gsap.to(".hero-title", {
      scale: 1,
      rotate: 0,
      xPercent: -50,
      duration: 2,
      delay: -0.8,
      ease: "expo.inOut",
    });

    const main = document.querySelector<HTMLElement>(".main");

    const handleMouseMove = (e: MouseEvent) => {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      gsap.to(".hero-title", {
        x: xMove * 0.8,
        xPercent: -50,
      });
      gsap.to(".sky", {
        x: xMove,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
      });
    };

    main?.addEventListener("mousemove", handleMouseMove);
    return () => {
      main?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showContent]);

  return (
    <>
  
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>

      {showContent && (
        <div className="main w-full rotate-[-10deg] scale-[1.7] origin-center">
          <div className="landing overflow-hidden relative w-full h-screen bg-black">
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-8 px-10">
              <div className="logo flex items-center gap-6">
                <div className="lines flex flex-col gap-[5px]">
                  <div className="line w-14 h-2 bg-white"></div>
                  <div className="line w-8 h-2 bg-white"></div>
                  <div className="line w-5 h-2 bg-white"></div>
                </div>
                <h3 className="text-4xl -mt-[4px] leading-none text-white tracking-wider">
                  Rockstar
                </h3>
              </div>
            </div>

            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              <img
                className="absolute sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="./sky.png"
                alt="Sky"
              />
              <img
                className="absolute scale-[1.8] rotate-[-3deg] bg top-0 left-0 w-full h-full object-cover"
                src="./bg.png"
                alt="Background"
              />
              <div className="hero-title text-white flex flex-col gap-2 absolute top-16 left-1/2 scale-[1.4] rotate-[-10deg] pointer-events-none select-none">
                <h1 className="text-[12rem] leading-none -ml-36">grand</h1>
                <h1 className="text-[12rem] leading-none ml-20">theft</h1>
                <h1 className="text-[12rem] leading-none -ml-36">auto</h1>
              </div>
              <img
                className="absolute character -bottom-[150%] left-1/2 scale-[2.5] rotate-[-20deg] pointer-events-none select-none max-w-none"
                src="./girlbg.png"
                alt="Character"
              />
            </div>

            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-8 px-10 flex items-center justify-between bg-gradient-to-t from-black via-black/80 to-transparent z-20">
              <div className="flex gap-4 items-center">
                <i className="text-3xl ri-arrow-down-line"></i>
                <h3 className="text-lg font-sans tracking-wide">
                  Scroll Down
                </h3>
              </div>
              <img
                className="h-[45px] object-contain"
                src="./ps5.png"
                alt="PS5"
              />
              <img
                className="h-[45px] object-contain"
                src="./logo18.png"
                alt="Rating 18+"
              />
            </div>
          </div>

          <div className="w-full min-h-screen flex items-center justify-center bg-black py-20">
            <div className="cntnr flex items-center text-white w-full max-w-7xl px-8">
              <div className="limg relative w-1/2 flex justify-center">
                <img
                  className="max-w-[85%] object-contain"
                  src="./imag.png"
                  alt="Feature"
                />
              </div>
              <div className="rg w-1/2 pl-12 py-10">
                <h1 className="text-7xl leading-tight">Still Running,</h1>
                <h1 className="text-7xl leading-tight mb-8">Not Hunting</h1>
                <p className="mt-4 text-lg font-sans text-gray-300 leading-relaxed">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Distinctio possimus, asperiores nam, omnis inventore nesciunt
                  a architecto eveniet saepe, ducimus necessitatibus at
                  voluptate.
                </p>
                <p className="mt-4 text-lg font-sans text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  eius illum fugit eligendi nesciunt quia similique velit
                  excepturi soluta tenetur illo repellat consectetur laborum
                  eveniet eaque, dicta, hic quisquam? Ex cupiditate ipsa nostrum
                  autem sapiente.
                </p>
                <p className="mt-4 text-lg font-sans text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  eius illum fugit eligendi nesciunt quia similique velit
                  excepturi soluta tenetur illo repellat consectetur laborum
                  eveniet eaque, dicta, hic quisquam? Ex cupiditate ipsa nostrum
                  autem sapiente.
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-400 transition-colors px-10 py-5 text-black mt-8 text-3xl font-bold tracking-wider cursor-pointer">
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;