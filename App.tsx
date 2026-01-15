import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { LoadingState, ScriptResponse } from './types';
import { generateScript } from './services/gemini';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<ScriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (plotIdea: string) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateScript(plotIdea);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "生成脚本失败，请重试。");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-anime-bg text-anime-text font-sans selection:bg-anime-secondary/30 selection:text-white">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
             将创意转化为二次元动画
          </h2>
          <p className="text-anime-dim text-lg">
            瞬间生成专业的时间码分镜脚本和符合物理规律的 AI 视频提示词。
          </p>
        </div>

        <InputSection onGenerate={handleGenerate} loadingState={loadingState} />

        {loadingState === LoadingState.ERROR && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && <ResultsSection data={result} />}
        
        {!result && loadingState !== LoadingState.LOADING && (
          <div className="mt-16 text-center">
            <div className="inline-block p-4 rounded-full bg-anime-card/50 border border-white/5 mb-4">
              <div className="flex gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-anime-accent animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-anime-secondary animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
              </div>
            </div>
            <p className="text-sm text-anime-dim">准备就绪。请在上方输入剧情想法。</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;