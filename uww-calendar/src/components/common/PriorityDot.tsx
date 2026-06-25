import type React from 'react';
import type { Priority } from '../../types';
import { priorityDotStyle } from '../../data/utils';

interface PriorityDotProps {
  priority: Priority;
  size?: number;
  title?: string;
  style?: React.CSSProperties;
}

export default function PriorityDot({ priority, size, title, style: extra }: PriorityDotProps) {
  const style = priorityDotStyle(priority);
  if (size) {
    style.width = size;
    style.height = size;
  }
  return <span style={{ ...style, ...extra }} title={title} aria-label={`Priority ${priority}`} />;
}
