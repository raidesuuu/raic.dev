import React from "react";
import Card from "./Card";

const Products: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-5 bold-h1" id="products">
        製品
      </h1>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Card title="VistaUpdater" subtitle="VistaUpdaterは、Windows Vistaを更新できるようにするソフトウェア" badge="🔥人気" href="https://vistaupdater.net/" />
        <Card title="Bolt+" subtitle="完全無料で、様々なモデルに対応して、日本語用の最適化がされたBolt" badge="💡注目" href="https://bolt.raic.dev/" />
        <Card title="VS Code RPC" subtitle="DiscordにVisual Studio Codeのステータスを表示するVS Codeのプラグイン" href="https://marketplace.visualstudio.com/items?itemName=theuplauncher.vscoderpc" />
      </div>

      <div className="flex flex-wrap space-x-4">
        <Card title="Purble" subtitle="Visual Studio Codeの青と紫のテーマ (Rehemeの後継)" href="https://marketplace.visualstudio.com/items?itemName=theuplauncher.purble" />
        <Card title="Bridder" subtitle="Xを改善するための拡張機能。XをTwitterに変える機能も搭載" badge="📦新バージョン" href="https://github.com/UpLauncher/Bridder" />
      </div>
    </div>
  );
};

export default Products;
