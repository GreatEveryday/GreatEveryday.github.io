import React, { useState, useCallback } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { ResultScreen } from './components/ResultScreen';
import { AppState, AnalysisResult } from './types';
import { analyzeFace } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.AUTH);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = () => {
    setAppState(AppState.UPLOAD);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError("请上传图片文件 (JPG, PNG)");
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("图片大小不能超过 5MB");
        return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
        const result = e.target?.result as string;
        setImageSrc(result);
        setAppState(AppState.ANALYZING);
        
        // Extract base64 content for API (remove "data:image/jpeg;base64," prefix)
        const base64Data = result.split(',')[1];
        
        try {
            const data = await analyzeFace(base64Data);
            setAnalysisResult(data);
            setAppState(AppState.RESULT);
        } catch (err) {
            console.error(err);
            setError("AI 分析失败，请稍后重试或更换图片");
            setAppState(AppState.UPLOAD);
        }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setImageSrc(null);
    setError(null);
    setAppState(AppState.UPLOAD);
  };

  if (appState === AppState.AUTH) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  if (appState === AppState.RESULT && analysisResult && imageSrc) {
    return <ResultScreen result={analysisResult} onReset={handleReset} imageSrc={imageSrc} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">高级颜值测评</h1>
        <button className="text-sm text-gray-500">帮助</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        
        {appState === AppState.ANALYZING ? (
           <div className="flex flex-col items-center animate-pulse">
             <div className="relative w-32 h-32 mb-8">
                {imageSrc && (
                    <img 
                        src={imageSrc} 
                        alt="Scanning" 
                        className="w-full h-full object-cover rounded-full opacity-50 blur-sm"
                    />
                )}
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">正在分析五官特征...</h2>
             <p className="text-gray-500">AI正在生成您的专业颜值报告</p>
           </div>
        ) : (
          <div className="w-full max-w-sm">
             <div className="mb-10 relative">
                <div className="w-48 h-48 bg-indigo-50 rounded-full mx-auto flex items-center justify-center mb-6 relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">上传正脸照片</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                   为了获得最准确的分析结果，<br/>请确保光线充足，五官清晰可见，<br/>无遮挡，无过度美颜。
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
                
                <label className="block w-full">
                    <span className="sr-only">选择照片</span>
                    <div className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        上传照片 / 拍照
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                </label>
             </div>
          </div>
        )}
      </div>
      
      <div className="py-4 text-center text-gray-300 text-xs">
         Lumina Face Analysis System
      </div>
    </div>
  );
};

export default App;