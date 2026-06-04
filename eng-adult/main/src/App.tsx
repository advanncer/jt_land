import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown,
  Star,
  Play,
  ArrowRight,
  Check,
  Menu,
  X,
  Globe,
  Users,
  BookOpen,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Briefcase,
  GraduationCap,
  MapPin,
  HelpCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-['StratosSkyeng',sans-serif] text-[#04121b] selection:bg-[#fad800]/30 overflow-x-hidden">
      
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img 
                src="https://cdn-user84632.skyeng.ru/shared/large-media/skysmart/layout/logo/skyeng-logo-dark-no-p.svg" 
                alt="Skyeng" 
                className="h-8 md:h-9"
              />
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
              {[
                { name: 'Взрослым', active: true },
                { name: 'Детям' },
                { name: 'Другие языки' },
                { name: 'Бизнесу' },
                { name: 'Тест уровня' },
                { name: 'Цены' }
              ].map((item) => (
                <div key={item.name} className="relative group">
                  <button className={`flex items-center gap-1 text-[15px] font-medium transition-colors ${item.active ? 'text-[#00aefa]' : 'text-[#04121b] hover:text-[#00aefa]'}`}>
                    {item.name}
                    {['Взрослым', 'Детям', 'Другие языки'].includes(item.name) && <ChevronDown size={14} className="opacity-50" />}
                  </button>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-[15px] font-bold text-[#04121b] hover:text-[#00aefa] transition-colors">Войти</button>
            <button className="bg-[#fad800] text-[#04121b] px-6 py-2.5 md:px-8 md:py-3 rounded-2xl text-[15px] md:text-base font-black hover:bg-[#ffe22e] transition-all shadow-[0_4px_0_rgb(226,198,0)] active:shadow-none active:translate-y-[2px]">
              Начать учиться
            </button>
            <button className="xl:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl p-6 xl:hidden"
            >
              <div className="flex flex-col gap-5">
                {['Взрослым', 'Детям', 'Другие языки', 'Бизнесу', 'Тест уровня', 'Цены'].map(item => (
                  <a key={item} href="#" className="text-lg font-bold hover:text-[#00aefa]">{item}</a>
                ))}
                <hr className="my-2 border-slate-100" />
                <button className="w-full py-4 bg-slate-50 rounded-2xl font-bold text-[#04121b]">Войти</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 overflow-hidden bg-[#f4f5f6]">
        {/* Background Image / Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 md:opacity-100">
           <img 
            src="https://cdn-user84632.skyeng.ru/shared/large-media/skysmart/product-pages/home/top-form/top-form-bg-1920-x1.png" 
            className="w-full h-full object-cover object-right"
            alt=""
           />
        </div>

        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[44px] md:text-[88px] leading-[1] font-black mb-8 tracking-tighter text-[#02212b]">
              №1 онлайн-школа <br />
              английского языка
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-sm border border-white flex flex-col items-center justify-center min-w-[140px]">
                <div className="text-2xl md:text-3xl font-black text-[#04121b]">893 627</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mt-1">учеников</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-sm border border-white flex flex-col items-center justify-center min-w-[140px]">
                <div className="text-2xl md:text-3xl font-black text-[#04121b]">15 045</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mt-1">преподавателей</div>
              </div>
            </div>

            <div className="max-w-md">
               <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                 {/* Badge */}
                 <div className="absolute top-0 right-0 bg-[#fad800] px-4 py-2 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest">
                   Бесплатно
                 </div>
                 
                 <h3 className="text-xl md:text-2xl font-black mb-8 leading-tight">Попробуйте первый <br />урок бесплатно</h3>
                 <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Имя" 
                        className="w-full px-6 py-4 rounded-2xl bg-[#f4f5f6] border-2 border-transparent focus:border-[#00aefa] focus:bg-white outline-none transition-all font-bold text-lg"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="+7 (___) ___-__-__" 
                        className="w-full px-6 py-4 rounded-2xl bg-[#f4f5f6] border-2 border-transparent focus:border-[#00aefa] focus:bg-white outline-none transition-all font-bold text-lg"
                      />
                    </div>
                    <button className="w-full bg-[#fad800] text-[#04121b] py-5 rounded-2xl text-lg font-black shadow-[0_5px_0_rgb(226,198,0)] hover:translate-y-[-2px] hover:shadow-[0_7px_0_rgb(226,198,0)] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 group mt-6">
                      Записаться на урок
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </form>
                 <p className="mt-6 text-[10px] text-slate-400 font-medium leading-relaxed">
                   Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с Политикой конфиденциальности.
                 </p>
               </div>
               
               <div className="mt-8 flex items-center gap-3 px-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Сейчас на сайте 2 482 ученика</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges / Brands */}
      <section className="py-10 border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-12 min-w-[800px] opacity-40 grayscale">
            <span className="text-xl font-black tracking-tighter">Smart Ranking</span>
            <span className="text-xl font-black tracking-tighter">Forbes</span>
            <span className="text-xl font-black tracking-tighter">РБК</span>
            <span className="text-xl font-black tracking-tighter">Сколково</span>
            <span className="text-xl font-black tracking-tighter">Коммерсантъ</span>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <h2 className="text-4xl md:text-[56px] leading-[1] font-black tracking-tighter text-[#02212b] max-w-2xl">
              Программы для любых целей <br />
              с гарантией результата
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-sm mb-2">
              Занимайтесь один на один с опытным преподавателем и практикуйте английский 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Main Card */}
             <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[40px] p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group">
                <div>
                   <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#00aefa] text-[10px] font-black uppercase tracking-widest mb-6">
                      Курс-бестселлер
                   </div>
                   <h3 className="text-3xl font-black mb-4 leading-tight">+1 уровень английского за 3 месяца</h3>
                   <p className="text-slate-500 font-medium mb-8">Интенсивная программа с личным преподавателем и гарантией в договоре.</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                   <div className="text-2xl font-black text-[#00aefa]">от 790₽ <span className="text-sm text-slate-400 font-bold">/ урок</span></div>
                   <div className="w-12 h-12 bg-[#f4f5f6] rounded-2xl flex items-center justify-center group-hover:bg-[#fad800] transition-colors">
                      <ArrowRight size={24} />
                   </div>
                </div>
             </div>

             {/* Second Card */}
             <div className="bg-[#f4f5f6] rounded-[40px] p-10 flex flex-col justify-between hover:bg-[#fff7c7] transition-all group cursor-pointer">
                <div>
                   <h3 className="text-3xl font-black mb-4 leading-tight">Английский для работы и IT</h3>
                   <p className="text-slate-500 font-medium">Подготовим к интервью, презентациям и общению с зарубежными коллегами.</p>
                </div>
                <div className="flex items-center justify-between mt-20">
                   <div className="text-sm font-bold uppercase tracking-widest text-[#04121b]">Подробнее</div>
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:bg-[#fad800] transition-colors shadow-sm">
                      <ArrowRight size={24} />
                   </div>
                </div>
             </div>

             {/* Third Card */}
             <div className="bg-[#02212b] rounded-[40px] p-10 flex flex-col justify-between text-white group cursor-pointer">
                <div>
                   <h3 className="text-3xl font-black mb-4 leading-tight">Разговорный английский</h3>
                   <p className="text-slate-400 font-medium">Преодолейте языковой барьер и начните говорить свободно на любые темы.</p>
                </div>
                <div className="flex items-center justify-between mt-20">
                   <div className="text-sm font-bold uppercase tracking-widest">Выбрать программу</div>
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#fad800] group-hover:text-[#04121b] transition-colors">
                      <ArrowRight size={24} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section - Interactive & Modern */}
      <section className="py-24 px-4 bg-[#f4f5f6]">
        <div className="max-w-[1440px] mx-auto">
           <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                 <h2 className="text-4xl md:text-[56px] leading-[1] font-black tracking-tighter text-[#02212b] mb-12">
                   Добейтесь реальных результатов <br />
                   с нашей экосистемой
                 </h2>
                 
                 <div className="space-y-6">
                    {[
                      { title: 'Интерактивная платформа', desc: 'Уроки проходят на платформе, где всё под рукой: видеосвязь, упражнения и словарь.', icon: Globe, active: true },
                      { title: 'Умное приложение', desc: 'Учите слова, делайте домашние задания и следите за прогрессом прямо в телефоне.', icon: Zap },
                      { title: 'AI-репетитор', desc: 'Тренируйте разговорную речь в любое время с искусственным интеллектом.', icon: Sparkles }
                    ].map((item, i) => (
                      <div key={i} className={`p-6 rounded-3xl border-2 transition-all ${item.active ? 'bg-white border-[#00aefa] shadow-xl' : 'bg-transparent border-transparent hover:bg-white/50'}`}>
                         <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.active ? 'bg-[#00aefa] text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                               <item.icon size={24} />
                            </div>
                            <div>
                               <h4 className="text-lg font-black mb-1">{item.title}</h4>
                               <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="lg:col-span-7 relative">
                 <div className="aspect-[16/10] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 relative group cursor-pointer">
                    <img 
                      src="https://cdn-user84632.skyeng.ru/shared/large-media/skysmart/product-pages/home/top-form/top-form-bg-1024-large-new-x1.png" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                      alt="Skyeng Platform" 
                    />
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play size={32} fill="#04121b" className="ml-1" />
                       </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-lg">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#00aefa] rounded-xl flex items-center justify-center text-white">
                             <Check size={20} />
                          </div>
                          <div>
                             <div className="font-black text-sm uppercase tracking-widest mb-0.5">Эффективность</div>
                             <div className="text-slate-500 font-bold text-xs">Помогаем достичь цели в 2 раза быстрее</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Teachers Showcase */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-[56px] leading-[1] font-black tracking-tighter text-[#02212b] mb-6">
                15 045 преподавателей <br />со всего мира
              </h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                Отбираем только 1 из 30 кандидатов. Все преподаватели проходят обучение по нашей авторской методике.
              </p>
           </div>

           <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
              {[
                { name: 'Юлия Б.', role: 'Для начинающих', rate: '4.98', exp: '8 лет', img: 'https://i.pravatar.cc/300?u=yulia' },
                { name: 'Дэвид У.', role: 'Носитель языка', rate: '5.0', exp: '12 лет', img: 'https://i.pravatar.cc/300?u=david' },
                { name: 'Анна М.', role: 'Бизнес-английский', rate: '4.95', exp: '6 лет', img: 'https://i.pravatar.cc/300?u=anna' },
                { name: 'Марк С.', role: 'IELTS/TOEFL', rate: '4.99', exp: '10 лет', img: 'https://i.pravatar.cc/300?u=mark' },
                { name: 'Елена В.', role: 'Для детей', rate: '4.97', exp: '5 лет', img: 'https://i.pravatar.cc/300?u=elena' }
              ].map((t, i) => (
                <div key={i} className="min-w-[280px] md:min-w-[320px] bg-[#f4f5f6] rounded-[40px] p-8 snap-center hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100 group">
                   <div className="relative w-full aspect-square rounded-[32px] overflow-hidden mb-6">
                      <img src={t.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={t.name} />
                      <div className="absolute top-4 right-4 bg-white text-[#04121b] px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-md">
                         <Star size={12} fill="#fad800" stroke="#fad800" /> {t.rate}
                      </div>
                   </div>
                   <div className="flex items-center justify-between mb-2">
                      <h4 className="text-2xl font-black">{t.name}</h4>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.exp} опыта</span>
                   </div>
                   <p className="text-[#00aefa] font-black text-sm uppercase tracking-widest">{t.role}</p>
                </div>
              ))}
           </div>
           
           <div className="flex justify-center mt-10">
              <button className="flex items-center gap-3 font-black text-lg hover:text-[#00aefa] transition-colors group">
                 Посмотреть всех преподавателей
                 <div className="w-10 h-10 bg-[#f4f5f6] rounded-full flex items-center justify-center group-hover:bg-[#fad800] transition-colors">
                    <ArrowRight size={20} />
                 </div>
              </button>
           </div>
        </div>
      </section>

      {/* Testimonials Video / Cards */}
      <section className="py-24 px-4 bg-[#02212b] rounded-[60px] mx-4 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00aefa]/10 blur-[150px] rounded-full" />
        <div className="max-w-[1440px] mx-auto relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-[56px] font-black text-white tracking-tighter mb-6">Истории наших учеников</h2>
              <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                Более 90% наших учеников достигают поставленной цели. Вот что они говорят о процессе.
              </p>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-video bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                 <img src="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" className="w-full h-full object-cover opacity-50 grayscale" alt="Video Review" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-6">
                       <Play size={40} fill="#04121b" className="ml-1" />
                    </div>
                    <span className="text-white font-black text-xl">Смотреть видеоотзыв</span>
                 </div>
              </div>
              
              <div className="space-y-6">
                 {[
                   { name: 'Александр В.', text: 'Благодаря Skyeng я смог подготовиться к IELTS за 2 месяца и поступить в университет в Берлине. Это было круто!', color: 'bg-blue-500' },
                   { name: 'Мария К.', text: 'Интерактивная платформа — это любовь. Теперь учить слова стало проще, чем смотреть ленту в соцсетях.', color: 'bg-[#fad800]' }
                 ].map((rev, i) => (
                   <div key={i} className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-xl text-white font-medium mb-6 leading-relaxed italic">«{rev.text}»</p>
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 ${rev.color} rounded-full`} />
                         <span className="text-lg font-black text-white">{rev.name}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-[1440px] mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-[56px] font-black tracking-tighter text-[#02212b] mb-6">Стоимость обучения</h2>
              <div className="flex items-center justify-center gap-4">
                 <span className="font-bold text-slate-400">Взрослым</span>
                 <div className="w-14 h-8 bg-slate-100 rounded-full p-1 cursor-pointer">
                    <div className="w-6 h-6 bg-[#00aefa] rounded-full" />
                 </div>
                 <span className="font-bold text-[#04121b]">Детям</span>
              </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Базовый', price: 'от 790 ₽', desc: 'Для тех, кто учит для себя', features: ['Опытные учителя', 'Платформа 24/7', 'Клубы бесплатно'], active: false },
                { title: 'Премиум', price: 'от 1 290 ₽', desc: 'Лучший выбор для результата', features: ['Топ-5% учителей', 'Личный методист', 'Подготовка к IELTS', 'Заморозка навсегда'], active: true },
                { title: 'С носителем', price: 'от 1 890 ₽', desc: 'Для продвинутого уровня', features: ['Учителя из США/ЮК', 'Акцент и сленг', 'Снятие барьера'], active: false },
                { title: 'Группы', price: 'от 490 ₽', desc: 'Учитесь вместе с другими', features: ['Группы 4-6 чел', 'Живое общение', 'Выгодная цена'], active: false }
              ].map((p, i) => (
                <div key={i} className={`relative p-8 rounded-[40px] border-2 transition-all flex flex-col ${p.active ? 'bg-white border-[#fad800] shadow-2xl scale-105 z-10' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                   {p.active && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fad800] text-[#04121b] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">Популярно</div>}
                   <div className="text-xl font-black mb-1">{p.title}</div>
                   <div className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">{p.desc}</div>
                   <div className="text-3xl font-black text-[#02212b] mb-8">{p.price}<span className="text-sm text-slate-400 font-bold ml-1">/ урок</span></div>
                   <div className="space-y-4 mb-10 flex-1">
                      {p.features.map(f => (
                        <div key={f} className="flex gap-3 text-sm font-bold text-slate-600">
                           <Check size={18} className="text-green-500 shrink-0" />
                           {f}
                        </div>
                      ))}
                   </div>
                   <button className={`w-full py-4 rounded-2xl font-black transition-all ${p.active ? 'bg-[#fad800] text-[#04121b] shadow-xl hover:bg-[#ffe22e]' : 'bg-[#f4f5f6] text-slate-500 hover:bg-slate-200'}`}>
                      Выбрать пакет
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 px-4 bg-[#f4f5f6]">
        <div className="max-w-3xl mx-auto">
           <h2 className="text-3xl md:text-[44px] font-black tracking-tighter text-[#02212b] mb-16 text-center">Частые вопросы</h2>
           <div className="space-y-4">
              {[
                'Как проходит первый бесплатный урок?',
                'Как вы подбираете преподавателя?',
                'Что если мне не понравится преподаватель?',
                'Как работает гарантия результата?',
                'Можно ли заниматься с телефона?'
              ].map((q, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 md:p-8 cursor-pointer group hover:shadow-xl transition-all">
                   <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#02212b] group-hover:text-[#00aefa] transition-colors">{q}</span>
                      <div className="w-10 h-10 rounded-2xl bg-[#f4f5f6] flex items-center justify-center group-hover:bg-[#fad800] transition-colors">
                         <ChevronDown size={20} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
              <div className="lg:col-span-2">
                 <img src="https://cdn-user84632.skyeng.ru/shared/large-media/skysmart/layout/logo/skyeng-logo-dark.svg" alt="Skyeng" className="h-8 mb-8" />
                 <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-8">
                    №1 онлайн-школа английского языка в Европе. Обучаем на базе интерактивной платформы с 2012 года.
                 </p>
                 <div className="flex gap-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-11 h-11 bg-[#f4f5f6] rounded-2xl flex items-center justify-center hover:bg-[#fad800] transition-colors cursor-pointer" />
                    ))}
                 </div>
              </div>
              
              <div>
                 <h4 className="font-black text-lg mb-8">Для учеников</h4>
                 <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                    <a href="#" className="hover:text-[#00aefa]">Для взрослых</a>
                    <a href="#" className="hover:text-[#00aefa]">Для детей</a>
                    <a href="#" className="hover:text-[#00aefa]">Преподаватели</a>
                    <a href="#" className="hover:text-[#00aefa]">Цены</a>
                 </div>
              </div>

              <div>
                 <h4 className="font-black text-lg mb-8">О школе</h4>
                 <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                    <a href="#" className="hover:text-[#00aefa]">О нас</a>
                    <a href="#" className="hover:text-[#00aefa]">Методика</a>
                    <a href="#" className="hover:text-[#00aefa]">Вакансии</a>
                    <a href="#" className="hover:text-[#00aefa]">Контакты</a>
                 </div>
              </div>

              <div>
                 <h4 className="font-black text-lg mb-8">Полезное</h4>
                 <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                    <a href="#" className="hover:text-[#00aefa]">Блог</a>
                    <a href="#" className="hover:text-[#00aefa]">Тест уровня</a>
                    <a href="#" className="hover:text-[#00aefa]">FAQ</a>
                 </div>
              </div>
           </div>
           
           <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div>© 2012–2026 Skyeng. Все права защищены.</div>
              <div className="flex gap-8">
                 <a href="#" className="hover:text-[#04121b]">Конфиденциальность</a>
                 <a href="#" className="hover:text-[#04121b]">Условия использования</a>
                 <a href="#" className="hover:text-[#04121b]">Рекурентные платежи</a>
              </div>
           </div>
        </div>
      </footer>

      {/* Extra CSS for Custom Scrollbar and Layout Fixes */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
