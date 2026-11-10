import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState, type ComponentProps } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { errorMessage } from '../../lib/api';
import {
  bookHomePooja,
  fetchAdminHomePooja,
  fetchHomePoojaRsvps,
  fetchMemberHomePooja,
  updateHomePoojaAdmin,
  type CalendarDate,
  type HomePoojaRequest,
  type RsvpGroup,
} from '../../lib/calendar';
import { useAuth } from '../../providers/AuthProvider';

type Props = {
  selectedDate: string;
  selectedItem?: CalendarDate;
  onChanged: () => Promise<void>;
};

export function HomePoojaAccess({ selectedDate, selectedItem, onChanged }: Props) {
  const { status, member, isAdmin } = useAuth();
  const [requests, setRequests] = useState<HomePoojaRequest[]>([]);
  const [adminEntries, setAdminEntries] = useState<HomePoojaRequest[]>([]);
  const [available, setAvailable] = useState<CalendarDate[]>([]);
  const [rsvps, setRsvps] = useState<RsvpGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [poojaAddress, setPoojaAddress] = useState('');
  const [requesterNote, setRequesterNote] = useState('');
  const [adminDate, setAdminDate] = useState('');
  const [adminTime, setAdminTime] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const load = useCallback(async () => {
    if(status !== 'member') return;
    setLoading(true);
    setError('');
    try {
      const [memberData, groups, adminData] = await Promise.all([
        fetchMemberHomePooja(),
        fetchHomePoojaRsvps(isAdmin).catch(() => []),
        isAdmin ? fetchAdminHomePooja() : Promise.resolve(null),
      ]);
      setRequests(memberData.requests ?? []);
      setAvailable((memberData.calendar?.dates ?? []).filter(item => item.status === 'Available'));
      setRsvps(groups);
      setAdminEntries(adminData?.entries ?? []);
      setRequesterName(current => current || [member?.firstName, member?.lastName].filter(Boolean).join(' '));
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [isAdmin, member?.firstName, member?.lastName, status]);

  useEffect(() => {
    // Synchronize the authenticated portal data when the signed-in identity changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  useEffect(() => {
    if(!selectedDate) return;
    // The admin editor intentionally mirrors whichever calendar date was selected.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminDate(selectedDate);
    setAdminTime(selectedItem?.eventTime || selectedItem?.bookingTime || selectedItem?.time || '');
    setAdminReason(selectedItem?.eventName || selectedItem?.reason || '');
    setEditAddress(selectedItem?.eventAddress || selectedItem?.poojaAddress || '');
  }, [selectedDate, selectedItem]);

  const selectedBooking = (() => {
    if(selectedItem?.bookingId) return adminEntries.find(item => item.id === selectedItem.bookingId);
    return adminEntries.find(item => item.poojaDate === selectedDate && item.entryType === 'Booking');
  })();

  const runAdmin = async (method: 'POST' | 'PATCH', body: Record<string, unknown>, success: string) => {
    if(busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await updateHomePoojaAdmin(method, body);
      setMessage(success);
      await Promise.all([load(), onChanged()]);
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const submitBooking = async () => {
    if(busy || !requesterName.trim() || !phoneNumber.trim() || !bookingDate || !poojaAddress.trim()) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await bookHomePooja({
        requesterName: requesterName.trim(),
        phoneNumber: phoneNumber.trim(),
        poojaDate: bookingDate,
        poojaAddress: poojaAddress.trim(),
        requesterNote: requesterNote.trim(),
      });
      setMessage(result.message || 'Your Home Pooja request was submitted.');
      setBookingDate('');
      setPoojaAddress('');
      setRequesterNote('');
      await Promise.all([load(), onChanged()]);
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  if(status === 'loading') return <AccessCard icon="hourglass-outline" title="Checking member access…" />;

  if(status !== 'member') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.icon}><Ionicons name="person-outline" size={22} color="#A54008" /></View>
          <View style={styles.flex}>
            <Text style={styles.kicker}>MEMBER PORTAL</Text>
            <Text accessibilityRole="header" style={styles.heading}>Book a Home Pooja</Text>
          </View>
        </View>
        <Text style={styles.body}>Sign in with your AAYSSA membership email to request an available date and view your bookings.</Text>
        {status === 'donor' ? <Text style={styles.note}>Donation-email verification does not provide member booking access.</Text> : null}
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/login', params: { next: '/calendar' } })} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          <Text style={styles.primaryText}>Member sign in</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF9E9" />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/member-registration')} style={({ pressed }) => [styles.memberOutline, pressed && styles.pressed]}>
          <Text style={styles.memberOutlineText}>Become a member</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.icon}><Ionicons name="home-outline" size={22} color="#A54008" /></View>
          <View style={styles.flex}>
            <Text style={styles.kicker}>MEMBER PORTAL</Text>
            <Text accessibilityRole="header" style={styles.heading}>Book a Home Pooja</Text>
            <Text style={styles.note}>Signed in as {member?.firstName} · {member?.role}</Text>
          </View>
        </View>

        {loading ? <Text style={styles.body}>Loading member bookings…</Text> : null}
        {error ? <StatusBox text={error} error /> : null}
        {message ? <StatusBox text={message} /> : null}

        {requests.length ? (
          <View style={styles.subsection}>
            <Text style={styles.subheading}>Your bookings</Text>
            {requests.map(request => (
              <View key={request.id} style={styles.rowCard}>
                <Text style={styles.rowTitle}>{request.poojaDate} · {request.preferredTime}</Text>
                <Text style={styles.note}>{request.status}{request.adminNotes ? ` · ${request.adminNotes}` : ''}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Field label="Requester name" value={requesterName} onChangeText={setRequesterName} />
        <Field label="Phone number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <Text style={styles.label}>Available date</Text>
        {available.length ? (
          <View style={styles.choices}>
            {available.map(item => (
              <Pressable key={item.date} accessibilityRole="radio" accessibilityState={{ checked: bookingDate === item.date }} onPress={() => setBookingDate(item.date)} style={[styles.choice, bookingDate === item.date && styles.choiceSelected]}>
                <Text style={[styles.choiceText, bookingDate === item.date && styles.choiceTextSelected]}>{item.date}</Text>
                <Text style={[styles.choiceTime, bookingDate === item.date && styles.choiceTextSelected]}>{item.time}</Text>
              </Pressable>
            ))}
          </View>
        ) : <Text style={styles.note}>No available dates are currently published.</Text>}
        <Field label="Pooja address" value={poojaAddress} onChangeText={setPoojaAddress} multiline />
        <Field label="Notes (optional)" value={requesterNote} onChangeText={setRequesterNote} multiline />
        <Pressable accessibilityRole="button" disabled={busy || !requesterName.trim() || !phoneNumber.trim() || !bookingDate || !poojaAddress.trim()} onPress={submitBooking} style={({ pressed }) => [styles.primary, (busy || !requesterName.trim() || !phoneNumber.trim() || !bookingDate || !poojaAddress.trim()) && styles.disabled, pressed && styles.pressed]}>
          <Text style={styles.primaryText}>{busy ? 'Please wait…' : 'Request Home Pooja'}</Text>
        </Pressable>
      </View>

      <RsvpGroups groups={rsvps} admin={isAdmin} />

      {isAdmin ? (
        <View style={[styles.card, styles.adminCard]}>
          <View style={styles.cardHeader}>
            <View style={[styles.icon, styles.adminIcon]}><Ionicons name="settings-outline" size={22} color="#285C49" /></View>
            <View style={styles.flex}>
              <Text style={[styles.kicker, styles.adminKicker]}>BOARD / ADMIN</Text>
              <Text accessibilityRole="header" style={styles.heading}>Manage Home Pooja</Text>
              <Text style={styles.note}>Select a calendar date above, then edit its availability, booking, or event block.</Text>
            </View>
          </View>

          <Field label="Date (YYYY-MM-DD)" value={adminDate} onChangeText={setAdminDate} />
          <Field label={selectedItem?.status === 'Blocked' ? 'Event name / block reason' : 'Scheduled time'} value={selectedItem?.status === 'Blocked' ? adminReason : adminTime} onChangeText={selectedItem?.status === 'Blocked' ? setAdminReason : setAdminTime} />

          {selectedItem?.status === 'Available' ? (
            <View style={styles.actions}>
              <Action label="Save availability" onPress={() => runAdmin('PATCH', { action: 'edit-availability', originalDate: selectedDate, poojaDate: adminDate, preferredTime: adminTime }, 'Availability updated.')} disabled={busy} />
              <Action label="Block date" secondary onPress={() => runAdmin('POST', { poojaDate: adminDate, blockReason: adminReason || 'Special AAYSSA event' }, 'Date blocked.')} disabled={busy} />
            </View>
          ) : null}

          {selectedItem?.status === 'Blocked' ? (
            <View style={styles.actions}>
              <Action label="Save event" onPress={() => runAdmin('PATCH', { action: 'edit-block', originalDate: selectedDate, poojaDate: adminDate, blockReason: adminReason }, 'Event block updated.')} disabled={busy || !adminReason.trim()} />
              <Action label="Unblock date" danger onPress={() => Alert.alert('Unblock this date?', `${selectedDate} will become available again.`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Unblock', style: 'destructive', onPress: () => { void runAdmin('PATCH', { action: 'unblock-date', poojaDate: selectedDate }, 'Date unblocked.'); } },
              ])} disabled={busy} />
            </View>
          ) : null}

          {selectedItem?.status === 'Booked' && selectedBooking ? (
            <View style={styles.subsection}>
              <Text style={styles.subheading}>Edit booking · {selectedBooking.requesterName}</Text>
              <Field label="Scheduled time" value={adminTime} onChangeText={setAdminTime} />
              <Field label="Pooja address" value={editAddress} onChangeText={setEditAddress} multiline />
              <Action label="Save booking changes" onPress={() => runAdmin('PATCH', { id: selectedBooking.id, action: 'edit-booking', preferredTime: adminTime, poojaAddress: editAddress }, 'Booking updated.')} disabled={busy} />
            </View>
          ) : null}

          {!selectedItem ? (
            <View style={styles.subsection}>
              <Text style={styles.subheading}>Add or block a date</Text>
              <Field label="Scheduled time" value={adminTime} onChangeText={setAdminTime} />
              <View style={styles.actions}>
                <Action label="Add availability" onPress={() => runAdmin('POST', { action: 'add-availability', poojaDate: adminDate, preferredTime: adminTime }, 'Availability added.')} disabled={busy || !adminDate || !adminTime} />
                <Action label="Block date" secondary onPress={() => runAdmin('POST', { poojaDate: adminDate, blockReason: adminReason || 'Special AAYSSA event' }, 'Date blocked.')} disabled={busy || !adminDate} />
              </View>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function AccessCard({ icon, title }: { icon: ComponentProps<typeof Ionicons>['name']; title: string }) {
  return <View style={styles.card}><Ionicons name={icon} size={24} color="#A54008" /><Text style={styles.heading}>{title}</Text></View>;
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor="#968A7D" style={[styles.input, props.multiline && styles.textarea]} {...props} /></View>;
}

function Action({ label, secondary, danger, disabled, onPress }: { label: string; secondary?: boolean; danger?: boolean; disabled?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.action, secondary && styles.actionSecondary, danger && styles.actionDanger, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.actionText, secondary && styles.actionSecondaryText]}>{label}</Text></Pressable>;
}

function StatusBox({ text, error }: { text: string; error?: boolean }) {
  return <View style={[styles.status, error && styles.statusError]}><Text style={[styles.statusText, error && styles.statusErrorText]}>{text}</Text></View>;
}

function RsvpGroups({ groups, admin }: { groups: RsvpGroup[]; admin: boolean }) {
  if(!groups.length) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>{admin ? 'BOARD / ADMIN' : 'YOUR EVENTS'}</Text>
      <Text accessibilityRole="header" style={styles.heading}>RSVP responses</Text>
      {groups.map((group, groupIndex) => (
        <View key={`${group.type}-${group.date}-${groupIndex}`} style={styles.subsection}>
          <Text style={styles.subheading}>{group.type} · {group.date}</Text>
          <Text style={styles.note}>{group.name}{group.time ? ` · ${group.time}` : ''}</Text>
          <Text style={styles.summary}>Attending: {group.summary?.attending?.households ?? 0} households · {group.summary?.attending?.adults ?? 0} adults · {group.summary?.attending?.kids ?? 0} kids</Text>
          {group.responses.map((response, index) => (
            <View key={`${response.attendeeName}-${index}`} style={styles.rowCard}>
              <Text style={styles.rowTitle}>{response.attendeeName} · {response.status}</Text>
              <Text style={styles.note}>{response.adults} adults · {response.kids} kids</Text>
              {admin && (response.email || response.phone) ? <Text style={styles.note}>{[response.email, response.phone].filter(Boolean).join(' · ')}</Text> : null}
              {response.notes ? <Text style={styles.note}>{response.notes}</Text> : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
  card: { backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#E8DED0', borderRadius: 22, padding: 20, gap: 14 },
  adminCard: { borderColor: '#B9D3C7', backgroundColor: '#F5FAF7' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBE8D8' },
  adminIcon: { backgroundColor: '#DCECE4' },
  flex: { flex: 1, gap: 3 },
  kicker: { color: '#A55017', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  adminKicker: { color: '#285C49' },
  heading: { color: '#3E3125', fontSize: 20, lineHeight: 27, fontWeight: '800' },
  body: { color: '#62574C', fontSize: 14, lineHeight: 21 },
  note: { color: '#776B60', fontSize: 12, lineHeight: 18 },
  field: { gap: 6 },
  label: { color: '#51473D', fontSize: 12, fontWeight: '700' },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#D9CFC2', borderRadius: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 13, paddingVertical: 11, color: '#352E27', fontSize: 14 },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  primary: { minHeight: 50, borderRadius: 14, backgroundColor: '#B84A0A', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  primaryText: { color: '#FFF9E9', fontSize: 14, fontWeight: '800' },
  memberOutline: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: '#B84A0A', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  memberOutlineText: { color: '#A54008', fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
  choices: { gap: 8 },
  choice: { borderWidth: 1, borderColor: '#D9CFC2', borderRadius: 12, padding: 12, backgroundColor: '#FFFFFF' },
  choiceSelected: { backgroundColor: '#285C49', borderColor: '#285C49' },
  choiceText: { color: '#3E3125', fontSize: 14, fontWeight: '800' },
  choiceTime: { color: '#776B60', fontSize: 12, marginTop: 2 },
  choiceTextSelected: { color: '#FFFFFF' },
  subsection: { gap: 8, borderTopWidth: 1, borderTopColor: '#E8DED0', paddingTop: 12 },
  subheading: { color: '#4A3B2E', fontSize: 15, fontWeight: '800' },
  rowCard: { backgroundColor: '#F8F3EB', borderRadius: 12, padding: 12, gap: 3 },
  rowTitle: { color: '#41362C', fontSize: 13, fontWeight: '800' },
  status: { borderRadius: 12, backgroundColor: '#E7F3EC', padding: 11 },
  statusError: { backgroundColor: '#FBE7E2' },
  statusText: { color: '#285C49', fontSize: 13, lineHeight: 18 },
  statusErrorText: { color: '#9A321D' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  action: { minHeight: 44, borderRadius: 12, backgroundColor: '#285C49', paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },
  actionSecondary: { backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#285C49' },
  actionDanger: { backgroundColor: '#A23B2A' },
  actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  actionSecondaryText: { color: '#285C49' },
  summary: { color: '#51473D', fontSize: 12, lineHeight: 18, fontWeight: '600' },
});
