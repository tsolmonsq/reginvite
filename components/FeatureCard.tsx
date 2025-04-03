import Image from 'next/image';

type CardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-sm mx-auto">
      <div className="mb-4 flex justify-center">
        <Image src={icon} alt={title} width={64} height={64} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </div>
  );
}
