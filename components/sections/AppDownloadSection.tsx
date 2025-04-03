// components/sections/AppDownloadSection.tsx
import Image from "next/image";

export default function AppDownloadSection() {
  return (
    <section className="w-full bg-white px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left: Image + App Badges */}
        <div className="w-full max-w-md text-center md:text-left">
          {/* Placeholder for image (e.g., phone mockup) */}
          <div className="w-full h-[250px] bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
            {/* Optional image: <Image src="/images/app-mock.png" ... /> */}
            <span className="text-gray-400">[App screenshot/image here]</span>
          </div>

          <div className="flex justify-center gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Image
                src="/badges/app_store.svg"
                alt="Download on the App Store"
                width={140}
                height={48}
              />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Image
                src="/badges/play_store.svg"
                alt="Get it on Google Play"
                width={140}
                height={48}
              />
            </a>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="w-full max-w-xl text-center md:text-left">
          <Image
            src="/illustrations/feature_6.svg"
            alt="App Icon"
            width={80}
            height={80}
            className="mx-auto md:mx-0 mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
            Гар утасны RegInvite scanner <br className="hidden md:block" />
            аппликейшн
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Аппликейшнээ татаад зочдынхоо ирцийг бүртгэлийг урилга дээрх
            QR кодоор нь богино хугацаанд хийгээрэй.
          </p>
        </div>
      </div>
    </section>
  );
}
