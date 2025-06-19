"use client";
import { useEffect, useState, useRef } from "react";
import WalletBar from "./WalletBar";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Change the import to use dynamic import
//fully fixed cartridge connector import
// This ensures it only loads in the browser and avoids SSR issues
// @ts-ignore - Ignore TypeScript error for dynamic import
// This is a workaround to ensure the ControllerConnector is loaded only in the browser
let ControllerConnector: any;
if (typeof window !== 'undefined') {
  import('@cartridge/connector/controller').then(module => {
    ControllerConnector = module.default;
  });
}

const navLinks = [
  { name: "Home", href: "/", icon: "/icons/home.svg" },
  { name: "Games", href: "/games", icon: "/icons/gamepad.svg" },
  { name: "Leaderboard", href: "/leaderboard", icon: "/icons/trophy.svg" },
  { name: "Rewards", href: "/rewards", icon: "/icons/gift.svg" },
  { name: "Community", href: "/community", icon: "/icons/users.svg" },
];

export function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [connected, setConnected] = useState(false);
  const [controllerReady, setControllerReady] = useState(false);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track when ControllerConnector is loaded
  // This ensures the connector is ready before trying to connect
  // This is necessary to avoid issues with SSR and dynamic imports
  // @ts-ignore - Ignore TypeScript error for ControllerConnector

  useEffect(() => {
    if (ControllerConnector) {
      setControllerReady(true);
    } else if (typeof window !== 'undefined') {
      import('@cartridge/connector/controller').then(module => {
        ControllerConnector = module.default;
        setControllerReady(true);
      }).catch(error => {
        console.error("Error loading controller:", error);
      });
    }
  }, []);

  // Controller connection - with safety checks
  // This ensures that the controller is ready and the address is available before trying to connect
  // It also checks if the username method exists and is callable
  // @ts-ignore - Ignore TypeScript error for ControllerConnector
  
  useEffect(() => {
    if (!address || !controllerReady) return;
    
    try {
      const controller = connectors.find((c) => 
        c.constructor.name === 'ControllerConnector' || 
        (ControllerConnector && c instanceof ControllerConnector)
      );
      
    if (controller) {
      setConnected(true);
        
        // Check if username method exists and is callable
        // @ts-ignore - Ignore TypeScript error for username method
        if (controller.username && typeof controller.username === 'function') {
          try {
            // Safely call username()
            Promise.resolve().then(() => {
              // @ts-ignore - Ignore TypeScript error for username method
              controller.username()
                .then((name: string | undefined) => {
                  if (name) setUsername(name);
                })
                .catch((error: any) => {
                  // Ignore "Not ready to connect" errors
                  if (!error.message?.includes('Not ready to connect')) {
                    console.error("Username error:", error);
                  }
                });
            });
          } catch (e) {
            // Ignore errors here
          }
        }
      }
    } catch (error) {
      console.error("Error in controller setup:", error);
    }
  }, [address, connectors, controllerReady]);

  const handleControllerClick = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    try {
      if (address) {
        await disconnect();
        setConnected(false);
        setUsername(undefined);
      } else {
        if (!ControllerConnector) {
          console.error("Controller not loaded yet");
          return;
        }
        
        const controller = connectors.find((c) => 
          c.constructor.name === 'ControllerConnector' || 
          (ControllerConnector && c instanceof ControllerConnector)
        );
        
        if (!controller) {
          throw new Error("Controller connector not found");
        }
        await connect({ connector: controller });
        setConnected(true);
      }
    } catch (error) {
      console.error("Controller connection error:", error);
    }
  };

  return (
    <>
      <header className={`fixed w-full px-6 py-4 flex justify-between items-center text-white z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        {/* Left: Logo & Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.img 
              src="/icons/center.png" 
              alt="Starknet Arcade" 
              className="w-12 h-12"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.span 
              className="hidden md:block font-bold text-xl font-techno bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Starknet Arcade
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative group"
              >
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  (pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))) 
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white shadow-glow' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                  {link.name === "Home" ? (
                    <motion.img 
                      src={link.icon} 
                      alt={link.name} 
                      className="w-5 h-5 transition-transform duration-300"
                      whileHover={{ y: -2, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ) : link.name === "Games" ? (
                    <motion.img 
                      src={link.icon} 
                      alt={link.name} 
                      className="w-5 h-5 filter brightness-0 invert transition-transform duration-300"
                      whileHover={{ y: -2, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ) : (
                    <motion.img 
                      src={link.icon} 
                      alt={link.name} 
                      className="w-5 h-5 filter invert brightness-100 transition-transform duration-300"
                      whileHover={{ y: -2, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                  <span className="font-medium">{link.name}</span>
                </div>
                {(pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    layoutId="navIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {!(pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%", boxShadow: "0 0 8px rgba(168, 85, 247, 0.6)" }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </nav>
          </div>
        
        {/* Right: Search & User Actions */}
        <div className="flex items-center space-x-5">
          <motion.div
            className={`transition-all duration-300 ease-in-out border border-[#ffffff1a] bg-[#1a1a1a80] backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-3 ${
              searchFocused ? "ring-2 ring-purple-500/50 border-purple-500/50 w-60 shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "w-48"
            }`}
            whileHover={{ boxShadow: "0 0 15px rgba(139,92,246,0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.img
              src="/icons/search-purple.svg"
              alt="Search"
              className="w-4 h-4 opacity-90"
              animate={{ rotate: searchFocused ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <input
              type="text"
              placeholder="Search games..."
              className="bg-transparent outline-none text-base text-white placeholder-gray-400 w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
        </motion.div>

          {/* User actions */}
          <div className="flex items-center space-x-5">
            {/* Notifications */}
            <div className="relative cursor-pointer group">
              <motion.div 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(139,92,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="/icons/bell-purple.svg"
                  alt="Notifications"
                  className="w-5 h-5"
                />
                <motion.span 
                  className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                ></motion.span>
              </motion.div>
              
              {/* Notification tooltip */}
              <div className="absolute right-0 mt-3 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-800 p-4 z-50 transform group-hover:translate-y-0 translate-y-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-gray-400">NOTIFICATIONS</div>
                  <div className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition-colors">Mark all as read</div>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <motion.div 
                    className="flex items-start space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                    whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.07)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <span className="emoji-fix">🎮</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">New game available: Crypto Racer</p>
                      <p className="text-xs text-gray-400">2 minutes ago</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                    whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.07)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <span className="emoji-fix">🏆</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">You ranked up on the leaderboard!</p>
                      <p className="text-xs text-gray-400">1 hour ago</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                    whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.07)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <span className="emoji-fix">💰</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">You've received 200 $STARK tokens!</p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </motion.div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-800 text-center">
                  <Link href="/notifications" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all notifications</Link>
                </div>
              </div>
            </div>

            {/* Points/XP */}
            <motion.div 
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-violet-600/30 to-purple-600/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors border border-purple-500/20"
              whileHover={{ scale: 1.05, borderColor: "rgba(168, 85, 247, 0.4)", boxShadow: "0 0 15px rgba(139,92,246,0.3)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-sm">
                <motion.span 
                  animate={{ rotate: [0, 10, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="emoji-fix"
                >
                  🪙
                </motion.span>
              </div>
              <span className="text-white font-medium">1,250 XP</span>
            </motion.div>

            {/* Wallet Connection */}
            <WalletBar />
        
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/20"
              >
                <span className="text-white font-bold text-sm">AM</span>
              </button>
              
              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-800 overflow-hidden z-50"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-bold">AM</span>
                        </div>
                        <div>
                          <h4 className="text-white font-bold">Amaan</h4>
                          <p className="text-xs text-gray-400 truncate">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <a href="/profile" className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/5 transition-colors">
                        <img src="/icons/user.svg" alt="Profile" className="w-5 h-5 opacity-70 filter invert" />
                        <span>My Profile</span>
                      </a>
                      <a href="/settings" className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/5 transition-colors">
                        <img src="/icons/settings.png" alt="Settings" className="w-5 h-5 opacity-70 filter invert" />
                        <span>Settings</span>
                      </a>
                      <a href="/history" className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/5 transition-colors">
                        <img src="/icons/history.svg" alt="History" className="w-5 h-5 opacity-70 filter invert" />
                        <span>Game History</span>
                      </a>
                    </div>
                    
                    <div className="border-t border-gray-800 py-2">
                      <button className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-white/5 transition-colors w-full text-left">
                        <img src="/icons/logout.svg" alt="Logout" className="w-5 h-5 opacity-70 filter invert brightness-100" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>

        {/* Mobile menu button */}
        <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
      {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex flex-col h-full px-6 py-20"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
            <button
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
              
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">AM</span>
                </div>
                <div>
                  <h4 className="text-white font-bold">Amaan</h4>
                  <p className="text-xs text-gray-400 truncate">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-lg ${
                        (pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href)))
                          ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white shadow-glow'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                    >
                      {link.name === "Home" ? (
                        <img src={link.icon} alt={link.name} className="w-6 h-6" />
                      ) : link.name === "Games" ? (
                        <img src={link.icon} alt={link.name} className="w-6 h-6 filter brightness-0 invert" />
                      ) : (
                        <img src={link.icon} alt={link.name} className="w-6 h-6 filter invert brightness-100" />
                      )}
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto space-y-4">
                <motion.div 
                  className="flex items-center justify-between bg-white/5 rounded-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <span className="text-gray-300">Your XP</span>
                  <span className="text-white font-bold">1,380</span>
                </motion.div>

            <WalletBar />
          </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
