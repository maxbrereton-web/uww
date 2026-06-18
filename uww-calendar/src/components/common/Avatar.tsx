import { useStore } from '../../store';
import { initials, avatarStyle, photoAvatarStyle } from '../../data/utils';

interface AvatarProps {
  staffId: string;
  size?: number;
  confirmed?: boolean;
  onClick?: () => void;
  title?: string;
}

export default function Avatar({ staffId, size = 28, confirmed = false, onClick, title }: AvatarProps) {
  const member = useStore(s => s.staff.find(m => m.id === staffId));
  const name = member?.name || staffId;
  const photo = member?.photo;

  const baseStyle = photo
    ? photoAvatarStyle(photo, confirmed, size)
    : avatarStyle(confirmed, size);

  return (
    <div
      style={{ ...baseStyle, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      title={title || name}
      role={onClick ? 'button' : undefined}
    >
      {!photo && initials(name)}
    </div>
  );
}
