import { FaHeart, FaChevronUp } from 'react-icons/fa';

export default function ClosingSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="closing-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 text-center bg-gradient-to-b from-[#0c0a09] via-[#1a0f16] to-[#0c0a09] overflow-hidden select-none"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-8">
          <FaHeart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          Nossa História Continua
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          E cada um desses dias se tornou <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 font-serif italic">inesquecível</span> ao seu lado.
        </h2>

        <div className="bg-black/55 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl mb-10 max-w-2xl text-left text-white/80 space-y-4 text-base sm:text-lg leading-relaxed">
          <p>
            Reviver cada uma dessas fotos me faz lembrar do seu sorriso fácil, das nossas conversas leves e de como tudo entre a gente flui com tanta verdade e carinho desde o primeiro dia.
          </p>
          <p>
            Seja nas aventuras improvisadas, na trilha sem fim em Pituaçu, nas risadas com as velas no shopping, no dia mágico dos museus, no cosplay do Aranha indiano ou simplesmente num fim de tarde dividindo um sorvete... o melhor lugar do mundo sempre foi onde você estava.
          </p>
          <p className="font-semibold text-rose-300 font-serif text-lg sm:text-xl pt-2 border-t border-white/10">
            "Que esses sejam apenas os primeiros de milhares de momentos lindos que ainda vamos construir e colecionar juntos."
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={scrollToTop}
            className="px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold bg-white/10 hover:bg-white/20 border border-white/20 hover:border-rose-400/50 text-white/90 hover:text-white transition-all cursor-pointer flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95"
          >
            <FaChevronUp className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>Rever Nossos Momentos</span>
          </button>
        </div>
      </div>
    </section>
  );
}
