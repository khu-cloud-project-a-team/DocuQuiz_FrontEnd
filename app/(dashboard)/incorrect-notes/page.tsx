"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { getWrongAnswerNotes, regenerateFromNote, WrongAnswerNote } from "@/lib/api";
import { format } from 'date-fns';

export default function IncorrectNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<WrongAnswerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const notesData = await getWrongAnswerNotes();
      setNotes(notesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오답노트 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegenerate = async (noteId: string) => {
    setRegeneratingId(noteId);
    try {
        const newQuiz = await regenerateFromNote(noteId);
        router.push(`/quiz/${newQuiz.id}`);
    } catch (err) {
        alert(err instanceof Error ? err.message : "퀴즈 재생성에 실패했습니다.");
        setRegeneratingId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-48 text-red-600">
          <AlertTriangle className="h-8 w-8" />
          <p className="mt-4 text-lg">오류: {error}</p>
          <Button onClick={fetchData} className="mt-4" variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" /> 다시 시도
          </Button>
        </div>
      );
    }
    
    if (notes.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-12">생성된 오답노트가 없습니다.</p>;
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((item) => (
          <Card key={item.id} className="shadow-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-medium">{item.quizResult.quiz.title}</CardTitle>
              <CardDescription>
                {format(new Date(item.createdAt), 'yyyy-MM-dd')} 생성
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleRegenerate(item.id)}
                disabled={regeneratingId === item.id}
              >
                 {regeneratingId === item.id 
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    : <RefreshCcw className="mr-2 h-4 w-4" />
                 }
                복습하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary" asChild>
        <Link href="/dashboard" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          대시보드로 돌아가기
        </Link>
      </Button>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">오답 노트</h2>
        <p className="text-muted-foreground">
          틀린 문제를 복습하고 약점을 보완하세요.
        </p>
      </div>

      {renderContent()}
    </div>
  );
}
