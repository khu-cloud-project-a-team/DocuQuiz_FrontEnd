"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

// Mock Data: 나중에 API로 대체
const QUESTIONS = [
  { id: 1, question: "sin(x)를 미분하면 무엇인가?", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"] },
  { id: 2, question: "적분의 기본 정리에 대해 옳은 것은?", options: ["미분의 역연산이다", "상수항이 없다", "넓이를 구할 수 없다", "기울기이다"] },
  { id: 3, question: "다음 중 연속함수의 조건은?", options: ["극한값이 존재한다", "함수값이 존재한다", "극한값과 함수값이 같다", "모두 정답"] },
];

export default function QuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // {문제번호: 선택한 답 인덱스}
  
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;
  const currQ = QUESTIONS[currentIdx];

  const handleSelect = (optionIdx: number) => {
    setAnswers({ ...answers, [currQ.id]: optionIdx });
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(prev => prev + 1);
    else {
      // 제출
      window.location.href = `/result/quiz_demo_123`;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 진행바 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="min-h-[400px] flex flex-col justify-between shadow-sm">
        <CardContent className="pt-8 space-y-8">
            {/* 문제 텍스트 */}
            <h2 className="text-2xl font-semibold leading-relaxed">
                <span className="text-blue-600 mr-2">Q{currentIdx + 1}.</span>
                {currQ.question}
            </h2>

            {/* 보기 리스트 */}
            <div className="grid gap-3">
                {currQ.options.map((opt, idx) => (
                    <div 
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 hover:bg-slate-50
                            ${answers[currQ.id] === idx 
                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                                : "border-slate-200"}
                        `}
                    >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs
                            ${answers[currQ.id] === idx ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 text-slate-500"}
                        `}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-base">{opt}</span>
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-slate-50/50 p-6">
            <Button 
                variant="outline" 
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> 이전
            </Button>
            <Button onClick={handleNext}>
                {currentIdx === QUESTIONS.length - 1 ? "제출하기" : "다음 문제"}
                {currentIdx !== QUESTIONS.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}