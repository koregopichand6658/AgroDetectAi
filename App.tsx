import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { ChatAssistant } from './components/ChatAssistant';
import { analyzePlantImage } from './services/geminiService';
import { Diagnosis } from './types';
import { Sprout, Leaf, Scan, ChevronRight, Github } from 'lucide-react';

const App = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'analyze'>('home');

  const handleImageSelected = async (base64: string) => {
    setCurrentImage(base64);
    setDiagnosis(null);
    setError(null);
    setIsAnalyzing(true);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await analyzePlantImage(base64);
      setDiagnosis(result);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStart = () => {
    setView('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView('home')}
          >
            <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
              <Sprout size={24} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">AgroDetect</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setView('home')} 
               className={`text-sm font-medium transition-colors ${view === 'home' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
             >
               Home
             </button>
             <button 
               onClick={() => setView('analyze')} 
               className={`text-sm font-medium transition-colors ${view === 'analyze' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
             >
               Analyze
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {view === 'home' ? (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 text-white">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070')] bg-cover bg-center opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              
              <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                  AI-Powered Agriculture
                </span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                  Protect Your Crops with <br/>
                  <span className="text-emerald-400">Intelligent Analysis</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
                  AgroDetect uses advanced computer vision to identify plant diseases, pests, and nutrient deficiencies instantly. Get accurate diagnoses and expert treatment advice in seconds.
                </p>
                <button 
                  onClick={handleStart}
                  className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  Start Analysis
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-50 py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">Three simple steps to healthier plants.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Scan size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">1. Upload Image</h3>
                    <p className="text-slate-500 leading-relaxed">Take a photo of your plant's affected area or upload an existing image.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Leaf size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">2. AI Diagnosis</h3>
                    <p className="text-slate-500 leading-relaxed">Our Gemini-powered AI analyzes the image for hundreds of diseases and pests.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Sprout size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">3. Get Treatment</h3>
                    <p className="text-slate-500 leading-relaxed">Receive instant treatment recommendations and prevention tips.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
             <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Plant Analysis</h1>
                <p className="text-slate-500">Upload a clear photo of the leaf or plant for the best results.</p>
             </div>

             <ImageUploader onImageSelected={handleImageSelected} isAnalyzing={isAnalyzing} />

             {error && (
               <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">
                 {error}
               </div>
             )}

             <div className="mt-12">
               {diagnosis && <AnalysisResult diagnosis={diagnosis} />}
             </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
             <Sprout size={20} className="text-emerald-600" />
             <span className="font-bold">AgroDetect</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 AgroDetect. Powered by Gemini AI.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </footer>

      {/* Chat Bot */}
      <ChatAssistant diagnosisContext={diagnosis || undefined} />
    </div>
  );
};

export default App;
