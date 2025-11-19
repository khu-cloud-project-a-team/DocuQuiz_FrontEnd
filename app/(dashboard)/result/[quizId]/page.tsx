"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, RefreshCcw, BookOpen, Home } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  // Mock Data: 실제로는 서버에서 채점 결과 받아옴
  const RESULTS = [
    { id: 1, question: "sin(x)를 미분하면?", userAns: "cos(x)", correctAns: "cos(x)", isCorrect: true, explanation: "sin(x)의 도함수는 cos(x)입니다.", sourcePage: 42 },
    { id: 2, question: "적분의 기본 정리는?", userAns: "기울기이다", correctAns: "미분의 역연산이다", isCorrect: false, explanation: "부정적분은 미분의 역연산 관계입니다.", sourcePage: 12 },
    { id: 3, question: "연속함수의 조건?", userAns: "모두 정답", correctAns: "모두 정답", isCorrect: true, explanation: "극한값 존재, 함숫값 존재, 두 값이 일치해야 합니다.", sourcePage: 33 },
  ];

  const score = Math.round((RESULTS.filter(r => r.isCorrect).length / RESULTS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        {/* 점수 대시보드 */}
        <Card className="bg-slate-900 text-white border-none">
            <CardContent className="flex flex-col md:flex-row items-center justify-between p-8">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-2xl font-bold">퀴즈 완료!</h1>
                    <p className="text-slate-400">총 {RESULTS.length}문제 중 {RESULTS.filter(r => r.isCorrect).length}문제를 맞췄습니다.</p>
                </div>
                <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <div className="text-center">
                        <span className="block text-5xl font-bold text-green-400">{score}</span>
                        <span className="text-sm text-slate-400">Score</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* 하단 액션 버튼 (오답 재생성 & 홈) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 text-lg border-2" asChild>
                <Link href="/dashboard">
                    <Home className="mr-2" /> 대시보드로 이동
                </Link>
            </Button>
            <Button className="h-14 text-lg bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/generate?mode=review'}>
                <RefreshCcw className="mr-2" /> 오답 문제만 다시 풀기
            </Button>
        </div>

        {/* 상세 해설 (Accordion UI) */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> 상세 해설 및 원문 확인
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {RESULTS.map((item, idx) => (
                    <AccordionItem key={item.id} value={`item-${idx}`} className="border rounded-lg px-4 bg-white">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-4 text-left w-full">
                                {item.isCorrect ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                                )}
                                <div className="flex-1">
                                    <span className="text-sm text-slate-500 font-normal mr-2">Q{idx + 1}.</span>
                                    <span className="font-medium">{item.question}</span>
                                </div>
                                <Badge variant={item.isCorrect ? "default" : "destructive"} className="ml-2 shrink-0">
                                    {item.isCorrect ? "정답" : "오답"}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-slate-600 bg-slate-50/50 -mx-4 px-6 py-4 border-t">
                            <div className="grid gap-3">
                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                    <span className="font-semibold text-slate-900">내 답안:</span>
                                    <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>{item.userAns}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                    <span className="font-semibold text-slate-900">정답:</span>
                                    <span className="text-blue-600">{item.correctAns}</span>
                                </div>
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                                    <p className="text-sm font-semibold text-blue-800 mb-1">💡 해설</p>
                                    <p className="text-sm text-slate-700">{item.explanation}</p>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <Badge variant="outline" className="text-slate-400 cursor-pointer hover:bg-slate-100">
                                        📄 원문 {item.sourcePage}p 참조
                                    </Badge>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>
  );
}