import React from "react";
import * as ContactComponent from "@components/Contact";

const Contacts: React.FC = () => {
  return (
    <div className="min-h-screen mt-16 p-8">
      <ContactComponent.default />
    </div>
  );
};

export default Contacts;
