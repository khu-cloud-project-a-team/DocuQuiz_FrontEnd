"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateQuiz, QuizGenerationOptions } from "@/lib/api";

// API 스펙에 맞는 타입 정의
type QuizType = '객관식' | '주관식' | 'OX' | '빈칸';
type QuizDifficulty = '쉬움' | '보통' | '어려움';

function GeneratePageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");
  const fileName = searchParams.get("fileName");

  const [isLoading, setIsLoading] = useState(false);
  const [qCount, setQCount] = useState([10]);
  
  // API의 'types' 필드는 배열이지만, 현재 UI는 단일 선택입니다.
  // API 명세에 맞는 값으로 state를 관리합니다.
  const [qType, setQType] = useState<QuizType>("객관식");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("보통");

  const handleGenerate = async () => {
    if (!fileId) {
      alert("파일 ID가 올바르지 않습니다. 다시 업로드해주세요.");
      router.push("/upload");
      return;
    }

    setIsLoading(true);

    const options: QuizGenerationOptions = {
      questionCount: qCount[0],
      types: [qType], // 현재는 단일 유형만 배열로 전달
      difficulty: difficulty,
    };

    try {
      console.log("Generating quiz with:", { fileId, options });
      const quiz = await generateQuiz(fileId, options);
      router.push(`/quiz/${quiz.id}`);
    } catch (error) {
      console.error("Failed to generate quiz", error);
      const message = error instanceof Error ? error.message : "퀴즈 생성에 실패했습니다.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">퀴즈 생성 설정</h1>
        <p className="text-slate-500">업로드된 파일을 기반으로 AI가 퀴즈를 생성합니다.</p>
      </div>

      <Card>
        <CardHeader>
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 bg-slate-100 w-fit px-3 py-1 rounded-full">
              <FileText className="w-4 h-4" />
              <span>{decodeURIComponent(fileName)}</span>
            </div>
          )}
          <CardTitle>옵션 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-base">문항 수</Label>
              <span className="font-bold text-blue-600">{qCount[0]}문제</span>
            </div>
            <Slider
              defaultValue={[10]}
              max={20} // API 제약사항에 따라 조절 필요
              step={1}
              min={5}
              onValueChange={setQCount}
              className="py-4"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base">난이도</Label>
            <Select onValueChange={(value: QuizDifficulty) => setDifficulty(value)} defaultValue={difficulty}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="난이도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="쉬움">쉬움</SelectItem>
                <SelectItem value="보통">보통</SelectItem>
                <SelectItem value="어려움">어려움</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base">문제 유형</Label>
            <Select onValueChange={(value: QuizType) => setQType(value)} defaultValue={qType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="객관식">객관식 (4지선다)</SelectItem>
                <SelectItem value="OX">OX 퀴즈</SelectItem>
                <SelectItem value="주관식">주관식 (단답형)</SelectItem>
                <SelectItem value="빈칸">빈칸 채우기</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full h-12 text-lg" onClick={handleGenerate} disabled={isLoading || !fileId}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 퀴즈 생성 중...</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> 퀴즈 생성하기</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


// Suspense로 감싸서 useSearchParams 사용에 대한 client-side 렌더링을 보장합니다.
export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratePageComponent />
    </Suspense>
  );
}