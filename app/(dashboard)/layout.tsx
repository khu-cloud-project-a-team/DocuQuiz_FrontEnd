import Link from "next/link";
import { BookOpen, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6" />
            <Link href="/dashboard">DocuQuiz</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:inline-block">
              대학교 3학년 님
            </span>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <LogOut className="h-5 w-5 text-slate-500 hover:text-red-500" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* 메인 컨텐츠 영역 */}
      <main className="container py-10 px-4 md:px-8 mx-auto max-w-5xl">
        {children}
      </main>
    </div>
  );
}