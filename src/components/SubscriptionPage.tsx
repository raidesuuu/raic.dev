import React, { useEffect, useRef } from "react";
import { useSubscriptionData } from "@/util/useSubscriptionData";
import { SubscriptionDataInterface } from "@/util/firebaseConfig";
import Loading from "@/app/loading";

const SubscriptionDetails: React.FC<{ data: SubscriptionDataInterface; formRef: React.RefObject<HTMLFormElement> }> = ({ data, formRef }) => {
  const getPlanName = (plan: string) => {
    if (plan.includes("pro")) {
      return "Pro";
    } else if (plan.includes("premiumPlus")) {
      return "プレミアムプラス";
    } else if (plan.includes("premium")) {
      return "プレミアム";
    } else {
      return "無料";
    }
  };

  const planName = getPlanName(data.plan);

  if (planName === "無料") {
    return null;
  }

  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.display = "none";
    }
  }, []);

  return (
    <div className="p-4 mb-4 text-base mt-6 rounded-lg bg-gray-900 text-green-400" role="alert">
      <p className="text-xl lg:text-2xl">{planName}はアクティブです</p>
      <p>
        Stripeでの購入が完了したか、あなたの特典申請リクエストは承認されました。
        <br />
        {planName}をご購入いただき、ありがとうございます。
      </p>
    </div>
  );
};

const SubscriptionPage: React.FC = () => {
  const { subscriptionData, loading, authToken } = useSubscriptionData();
  const formRef = useRef<HTMLFormElement>(null);

  console.log(subscriptionData);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-4xl lg:text-6xl font-bold mb-4">サブスクリプション</h1>
      <p className="text-lg lg:text-xl mb-8 max-w-5xl">プレミアムの購入とサブスクリプションの管理</p>

      <h2 className="text-2xl lg:text-3xl font-bold mb-5">プレミアムを購入する</h2>
      <p className="text-base lg:text-lg mb-8 max-w-5xl">
        GitHub SponsorsまたはStripeで、プレミアム以上のランクを購入してください。
        <br />
        サブスクリプション(ランク)についての詳細は
        <a href="/category/infomation/ranks.html" className="underline text-blue-400">
          こちら
        </a>
        をご覧ください。
        <br />
        <br />
        サブスクリプションを購入すると、
        <a href="https://raic.dev/category/infomation/purchaser-tos.html" className="underline text-blue-400">
          購入者の利用規約
        </a>
        に同意したことになります。
      </p>

      <form ref={formRef} className="mb-3" method="post" action="http://api.raic.dev/stripe/create-checkout-session">
        <h2 className="text-2xl lg:text-3xl font-bold mb-5">Stripeで購入する</h2>

        <h3 className="text-xl lg:text-2xl mb-3 font-bold">期間を選択</h3>
        <div className="mb-4">
          <input aria-label="月間" type="radio" defaultChecked id="selectPlan_monthly" name="selectPeriod" value="monthly" />
          <label htmlFor="selectPlan_monthly" className="ml-2">
            一か月
          </label>
          <input aria-label="年間" type="radio" id="selectPlan_yearly" name="selectPeriod" value="yearly" className="ml-4" />
          <label htmlFor="selectPlan_yearly" className="ml-2">
            一年
            <span className="ml-3 text-xs font-medium px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-300">割引あり</span>
          </label>
        </div>

        <h3 className="text-xl lg:text-2xl mb-3 font-bold">プランを選択</h3>

        <p className="text-base lg:text-lg mb-3 max-w-5xl">「50OFFSTRIPE」を使うと50%オフでプレミアムプラスとProを入手できます！</p>

        <input type="hidden" name="FB_AUTH_TOKEN" value={authToken || ""} />

        <select aria-label="プラン選択" name="selectPlan" className="border mb-3 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <option value="premium">プレミアム</option>
          <option value="premiumPlus">プレミアムプラス</option>
          <option value="pro">Pro</option>
        </select>

        <input className="button primary is-primary w-full lg:w-auto" type="submit" value="購入" />
      </form>

      {subscriptionData && <SubscriptionDetails data={subscriptionData} formRef={formRef} />}
    </div>
  );
};

export default function SubscriptionPageWithSuspense() {
  return <SubscriptionPage />;
}
