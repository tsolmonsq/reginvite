// components/sections/TeamSupportSection.tsx
import Image from "next/image";

export default function TeamFeatureIntroSection() {
  return (
    <section className="w-full bg-white px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col mt-10 md:flex-row justify-between gap-12">
        {/* Left: Text content */}
        <div className="w-full max-w-xl text-center md:text-left">
          <Image
            src="/illustrations/feature_5.svg"
            alt="Team Icon"
            width={80}
            height={80}
            className="mx-auto md:mx-0 mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
            Хамт олонтойгоо илүү үр бүтээмжтэй
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Олон зочид урьсан үед тэдний ирц бүртгэлийг ганцаараа биш хамт
            олонтойгоо хийвэл илүү хурдан. Хамт олноо системд бүртгэж ажлаа
            хөнгөвчлөөрэй.
          </p>
        </div>

        {/* Right: SVG team card */}
        <div className="w-full max-w-md">
          <Image
            src="/illustrations/mock_members_list.svg"
            alt="Team Members List"
            width={300}
            height={200}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
