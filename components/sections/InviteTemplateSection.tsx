import Image from "next/image";

export default function InviteTemplateSection() {
  return (
    <section className="w-full bg-white px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row justify-between gap-12">
        {/* Left: Mock Invite SVG */}
        <div className="w-full max-w-md flex justify-center">
          <Image
            src="/illustrations/mock_invitation.svg"
            alt="Mock Invitation"
            width={300}
            height={400}
            className="mx-auto"
          />
        </div>

        {/* Right: Text content */}
        <div className="w-full max-w-xl text-center mt-10 md:text-left">
          <Image
            src="/illustrations/feature_4.svg"
            alt="Icon"
            width={80}
            height={80}
            className="mx-auto md:mx-0 mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
            Урилгын загварын олон <br className="hidden md:block" />
            төрлийн сонголт
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Өөрийн арга хэмжээнийхээ өнгө аяс тохирсон урилгын
            загваруудаас сонголт хийж илгээгээрэй.
          </p>
        </div>
      </div>
    </section>
  );
}
