"use client";
import { motion } from 'framer-motion';

const partners = [
  {
    name: "Starkware",
    logo: "https://avatars.githubusercontent.com/u/59333826?s=280&v=4",
    description: "Core technology provider",
    website: "https://starkware.co/"
  },
  {
    name: "Starknet",
    logo: "https://pbs.twimg.com/profile_images/1656626983617323010/xzIYc6hK_400x400.png",
    description: "Layer 2 scaling solution",
    website: "https://starknet.io/"
  },
  {
    name: "Cartridge",
    logo: "/cartridge.png",
    description: "Gaming infrastructure",
    website: "https://cartridge.gg/"
  }
];

export default function Partners() {
  return (
    <section className="py-24 px-6 rounded-2xl text-white font-techno overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-blue-900/10 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-violet-900/10 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-techno text-center text-white">
            Our Partners & Technology
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by industry-leading blockchain technology and supported by top players in the ecosystem
          </p>
        </motion.div>
        
        {/* Partners showcase - improved layout */}
        <motion.div 
          className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {partners.map((partner, index) => (
            <motion.a
              key={index}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center glass-effect-dark p-8 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all group w-full md:w-1/3 max-w-xs"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <div className="relative mb-6 w-24 h-24 rounded-full overflow-hidden bg-white/5 p-1 group-hover:bg-white/10 transition-all">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover rounded-full"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-transparent to-blue-500/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {partner.name}
              </h3>
              <p className="text-base text-gray-400 text-center">
                {partner.description}
              </p>
            </motion.a>
          ))}
        </motion.div>
        
        {/* Technology showcase */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-white font-techno">
            Built with the Best Technology
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              "Zero-Knowledge Proofs", 
              "Layer 2 Scaling", 
              "Verifiable Randomness",
              "Cartridge Controllers",
              "Session Keys",
              "Dojo"
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-800/30 text-sm text-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(124, 58, 237, 0.2)" }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
