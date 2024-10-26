"use client";

import React, { useEffect, useRef } from "react";
import PanelSidebar from "@/components/PanelSidebar";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore, SubscriptionDataInterface } from "@util/firebaseConfig";
import { getPlan } from "@util/rai";

const Login: React.FC = () => {
  const subscriptionStateRef = useRef<HTMLDivElement | null>(null);
  const subscriptionHeaderRef = useRef<HTMLParagraphElement | null>(null);
  const subscriptionBodyRef = useRef<HTMLParagraphElement | null>(null);
  const authTokenRef = useRef<HTMLInputElement | null>(null);
  const checkoutCreateForm = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const args = new URLSearchParams(window.location.search);
    if (args.get("return") == "failed") {
      subscriptionStateRef.current!.classList.remove("text-green-400")
      subscriptionStateRef.current!.classList.add("text-red-400")
      subscriptionStateRef.current!.classList.remove("hidden")
      subscriptionHeaderRef.current!.textContent = "何らかの理由でサブスクリプションの付与に失敗しました"
      subscriptionBodyRef.current!.innerHTML = "サブスクリプションの付与に失敗しました。運営に以下のエラーコードを伝えてください。(注: session_usedの場合は報告しないでください)<br>エラーコード: " + args.get("error")
    }

    if (subscriptionBodyRef.current && subscriptionHeaderRef.current && subscriptionStateRef.current && checkoutCreateForm.current && authTokenRef.current) {
      auth.onAuthStateChanged(async (user) => {
        if (user === null) {
          window.location.pathname = "/account/login/";
          return;
        }

        authTokenRef.current!.value = await user.getIdToken();

        const query = await getDoc(doc(firestore, "subscription-state", user.uid));
        const userData = query.data() as SubscriptionDataInterface;
        if (!query.exists()) return;

        if (getPlan(userData.plan) != "free") {
          checkoutCreateForm.current!.style.display = "none";

          subscriptionStateRef.current!.classList.remove("hidden")
          switch (getPlan(userData.plan)) {
            case 'pro':
              subscriptionHeaderRef.current!.textContent = 'Proはアクティブです'
              subscriptionBodyRef.current!.innerHTML = 'あなたの特典申請リクエストは承認されました。<br>Proをご購入いただき、ありがとうございます。'
              break
            case 'premiumplus':
              subscriptionHeaderRef.current!.textContent = 'プレミアムプラスはアクティブです'
              subscriptionBodyRef.current!.innerHTML = 'あなたの特典申請リクエストは承認されました。<br>プレミアムプラスをご購入いただき、ありがとうございます。'
              break
            case 'premium':
              subscriptionHeaderRef.current!.textContent = 'プレミアムはアクティブです'
              subscriptionBodyRef.current!.innerHTML = 'あなたの特典申請リクエストは承認されました。<br>プレミアムをご購入いただき、ありがとうございます。'
              break
          }
          if (userData.isStaff) {
            subscriptionHeaderRef.current!.textContent = 'スタッフ権限がアクティブです'
            subscriptionBodyRef.current!.innerHTML = 'あなたは、UpLauncherチームのスタッフです。'
          }
          if (userData.isStudent) {
            subscriptionHeaderRef.current!.textContent = '学生プランがアクティブです'
            subscriptionBodyRef.current!.innerHTML = 'あなたは、学生であるため、プレミアムプラスの特典が利用できます。'
          }
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-gray-950 text-white p-8">
      <PanelSidebar />
      <div className="flex-grow w-full p-8 h-screen ml-8 bg-gray-800">
        <h1 className="text-6xl font-bold mb-4">サブスクリプション</h1>
        <p className="text-xl mb-8 max-w-5xl">プレミアムの購入とサブスクリプションの管理</p>
        <h2 className="text-3xl font-bold mb-5">プレミアムを購入する</h2>
        <p className="text-lg mb-8 max-w-5xl">
          GitHub SponsorsまたはStripeで、プレミアム以上のランクを購入してください。
          <br />
          サブスクリプション(ランク)についての詳細は<a href="/category/infomation/ranks.html">こちら</a>をご覧ください。
          <br />
          <br />
          サブスクリプションを購入すると、<a href="https://raic.tech/category/infomation/purchaser-tos.html">購入者の利用規約</a>に同意したことになります。
        </p>

        <form ref={checkoutCreateForm} className="mb-3" method="post" action="http://api.raic.tech/stripe/create-checkout-session">
          <h2 className="text-3xl font-bold mb-5">Stripeで購入する</h2>
          <h2 className="text-2xl mb-3 font-bold">期間を選択</h2>
          <div>
            <input aria-label="月間" type="radio" defaultChecked id="selectPlan_monthly" name="selectPeriod" value="monthly" />
            <label htmlFor="selectPeriod_monthly">一か月</label>&nbsp;
            <input aria-label="年間" type="radio" id="selectPlan_yearly" name="selectPeriod" value="yearly" />
            <label htmlFor="selectPeriod_yearly">
              一年<span className="ml-3 text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-300">割引あり</span>
            </label>
          </div>
          <br />

          <h2 className="text-2xl mb-3 font-bold">プランを選択</h2>

          <p className="text-lg mb-3 max-w-5xl">「50OFFSTRIPE」を使うと50%オフでプレミアムプラスとProを入手できます！</p>

          <input ref={authTokenRef} type="hidden" name="FB_AUTH_TOKEN" value="" />

          <select aria-label="プラン選択" name="selectPlan" className="border mb-3 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
            <option value="premium">プレミアム</option>
            <option value="premiumPlus">プレミアムプラス</option>
            <option value="pro">Pro</option>
          </select>

          <input className="button primary is-primary" type="submit" value="購入" />
        </form>

        <h2 className="text-3xl font-bold mb-5">Stripeのサブスクリプションを管理する</h2>

        <a aria-label="サブスクリプションの管理" className="button secondary" target="_blank" rel="noopener noreferrer" href="https://billing.stripe.com/p/login/8wM3d63qXeic1WgfYY">
          Stripeでサブスクリプションを管理
        </a>

        <div ref={subscriptionStateRef} className="p-4 mb-4 text-base mt-6 rounded-lg hidden bg-gray-900 text-green-400" role="alert">
          <p className="text-2xl" ref={subscriptionHeaderRef}>
            Success alert!
          </p>
          <p ref={subscriptionBodyRef}>Change a few things up and try submitting again.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
