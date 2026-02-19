import React from 'react';
import { Diagnosis } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  Activity, 
  ThermometerSun, 
  ShieldCheck, 
  Stethoscope, 
  HelpCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisResultProps {
  diagnosis: Diagnosis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ diagnosis }) => {
  if (!diagnosis.isPlant) {
    return (
      <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl text-center max-w-2xl mx-auto">
        <HelpCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-amber-800 mb-2">Plant Not Detected</h3>
        <p className="text-amber-700">
          We couldn't identify a plant in the image you uploaded. Please try again with a clearer photo of a leaf, fruit, or crop.
        </p>
      </div>
    );
  }

  const isHealthy = diagnosis.status === 'Healthy';
  const colorBase = isHealthy ? 'green' : diagnosis.severity === 'High' ? 'red' : 'amber';
  
  // Data for chart
  const data = [
    { name: 'Confidence', value: diagnosis.confidence },
    { name: 'Uncertainty', value: 100 - diagnosis.confidence },
  ];
  const COLORS = [isHealthy ? '#22c55e' : '#ef4444', '#e2e8f0'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header Card */}
      <div className={`
        rounded-3xl p-8 text-white shadow-xl overflow-hidden relative
        ${isHealthy ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-orange-700'}
      `}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <span className="uppercase tracking-wider text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {diagnosis.plantName}
              </span>
              <span className="uppercase tracking-wider text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {diagnosis.status}
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-2">
              {isHealthy ? "Plant is Healthy" : diagnosis.diseaseName}
            </h2>
            <p className="text-lg opacity-90 max-w-xl leading-relaxed">
              {diagnosis.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px]">
             <span className="text-sm font-medium opacity-80 mb-1">Confidence</span>
             <div className="text-3xl font-bold">{diagnosis.confidence}%</div>
             <div className="h-1 w-full bg-black/20 mt-2 rounded-full overflow-hidden">
               <div className="h-full bg-white transition-all duration-1000" style={{ width: `${diagnosis.confidence}%` }}></div>
             </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <Activity size={300} />
        </div>
      </div>

      {/* Grid Layout for Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Symptoms */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <AlertOctagon className="text-orange-500" size={20} />
            Symptoms
          </h3>
          <ul className="space-y-3">
            {diagnosis.symptoms.length > 0 ? (
              diagnosis.symptoms.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                  {item}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No specific symptoms detected.</li>
            )}
          </ul>
        </div>

        {/* Causes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <ThermometerSun className="text-blue-500" size={20} />
            Potential Causes
          </h3>
           <ul className="space-y-3">
            {diagnosis.causes.length > 0 ? (
              diagnosis.causes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                  {item}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No specific causes identified.</li>
            )}
          </ul>
        </div>

        {/* Treatments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Stethoscope className="text-emerald-500" size={20} />
            Recommended Treatments
          </h3>
           <ul className="space-y-3">
            {diagnosis.treatments.length > 0 ? (
              diagnosis.treatments.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  {item}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No specific treatments needed.</li>
            )}
          </ul>
        </div>

         {/* Prevention */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <ShieldCheck className="text-purple-500" size={20} />
            Prevention
          </h3>
           <ul className="space-y-3">
            {diagnosis.preventiveMeasures.length > 0 ? (
              diagnosis.preventiveMeasures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                  {item}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Maintain good care practices.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
