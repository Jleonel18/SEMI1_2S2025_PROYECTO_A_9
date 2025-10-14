import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRightIcon, HeartIcon, ChartBarIcon, ChatBubbleBottomCenterTextIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const autoplayOptions = {
    delay: 5000, // 5 seconds per slide
    stopOnInteraction: false,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay(autoplayOptions)]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-20 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mr-3 shadow-md">
              <span className="text-white text-xl font-bold">MB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">MindBalance</h1>
          </div>
          <div className="space-x-4">
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Iniciar Sesión</a>
            <a href="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Regístrate</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" fill="none" stroke="#60A5FA" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-waves)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">Equilibra Tu Mente con MindBalance</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre sesiones de terapia guiadas por IA, ejercicios de mindfulness y seguimiento diario de tu estado de ánimo. Tu compañero para una salud mental óptima.
          </p>
          <a href="/register" className="inline-flex items-center bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition duration-300 shadow-lg text-lg font-medium">
            Comienza Ahora <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>

          {/* Carousel */}
          <div className="mt-12 max-w-4xl mx-auto relative">
            <div className="overflow-hidden rounded-xl shadow-xl" ref={emblaRef}>
              <div className="flex">
                <div className="flex-none w-full relative">
                  <img src="https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470" alt="Paisaje calmante 1" className="w-full h-auto object-cover transition-opacity duration-1000 ease-in-out" />
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-1000" /> {/* For fade effect */}
                </div>
                <div className="flex-none w-full relative">
                  <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470" alt="Mindfulness 2" className="w-full h-auto object-cover transition-opacity duration-1000 ease-in-out" />
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-1000" />
                </div>
                <div className="flex-none w-full relative">
                  <img src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470" alt="Zen 3" className="w-full h-auto object-cover transition-opacity duration-1000 ease-in-out" />
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-1000" />
                </div>
              </div>
            </div>
            {/* Optional manual controls for accessibility */}
            <button onClick={scrollPrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
              ❮
            </button>
            <button onClick={scrollNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
              ❯
            </button>
            {/* Dots indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {[0, 1, 2].map((index) => (
                <button key={index} className="w-3 h-3 bg-gray-400 rounded-full hover:bg-blue-500 transition" onClick={() => emblaApi && emblaApi.scrollTo(index)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section: Vision and Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Sobre Nosotros</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">MindBalance es más que una app; es tu aliado en el camino hacia el bienestar mental.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md">
              <HeartIcon className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Visión</h4>
              <p className="text-gray-600 text-center">
                Ser la plataforma líder global en salud mental, empoderando a millones con herramientas accesibles y personalizadas para lograr un equilibrio emocional duradero.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-md">
              <ShieldCheckIcon className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Misión</h4>
              <p className="text-gray-600 text-center">
                Proporcionar terapia guiada por IA, análisis de patrones de estrés y recomendaciones personalizadas, asegurando privacidad y accesibilidad para todos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Características Principales</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Descubre cómo MindBalance puede transformar tu rutina diaria.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Terapia Guiada por IA</h4>
              <p className="text-gray-600">Sesiones personalizadas basadas en tus necesidades emocionales.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <ChartBarIcon className="h-10 w-10 text-green-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Seguimiento de Humor</h4>
              <p className="text-gray-600">Registra tu estado diario y visualiza tu progreso con gráficos intuitivos.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <GlobeAltIcon className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Accesibilidad Global</h4>
              <p className="text-gray-600">Traducciones automáticas y recomendaciones adaptadas a tu cultura.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <ShieldCheckIcon className="h-10 w-10 text-green-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Alertas Profesionales</h4>
              <p className="text-gray-600">Notificaciones para buscar ayuda experta cuando sea necesario.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <HeartIcon className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Ejercicios de Mindfulness</h4>
              <p className="text-gray-600">Guías diarias para reducir el estrés y mejorar el enfoque.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-green-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Análisis de Diarios y Audios</h4>
              <p className="text-gray-600">Sube tus entradas y recibe insights sobre patrones emocionales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Lo Que Dicen Nuestros Usuarios</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Historias reales de transformación.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-md">
              <p className="text-gray-600 mb-4">"MindBalance ha cambiado mi vida. Las sesiones de IA son como tener un terapeuta en mi bolsillo."</p>
              <div className="flex items-center">
                <img src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" alt="User A" className="w-10 h-10 rounded-full mr-3 object-cover" />
                <div>
                  <h5 className="font-semibold text-gray-800">Ana López</h5>
                  <p className="text-sm text-gray-500">Usuario desde 2023</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-md">
              <p className="text-gray-600 mb-4">"El seguimiento de humor me ayuda a ver patrones que nunca noté. ¡Recomendado!"</p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" alt="User J" className="w-10 h-10 rounded-full mr-3 object-cover" />
                <div>
                  <h5 className="font-semibold text-gray-800">Juan Martínez</h5>
                  <p className="text-sm text-gray-500">Usuario desde 2024</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-md">
              <p className="text-gray-600 mb-4">"Las traducciones hacen que sea accesible para mi familia en diferentes países."</p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=761" alt="User M" className="w-10 h-10 rounded-full mr-3 object-cover" />
                <div>
                  <h5 className="font-semibold text-gray-800">María Gómez</h5>
                  <p className="text-sm text-gray-500">Usuario desde 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">¿Listo para Empezar?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Únete a miles de usuarios que han encontrado equilibrio con MindBalance.</p>
          <a href="/register" className="inline-flex items-center bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-600 transition duration-300 shadow-lg text-lg font-medium">
            Regístrate Gratis <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; 2025 MindBalance. Todos los derechos reservados.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-300">Privacidad</a>
            <a href="#" className="hover:text-gray-300">Términos</a>
            <a href="#" className="hover:text-gray-300">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;