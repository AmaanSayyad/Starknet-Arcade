"use client";

const partners = [
  {
    name: "Starkware",
    logo: "https://pbs.twimg.com/profile_images/1656026873078398981/Ht7OXAUs_400x400.jpg",
  },
  {
    name: "Starknet",
    logo: "https://pbs.twimg.com/profile_images/1656626983617323010/xzIYc6hK_400x400.png",
  },
  {
    name: "Reclaim",
    logo: "https://pbs.twimg.com/profile_images/1891242686616891392/0B-S56nI_400x400.png",
  },
];

export default function Partners() {
  return (
    <section className="py-12 px-6 rounded-2xl text-white font-techno overflow-hidden flex justify-center items-center flex-col">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 font-techno text-center text-white">
        Our Partners
      </h2>

      <div className="relative w-[30%] overflow-hidden">
        <div className="flex  whitespace-nowrap animate-scroll gap-16">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center min-w-[150px]"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-25 w-25 object-contain mb-2"
              />
              <span className="text-xl font-semibold text-white">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
