import React from "react";

const partners = [
  { name: "Starknet", logo: "/logos/Starknet.svg" },
  { name: "Starknet", logo: "/logos/Starknet.svg" },
  { name: "Starknet", logo: "/logos/Starknet.svg" },
  { name: "Starknet", logo: "/logos/Starknet.svg" },
];

export default function Partners() {
  return (
    <section className=" py-12 px-6 rounded-2xl shadow-md text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 font-techno text-center text-white">Our Partners</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="= p-4 flex items-center justify-center shadow-sm transition hover:scale-105"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-10 md:h-12 max-w-[80%]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
