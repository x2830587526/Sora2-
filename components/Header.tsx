import React from 'react';
import { APP_TITLE, APP_SUBTITLE } from '../constants';
import { Film, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-anime-card/50 backdrop-blur-md border-b border-anime-accent/20 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-anime-accent to-anime-secondary rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {APP_TITLE}
              <span className="text-xs px-2 py-0.5 rounded-full bg-anime-accent/20 text-anime-accent border border-anime-accent/30 font-mono">
                Sora V2
              </span>
            </h1>
            <p className="text-xs text-anime-dim hidden sm:block">{APP_SUBTITLE}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-anime-dim bg-anime-bg/50 px-3 py-1.5 rounded-full border border-white/5">
          <Sparkles className="w-3 h-3 text-anime-secondary" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;