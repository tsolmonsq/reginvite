'use client';

import Image from 'next/image';
import Button from '../ui/buttons/Button'; 

export default function HeroSection() {
  return (
    <section className="w-full bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Left content */}
        <div className="text-center mt-38 md:text-left max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-heading leading-tight text-nowrap">
            Цахим урилга, <br />
            Хялбар бүртгэл
          </h1>
          <p className="mt-4 text-lg text-primary-black">
            Арга хэмжээний урилга, бүртгэлийг онлайн шийдлээр хялбаршуулна.
          </p>
        </div>

        {/* Right image */}
        <div className="flex-shrink-0 w-full md:w-1/2">
        <Image
          src="/illustrations/hero_decoration.svg"
          alt="Hero section image"
          width={891}
          height={891}
          className="w-11/12 max-w-xs sm:max-w-sm md:max-w-full mx-auto md:mx-0"
        />
        </div>
      </div>
    </section>
  );
}
