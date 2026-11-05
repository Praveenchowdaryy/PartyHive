'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users2, Link2, Shuffle, CheckCircle2, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Users2 className="w-5 h-5 text-yellow-400 stroke-[2.5]" />,
      title: 'Launch in 2 Seconds',
      tagline: 'Zero Registration',
      desc: 'Pick a nickname and an illustrated character avatar. Your private, authoritative room session initializes instantly.',
      meta: 'Instant Room Code & Session Token',
    },
    {
      num: '02',
      icon: <Link2 className="w-5 h-5 text-arcade-coral stroke-[2.5]" />,
      title: 'One Pass For Everyone',
      tagline: 'Universal Mobile Link',
      desc: 'Copy your 6-letter room code or 1-tap mobile share link. Friends tap and enter from iOS, Android, or laptop browser.',
      meta: 'Automatic Reconnection Support',
    },
    {
      num: '03',
      icon: <Shuffle className="w-5 h-5 text-arcade-mint stroke-[2.5]" />,
      title: 'Hot-Swap Games Freely',
      tagline: 'Never Disband',
      desc: 'Finish a drawing tournament, then jump straight into speed trivia or spicy hot takes without disbanding the party.',
      meta: 'Persistent Group Scores & Roster',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative bg-[#0B0C10] border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151821] border-2 border-black text-yellow-400 text-xs font-black uppercase tracking-wider mb-2.5 shadow-[2px_2px_0px_#000] font-mono">
            <Sparkles className="w-3.5 h-3.5 fill-yellow-400" />
            <span>Frictionless Flow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            How PartyHive Operates
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
            No app store downloads. No account logins. Built for fast multiplayer fun.
          </p>
        </div>

        {/* 3-Step Interactive Grid with Flow Connector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className="p-7 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] hover:border-yellow-400 transition-all relative flex flex-col justify-between group"
            >
              {/* Giant Watermark Step Number */}
              <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.05] select-none font-mono">
                {step.num}
              </div>

              <div>
                {/* Step badge & icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 rounded-2xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 font-mono">
                      STEP {step.num}
                    </span>
                    <p className="text-xs font-black text-slate-300 uppercase">
                      {step.tagline}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-2 group-hover:text-yellow-400 transition-colors font-display">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              {/* Sub-feature validation tag */}
              <div className="mt-6 pt-4 border-t-2 border-black flex items-center gap-2 text-xs text-arcade-mint font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-arcade-mint shrink-0 stroke-[2.5]" />
                <span className="text-[11px] truncate">{step.meta}</span>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};
