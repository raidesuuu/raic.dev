"use client";

import React, { useRef, useState } from "react";
import { auth } from "@util/firebaseConfig";
import { signInWithEmailAndPassword, getMultiFactorResolver, TotpMultiFactorGenerator, signInWithPopup, GoogleAuthProvider, OAuthProvider, GithubAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa";

const Login: React.FC = () => {
  const noticeRef = useRef<HTMLLabelElement | null>(null);
  const dialogPromiseRef = useRef<{ resolve: (value: string) => void } | null>(null);

  const [twoFaCode, setTwoFaCode] = useState(""); // 2FAコードの状態
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountEmail, setEmail] = useState("");
  const [accountPassword, setPassword] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) window.location.pathname = "/account/panel";
  });
  const request2FaCode = () => {
    return new Promise<string>((resolve) => {
      // ダイアログを開く
      setIsDialogOpen(true);
      // ダイアログを閉じたときに resolve する
      dialogPromiseRef.current = { resolve };
    });
  };

  // ダイアログを閉じる処理
  const closeDialog = () => {
    setIsDialogOpen(false);
    if (dialogPromiseRef.current) {
      // ダイアログが閉じたら入力された2FAコードをresolveで返す
      dialogPromiseRef.current.resolve(twoFaCode);
      dialogPromiseRef.current = null;
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.pathname = "/account/panel";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;
        if (noticeRef.current) {
          noticeRef.current.textContent = errorContent + " (エラーコード: " + errorCode + ")";
        }
      });
  };

  const signInWithMicrosoft = () => {
    const provider = new OAuthProvider("microsoft.com");
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.pathname = "/account/panel";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;
        if (noticeRef.current) {
          noticeRef.current.textContent = errorContent + " (エラーコード: " + errorCode + ")";
        }
      });
  };


  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.pathname = "/account/panel";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;
        if (noticeRef.current) {
          noticeRef.current.textContent = errorContent + " (エラーコード: " + errorCode + ")";
        }
      });
  };

  const loginClicked = async () => {
    if (!noticeRef.current) return;
    const notice = noticeRef.current;
    signInWithEmailAndPassword(auth, accountEmail, accountPassword)
      .then(() => {
        window.location.pathname = "/account/panel";
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (errorCode == "auth/user-not-found") {
          notice.textContent = "ユーザーが見つかりませんでした";
        } else if (errorCode == "auth/invalid-password" || errorCode == "auth/invalid-credential") {
          notice.textContent = "メールアドレスかパスワードが間違っています";
        } else if (errorCode == "auth/multi-factor-auth-required") {
          const mfaResolver = getMultiFactorResolver(auth, error);

          const resolver = getMultiFactorResolver(auth, error);

          // Ask user which second factor to use.
          if (resolver.hints[0].factorId === TotpMultiFactorGenerator.FACTOR_ID) {
            const tfaCode = await request2FaCode();
            if (!tfaCode) return;
            const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(mfaResolver.hints[0].uid, tfaCode);
            try {
              await mfaResolver.resolveSignIn(multiFactorAssertion).then(() => {
                window.location.pathname = "/account/panel";
              });
            } catch (e) {
              console.log(e);
              notice.textContent = "無効な認証コードです。もう一度お試しください。";
            }
          }
        } else if (errorCode == "auth/too-many-requests") {
          notice.textContent = "短時間にリクエストを送信しすぎています。しばらく待ってからお試しください";
        } else if (errorCode == "auth/invalid-email") {
          notice.textContent = "メールアドレスが無効です";
        } else if (errorCode == "auth/user-disabled") {
          notice.textContent = "このアカウントは無効になっています";
        } else {
          notice.textContent = `その他のエラー: ${errorContent}`;
        }
      });
  };

  return (
    <div className="mt-16">
      <div className="md:hidden"></div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button variant={"ghost"} asChild className={cn("absolute right-4 top-4 md:right-8 md:top-8")}>
          <Link href="/account/register">アカウントの作成</Link>
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
              <h1 className="text-2xl font-semibold tracking-tight">ログイン</h1>
              <p className="text-sm text-muted-foreground">アカウント情報を入力して、ログインします。</p>
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
              ログイン
            </Button>
            <Separator />
            <div className="flex gap-x-2">
              <Button type="submit" className="w-full" onClick={() => signInWithGoogle()}>
                <FaGoogle />
              </Button>
              <Button type="submit" className="w-full" onClick={() => signInWithMicrosoft()}>
                <FaMicrosoft />
              </Button>
              <Button type="submit" className="w-full" onClick={() => signInWithGitHub()}>
                <FaGithub />
              </Button>
            </div>
            <p className="px-2 text-center text-sm text-muted-foreground">
              このサイトにログインすると、{" "}
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

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>二段階認証が必要です</AlertDialogTitle>
            <AlertDialogDescription>このアカウントは、2段階認証による追加の保護が付与されています。</AlertDialogDescription>
          </AlertDialogHeader>
          <Label className="text-muted-foreground" htmlFor="twoFaCode">
            二段階認証のコード
          </Label>
          <InputOTP maxLength={6} value={twoFaCode} onChange={(e) => setTwoFaCode(e)} required placeholder="123456">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={closeDialog}>続行</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
