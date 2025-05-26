"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DiscordSection() {
  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Left content */}
        <motion.div 
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white font-techno mb-4">Join Our Discord Community</h2>
          <p className="text-gray-300 mb-6">
            Connect with thousands of players, developers, and Starknet enthusiasts. 
            Get help, share strategies, and participate in exclusive Discord-only events and giveaways.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">10+ Members</h3>
              </div>
              <p className="text-gray-400 text-sm pl-13">A growing community of gamers and crypto enthusiasts</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Active Channels</h3>
              </div>
              <p className="text-gray-400 text-sm pl-13">Game-specific channels, support, and general chat</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Announcements</h3>
              </div>
              <p className="text-gray-400 text-sm pl-13">Stay updated with the latest news and releases</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Exclusive Rewards</h3>
              </div>
              <p className="text-gray-400 text-sm pl-13">Access to Discord-only giveaways and events</p>
            </div>
          </div>

          <a 
            href="https://discord.gg/starknet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.202 13.202 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
            </svg>
            Join Our Discord
          </a>
        </motion.div>

        {/* Right side - Discord preview */}
        <motion.div 
          className="w-full md:w-1/2 relative"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-[500px] bg-[#36393f] rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Discord Header */}
            <div className="bg-[#2f3136] p-4 border-b border-gray-700 flex items-center">
              <svg className="w-6 h-6 text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.202 13.202 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
              </svg>
              <span className="text-white font-medium">Starknet Arcade Discord</span>
            </div>

            {/* Discord Content */}
            <div className="flex h-[calc(500px-64px)]">
              {/* Sidebar */}
              <div className="w-60 bg-[#2f3136] p-4">
                <div className="mb-4">
                  <h3 className="text-gray-400 text-xs uppercase mb-2">Channels</h3>
                  <ul className="space-y-1">
                    <li className="text-gray-300 flex items-center">
                      <span className="text-gray-500 mr-1">#</span> welcome
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="text-gray-500 mr-1">#</span> announcements
                    </li>
                    <li className="text-white flex items-center bg-[#42464d] rounded px-2 py-1">
                      <span className="text-gray-300 mr-1">#</span> general
                      <div className="ml-auto h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</div>
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="text-gray-500 mr-1">#</span> games-discussion
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="text-gray-500 mr-1">#</span> tournaments
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="text-gray-500 mr-1">#</span> help-and-support
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="text-gray-500 mr-1">#</span> feedback
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gray-400 text-xs uppercase mb-2">Voice Channels</h3>
                  <ul className="space-y-1">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Game Lounge 1
                      <span className="text-xs text-gray-400 ml-2">(5)</span>
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Tournament Voice
                      <span className="text-xs text-gray-400 ml-2">(2)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                  {/* Messages */}
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">G</div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-blue-400 font-medium">GameMaster</span>
                          <span className="text-gray-500 text-xs ml-2">Today at 2:30 PM</span>
                        </div>
                        <p className="text-gray-300">Welcome to the Starknet Arcade Discord server! Check out our latest tournament!</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">S</div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-green-400 font-medium">StarkPlayer1</span>
                          <span className="text-gray-500 text-xs ml-2">Today at 2:35 PM</span>
                        </div>
                        <p className="text-gray-300">Just won 500 STARK tokens in the roulette game! This is awesome!</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3">D</div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-purple-400 font-medium">DevHelper</span>
                          <span className="text-gray-500 text-xs ml-2">Today at 2:42 PM</span>
                        </div>
                        <p className="text-gray-300">If anyone needs help getting started, feel free to ask here or in the help channel!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="bg-[#40444b] rounded-lg p-2 flex items-center">
                    <button className="text-gray-400 p-1 hover:text-gray-200">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <input type="text" placeholder="Message #general" className="bg-transparent border-0 flex-1 text-gray-200 focus:outline-none px-2" />
                    <button className="text-gray-400 p-1 hover:text-gray-200">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-indigo-500/50"
              animate={{ 
                x: [0, 30, -20, 0],
                y: [0, -30, 20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-indigo-500/50"
              animate={{ 
                x: [0, -40, 30, 0],
                y: [0, 40, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 9,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 