import React from 'react';
import * as ContactComponent from '@components/Contact';

const Contacts: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <ContactComponent.default />
    </div>
  );
};

export default Contacts;
