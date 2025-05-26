"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const footerLinks = {
  explore: [
    { name: "Games", href: "/games" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Rewards", href: "/rewards" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Community", href: "/community" }
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Support", href: "/support" }
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" }
  ]
};

const socialLinks = [
  { name: "Twitter", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84", href: "https://twitter.com/starknetarcade" },
  { name: "Discord", icon: "M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.202 13.202 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z", href: "https://discord.gg/starknet" },
  { name: "GitHub", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", href: "https://github.com/starknet-arcade" },
  { name: "Telegram", icon: "M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-1.082.362-1.61.984-.133.155-.267.354-.335.628s-.038.622.095.895c.265.547.714.773 1.244.976.53.204 1.525.373 2.477.483l.3.035c.25.03.01.46.015.136.346.256.789.39 1.254.494.582.13 1.177.193 1.228.201.636.767 1.07.612 1.325.855.61.138.126.222.215.298.89.076.181.142.294.183.22.085.425.067.651-.027l.291-.125.347-.302s4.423-3.842 4.52-3.93c.022-.02.05-.02.067-.02l.184.015c.23.012.413.15.488.34.075.19.05.387-.066.52-.125.143-5.334 5.352-5.582 5.612-.248.26-.479.552-.63.814-.16.267-.296.556-.393.857-.103.31-.168.642-.198.974-.03.334.018.67.125.983.19.552.49.972.853 1.285.362.31.774.538 1.203.7.214.08.433.148.658.195.226.046.453.077.68.073.533-.012 1.11-.177 1.49-.418l.203-.135.167-.125.618-.497s4.146-3.322 4.25-3.415c.148-.132.334-.221.522-.282.19-.06.392-.09.594-.069.232.024.464.098.68.226.194.116.373.266.526.444.15.178.273.38.352.586.08.207.13.428.127.649-.003.221-.058.44-.141.645-.083.204-.211.392-.368.546-.438.428-2.768 2.691-2.923 2.83-.155.14-.32.281-.481.416-.162.134-.333.256-.517.344-.185.087-.381.155-.583.18-.202.026-.41.01-.595-.058-.185-.068-.35-.177-.487-.312-.136-.135-.246-.292-.317-.465-.07-.173-.102-.36-.09-.544.013-.184.068-.362.156-.52.088-.157.21-.29.354-.392.645-.46 2.289-1.665 2.387-1.751.098-.086.136-.138.136-.184 0-.047-.038-.092-.134-.145-.096-.054-5.492-2.386-5.636-2.445-.143-.06-.325-.07-.527-.032-.201.038-.421.14-.663.294-.242.155-.482.362-.679.608-.197.246-.35.526-.406.813-.055.287-.015.576.119.844.135.267.364.51.646.715.281.205 6.47 4.457 6.65 4.565.179.108.3.185.3.247 0 .062-.121.132-.3.22-.18.09-2.377 1.155-2.585 1.255-.207.099-.425.176-.649.23-.225.054-.454.085-.68.092-.226.007-.45-.013-.666-.06-.216-.046-.425-.119-.623-.217-.198-.098-.385-.22-.557-.362-.172-.142-.327-.304-.456-.48-.147-.2-.262-.424-.34-.662-.078-.238-.119-.489-.122-.739-.003-.25.033-.5.107-.736.073-.236.183-.456.327-.653.143-.196.319-.367.518-.507.199-.14.421-.247.655-.317.234-.07.48-.102.722-.095.242.007.48.052.705.133.226.08.437.196.627.344.172.133.327.288.461.458.02.025.038.05.055.077.147.212.227.438.252.667.025.229-.005.46-.09.682-.085.222-.224.427-.406.6-.182.174-.404.31-.642.405l-.124.047c-.083.031-.159.067-.242.102-.083.034-.174.065-.296.108l-.22.08-.267.093a2.79 2.79 0 01-.318.091c-.053.012-.107.02-.16.02-.08 0-.123-.019-.147-.04z", href: "https://t.me/starknetarcade" }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="relative pt-20 pb-10 overflow-hidden bg-black" 
      style={{ backgroundColor: 'black' }}
    >
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/10 filter blur-[100px]"
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-600/10 filter blur-[120px]"
          animate={{ 
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top grid section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-gray-800">
          {/* About column */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img 
                src="/icons/center.png" 
                alt="Starknet Arcade" 
                className="w-10 h-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              />
              <span className="font-bold text-xl text-white font-techno">Starknet Arcade</span>
            </motion.div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier on-chain gaming platform powered by StarkNet. Enjoy provably fair games with zero gas fees and instant withdrawals.
            </p>
            <div className="pt-2">
              <span className="text-gray-500 text-xs">Powered by</span>
              <div className="flex items-center space-x-4 mt-3">
                <motion.img 
                  src="https://avatars.githubusercontent.com/u/59333826?s=280&v=4" 
                  alt="StarkWare" 
                  className="h-8 w-8 rounded-full hover:shadow-glow"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
                <motion.img 
                  src="https://pbs.twimg.com/profile_images/1656626983617323010/xzIYc6hK_400x400.png" 
                  alt="StarkNet" 
                  className="h-8 w-8 rounded-full hover:shadow-glow"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
                <motion.img 
                  src="/cartridge.png" 
                  alt="Cartridge" 
                  className="h-8 w-8 rounded-full hover:shadow-glow"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Links columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-bold mb-6 text-lg font-techno">Explore</h3>
            <ul className="space-y-4">
              {footerLinks.explore.map((link, index) => (
                <motion.li key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-bold mb-6 text-lg font-techno">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, index) => (
                <motion.li key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Newsletter signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-bold mb-6 text-lg font-techno">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest games, tournaments, and rewards.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
              <motion.button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1 text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
            
            {/* Social media icons */}
            <div className="mt-6">
              <h4 className="text-gray-300 text-sm mb-3 font-techno">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a 
                    key={social.name}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors group"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d={social.icon}></path>
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom section with copyright */}
        <motion.div 
          className="mt-10 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-gray-500 text-sm">
            © {currentYear} Starknet Arcade. All rights reserved.
          </div>
          
          <div className="flex space-x-8 mt-6 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 