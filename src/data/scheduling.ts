import {
  AvailabilitySlot,
  ConfirmedMeeting,
  MeetingRequest,
  MeetingRequestStatus,
  SchedulingStore,
  UserRole,
} from '../types';

const SCHEDULING_STORAGE_KEY = 'nexus_scheduling_store';

const formatDateOffset = (offset: number): string => {
  const next = new Date();
  next.setDate(next.getDate() + offset);
  return next.toISOString().split('T')[0];
};

const createId = (): string => {
  return `meet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const seededStore = (): SchedulingStore => ({
  availabilitySlots: [
    {
      id: createId(),
      title: 'Founder Office Hours',
      date: formatDateOffset(1),
      time: '10:00',
      description: 'Open availability for investor Q&A.',
      ownerId: 'e1',
      ownerName: 'Sarah Johnson',
      ownerRole: 'entrepreneur',
      type: 'availability',
    },
    {
      id: createId(),
      title: 'Portfolio Intro Slot',
      date: formatDateOffset(2),
      time: '14:30',
      description: '15-minute intro calls for shortlisted startups.',
      ownerId: 'i1',
      ownerName: 'Michael Chen',
      ownerRole: 'investor',
      type: 'availability',
    },
  ],
  meetingRequests: [
    {
      id: createId(),
      title: 'Investment Fit Discussion',
      date: formatDateOffset(3),
      time: '11:30',
      description: 'Discuss runway and go-to-market strategy.',
      requesterId: 'i2',
      requesterName: 'Emily Rodriguez',
      requesterRole: 'investor',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ],
  confirmedMeetings: [
    {
      id: createId(),
      title: 'Term Sheet Follow-up',
      date: formatDateOffset(4),
      time: '16:00',
      description: 'Review updated terms and next actions.',
      participantName: 'Alex Morgan',
      participantRole: 'entrepreneur',
      sourceRequestId: null,
      type: 'confirmed',
    },
  ],
});

const safeRead = (): SchedulingStore => {
  if (typeof window === 'undefined') {
    return seededStore();
  }

  const raw = window.localStorage.getItem(SCHEDULING_STORAGE_KEY);
  if (!raw) {
    const seed = seededStore();
    window.localStorage.setItem(SCHEDULING_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw) as SchedulingStore;
  } catch {
    const seed = seededStore();
    window.localStorage.setItem(SCHEDULING_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
};

const safeWrite = (store: SchedulingStore): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(SCHEDULING_STORAGE_KEY, JSON.stringify(store));
};

export const getSchedulingStore = (): SchedulingStore => {
  return safeRead();
};

export const saveSchedulingStore = (store: SchedulingStore): SchedulingStore => {
  safeWrite(store);
  return store;
};

export const addAvailabilitySlot = (
  payload: Omit<AvailabilitySlot, 'id' | 'type'>,
): SchedulingStore => {
  const store = safeRead();
  store.availabilitySlots.unshift({
    id: createId(),
    type: 'availability',
    ...payload,
  });
  return saveSchedulingStore(store);
};

export const updateAvailabilitySlot = (
  slotId: string,
  updates: Partial<Pick<ConfirmedMeeting, 'title' | 'date' | 'time' | 'description'>>,
): SchedulingStore => {
  const store = safeRead();
  store.availabilitySlots = store.availabilitySlots.map((slot) =>
    slot.id === slotId ? { ...slot, ...updates } : slot,
  );
  return saveSchedulingStore(store);
};

export const removeAvailabilitySlot = (slotId: string): SchedulingStore => {
  const store = safeRead();
  store.availabilitySlots = store.availabilitySlots.filter((slot) => slot.id !== slotId);
  return saveSchedulingStore(store);
};

export const addMeetingRequest = (
  payload: Omit<MeetingRequest, 'id' | 'status' | 'createdAt'>,
): SchedulingStore => {
  const store = safeRead();
  store.meetingRequests.unshift({
    id: createId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...payload,
  });
  return saveSchedulingStore(store);
};

export const respondToMeetingRequest = (
  requestId: string,
  status: MeetingRequestStatus,
): SchedulingStore => {
  const store = safeRead();
  const request = store.meetingRequests.find((item) => item.id === requestId);

  store.meetingRequests = store.meetingRequests.map((item) =>
    item.id === requestId ? { ...item, status } : item,
  );

  if (request && status === 'accepted') {
    const confirmed: ConfirmedMeeting = {
      id: createId(),
      title: request.title,
      date: request.date,
      time: request.time,
      description: request.description,
      participantName: request.requesterName,
      participantRole: request.requesterRole,
      sourceRequestId: request.id,
      type: 'confirmed',
    };
    store.confirmedMeetings.unshift(confirmed);
  }

  return saveSchedulingStore(store);
};

export const updateConfirmedMeeting = (
  meetingId: string,
  updates: Partial<Pick<ConfirmedMeeting, 'title' | 'date' | 'time' | 'description'>>,
): SchedulingStore => {
  const store = safeRead();
  store.confirmedMeetings = store.confirmedMeetings.map((item) =>
    item.id === meetingId ? { ...item, ...updates } : item,
  );
  return saveSchedulingStore(store);
};

export const getUpcomingConfirmedCount = (): number => {
  const today = new Date().toISOString().split('T')[0];
  return safeRead().confirmedMeetings.filter((item) => item.date >= today).length;
};

export const getNextConfirmedMeeting = (): ConfirmedMeeting | null => {
  const today = new Date().toISOString().split('T')[0];
  const sorted = safeRead().confirmedMeetings
    .filter((item) => item.date >= today)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  return sorted[0] ?? null;
};

export const roleLabel = (role: UserRole): string => {
  return role === 'investor' ? 'Investor' : 'Entrepreneur';
};
