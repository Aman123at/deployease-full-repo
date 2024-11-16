import { FC, useState } from 'react';
import { ITooltipProps } from '../interfaces/commonInterface';

const Tooltip:FC<ITooltipProps> = ({ tooltipText,children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative flex items-center">
      <span
        className="inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>
      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-800 rounded-md shadow-lg">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default Tooltip;