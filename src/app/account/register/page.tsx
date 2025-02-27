"use client";

import React, { useRef, useState } from "react";
import { auth } from "@util/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Login: React.FC = () => {
  const noticeRef = useRef<HTMLLabelElement | null>(null);

  const [accountEmail, setEmail] = useState("");
  const [accountPassword, setPassword] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) window.location.pathname = "/account/panel";
  });

  const loginClicked = async () => {
    if (!noticeRef.current) return;
    const notice = noticeRef.current;
    createUserWithEmailAndPassword(auth, accountEmail, accountPassword)
      .then(() => {
        window.location.pathname = "/account/panel";
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (errorCode == "auth/email-already-in-use") {
          notice.textContent = "このメールアドレスは既に使用されています";
        } else if (errorCode == "auth/weak-password") {
          notice.textContent = "パスワードは6文字以上である必要があります";
        } else if (errorCode == "auth/invalid-email") {
          notice.textContent = "メールアドレスが無効です";
        }  else {
          notice.textContent = `その他のエラー: ${errorContent}`;
        }
      });
  };

  return (
    <div className="mt-16">
      <div className="md:hidden"></div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button variant={"ghost"} asChild className={cn("absolute right-4 top-4 md:right-8 md:top-8")}>
          <Link href="/account/login">ログイン</Link>
        </Button>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            UpLauncher
          </div>
          {/* <div className="relative z-20 mt-auto">
            <p className="text-lg">この認証ページはベータ版です。</p>
          </div> */}
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">アカウントを作成</h1>
              <p className="text-sm text-muted-foreground">Rai Chat などのための新しいアカウントを作成します。</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground" htmlFor="email">
                メールアドレス
              </Label>
              <Input id="email" type="email" placeholder="mail@example.com" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground" htmlFor="password">
                パスワード
              </Label>
              <Input id="password" type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Label ref={noticeRef} className="text-red-500"></Label>
            <Button type="submit" className="w-full" onClick={loginClicked}>
              アカウントを作成
            </Button>
            <p className="px-2 text-center text-sm text-muted-foreground">
              このサイトにアカウント登録をすると、{" "}
              <Link href="/infomation/terms" className="underline underline-offset-4 hover:text-primary">
                利用規約
              </Link>{" "}
              と{" "}
              <Link href="/infomation/privacy" className="underline underline-offset-4 hover:text-primary">
                プライバシーポリシー
              </Link>{" "}
              に同意したことになります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
