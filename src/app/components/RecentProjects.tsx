"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "../../../data";
import { PinContainer } from "./ui/PinContainer";
import Image from "next/image";

const RecentProjects = () => {
  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-x-24 gap-y-8 mt-10">
        {projects.map((item) => (
          <div
            onClick={() => window.open(item.href, "_blank")}
            className="cursor-pointer md:mt-4 sm:h-[41rem] lg:min-h-[32.5rem] flex items-center justify-center sm:w-[570px] w-[80vw]"
            key={item.id}
          >
            <PinContainer title={item.link} href={item.href}>
              <div className="relative flex items-center justify-center sm:w-[570px] w-[80vw] sm:h-[40vh] h-[30vh] overflow-hidden lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <Image
                   src="/bg.png"
                   alt="bgimg"
                   fill
                  className="object-cover object-center w-full h-full"
    />
                </div>
                <Image
                  src={item.img}
                  alt="cover"
                  fill
                   className="z-10 absolute bottom-0 object-cover object-center w-full h-full"
                />
              </div>

              
              <h1
                className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1"
                style={{
                  color: "#CBACF9",
                }}
              >
                {item.title}
              </h1>
               
              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </p>
              

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <Image 
                      src={icon}
                       alt="icon5" 
                        height={128}
                        width={128}
                      className="p-2" 
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3" color="#CBACF9" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
