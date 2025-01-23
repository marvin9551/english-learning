import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <h1 className="text-4xl font-bold">欢迎来到英语学习平台</h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          这是一个帮助你提升英语水平的学习平台。通过系统化的学习方法和丰富的练习资源，让英语学习变得更加高效和有趣。
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-8 sm:px-10"
            href="/login"
          >
            立即开始
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-8 sm:px-10"
            href="/learn"
          >
            了解更多
          </Link>
        </div>
      </main>
      <footer className="row-start-3 text-sm text-muted-foreground">
        © 2024 英语学习平台. 保留所有权利。
      </footer>
    </div>
  );
}
