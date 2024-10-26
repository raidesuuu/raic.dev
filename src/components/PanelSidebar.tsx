import React from 'react';

const PanelSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">メニュー</h2>
            </div>
            <nav className="flex flex-col space-y-4">
                <a href="#" className="text-lg hover:bg-gray-700 rounded py-2 px-4">
                    ホーム
                </a>
                <a href="#" className="text-lg hover:bg-gray-700 rounded py-2 px-4">
                    サブスクリプション
                </a>
                <a href="#" className="text-lg hover:bg-gray-700 rounded py-2 px-4">
                    セキュリティ
                </a>
            </nav>
        </aside>
    );
};

export default PanelSidebar;
