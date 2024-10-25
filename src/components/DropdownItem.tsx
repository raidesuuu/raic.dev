import React from 'react';
import { Link } from 'react-router-dom';

interface DdItemProps {
  content: string;
  url: string;
}

const DropdownItem: React.FC<DdItemProps> = ({
  content,
  url
}) => {

  return (
    <Link to={url} className="block px-4 py-2 dd-item hover:bg-gray-600 hover:text-blue-200">{content}</Link>
  );
};

export default DropdownItem;
