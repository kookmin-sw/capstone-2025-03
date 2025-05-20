// src/components/onboarding/CustomTooltip.tsx
import { TooltipRenderProps } from 'react-joyride';
import { Button, Stack, Typography } from '@mui/material';

export default function CustomTooltip({
  step,
  index,
  continuous,
  backProps,
  primaryProps,
  closeProps,
}: TooltipRenderProps) {
  return (
    <Stack sx={{ backgroundColor: '#fff', p: 2, borderRadius: 2 }} spacing={2}>
      <Typography>{step.content}</Typography>
      <Stack direction="row" justifyContent="space-between">
        {index > 0 && <Button {...backProps}>이전</Button>}
        {continuous && <Button {...primaryProps}>다음</Button>}
        {!continuous && <Button {...closeProps}>닫기</Button>}
      </Stack>
    </Stack>
  );
}
