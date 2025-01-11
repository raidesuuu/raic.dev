import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaCheck, FaXmark } from "react-icons/fa6";

const PatchNote: React.FC = () => {
  const invoices = [
    {
      feature: "優先サポート",
      premium: true,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "お手紙の編集",
      premium: true,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "認証される",
      premium: true,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "Markdown+",
      premium: true,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "API の基本アクセス",
      premium: true,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "登場予定の機能",
      premium: false,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "メッセージの強調表示",
      premium: false,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "API の詳細アクセス",
      premium: false,
      premiumPlus: true,
      pro: true,
    },
    {
      feature: "新しい Rai Chat",
      premium: false,
      premiumPlus: false, 
      pro: true,
    },
    {
      feature: "ファイルのアップロード",
      premium: false,
      premiumPlus: false, 
      pro: true,
    },
    {
      feature: "API の無制限利用",
      premium: false,
      premiumPlus: false,
      pro: true,
    },
  ];

  return (
    <div className="min-h-screen mt-16 p-8">
      <h1 className="text-4xl font-bold mb-4">サブスクリプション</h1>
      <p className="mb-6 text-lg leading-relaxed">
        {" "}
        雷のサブスクリプションは、<a href="https://github.com/sponsors/raidesuuu">GitHub Sponsors</a>とStripeで購入することができます。
        <br />
        サブスクリプションへ入ると、⇩の報酬を入手することができます。
        <br />
        <br />
        サブスクリプションを購入すると、<a href="/category/infomation/purchaser-tos.html">購入者の利用規約</a>に同意したことになります。
      </p>

      <Table className="size-1/3 text-base">
        <TableCaption>サブスクリプションの特典</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ランク</TableHead>
            <TableHead>プレミアム</TableHead>
            <TableHead>プレミアム+</TableHead>
            <TableHead>Pro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.feature}>
              <TableCell className="font-medium">{invoice.feature}</TableCell>
              <TableCell>{invoice.premium ? <FaCheck className="text-green-400"></FaCheck> : <FaXmark className="text-red-400"></FaXmark>}</TableCell>
              <TableCell>{invoice.premiumPlus ? <FaCheck className="text-green-400"></FaCheck> : <FaXmark className="text-red-400"></FaXmark>}</TableCell>
              <TableCell>{invoice.pro ? <FaCheck className="text-green-400"></FaCheck> : <FaXmark className="text-red-400"></FaXmark>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>価格</TableCell>
            <TableCell>¥500</TableCell>
            <TableCell>¥1000</TableCell>
            <TableCell>¥1500</TableCell>
          </TableRow>
          </TableFooter>
      </Table>
    </div>
  );
};

export default PatchNote;
