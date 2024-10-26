"use client"

import React, { useEffect, useRef, useState } from 'react';
import { auth } from "@/util/firebaseConfig"
import { signInWithEmailAndPassword, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';

const Login: React.FC = () => {
    const noticeRef = useRef<HTMLParagraphElement | null>(null);
    const dialogPromiseRef = useRef<{ resolve: (value: string) => void } | null>(null);

    const [twoFaCode, setTwoFaCode] = useState(''); // 2FAコードの状態
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [accountEmail, setEmail] = useState("")
    const [accountPassword, setPassword] = useState("")

    auth.onAuthStateChanged((user) => {
        if (user) window.location.pathname = "/account/panel/";
    })
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

    const loginClicked = async () => {
        if (!noticeRef.current) return;
        const notice = noticeRef.current;
        signInWithEmailAndPassword(auth, accountEmail, accountPassword)
            .then(() => {
                window.location.pathname = "/account/panel/"
            })
            .catch(async (error) => {
                const errorCode = error.code
                const errorContent = error.message

                if (errorCode == 'auth/user-not-found') {
                    notice.textContent = "ユーザーが見つかりませんでした"
                } else if (errorCode == 'auth/invalid-password' || errorCode == 'auth/invalid-credential') {
                    notice.textContent = 'メールアドレスかパスワードが間違っています'
                } else if (errorCode == 'auth/multi-factor-auth-required') {
                    const mfaResolver = getMultiFactorResolver(auth, error)

                    const resolver = getMultiFactorResolver(auth, error)

                    // Ask user which second factor to use.
                    if (resolver.hints[0].factorId === TotpMultiFactorGenerator.FACTOR_ID) {
                        const tfaCode = await request2FaCode();
                        if (!tfaCode) return;
                        const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(mfaResolver.hints[0].uid, tfaCode)
                        try {
                            await mfaResolver.resolveSignIn(multiFactorAssertion).then(() => {
                                window.location.pathname = "/account/panel/"
                            })
                        } catch (e) {
                            notice.textContent = '無効な認証コードです。もう一度お試しください。'
                        }
                    }
                } else if (errorCode == 'auth/too-many-requests') {
                    notice.textContent = "短時間にリクエストを送信しすぎています。しばらく待ってからお試しください"
                } else if (errorCode == 'auth/invalid-email') {
                    notice.textContent = "メールアドレスが無効です"
                } else if (errorCode == 'auth/user-disabled') {
                    notice.textContent = 'このアカウントは無効になっています'
                } else {
                    notice.textContent = `その他のエラー: ${errorContent}`
                }
            })
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="flex items-center justify-center h-screen">
                <div className="flex text-center pb-3 pt-3 pr-3 pl-3 bg-gray-800">
                    <div className="bg-gradient-to-r from-purple-300 to-blue-800 w-96 mr-3">
                    </div>
                    <div className="pt-5 pr-5 pl-5 pb-5">
                        <h1 className="text-6xl font-bold mb-4">ログイン</h1>
                        <p className="text-xl mb-8 max-w-xl">
                            雷のアカウントにサインインします。
                        </p>

                        <input
                            type="text"
                            placeholder="あなたのメールアドレス"
                            onChange={(e) => setEmail(e.target.value)}
                            value={accountEmail}
                            className="bg-gray-800 text-white rounded-full mb-3 border-4 border-gray-700 py-1 pl-3 pr-3"
                        /><br />

                        <input
                            type="password"
                            placeholder="パスワード"
                            onChange={(e) => setPassword(e.target.value)}
                            value={accountPassword}
                            className="bg-gray-800 text-white rounded-full border-4 border-gray-700 mb-3 py-1 pl-3 pr-3"
                        /><br />

                        <p className="text-base mb-8" ref={noticeRef}>
                        </p>

                        <button type="button" className="button primary" onClick={loginClicked}>ログイン</button>
                    </div>
                </div>
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 bg-opacity-50 absolute inset-0"></div>
                    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 z-10 w-96">
                        <h2 className="text-xl font-bold mb-4">二段階認証が必要です</h2>
                        <input
                            type="text"
                            value={twoFaCode}
                            onChange={(e) => setTwoFaCode(e.target.value)} // 入力のたびに状態を更新
                            placeholder="認証アプリのコード"
                            className="border border-gray-300 bg-gray-700 p-2 rounded w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={closeDialog}
                                className="button secondary"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={closeDialog} // ここでコードを確定して閉じる
                                className="button primary"
                            >
                                続行
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
