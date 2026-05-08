import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  CalendarCheck2,
  CalendarClock,
  CalendarPlus2,
  Check,
  Clock3,
  Trash2,
  X,
} from 'lucide-react';
import { EventContentArg, EventInput } from '@fullcalendar/core';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import {
  addAvailabilitySlot,
  addMeetingRequest,
  getSchedulingStore,
  removeAvailabilitySlot,
  respondToMeetingRequest,
  roleLabel,
  updateAvailabilitySlot,
  updateConfirmedMeeting,
} from '../../data/scheduling';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { AvailabilitySlot, MeetingRequest, SchedulingStore } from '../../types';

type ModalMode = 'create-availability' | 'create-request' | 'edit-availability';

interface FormState {
  title: string;
  date: string;
  time: string;
  description: string;
  meetingMode: 'availability' | 'request';
}

const initialForm: FormState = {
  title: '',
  date: '',
  time: '10:00',
  description: '',
  meetingMode: 'availability',
};

const toDisplayTime = (time: string): string => {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${suffix}`;
};

const eventDateTime = (date: string, time: string): string => `${date}T${time}:00`;

const renderEventContent = (arg: EventContentArg) => {
  const kind = arg.event.extendedProps.kind as 'availability' | 'confirmed';
  const source = arg.event.extendedProps.source as { time?: string } | undefined;
  const timeLabel = source?.time ? toDisplayTime(source.time) : arg.timeText;
  const title = arg.event.title.replace(/^Available:\s*/i, '').replace(/^Confirmed:\s*/i, '');

  const palette = kind === 'confirmed'
    ? 'border-success-200 bg-success-50 text-success-800'
    : 'border-primary-200 bg-primary-50 text-primary-800';

  return (
    <div className={`fc-event-card flex flex-col gap-1 overflow-hidden rounded-md border px-2 py-1 shadow-sm ${palette}`}>
      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wide opacity-80">
        <span className="truncate">{kind === 'confirmed' ? 'Confirmed' : 'Available'}</span>
        <span className="shrink-0 whitespace-nowrap">{timeLabel}</span>
      </div>
      <div className="min-w-0 text-xs font-semibold leading-tight break-words whitespace-normal">
        {title}
      </div>
    </div>
  );
};

export const SchedulingPage: React.FC = () => {
  const { user } = useAuth();
  const [store, setStore] = useState<SchedulingStore>(getSchedulingStore());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create-availability');
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  if (!user) {
    return null;
  }

  const pendingRequests = useMemo(
    () => store.meetingRequests.filter((item) => item.status === 'pending'),
    [store.meetingRequests],
  );

  const confirmedMeetings = useMemo(
    () => [...store.confirmedMeetings].sort((a, b) => eventDateTime(a.date, a.time).localeCompare(eventDateTime(b.date, b.time))),
    [store.confirmedMeetings],
  );

  const events = useMemo<EventInput[]>(() => {
    const availabilityEvents = store.availabilitySlots.map((slot) => ({
      id: slot.id,
      title: `Available: ${slot.title}`,
      start: eventDateTime(slot.date, slot.time),
      allDay: false,
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6',
      textColor: '#1e3a8a',
      extendedProps: {
        kind: 'availability',
        source: slot,
      },
    }));

    const confirmedEvents = store.confirmedMeetings.map((meeting) => ({
      id: meeting.id,
      title: `Confirmed: ${meeting.title}`,
      start: eventDateTime(meeting.date, meeting.time),
      allDay: false,
      backgroundColor: '#dcfce7',
      borderColor: '#22c55e',
      textColor: '#14532d',
      extendedProps: {
        kind: 'confirmed',
        source: meeting,
      },
    }));

    return [...availabilityEvents, ...confirmedEvents];
  }, [store.availabilitySlots, store.confirmedMeetings]);

  const resetModal = () => {
    setSelectedAvailabilityId(null);
    setForm(initialForm);
    setModalMode('create-availability');
    setIsModalOpen(false);
  };

  const openCreateModal = (date: string, mode: 'availability' | 'request') => {
    setForm({
      ...initialForm,
      date,
      meetingMode: mode,
    });
    setModalMode(mode === 'availability' ? 'create-availability' : 'create-request');
    setIsModalOpen(true);
  };

  const handleDateClick = (arg: DateClickArg) => {
    openCreateModal(arg.dateStr, 'availability');
  };

  const handleEventClick = (arg: EventClickArg) => {
    const kind = arg.event.extendedProps.kind as 'availability' | 'confirmed';

    if (kind === 'availability') {
      const slot = arg.event.extendedProps.source as AvailabilitySlot;
      setSelectedAvailabilityId(slot.id);
      setForm({
        title: slot.title,
        date: slot.date,
        time: slot.time,
        description: slot.description ?? '',
        meetingMode: 'availability',
      });
      setModalMode('edit-availability');
      setIsModalOpen(true);
      return;
    }

    const confirmed = arg.event.extendedProps.source as { title: string; date: string; time: string; participantName: string };
    window.alert(`Confirmed Meeting\n\n${confirmed.title}\n${confirmed.date} at ${toDisplayTime(confirmed.time)}\nWith: ${confirmed.participantName}`);
  };

  const handleEventDrop = (arg: EventDropArg) => {
    const droppedDate = arg.event.start;
    if (!droppedDate) {
      return;
    }

    const newDate = droppedDate.toISOString().split('T')[0];
    const hour = String(droppedDate.getHours()).padStart(2, '0');
    const minute = String(droppedDate.getMinutes()).padStart(2, '0');
    const newTime = `${hour}:${minute}`;

    const kind = arg.event.extendedProps.kind as 'availability' | 'confirmed';

    if (kind === 'availability') {
      setStore(updateAvailabilitySlot(arg.event.id, { date: newDate, time: newTime }));
      return;
    }

    setStore(updateConfirmedMeeting(arg.event.id, { date: newDate, time: newTime }));
  };

  const handleSubmitModal = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.date || !form.time) {
      return;
    }

    if (modalMode === 'edit-availability' && selectedAvailabilityId) {
      setStore(
        updateAvailabilitySlot(selectedAvailabilityId, {
          title: form.title.trim(),
          date: form.date,
          time: form.time,
          description: form.description.trim() || undefined,
        }),
      );
      resetModal();
      return;
    }

    if (form.meetingMode === 'availability') {
      setStore(
        addAvailabilitySlot({
          title: form.title.trim(),
          date: form.date,
          time: form.time,
          description: form.description.trim() || undefined,
          ownerId: user.id,
          ownerName: user.name,
          ownerRole: user.role,
        }),
      );
      resetModal();
      return;
    }

    setStore(
      addMeetingRequest({
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        description: form.description.trim() || undefined,
        requesterId: user.id,
        requesterName: user.name,
        requesterRole: user.role,
      }),
    );
    resetModal();
  };

  const handleDeleteAvailability = () => {
    if (!selectedAvailabilityId) {
      return;
    }
    setStore(removeAvailabilitySlot(selectedAvailabilityId));
    resetModal();
  };

  const handleRequestAction = (requestId: string, status: 'accepted' | 'declined') => {
    setStore(respondToMeetingRequest(requestId, status));
  };

  const requestBadgeVariant = (status: MeetingRequest['status']): 'warning' | 'success' | 'error' => {
    if (status === 'accepted') {
      return 'success';
    }
    if (status === 'declined') {
      return 'error';
    }
    return 'warning';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">Meeting Scheduling Calendar</h1>
          <p className="text-secondary-600 mt-1">Manage availability, requests, and confirmed meetings in one place.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button
            className="w-full sm:w-auto"
            leftIcon={<CalendarPlus2 size={18} />}
            onClick={() => openCreateModal(new Date().toISOString().split('T')[0], 'availability')}
          >
            Add Availability
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            leftIcon={<CalendarClock size={18} />}
            onClick={() => openCreateModal(new Date().toISOString().split('T')[0], 'request')}
          >
            Send Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-secondary-900">Calendar View</h2>
              <Badge variant="info">Drag & Drop Enabled</Badge>
            </CardHeader>
            <CardBody className="overflow-hidden">
              <div className="rounded-lg border border-gray-100 p-2 md:p-4 bg-white overflow-x-auto">
                <div className="min-w-[720px] md:min-w-0">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    buttonText={{
                      today: 'Today',
                      month: 'Month',
                      week: 'Week',
                      day: 'Day',
                    }}
                    events={events}
                    eventContent={renderEventContent}
                    selectable
                    editable
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    height="auto"
                    dayMaxEventRows={3}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">Meeting Requests</h2>
              <Badge variant="warning">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody className="space-y-3">
              {store.meetingRequests.length === 0 && (
                <p className="text-sm text-secondary-500">No meeting requests yet.</p>
              )}

              {store.meetingRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-secondary-900">{request.title}</h3>
                      <p className="text-xs text-secondary-500 mt-1">
                        {request.date} at {toDisplayTime(request.time)}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        By {request.requesterName} ({roleLabel(request.requesterRole)})
                      </p>
                    </div>
                    <Badge variant={requestBadgeVariant(request.status)}>{request.status}</Badge>
                  </div>
                  {request.description && (
                    <p className="text-sm text-secondary-600 mt-2">{request.description}</p>
                  )}

                  {request.status === 'pending' && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        leftIcon={<Check size={16} />}
                        className="w-full"
                        onClick={() => handleRequestAction(request.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="error"
                        leftIcon={<X size={16} />}
                        className="w-full"
                        onClick={() => handleRequestAction(request.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">Confirmed Meetings</h2>
              <Badge variant="success">{confirmedMeetings.length}</Badge>
            </CardHeader>
            <CardBody className="space-y-3">
              {confirmedMeetings.length === 0 && (
                <p className="text-sm text-secondary-500">No confirmed meetings yet.</p>
              )}

              {confirmedMeetings.slice(0, 6).map((meeting) => (
                <div key={meeting.id} className="rounded-lg border border-success-100 bg-success-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-secondary-900">{meeting.title}</h3>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-secondary-600">
                    <p className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {meeting.date} at {toDisplayTime(meeting.time)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CalendarCheck2 size={14} />
                      With {meeting.participantName} ({roleLabel(meeting.participantRole)})
                    </p>
                  </div>
                  {meeting.description && <p className="mt-2 text-sm text-secondary-700">{meeting.description}</p>}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-xl bg-white border border-gray-100 shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">
                {modalMode === 'edit-availability' ? 'Edit Availability Slot' : 'Create Meeting Item'}
              </h2>
              <button
                type="button"
                className="p-2 rounded-lg text-secondary-500 hover:bg-gray-100 hover:text-secondary-700 transition-colors duration-200"
                onClick={resetModal}
              >
                <X size={18} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmitModal}>
              {modalMode !== 'edit-availability' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                  <select
                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                    value={form.meetingMode}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        meetingMode: event.target.value as 'availability' | 'request',
                      }))
                    }
                  >
                    <option value="availability">Availability Slot</option>
                    <option value="request">Meeting Request</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Meeting Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                    value={form.date}
                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                    value={form.time}
                    onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description (optional)</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-2">
                {modalMode === 'edit-availability' ? (
                  <Button
                    type="button"
                    variant="error"
                    leftIcon={<Trash2 size={16} />}
                    onClick={handleDeleteAvailability}
                    className="w-full sm:w-auto"
                  >
                    Delete Slot
                  </Button>
                ) : (
                  <span className="text-xs text-secondary-500">Items are saved locally in your browser for demo use.</span>
                )}

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={resetModal}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {modalMode === 'edit-availability' ? 'Save Changes' : 'Create'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingPage;
