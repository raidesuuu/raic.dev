import React from 'react';
import * as ContactComponent from '@components/Contact';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <ContactComponent.default />
    </div>
  );
};

export default Contact;
