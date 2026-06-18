import type { Priority } from '../../types';
import { priorityDotStyle } from '../../data/utils';

interface PriorityDotProps {
  priority: Priority;
  size?: number;
  title?: string;
}

export default function PriorityDot({ priority, size, title }: PriorityDotProps) {
  const style = priorityDotStyle(priority);
  if (size) {
    style.width = size;
    style.height = size;
  }
  return <span style={style} title={title} aria-label={`Priority ${priority}`} />;
}
