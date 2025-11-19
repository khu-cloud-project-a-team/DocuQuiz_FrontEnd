import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, BookOpen, BarChart3, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">
            안녕하세요! 오늘 학습할 내용을 선택해보세요.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            새 퀴즈 만들기
          </Link>
        </Button>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 푼 문제 수</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+18.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-muted-foreground">+4% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">학습 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">이번 주 누적 시간</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 퀴즈 목록 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>최근 학습 기록</CardTitle>
            <CardDescription>
              최근에 생성하고 푼 퀴즈 목록입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock Data Items */}
              {[
                { title: "운영체제 중간고사 대비", date: "2024-03-15", score: 85 },
                { title: "데이터베이스 3장 정규화", date: "2024-03-14", score: 92 },
                { title: "알고리즘 - 정렬 파트", date: "2024-03-10", score: 78 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="font-medium">
                    {item.score}점
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 빠른 시작 / 추천 영역 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>오답 노트 바로가기</CardTitle>
            <CardDescription>
              많이 틀린 유형을 복습해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="flex-1">
                    <p className="text-sm font-medium">데이터베이스 - B-Tree</p>
                    <p className="text-xs text-muted-foreground">정답률 40% 미만</p>
                </div>
                <Button variant="ghost" size="sm">복습</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}