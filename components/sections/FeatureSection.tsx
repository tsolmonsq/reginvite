import FeatureCard from "../cards/FeatureCard";

export default function FeatureSection() {
  return (
    <section className="w-full px-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-12 text-gray-900">
          Арга хэмжээ зохион байгуулах хүсэлтэй хэн бүхэнд
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="/illustrations/feature_1.svg"
            title="Урилгын цахим шийдэл"
            description="Арга хэмжээндээ урих зочдынхоо имэйл хаяг руу нь урилгаа нэгэн зэрэг илгээх боломж."
          />
          <FeatureCard
            icon="/illustrations/feature_2.svg"
            title="Зочдын хялбар бүртгэл"
            description="Ирсэн зочдынхоо бүртгэлийг цаг хугацаанд хэмнэлттэйгээр хурдан бөгөөд хялбараар хийх QR шийдэл."
          />
          <FeatureCard
            icon="/illustrations/feature_3.svg"
            title="Маягт үүсгэх"
            description="Зочдоор бөглүүлэх нэмэлт мэдээллийг арга хэмжээнийхээ шаардлагад тохируулан тодорхойлж, түүнд зориулсан маягтыг үүсгэх боломж."
          />
        </div>
      </div>
    </section>
  );
}
