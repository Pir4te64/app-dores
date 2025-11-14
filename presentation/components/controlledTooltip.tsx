import React, { useState } from 'react';
import { Tooltip, TooltipProps } from '@rneui/base';

type ControlledTooltipProps = TooltipProps & {
  children?: React.ReactNode;
};

export const ControlledTooltip: React.FC<ControlledTooltipProps> = (props) => {
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
