import React, { useState } from 'react';
import { ScriptResponse } from '../types';
import { Clock, User, Copy, Check, Video, Camera, Mic } from 'lucide-react';

interface ResultsSectionProps {
  data: ScriptResponse;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'character' | 'prompt'>('storyboard');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Determine what to copy based on structure
    const textToCopy = typeof data.soraPrompt === 'string' 
      ? data.soraPrompt 
      : JSON.stringify(data.soraPrompt, null, 2);
      
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 space-y-6 animate-fade-in-up">
      {/* Tabs */}
      <div className="flex p-1 bg-anime-card/50 rounded-xl border border-white/5 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'storyboard' 
              ? 'bg-anime-accent text-white shadow-lg shadow-anime-accent/20' 
              : 'text-anime-dim hover:text-white hover:bg-white/5'
          }`}
        >
          <Video className="w-4 h-4" />
          分镜脚本
        </button>
        <button
          onClick={() => setActiveTab('character')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'character' 
              ? 'bg-anime-accent text-white shadow-lg shadow-anime-accent/20' 
              : 'text-anime-dim hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          角色与台词
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'prompt' 
              ? 'bg-anime-secondary text-white shadow-lg shadow-anime-secondary/20' 
              : 'text-anime-dim hover:text-white hover:bg-white/5'
          }`}
        >
          <Camera className="w-4 h-4" />
          Sora 提示词
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-anime-card border border-white/5 rounded-2xl p-6 min-h-[400px]">
        
        {/* Storyboard View */}
        {activeTab === 'storyboard' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-anime-accent" />
              15秒分镜序列
            </h3>
            <div className="grid gap-4">
              {data.storyboard.map((shot, idx) => (
                <div key={idx} className="group relative bg-anime-bg/50 p-4 rounded-xl border border-white/5 hover:border-anime-accent/30 transition-all">
                  <div className="absolute top-4 right-4 text-xs font-mono font-bold text-anime-dim bg-white/5 px-2 py-1 rounded">
                    {shot.time}
                  </div>
                  <div className="pr-12">
                    <div className="text-sm font-mono text-anime-secondary mb-1 flex items-center gap-2">
                      <Camera className="w-3 h-3" />
                      {shot.camera}
                    </div>
                    <p className="text-gray-300 leading-relaxed font-medium">
                      {shot.action} <span className="text-anime-dim/50 text-xs font-mono ml-2">[cut]</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character View - Styled strictly as requested */}
        {activeTab === 'character' && (
          <div className="h-full flex flex-col justify-center">
            <div className="bg-gradient-to-br from-anime-bg to-anime-card p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-anime-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <h3 className="text-xs font-bold text-anime-dim uppercase tracking-wider mb-6 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Script Format
              </h3>
              
              <div className="font-serif text-lg md:text-xl leading-loose text-gray-200">
                <span className="font-mono text-anime-accent text-base mr-2">0.1~15s:</span>
                <span className="text-anime-secondary font-bold">
                  【{data.character.description.replace(/[【】]/g, '')}】
                </span>
                <span className="mx-1">:</span>
                <span className="italic">
                  {data.character.dialogue}
                </span>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 text-sm text-anime-dim">
                <div className="flex-1">
                  <span className="block text-xs font-bold text-white/30 mb-1 uppercase">Visual Tags</span>
                  {data.character.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompt View */}
        {activeTab === 'prompt' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Sora 2 优化提示词 (JSON)</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-anime-bg bg-white rounded hover:bg-gray-200 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? '已复制!' : '复制'}
              </button>
            </div>
            <div className="flex-1 bg-black/30 rounded-xl p-4 border border-white/10 font-mono text-sm text-gray-400 leading-relaxed overflow-y-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(data.soraPrompt, null, 2)}
              </pre>
            </div>
            <p className="text-xs text-anime-dim mt-4">
              *请直接将此 JSON 格式提示词粘贴到支持 Sora 2 结构化输入的工具中。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;