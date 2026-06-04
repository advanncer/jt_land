import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Users, 
  Globe, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Briefcase,
  Star,
  ShieldCheck,
  Zap,
  Menu,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-[#04121b] overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-[100] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0071a0] rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
              <span className="font-black text-xl md:text-2xl tracking-tighter">Skyeng</span>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-slate-600">
              <a href="#" className="hover:text-[#0071a0] transition-colors">Английский для взрослых</a>
              <a href="#" className="hover:text-[#0071a0] transition-colors">Детям и подросткам</a>
              <a href="#" className="hover:text-[#0071a0] transition-colors">Другие языки</a>
              <a href="#" className="hover:text-[#0071a0] transition-colors">Цены</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button className="hidden md:block text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors">Войти</button>
            <button className="bg-[#fad800] text-[#04121b] px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-black hover:bg-[#f0ce00] transition-all shadow-md active:scale-95">
              Начать учиться
            </button>
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in-down">
            <a href="#" className="text-lg font-black">Английский для взрослых</a>
            <a href="#" className="text-lg font-black">Детям и подросткам</a>
            <a href="#" className="text-lg font-black">Другие языки</a>
            <a href="#" className="text-lg font-black">Цены</a>
            <hr />
            <button className="w-full py-4 bg-slate-100 rounded-2xl font-black">Войти</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-12 md:pt-48 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0071a0] text-xs font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
              <Sparkles size={14} />
              <span>№1 онлайн-школа в Европе</span>
            </div>
            
            <h1 className="text-[40px] leading-[1] md:text-[80px] font-black mb-8 tracking-tighter">
              Свободный английский <br />
              <span className="text-[#0071a0] relative inline-block">
                с гарантией
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#fad800]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
              Достигните цели за 3 месяца по персональной программе на самой удобной интерактивной платформе.
            </p>

            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 max-w-md relative mb-12">
               <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#fad800] rounded-full flex flex-col items-center justify-center rotate-12 shadow-lg border-4 border-white z-20">
                 <span className="text-[10px] font-black uppercase">Урок</span>
                 <span className="text-xl font-black">0₽</span>
               </div>
               
               <h3 className="text-xl font-black mb-6">Запишитесь на вводный урок</h3>
               <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <input 
                    type="text" 
                    placeholder="Ваше имя" 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0071a0] outline-none transition-all font-bold"
                  />
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__" 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0071a0] outline-none transition-all font-bold"
                  />
                  <button className="w-full bg-[#fad800] text-[#04121b] py-5 rounded-2xl text-xl font-black shadow-xl shadow-yellow-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                    Записаться бесплатно
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </form>
               <p className="mt-4 text-[10px] text-slate-400 font-medium text-center px-4 leading-relaxed">
                 Нажимая на кнопку, вы даете согласие на обработку персональных данных
               </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 shadow-sm overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-slate-400">
                <span className="text-[#04121b] block font-black text-lg">893 627+</span>
                учеников уже с нами
              </div>
            </div>
          </motion.div>

          <div className="relative lg:h-[700px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent rounded-[4rem] -rotate-3 scale-105" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-full bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <img 
                src="https://cdn-user84632.skyeng.ru/shared/large-media/skysmart/product-pages/home/top-form/top-form-bg-1024-large-new-x1.png" 
                className="w-full h-full object-cover" 
                alt="Skyeng Learning" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10 flex gap-4">
                <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#fad800] rounded-full flex items-center justify-center text-slate-900">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <span className="font-black">Результат</span>
                  </div>
                  <p className="text-sm font-bold opacity-90 leading-relaxed">98% учеников достигают цели за первый курс обучения</p>
                </div>
                <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 text-white">
                   <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="font-black">Скорость</span>
                  </div>
                  <p className="text-sm font-bold opacity-90 leading-relaxed">В 2 раза быстрее обычных курсов благодаря AI платформе</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { val: "893 627", label: "Учеников из 45 стран", icon: Users },
              { val: "15 045", label: "Преподавателей со всего мира", icon: Globe },
              { val: "50m+", label: "Проведенных занятий", icon: BookOpen },
              { val: "4.9/5", label: "Средняя оценка уроков", icon: Star }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-[#0071a0]">
                  <s.icon size={24} />
                </div>
                <div className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">{s.val}</div>
                <div className="text-[11px] md:text-[13px] font-bold text-slate-400 uppercase tracking-widest px-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
              Добейтесь реальных результатов с нашей экосистемой
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Мы объединили лучшие методики и технологии, чтобы ваш путь к английскому был максимально эффективным.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "AI-репетитор 24/7", 
                desc: "Ваш персональный помощник в кармане. Практикуйте диалоги, учите слова и получайте фидбек мгновенно.", 
                icon: Sparkles,
                color: "bg-purple-50 text-purple-600"
              },
              { 
                title: "Интерактивная платформа", 
                desc: "Как Zoom, только круче. Видеосвязь, упражнения, словарь и заметки — всё в одном окне.", 
                icon: LayoutGrid,
                color: "bg-blue-50 text-[#0071a0]"
              },
              { 
                title: "Разговорные клубы", 
                desc: "Занимайтесь в группах по интересам с людьми со всего мира. Доступно бесплатно каждому ученику.", 
                icon: MessageSquare,
                color: "bg-green-50 text-green-600"
              }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                <div className={`w-16 h-16 ${f.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {f.icon && <f.icon size={32} />}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">{f.desc}</p>
                <div className="flex items-center gap-2 text-[#0071a0] font-black cursor-pointer">
                  Подробнее <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 px-4 bg-slate-900 text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0071a0]/30 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
              15 045 преподавателей <br />
              <span className="text-[#fad800]">со всего мира</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed max-w-lg">
              Мы отбираем только 1 из 30 кандидатов. Каждый преподаватель проходит обучение по методикам Skyeng.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              {[
                "Носители из США и Британии",
                "Методисты",
                "Бизнес-тренеры",
                "Для детей"
              ].map(tag => (
                <div key={tag} className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm font-bold">
                  {tag}
                </div>
              ))}
            </div>
            <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl text-xl font-black hover:bg-[#fad800] transition-colors shadow-xl active:scale-95">
              Подобрать преподавателя
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: "Sarah M.", role: "Native Speaker", rate: "4.98", img: "https://i.pravatar.cc/300?u=sarah" },
              { name: "Alex K.", role: "Business English", rate: "5.0", img: "https://i.pravatar.cc/300?u=alex" },
              { name: "Emma W.", role: "IELTS Expert", rate: "4.95", img: "https://i.pravatar.cc/300?u=emma" },
              { name: "John D.", role: "General English", rate: "4.97", img: "https://i.pravatar.cc/300?u=john" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
                  <img src={t.img} className="w-full h-full object-cover" alt={t.name} />
                  <div className="absolute top-3 right-3 bg-white text-slate-900 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-md">
                    <Star size={10} fill="currentColor" /> {t.rate}
                  </div>
                </div>
                <div className="font-black text-lg mb-1">{t.name}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Стоимость обучения</h2>
            <p className="text-lg text-slate-500 font-medium">Подберите пакет занятий, который подходит именно вам</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Базовый", price: "от 790₽", feat: ["Русскоязычный учитель", "Интерактивная платформа", "Разговорные клубы"], best: false },
              { title: "Премиум", price: "от 1 290₽", feat: ["Лучшие преподаватели", "Приоритетная поддержка", "Замена в любое время", "Подготовка к экзаменам"], best: true },
              { title: "С носителем", price: "от 1 890₽", feat: ["Учитель из США/Британии", "Максимальное погружение", "Постановка акцента"], best: false }
            ].map((p, i) => (
              <div key={i} className={`relative p-10 rounded-[3rem] bg-white border-2 ${p.best ? 'border-[#fad800] shadow-2xl shadow-yellow-100' : 'border-slate-100'} flex flex-col`}>
                {p.best && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#fad800] text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-md">Популярный выбор</div>}
                <div className="text-2xl font-black mb-2">{p.title}</div>
                <div className="text-4xl font-black text-[#0071a0] mb-8">{p.price}<span className="text-sm text-slate-400 font-bold ml-1">/ урок</span></div>
                <div className="space-y-4 mb-12 flex-1">
                  {p.feat.map(f => (
                    <div key={f} className="flex gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full py-5 rounded-2xl text-lg font-black transition-all ${p.best ? 'bg-[#fad800] text-slate-900 shadow-lg shadow-yellow-100 hover:scale-[1.02]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  Выбрать пакет
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-[#0071a0] rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#fad800]/20 blur-[80px] rounded-full" />
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter relative z-10">
            Начните свой путь к <br />
            свободному английскому
          </h2>
          <p className="text-xl text-blue-100 mb-12 font-medium max-w-lg mx-auto relative z-10">
            Запишитесь на бесплатный вводный урок. Мы определим ваш уровень и составим план обучения.
          </p>
          <button className="bg-[#fad800] text-[#04121b] px-12 py-6 rounded-2xl text-2xl font-black hover:scale-105 transition-all shadow-2xl active:scale-95 relative z-10">
            Записаться бесплатно
          </button>
          
          <div className="mt-12 flex items-center justify-center gap-8 relative z-10 opacity-60">
            <div className="flex items-center gap-2 font-black text-sm"><ShieldCheck size={20} /> Безопасно</div>
            <div className="flex items-center gap-2 font-black text-sm"><CheckCircle2 size={20} /> Гарантия результата</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#0071a0] rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="font-black text-2xl tracking-tighter">Skyeng</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-xs">
              Онлайн-школа английского языка №1 в Европе. Мы помогаем достигать целей через инновации и любовь к обучению.
            </p>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-[#0071a0]/30 transition-colors cursor-pointer" />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-lg mb-8">О школе</h4>
            <div className="flex flex-col gap-4 text-slate-500 font-bold text-sm">
              <a href="#" className="hover:text-[#0071a0]">О нас</a>
              <a href="#" className="hover:text-[#0071a0]">Преподаватели</a>
              <a href="#" className="hover:text-[#0071a0]">Отзывы</a>
              <a href="#" className="hover:text-[#0071a0]">Контакты</a>
              <a href="#" className="hover:text-[#0071a0]">Вакансии</a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-lg mb-8">Обучение</h4>
            <div className="flex flex-col gap-4 text-slate-500 font-bold text-sm">
              <a href="#" className="hover:text-[#0071a0]">Для взрослых</a>
              <a href="#" className="hover:text-[#0071a0]">Для детей</a>
              <a href="#" className="hover:text-[#0071a0]">Корпоративное обучение</a>
              <a href="#" className="hover:text-[#0071a0]">Экзамены</a>
              <a href="#" className="hover:text-[#0071a0]">Цены</a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-lg mb-8">Помощь</h4>
            <div className="flex flex-col gap-4 text-slate-500 font-bold text-sm">
              <a href="#" className="hover:text-[#0071a0]">Тест уровня</a>
              <a href="#" className="hover:text-[#0071a0]">Блог</a>
              <a href="#" className="hover:text-[#0071a0]">База знаний</a>
              <a href="#" className="hover:text-[#0071a0]">FAQ</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            © 2026 Skyeng. Все права защищены.
          </div>
          <div className="flex gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900">Политика конфиденциальности</a>
            <a href="#" className="hover:text-slate-900">Оферта</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

const LayoutGrid = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
