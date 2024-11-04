/* eslint @typescript-eslint/no-explicit-any: off */
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { auth } from "@util/firebaseConfig";
import { EmailAuthProvider, getMultiFactorResolver, TotpMultiFactorGenerator, reauthenticateWithCredential, verifyBeforeUpdateEmail, updatePassword, onAuthStateChanged, multiFactor, TotpSecret } from "firebase/auth";
import PanelSidebar from "@/components/PanelSidebar";
import qrcode from "qrcode";
import LoadingScreen from "@/components/Loading";

const Login: React.FC = () => {
  const welcomeRef = useRef<HTMLHeadingElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLHeadingElement | null>(null);
  const noticeRef = useRef<HTMLParagraphElement | null>(null);
  const noticePasswordRef = useRef<HTMLParagraphElement | null>(null);
  const noticeTFARef = useRef<HTMLParagraphElement | null>(null);
  const tfaContainerRef = useRef<HTMLDivElement | null>(null);
  const qrCodeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tfaSecretRef = useRef<HTMLParagraphElement | null>(null);
  const tfaActivateRef = useRef<HTMLButtonElement | null>(null);
  const dialogPromiseRef = useRef<{ resolve: (value: string) => void } | null>(null);

  const [totpSecret, setTotpSecret] = useState({} as TotpSecret);
  const [nextStep, setNextStep] = useState(false);

  const [twoFaCode, setTwoFaCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountEmail, setEmail] = useState("");
  const [accountPassword, setPassword] = useState("");
  const [accountNewPassword, setNewPassword] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.pathname = "/account/login";
        return;
      }
      if (multiFactor(user).enrolledFactors.length > 0 && noticeTFARef.current) {
        multiFactor(user).enrolledFactors.forEach((mf) => {
          console.log(mf);
        });
        noticeTFARef.current.textContent = "二段階認証は有効になっています！";
      }
      loadingRef.current?.classList.add("hidden");
      mainRef.current?.classList.remove("hidden");
      mainRef.current?.classList.add("flex");
      if (welcomeRef.current) {
        welcomeRef.current.textContent = auth.currentUser?.displayName ? `${auth.currentUser?.displayName} さん、こんにちは！` : "名無しさん、こんにちは！";
      }
    });
  }, []);

  const emailChangeClicked = async () => {
    if (!noticeRef.current) return;
    const notice = noticeRef.current;
    if (!accountPassword && !accountEmail) {
      notice.textContent = "すべてのフィールドを入力してください";
      return;
    }
    reauthenticateWithCredential(auth.currentUser!, EmailAuthProvider.credential(auth.currentUser?.email || "", accountPassword))
      .then(() => {
        verifyBeforeUpdateEmail(auth.currentUser!, accountEmail)
          .then(() => {
            notice.innerHTML = "メールアドレスの変更を完了するには、新しいメールアドレスを認証する必要があります。\n新しいメールアドレスのメールボックスを確認してください。";
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              notice.innerHTML = "このメールアドレスは既に使用されています。";
            } else if (error.code === "auth/invalid-email") {
              notice.innerHTML = "無効なメールアドレスです。";
            } else if (error.code === "auth/operation-not-allowed") {
              notice.innerHTML = "メールアドレスを変更するには、現在のメールアドレスを確認する必要があります。";
            }
          });
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (errorCode == "auth/invalid-password" || errorCode == "auth/invalid-credential") {
          notice.textContent = "メールアドレスかパスワードが間違っています";
        } else if (errorCode === "auth/email-already-in-use") {
          notice.textContent = "このメールアドレスは既に使用されています。";
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
                verifyBeforeUpdateEmail(auth.currentUser!, accountEmail)
                  .then(() => {
                    notice.innerHTML = "メールアドレスの変更を完了するには、新しいメールアドレスを認証する必要があります。\n新しいメールアドレスのメールボックスを確認してください。";
                  })
                  .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                      notice.innerHTML = "このメールアドレスは既に使用されています。";
                    } else if (error.code === "auth/invalid-email") {
                      notice.innerHTML = "無効なメールアドレスです。";
                    } else if (error.code === "auth/operation-not-allowed") {
                      notice.innerHTML = "メールアドレスを変更するには、現在のメールアドレスを確認する必要があります。";
                    }
                  });
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
        } else {
          notice.textContent = `その他のエラー: ${errorContent}`;
        }
      });
  };

  const passwordChangeClicked = async () => {
    if (!noticePasswordRef.current) return;
    const notice = noticePasswordRef.current;
    if (!accountPassword && !accountNewPassword) {
      notice.textContent = "すべてのフィールドを入力してください";
      return;
    }
    reauthenticateWithCredential(auth.currentUser!, EmailAuthProvider.credential(auth.currentUser?.email || "", accountPassword))
      .then(() => {
        updatePassword(auth.currentUser!, accountNewPassword)
          .then(() => {
            notice.textContent = "パスワードが変更されました";
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/invalid-password") {
              notice.textContent = "パスワードが無効です。もう一度お試しください。";
            } else if (errorCode === "auth/weak-password") {
              notice.textContent = "パスワードは6文字以上である必要があります";
            } else {
              notice.textContent = "エラーが発生しました: " + errorMessage;
            }
          });
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (errorCode == "auth/invalid-password" || errorCode == "auth/invalid-credential") {
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
              setTwoFaCode("");
              await mfaResolver.resolveSignIn(multiFactorAssertion).then(() => {
                updatePassword(auth.currentUser!, accountNewPassword);
                notice.textContent = "パスワードが変更されました";
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
        } else {
          notice.textContent = `その他のエラー: ${errorContent}`;
        }
      });
  };

  const disableTfa = async () => {
    if (!noticeTFARef.current) return;
    const notice = noticeTFARef.current;
    if (!accountPassword) {
      notice.textContent = "パスワードを入力してください";
      return;
    }

    try {
      await reauthenticateWithCredential(auth.currentUser!, EmailAuthProvider.credential(auth.currentUser!.email || "", accountPassword));
    } catch (error: any) {
      if (error.code === "auth/multi-factor-auth-required") {
        // ここで多要素認証を要求する処理を追加
        const mfaResolver = getMultiFactorResolver(auth, error);
        if (multiFactor(auth.currentUser!).enrolledFactors[0].factorId === TotpMultiFactorGenerator.FACTOR_ID) {
          // TOTPによる認証を処理
          const tfaCode = await request2FaCode(); // ユーザーにTOTPコードを入力してもらう
          if (!tfaCode) return;

          const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(multiFactor(auth.currentUser!).enrolledFactors[0].uid, tfaCode);
          try {
            await mfaResolver.resolveSignIn(multiFactorAssertion);
            await multiFactor(auth.currentUser!)
              .unenroll(multiFactor(auth.currentUser!).enrolledFactors[0].uid)
              .then(() => {
                notice.textContent = "2段階認証が無効になりました！";
              });
          } catch (e) {
            console.log(e);
            notice.textContent = "無効な認証コードです。もう一度お試しください。";
          }
        }
      } else {
        notice.textContent = "エラーが発生しました: " + error.message;
      }
    }
  };

  const tfaCodeClicked = async () => {
    if (!noticeTFARef.current) return;
    const notice = noticeTFARef.current;
    if (!accountPassword) {
      notice.textContent = "パスワードを入力してください";
      return;
    }
    if (multiFactor(auth.currentUser!).enrolledFactors.length > 0) {
      disableTfa();
      return;
    }
    if (nextStep) {
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, twoFaCode);
      await multiFactor(auth.currentUser!)
        .enroll(multiFactorAssertion, "TOTP")
        .then(() => {
          notice.textContent = "多要素認証が有効になりました";
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode == "auth/invalid-verification-code") {
            notice.textContent = "コードが間違っています";
          }
        });
    } else {
      reauthenticateWithCredential(auth.currentUser!, EmailAuthProvider.credential(auth.currentUser?.email || "", accountPassword))
        .then(async (credential) => {
          const multiFactorSession = await multiFactor(credential.user).getSession();
          const tfaSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);

          if (tfaSecretRef.current && qrCodeCanvasRef.current && tfaContainerRef.current) {
            tfaContainerRef.current.classList.remove("hidden");
            tfaSecretRef.current.textContent = "シークレットキー: " + tfaSecret.secretKey;

            setNextStep(true);

            setTotpSecret(tfaSecret);

            const qrCode = new URL(`otpauth://totp/UpLauncher?secret=${tfaSecret.secretKey}&issuer=UpLauncher`);

            qrcode.toCanvas(qrCodeCanvasRef.current, qrCode.toString(), (error) => {
              if (error) {
                console.error(error);
              }
            });
          }
        })
        .catch(async (error) => {
          const errorCode = error.code;
          const errorContent = error.message;

          if (errorCode == "auth/invalid-password" || errorCode == "auth/invalid-credential") {
            notice.textContent = "メールアドレスかパスワードが間違っています";
          } else if (errorCode == "auth/too-many-requests") {
            notice.textContent = "短時間にリクエストを送信しすぎています。しばらく待ってからお試しください";
          } else {
            notice.textContent = `その他のエラー: ${errorContent}`;
          }
        });
    }
  };

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

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Suspense fallback={<LoadingScreen />}>
        <div ref={mainRef} className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-950 text-white p-4 lg:p-8">
          <PanelSidebar />
          {/* Main Content */}
          <div className="flex-grow w-full p-4 lg:p-8 h-full lg:h-screen bg-gray-800 ml-0 lg:ml-8">
            <h1 className="text-3xl lg:text-6xl font-bold mb-4">こんにちは！</h1>
            <p className="text-lg lg:text-xl mb-8 max-w-5xl">
              このパネルでは、メールアドレスやパスワードを管理したり、サブスクリプションの管理などができます。
              <br />
              <small>ちなみにパスワードボックスは同期されるよ（笑）</small>
              <button className="button bg-blue-300 mt-4" onClick={() => auth.signOut()}>
                ログアウト
              </button>
            </p>

            {/* Flex Row for Email and Password Section */}
            <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-10">
              {/* Email Section */}
              <div className="lg:w-2/4">
                <h2 className="text-3xl font-bold mb-4">メールアドレスを変更</h2>
                <input type="text" placeholder="新しいメールアドレス" onChange={(e) => setEmail(e.target.value)} value={accountEmail} className="bg-gray-800 text-white rounded-full mb-3 border-4 border-gray-700 py-1 px-3 w-full" />
                <input type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} value={accountPassword} className="bg-gray-800 text-white rounded-full border-4 border-gray-700 mb-3 py-1 px-3 w-full" />
                <p className="text-base mb-8" ref={noticeRef}>
                  注: 二段階認証を設定している場合はアプリの認証コードが求められます
                </p>
                <button type="button" className="button primary" onClick={emailChangeClicked}>
                  変更する
                </button>
              </div>

              {/* Password Section */}
              <div className="lg:w-2/4">
                <h2 className="text-3xl font-bold mb-4">パスワードを変更</h2>
                <input type="password" placeholder="現在のパスワード" onChange={(e) => setPassword(e.target.value)} value={accountPassword} className="bg-gray-800 text-white rounded-full border-4 border-gray-700 mb-3 py-1 px-3 w-full" />
                <input type="password" placeholder="新しいパスワード" onChange={(e) => setNewPassword(e.target.value)} value={accountNewPassword} className="bg-gray-800 text-white rounded-full border-4 border-gray-700 mb-3 py-1 px-3 w-full" />
                <p className="text-base mb-8" ref={noticePasswordRef}>
                  注: 二段階認証を設定している場合はアプリの認証コードが求められます
                </p>
                <button type="button" className="button primary mb-5" onClick={passwordChangeClicked}>
                  変更する
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="lg:w-2/4 mt-8">
              <h2 className="text-3xl font-bold mb-4">二段階認証の設定</h2>
              <input type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} value={accountPassword} className="bg-gray-800 text-white rounded-full border-4 border-gray-700 mb-3 py-1 px-3 w-full" />
              <div ref={tfaContainerRef} className="hidden">
                <canvas ref={qrCodeCanvasRef}></canvas>
                <p className="text-base mb-2" ref={tfaSecretRef}></p>
                <input type="password" placeholder="二段階認証コード" onChange={(e) => setTwoFaCode(e.target.value)} value={twoFaCode} className="bg-gray-800 text-white rounded-full border-4 border-gray-700 py-1 px-3 w-full" />
              </div>
              <p className="text-base mb-3" ref={noticeTFARef}></p>
              <button type="button" className="button primary mb-5" ref={tfaActivateRef} onClick={tfaCodeClicked}>
                続ける
              </button>
            </div>
          </div>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-75 absolute inset-0"></div>
            <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 z-10 w-11/12 sm:w-96">
              <h2 className="text-xl font-bold mb-4">二段階認証が必要です</h2>
              <input type="text" value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)} placeholder="認証アプリのコード" className="border border-gray-300 bg-gray-700 p-2 rounded w-full mb-4" />
              <div className="flex justify-end space-x-4">
                <button onClick={closeDialog} className="button secondary">
                  キャンセル
                </button>
                <button onClick={closeDialog} className="button primary">
                  続行
                </button>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default Login;
