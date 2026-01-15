import React, { useState, useEffect } from 'react';
import { Send, Wand2, Lightbulb, RefreshCw } from 'lucide-react';
import { LoadingState } from '../types';

interface InputSectionProps {
  onGenerate: (prompt: string) => void;
  loadingState: LoadingState;
}

const PLOT_POOL = [
  { label: "赛博朋克雨夜", text: "一位穿着透明雨衣的赛博朋克少女，手持发光武士刀，在霓虹灯闪烁的雨夜街道上奔跑，身后有无人机追击，眼神坚毅。" },
  { label: "校园天台告白", text: "夕阳下的学校天台，微风吹起少女的水手服裙摆和黑色长发，她含泪微笑着向镜头递出一封情书，樱花瓣飘落。" },
  { label: "末日机甲维修", text: "在废土世界的车库里，一位脸上沾着油污的机械师少女正在焊接巨大的破旧战斗机甲，火花飞溅，光影交错。" },
  { label: "魔法少女变身", text: "在一片璀璨的星空中，少女被光带包围，正在进行华丽的变身，衣服从校服瞬间变为华丽的战斗礼服，伴随着魔法法阵的展开。" },
  { label: "古风剑客对决", text: "竹林深处，白衣剑客与黑衣刺客在空中交错，剑气斩断竹叶，慢镜头特写眼神中的杀气，背景是 misty 的山水画风格。" },
  { label: "深海人鱼吟唱", text: "发光的深海遗迹中，一位人鱼公主坐在巨大的贝壳上歌唱，周围环绕着发光的水母和鱼群，气泡缓缓上升。" },
  { label: "蒸汽朋克飞艇", text: "巨大的齿轮飞艇甲板上，一位戴着防风镜的少年正在调试复杂的仪表盘，云层中雷电交加，巨大的机械龙在云雾中若隐若现。" },
  { label: "异世界召唤", text: "图书馆的地板上突然亮起复杂的魔法阵，书本飞舞，一位普通高中生惊讶地看着从光芒中伸出的手。" },
  { label: "偶像舞台演出", text: "万人体育馆的舞台中央，偶像少女随着快节奏的音乐热舞，汗水挥洒，台下是整齐划一的荧光棒海洋，灯光炫目。" },
  { label: "丧尸围城突围", text: "破败的城市街道，幸存者小队驾驶改装车冲撞尸潮，后座的少女架着机枪疯狂扫射，弹壳飞溅。" },
  { label: "星际战舰指挥", text: "全息投影的战舰指挥室，冷酷的女舰长下达开火指令，窗外是壮观的太空舰队战，激光束交织。" },
  { label: "妖怪祭典", text: "夜晚的神社，戴着狐狸面具的少年少女穿梭在热闹的祭典人群中，周围不仅有人类，还有各种可爱的妖怪在吃章鱼烧。" },
  { label: "电竞夺冠瞬间", text: "电竞场馆金色的雨落下，少年摘下耳机，满脸泪水地举起奖杯，队友们冲上来拥抱，大屏幕上显示着 'VICTORY'。" },
  { label: "吸血鬼古堡", text: "月光透过破碎的彩绘玻璃窗照射在古堡大厅，穿着哥特萝莉装的吸血鬼少女端着红酒杯，坐在王座上冷冷地看着闯入者。" },
  { label: "美食烹饪对决", text: "中华小当家风格的厨房，火焰冲天，厨师少女快速挥舞菜刀，食材在空中飞舞，最后揭开盖子金光四射。" },
  { label: "侦探推理时刻", text: "灰暗的案发现场，侦探少年推了推眼镜，镜片反光，他指向凶手，背景出现复杂的线索连线特效。" }
];

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, loadingState }) => {
  const [input, setInput] = useState('');
  const [examples, setExamples] = useState<typeof PLOT_POOL>([]);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    refreshExamples();
  }, []);

  const refreshExamples = () => {
    setIsRotating(true);
    // Shuffle and pick 4
    const shuffled = [...PLOT_POOL].sort(() => 0.5 - Math.random());
    setExamples(shuffled.slice(0, 4));
    
    // Stop rotation animation after a short delay
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && loadingState !== LoadingState.LOADING) {
      onGenerate(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <section className="bg-anime-card border border-white/5 rounded-2xl p-6 shadow-xl shadow-black/20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-end mb-2">
             <label htmlFor="prompt" className="block text-sm font-semibold text-anime-dim uppercase tracking-wider">
              剧情想法 / 关键词
            </label>
            <span className="text-xs text-anime-dim/60 hidden sm:inline-block">Cmd + Enter 发送</span>
          </div>
         
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-anime-accent to-anime-secondary rounded-xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
            <textarea
              id="prompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="描述你想看到的画面... 例如：穿着和服的少女在雪地里回眸，眼神悲伤，背景是燃烧的神社。"
              className="relative w-full bg-anime-bg text-anime-text placeholder-slate-500 rounded-xl p-4 min-h-[120px] focus:outline-none resize-none font-sans text-lg leading-relaxed"
              disabled={loadingState === LoadingState.LOADING}
            />
          </div>
        </div>

        {/* Example Plots */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 text-xs font-bold text-anime-secondary">
              <Lightbulb className="w-3 h-3" />
              <span>灵感:</span>
            </div>
            <button
              type="button"
              onClick={refreshExamples}
              className="group p-1 rounded-md hover:bg-white/5 text-anime-dim hover:text-white transition-colors"
              title="换一批剧情"
            >
              <RefreshCw className={`w-3 h-3 transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, idx) => (
              <button
                key={`${ex.label}-${idx}`}
                type="button"
                onClick={() => setInput(ex.text)}
                disabled={loadingState === LoadingState.LOADING}
                className="px-3 py-1 rounded-full text-xs bg-anime-bg/50 border border-white/5 text-anime-dim hover:text-white hover:border-anime-accent/50 hover:bg-anime-accent/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!input.trim() || loadingState === LoadingState.LOADING}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all duration-300
              ${loadingState === LoadingState.LOADING 
                ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-r from-anime-accent to-anime-secondary hover:shadow-lg hover:shadow-anime-accent/25 hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {loadingState === LoadingState.LOADING ? (
              <>
                <Wand2 className="w-5 h-5 animate-spin" />
                <span>正在构思脚本...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>生成脚本</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default InputSection;