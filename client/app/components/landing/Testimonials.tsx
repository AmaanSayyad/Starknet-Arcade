"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "DeFi Trader",
    avatar: "AC",
    rating: 5,
    content: "The transparency of blockchain gaming combined with the thrill of classic arcade games. Starknet Arcade has revolutionized my gaming experience!",
    game: "Roulette"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "Crypto Enthusiast",
    avatar: "MR",
    rating: 5,
    content: "Finally, a platform where I can enjoy my favorite casino games while maintaining complete ownership of my assets. The user interface is incredibly smooth.",
    game: "Plinko"
  },
  {
    id: 3,
    name: "David Kim",
    role: "GameFi Investor",
    avatar: "DK",
    rating: 4,
    content: "The integration with Starknet is seamless. Fast transactions, low fees, and provably fair gaming. This is the future of online gaming!",
    game: "Mines"
  }
];



const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-yellow-400 fill-current"
              : "text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white font-techno">
            What Players Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied players who have discovered the future of blockchain gaming
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 bg-opacity-60 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all hover:transform hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-6">
                <Quote className="w-8 h-8 text-purple-400 opacity-50" />
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-300 mb-6">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white font-bold font-techno">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white font-techno">{testimonial.name}</h4>
                  <p className="text-sm text-gray-300">{testimonial.role}</p>
                </div>
              </div>

              {/* Favorite Game Badge */}
              <div className="pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-400">Favorite Game:</span>
                <span className="ml-2 text-sm font-bold text-purple-400">{testimonial.game}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
} 