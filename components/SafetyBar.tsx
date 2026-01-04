import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const SafetyBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-stone-800/80 backdrop-blur-sm p-2 rounded-full hover:bg-stone-700 transition-colors border border-stone-600 shadow-lg group"
        aria-label="Safety Information"
      >
        <ShieldAlert className="w-5 h-5 text-stone-400 group-hover:text-red-400 transition-colors" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              緊急時のサポート
            </h2>
            
            <p className="text-stone-300 mb-4 leading-relaxed text-sm">
              このアプリは医療・精神医療を提供するものではありません。
              もし今、あなたが辛い状況にあり、すぐに助けが必要な場合は、
              専門の窓口に連絡してください。
            </p>

            <div className="space-y-3">
              <div className="bg-stone-800 p-4 rounded-md border-l-4 border-yellow-500">
                <h3 className="font-bold text-white mb-1">こころの健康相談統一ダイヤル</h3>
                <p className="text-2xl font-mono text-yellow-400">0570-064-556</p>
              </div>
              
              <div className="bg-stone-800 p-4 rounded-md border-l-4 border-red-500">
                <h3 className="font-bold text-white mb-1">よりそいホットライン</h3>
                <p className="text-2xl font-mono text-red-400">0120-279-338</p>
              </div>
            </div>

            <p className="mt-6 text-xs text-stone-500 text-center">
              あなたの命と安全が最優先です。
            </p>
          </div>
        </div>
      )}
    </>
  );
};