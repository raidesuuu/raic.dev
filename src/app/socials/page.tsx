import React from 'react';
import * as SocialComponent from '@components/Socials';

const Socials: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <SocialComponent.default />
    </div>
  );
};

export default Socials;
