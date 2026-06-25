export type Role = 'admin' | 'staff' | 'freelance';
export type Priority = 'top' | 'mid' | 'low';
export type EventType = 'wrestling' | 'grappling' | 'randoms' | 'amma' | 'pankration' | 'devcamp' | 'documentary';
export type MemberStatus = 'invited' | 'pending' | 'confirmed';
export type AvailStatus = 'Available' | 'Limited';
export type StaffType = 'Staff' | 'Freelance';
export type NotifKind = 'flight' | 'info' | 'staff' | 'request' | 'roles' | 'reply' | 'mention';
export type NotifTab = 'info' | 'flights' | 'staffRoles' | 'requests' | 'schedule' | 'posting' | 'notifications';
export type NotifRole = 'admin' | 'staff' | 'both';
export type Page = 'calendar' | 'staff' | 'archive' | 'templates' | 'chat';
export type CalView = 'calendar' | 'table';
export type SortKey = 'date' | 'type' | 'completion' | 'priority';

export interface UWWEvent {
  id: string;
  name: string;
  priority: Priority;
  eventType: EventType;
  competitionType: string;
  ageRange: string;
  location: string;
  start: string;
  end: string;
  staff: string[];
  barColor?: string;
  eventAdmins?: string[];
  reminderOff?: number[];
  flightDeadline?: string;
  archived?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  admin: boolean;
  location: string;
  email: string;
  type: StaffType;
  skillsets: string[];
  country: string;
  photo?: string;
}

export interface EventMember {
  id: string;
  roles: string[];
  status: MemberStatus;
}

export interface InfoItem {
  id: string;
  kind: 'doc' | 'link';
  name: string;
  content?: string;
  url?: string;
}

export interface ScheduleItem { time: string; label: string; }

export interface PostingItem {
  posted: boolean;
  type: string;
  name: string;
  link: string;
  athlete: string;
  caption: string;
}

export interface Availability {
  status: AvailStatus;
  flights: boolean;
  flightNotReq?: boolean;
  days?: string[];
  daysConfirmed?: boolean;
}

export interface Message {
  from: string;
  text: string;
  time: string;
  att?: { name: string; url: string; };
}

export interface Comment {
  id: string;
  from: string;
  status: 'open' | 'resolved';
  draft: string;
  messages: Message[];
}

export interface EventDetail {
  infoItems: InfoItem[];
  schedule: Record<string, ScheduleItem[]>;
  members: EventMember[];
  joinRequests: string[];
  posting: Record<string, PostingItem[]>;
  availability: Record<string, Availability>;
  requests: Comment[];
  newRequest: string;
}

export interface Notification {
  id: string;
  eventId: string;
  title: string;
  kind: NotifKind;
  pri: Priority;
  deadlineLabel: string;
  targetTab: NotifTab;
  forRole: NotifRole;
  actioned?: boolean;
  cleared?: boolean;
  mentionFor?: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  messages: Message[];
  photo?: string;
}

export interface EventTemplate {
  id: string;
  name: string;
  eventType: EventType | '';
  competitionType: string;
  ageRange: string;
  region?: string;
  priority: Priority;
  barColor?: string;
}

export interface DocTemplate {
  id: string;
  name: string;
  content: string;
}

export interface Templates {
  events: EventTemplate[];
  docs: DocTemplate[];
}

export interface ContextMenuData {
  x: number;
  y: number;
  type: 'event' | 'day';
  eventId?: string;
  date?: string;
}

export interface NewEventForm {
  name: string;
  priority: Priority;
  eventType: EventType;
  competitionType: string;
  ageRange: string;
  location: string;
  start: string;
  end: string;
  barColor: string;
}

export interface NewEventFromDate {
  date?: string;
}
