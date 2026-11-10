import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ErrorBox } from '../donate/parts';
import { colors, d } from '../donate/styles';
import { errorMessage } from '../../lib/api';
import { fetchMyVolunteers, updateMemberProfile, updateMyVolunteers, type Member, type Volunteer } from '../../lib/member';

const volunteerAreas = ['Pooja', 'Annadhanam', 'Bhajan', 'Media', 'Decorations'];
type Section = 'family' | 'contact' | 'preferences' | 'volunteering' | null;

export function ProfileOverview({ initialMember }: { initialMember: Member }) {
  const [profile, setProfile] = useState(initialMember);
  const [draft, setDraft] = useState(initialMember);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [volunteerDraft, setVolunteerDraft] = useState<Volunteer[]>([]);
  const [editing, setEditing] = useState<Section>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadVolunteers = useCallback(async () => {
    try {
      const next = await fetchMyVolunteers();
      setVolunteers(next);
      setVolunteerDraft(next);
    } catch(caught) {
      setError(errorMessage(caught));
    }
  }, []);

  useEffect(() => {
    // Load the member's selected volunteering records from the portal.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadVolunteers();
  }, [loadVolunteers]);

  const begin = (section: Exclude<Section, null>) => {
    setDraft(profile);
    setVolunteerDraft(volunteers.map(volunteer => ({ ...volunteer, areas: [...(volunteer.areas ?? [])] })));
    setEditing(section);
    setError('');
  };

  const saveProfile = async () => {
    if(busy) return;
    setBusy(true);
    setError('');
    try {
      const saved = await updateMemberProfile(draft);
      setProfile(current => ({ ...current, ...saved }));
      setDraft(current => ({ ...current, ...saved }));
      setEditing(null);
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const saveVolunteers = async () => {
    if(busy) return;
    setBusy(true);
    setError('');
    try {
      const saved = await updateMyVolunteers(volunteerDraft);
      setVolunteers(saved);
      setVolunteerDraft(saved);
      setEditing(null);
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    setDraft(profile);
    setVolunteerDraft(volunteers);
    setEditing(null);
    setError('');
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 5 }}>
        <Text style={d.eyebrow}>PROFILE OVERVIEW</Text>
        <Text accessibilityRole="header" style={[d.title, { fontSize: 24 }]}>Membership overview</Text>
      </View>

      {error ? <ErrorBox message={error} /> : null}

      <ProfileCard title="Family details" icon="people-outline" editing={editing === 'family'} onEdit={() => begin('family')} onSave={saveProfile} onCancel={cancel} busy={busy}>
        {editing === 'family' ? (
          <>
            <Field label="First name" value={draft.firstName} onChangeText={value => setDraft(current => ({ ...current, firstName: value }))} />
            <Field label="Last name" value={draft.lastName} onChangeText={value => setDraft(current => ({ ...current, lastName: value }))} />
            <Field label="Spouse first name" value={draft.spouseFirstName ?? ''} onChangeText={value => setDraft(current => ({ ...current, spouseFirstName: value }))} />
            <Field label="Spouse last name" value={draft.spouseLastName ?? ''} onChangeText={value => setDraft(current => ({ ...current, spouseLastName: value }))} />
            <Field label="Adults" value={String(draft.noOfAdults ?? '')} onChangeText={value => setDraft(current => ({ ...current, noOfAdults: value.replace(/\D/g, '') }))} keyboardType="number-pad" />
            <Field label="Kids" value={String(draft.noOfKids ?? '')} onChangeText={value => setDraft(current => ({ ...current, noOfKids: value.replace(/\D/g, '') }))} keyboardType="number-pad" />
          </>
        ) : (
          <>
            <Info label="Primary member" value={`${profile.firstName} ${profile.lastName}`.trim()} />
            <Info label="Spouse" value={`${profile.spouseFirstName ?? ''} ${profile.spouseLastName ?? ''}`.trim()} />
            <Info label="Adults" value={String(profile.noOfAdults ?? '')} />
            <Info label="Kids" value={String(profile.noOfKids ?? '')} />
          </>
        )}
      </ProfileCard>

      <ProfileCard title="Contact information" icon="call-outline" editing={editing === 'contact'} onEdit={() => begin('contact')} onSave={saveProfile} onCancel={cancel} busy={busy}>
        {editing === 'contact' ? (
          <>
            <Info label="Email" value={profile.email} />
            <Field label="Spouse email" value={draft.spouseEmail ?? ''} onChangeText={value => setDraft(current => ({ ...current, spouseEmail: value }))} keyboardType="email-address" autoCapitalize="none" />
            <Field label="Mobile" value={draft.mobileNumber ?? ''} onChangeText={value => setDraft(current => ({ ...current, mobileNumber: value }))} keyboardType="phone-pad" />
            <Field label="Address" value={draft.address ?? ''} onChangeText={value => setDraft(current => ({ ...current, address: value }))} multiline />
          </>
        ) : (
          <>
            <Info label="Email" value={profile.email} />
            <Info label="Spouse email" value={profile.spouseEmail ?? ''} />
            <Info label="Mobile" value={profile.mobileNumber ?? ''} />
            <Info label="Address" value={profile.address ?? ''} />
          </>
        )}
      </ProfileCard>

      <ProfileCard title="Communication preferences" icon="notifications-outline" editing={editing === 'preferences'} onEdit={() => begin('preferences')} onSave={saveProfile} onCancel={cancel} busy={busy}>
        <View style={d.pills}>
          <Preference label="Email" checked={editing === 'preferences' ? !!draft.emailOptIn : !!profile.emailOptIn} editable={editing === 'preferences'} onPress={() => setDraft(current => ({ ...current, emailOptIn: !current.emailOptIn }))} />
          <Preference label="Text" checked={editing === 'preferences' ? !!draft.textOptIn : !!profile.textOptIn} editable={editing === 'preferences'} onPress={() => setDraft(current => ({ ...current, textOptIn: !current.textOptIn }))} />
        </View>
      </ProfileCard>

      <ProfileCard title="Seva & volunteering" icon="heart-outline" editing={editing === 'volunteering'} onEdit={() => begin('volunteering')} onSave={saveVolunteers} onCancel={cancel} busy={busy}>
        {(editing === 'volunteering' ? volunteerDraft : volunteers).length === 0 ? <Text style={d.small}>No volunteering preferences selected.</Text> : null}
        {(editing === 'volunteering' ? volunteerDraft : volunteers).map((volunteer, index) => volunteer.active === false ? null : (
          <View key={String(volunteer.id ?? `${volunteer.memberType}-${index}`)} style={[d.row, { alignItems: 'flex-start' }]}>
            <View style={{ flex: 1, gap: 7 }}>
              <Text style={d.rowTitle}>{volunteer.name || volunteer.memberTypeLabel || volunteerLabel(volunteer.memberType)}</Text>
              <Text style={d.small}>{volunteer.memberTypeLabel || volunteerLabel(volunteer.memberType)}</Text>
              {editing === 'volunteering' ? (
                <>
                  <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: volunteer.interested }} onPress={() => updateVolunteer(index, { interested: !volunteer.interested })} style={{ minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name={volunteer.interested ? 'checkbox' : 'square-outline'} size={21} color={volunteer.interested ? colors.green : colors.muted} />
                    <Text style={d.small}>Interested in volunteering</Text>
                  </Pressable>
                  {volunteer.interested ? <View style={d.pills}>{volunteerAreas.map(area => <Area key={area} area={area} checked={(volunteer.areas ?? []).includes(area)} onPress={() => updateVolunteerArea(index, area)} />)}</View> : null}
                </>
              ) : volunteer.interested ? (
                <View style={d.pills}>{(volunteer.areas ?? []).map(area => <View key={area} style={[d.pill, { backgroundColor: colors.greenSoft, borderColor: '#9DBFAE' }]}><Text style={[d.pillText, { color: colors.greenInk }]}>{area}</Text></View>)}</View>
              ) : <Text style={d.small}>Not currently volunteering</Text>}
            </View>
          </View>
        ))}
      </ProfileCard>
    </View>
  );

  function updateVolunteer(index: number, changes: Partial<Volunteer>) {
    setVolunteerDraft(current => current.map((volunteer, itemIndex) => itemIndex === index ? { ...volunteer, ...changes } : volunteer));
  }

  function updateVolunteerArea(index: number, area: string) {
    const volunteer = volunteerDraft[index];
    const areas = volunteer.areas ?? [];
    updateVolunteer(index, { areas: areas.includes(area) ? areas.filter(value => value !== area) : [...areas, area] });
  }
}

function ProfileCard({ title, icon, editing, onEdit, onSave, onCancel, busy, children }: { title: string; icon: ComponentProps<typeof Ionicons>['name']; editing: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void; busy: boolean; children: ReactNode }) {
  return (
    <View style={[d.adminCard, { gap: 12 }]}>
      <View style={d.adminHead}>
        <View style={[d.noticeIcon, { backgroundColor: colors.saffronTint }]}><Ionicons name={icon} size={20} color={colors.saffronDeep} /></View>
        <Text accessibilityRole="header" style={[d.rowTitle, { flex: 1, fontSize: 17 }]}>{title}</Text>
        {!editing ? <Pressable accessibilityRole="button" onPress={onEdit} style={({ pressed }) => [d.edit, pressed && d.pressed]}><Text style={d.editText}>Edit</Text></Pressable> : null}
      </View>
      {children}
      {editing ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable accessibilityRole="button" disabled={busy} onPress={onSave} style={({ pressed }) => [d.addButton, busy && d.disabled, pressed && d.pressed]}><Text style={d.addText}>{busy ? 'Saving…' : 'Save'}</Text></Pressable>
          <Pressable accessibilityRole="button" disabled={busy} onPress={onCancel} style={({ pressed }) => [d.outline, { minHeight: 40, paddingHorizontal: 14 }, pressed && d.pressed]}><Text style={d.outlineText}>Cancel</Text></Pressable>
        </View>
      ) : null}
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={{ gap: 2, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 8 }}><Text style={d.label}>{label.toUpperCase()}</Text><Text style={d.body}>{value || '—'}</Text></View>;
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return <View style={{ gap: 6 }}><Text style={d.label}>{label}</Text><TextInput placeholderTextColor="#8A8174" style={[d.input, props.multiline && { minHeight: 82, textAlignVertical: 'top' }]} {...props} /></View>;
}

function Preference({ label, checked, editable, onPress }: { label: string; checked: boolean; editable: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole={editable ? 'checkbox' : 'text'} accessibilityState={editable ? { checked } : undefined} disabled={!editable} onPress={onPress} style={[d.pill, { backgroundColor: checked ? colors.greenSoft : colors.sand, borderColor: checked ? '#9DBFAE' : colors.line }]}><Ionicons name={checked ? 'checkmark-circle' : 'close-circle-outline'} size={16} color={checked ? colors.green : colors.muted} /><Text style={[d.pillText, { color: checked ? colors.greenInk : colors.body }]}>{label}: {checked ? 'Yes' : 'No'}</Text></Pressable>;
}

function Area({ area, checked, onPress }: { area: string; checked: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={[d.pill, { backgroundColor: checked ? colors.greenSoft : colors.card, borderColor: checked ? '#9DBFAE' : colors.line }]}><Text style={[d.pillText, { color: checked ? colors.greenInk : colors.body }]}>{area}</Text></Pressable>;
}

function volunteerLabel(type: string) {
  if(type === 'primary') return 'Primary Member';
  if(type === 'spouse') return 'Spouse';
  return 'Additional Family Member';
}
