import { Tooltip, TooltipProps } from '@rneui/base';
import { useState } from 'react';

export const ControlledTooltip: React.FC<TooltipProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
};
