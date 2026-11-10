import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState, type ComponentProps } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ErrorBox, Loading } from '../donate/parts';
import { colors, d } from '../donate/styles';
import { errorMessage } from '../../lib/api';
import {
  fetchMaaladharanRegistrations,
  registerMaaladharan,
  updateMaaladharanRegistration,
  type MaaladharanData,
  type MaaladharanRegistration,
} from '../../lib/member';
import { useAuth } from '../../providers/AuthProvider';
import { ProfileOverview } from './ProfileOverview';

const padiOptions = ['0 (Kanni Swamy)', '1', ...Array.from({ length: 16 }, (_, index) => String(index + 2)), '18 (Guru Swamy)', ...Array.from({ length: 21 }, (_, index) => String(index + 19)), '40+'];
const offerings = ['Tampa Temple', 'AAYSSA Temple', 'Other Temple or Self'];

export function MemberOverview() {
  const { member, signOut } = useAuth();
  const [data, setData] = useState<MaaladharanData | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [participantType, setParticipantType] = useState<'primary' | 'spouse' | 'additional'>('primary');
  const [participantName, setParticipantName] = useState(`${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim());
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(member?.mobileNumber ?? '');
  const [maaladharanDate, setMaaladharanDate] = useState('');
  const [padiStatus, setPadiStatus] = useState('0 (Kanni Swamy)');
  const [irumudiOffering, setIrumudiOffering] = useState('');
  const [memberNotes, setMemberNotes] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const next = await fetchMaaladharanRegistrations();
      setData(next);
      setMaaladharanDate(current => current || next.seasonStart);
    } catch(caught) {
      setError(errorMessage(caught));
    }
  }, []);

  useEffect(() => {
    // Load the signed-in member's portal data when this native overview mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const spouseName = `${member?.spouseFirstName ?? ''} ${member?.spouseLastName ?? ''}`.trim();
  const selectParticipant = (type: 'primary' | 'spouse' | 'additional') => {
    setParticipantType(type);
    if(type === 'primary') setParticipantName(`${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim());
    if(type === 'spouse') setParticipantName(spouseName);
    if(type === 'additional') setParticipantName('');
  };

  const submit = async () => {
    if(!data || busy || !participantName.trim() || !age || !phoneNumber.trim() || !maaladharanDate || !irumudiOffering) return;
    setBusy(true);
    setError('');
    try {
      const next = await registerMaaladharan({
        participantType,
        participantName: participantName.trim(),
        age: Number(age),
        phoneNumber: phoneNumber.trim(),
        maaladharanDate,
        firstDeeksha: padiStatus === '0 (Kanni Swamy)',
        padiStatus,
        irumudiOffering,
        memberNotes: memberNotes.trim(),
      });
      setData(next);
      setAge('');
      setMemberNotes('');
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async (registration: MaaladharanRegistration) => {
    if(busy) return;
    setBusy(true);
    setError('');
    try {
      setData(await updateMaaladharanRegistration({
        id: registration.id,
        action: 'update',
        maaladharanDate,
        padiStatus,
        irumudiOffering,
        memberNotes,
      }));
      setEditing(null);
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (registration: MaaladharanRegistration) => {
    setEditing(registration.id);
    setMaaladharanDate(registration.maaladharanDate);
    setPadiStatus(registration.padiStatus);
    setIrumudiOffering(registration.irumudiOffering);
    setMemberNotes(registration.memberNotes ?? '');
  };

  const withdraw = (registration: MaaladharanRegistration) => {
    Alert.alert('Withdraw registration?', `${registration.participantName} will be removed from active Maaladharan registration.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', style: 'destructive', onPress: async () => {
        setBusy(true);
        try {
          setData(await updateMaaladharanRegistration({ id: registration.id, action: 'withdraw', memberNotes: registration.memberNotes ?? '' }));
          setEditing(null);
        } catch(caught) {
          setError(errorMessage(caught));
        } finally {
          setBusy(false);
        }
      } },
    ]);
  };

  return (
    <View style={{ gap: 20 }}>
      <View style={[d.infoBox, { backgroundColor: colors.greenSoft, gap: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={[d.noticeIcon, { backgroundColor: '#FFFFFF' }]}><Ionicons name="person" size={20} color={colors.green} /></View>
          <View style={{ flex: 1 }}>
            <Text style={d.eyebrow}>MEMBER OVERVIEW</Text>
            <Text accessibilityRole="header" style={[d.title, { fontSize: 24 }]}>{member?.firstName} {member?.lastName}</Text>
            <Text style={d.small}>{member?.email} · {member?.role}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/my-donations')} style={({ pressed }) => [d.outline, { flex: 1 }, pressed && d.pressed]}><Text style={d.outlineText}>My donations</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => void signOut()} style={({ pressed }) => [d.outline, { flex: 1 }, pressed && d.pressed]}><Text style={d.outlineText}>Sign out</Text></Pressable>
        </View>
      </View>

      {member ? <ProfileOverview initialMember={member} /> : null}

      <View style={{ gap: 12 }}>
        <Text style={d.eyebrow}>DEVOTIONAL JOURNEY</Text>
        <Text accessibilityRole="header" style={[d.title, { fontSize: 24 }]}>Maaladharan registration</Text>
        <Text style={d.body}>Register each family member taking Ayyappa Swamy Deeksha. Submit one registration per participant.</Text>
      </View>

      {error ? <ErrorBox message={error} onRetry={load} /> : null}
      {!data && !error ? <Loading label="Loading registrations…" /> : null}

      {data ? (
        <>
          <View style={d.syncNote}>
            <Ionicons name="calendar-outline" size={17} color={colors.green} />
            <Text style={[d.small, { flex: 1 }]}>Season {data.season} · {data.seasonStart} to {data.seasonEnd}</Text>
          </View>

          <Text accessibilityRole="header" style={d.section}>Registered Swamies</Text>
          {data.registrations.length === 0 ? <Text style={d.body}>No family members registered yet.</Text> : null}
          {data.registrations.map(registration => (
            <View key={registration.id} style={d.adminCard}>
              <View style={d.adminHead}>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={d.rowTitle}>{registration.participantName}</Text>
                  <Text style={d.small}>{registration.status === 'Cancelled' ? 'Withdrawn' : registration.status || 'Submitted'} · {registration.participantType} · Age {registration.age}</Text>
                  <Text style={d.small}>Maaladharan {registration.maaladharanDate} · {registration.padiStatus}</Text>
                  <Text style={d.small}>Irumudi: {registration.irumudiOffering || 'Not selected'}</Text>
                </View>
                {registration.status !== 'Cancelled' ? <Pressable accessibilityRole="button" onPress={() => startEdit(registration)} style={({ pressed }) => [d.edit, pressed && d.pressed]}><Text style={d.editText}>Edit</Text></Pressable> : null}
              </View>
              {editing === registration.id ? (
                <View style={{ gap: 12, marginTop: 8 }}>
                  <Field label="Maaladharan date (YYYY-MM-DD)" value={maaladharanDate} onChangeText={setMaaladharanDate} />
                  <ChoiceStrip label="Padi count completed" values={padiOptions} selected={padiStatus} onSelect={setPadiStatus} />
                  <ChoiceStrip label="Irumudi offering" values={offerings} selected={irumudiOffering} onSelect={setIrumudiOffering} />
                  <Field label="Member note (optional)" value={memberNotes} onChangeText={setMemberNotes} multiline />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <SmallButton label="Save changes" onPress={() => saveEdit(registration)} disabled={busy} />
                    <SmallButton label="Withdraw" onPress={() => withdraw(registration)} disabled={busy} danger />
                    <SmallButton label="Cancel" onPress={() => setEditing(null)} disabled={busy} secondary />
                  </View>
                </View>
              ) : null}
            </View>
          ))}

          <Text accessibilityRole="header" style={d.section}>Register a participant</Text>
          <ChoiceStrip label="Participant type" values={spouseName ? ['primary', 'spouse', 'additional'] : ['primary', 'additional']} selected={participantType} onSelect={value => selectParticipant(value as 'primary' | 'spouse' | 'additional')} />
          <Field label="Participant name *" value={participantName} onChangeText={setParticipantName} />
          <Field label="Age *" value={age} onChangeText={value => setAge(value.replace(/\D/g, ''))} keyboardType="number-pad" />
          <Field label="Phone number *" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
          <Field label="Maaladharan date (YYYY-MM-DD) *" value={maaladharanDate} onChangeText={setMaaladharanDate} />
          <ChoiceStrip label="Padi count completed" values={padiOptions} selected={padiStatus} onSelect={setPadiStatus} />
          {padiStatus === '0 (Kanni Swamy)' ? <Text style={d.small}>This is the Swamy’s first Deeksha.</Text> : null}
          <ChoiceStrip label="Irumudi offering *" values={offerings} selected={irumudiOffering} onSelect={setIrumudiOffering} />
          <Field label="Notes (optional)" value={memberNotes} onChangeText={setMemberNotes} multiline />
          <Pressable accessibilityRole="button" disabled={busy || !participantName.trim() || !age || !phoneNumber.trim() || !maaladharanDate || !irumudiOffering} onPress={submit} style={({ pressed }) => [d.primary, d.primaryGreen, (busy || !participantName.trim() || !age || !phoneNumber.trim() || !maaladharanDate || !irumudiOffering) && d.disabled, pressed && d.pressed]}>
            <Text style={d.primaryText}>{busy ? 'Please wait…' : 'Register participant'}</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return <View style={{ gap: 6 }}><Text style={d.label}>{label}</Text><TextInput placeholderTextColor="#8A8174" style={[d.input, props.multiline && { minHeight: 82, textAlignVertical: 'top' }]} {...props} /></View>;
}

function ChoiceStrip({ label, values, selected, onSelect }: { label: string; values: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={d.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        {values.map(value => (
          <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: selected === value }} onPress={() => onSelect(value)} style={[d.pill, selected === value ? { backgroundColor: colors.greenSoft, borderColor: '#9DBFAE' } : { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Text style={[d.pillText, { color: selected === value ? colors.greenInk : colors.body }]}>{value}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function SmallButton({ label, onPress, disabled, secondary, danger }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean; danger?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [d.addButton, secondary && d.outline, danger && { backgroundColor: '#A23B2A' }, disabled && d.disabled, pressed && d.pressed]}><Text style={[d.addText, secondary && d.outlineText, danger && { color: '#FFFFFF' }]}>{label}</Text></Pressable>;
}
