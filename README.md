This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

1. 환경변수 템플릿(`env.example`)을 복사해 로컬 전용 파일을 만듭니다.
   ```bash
   cp env.example .env.local
   ```
2. `.env.local`은 `.gitignore`에 포함되어 있으므로 깃허브에 업로드되지 않습니다.
3. 필요하다면 `NEXT_PUBLIC_API_URL` 값을 실제로 연결하고 싶은 서버 주소로 수정하세요.

## Getting Started

먼저 개발 서버를 실행합니다:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 결과를 확인할 수 있습니다.

`app/page.tsx` 파일을 수정해 바로 반영되는 화면을 확인할 수 있습니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
