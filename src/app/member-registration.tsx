import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBox, TopBar } from '../components/donate/parts';
import { colors, d } from '../components/donate/styles';
import { errorMessage } from '../lib/api';
import { registerMembership } from '../lib/member';

const volunteerAreas = ['Pooja', 'Annadhanam', 'Bhajan', 'Media', 'Decorations'];

export default function MemberRegistrationScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [spouseFirstName, setSpouseFirstName] = useState('');
  const [spouseLastName, setSpouseLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [noOfAdults, setNoOfAdults] = useState('');
  const [noOfKids, setNoOfKids] = useState('');
  const [primaryInterested, setPrimaryInterested] = useState(false);
  const [spouseInterested, setSpouseInterested] = useState(false);
  const [primaryAreas, setPrimaryAreas] = useState<string[]>([]);
  const [spouseAreas, setSpouseAreas] = useState<string[]>([]);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [textOptIn, setTextOptIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = mobileNumber.replace(/\D/g, '');
  const valid = !!firstName.trim() && !!lastName.trim() && validEmail && phoneDigits.length === 10;
  const hasSpouse = !!(spouseFirstName.trim() || spouseLastName.trim());

  const toggleArea = (area: string, values: string[], update: (next: string[]) => void) => {
    update(values.includes(area) ? values.filter(value => value !== area) : [...values, area]);
  };

  const submit = async () => {
    if(!valid || busy) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const message = await registerMembership({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        spouseFirstName: spouseFirstName.trim(),
        spouseLastName: spouseLastName.trim(),
        email: email.trim().toLowerCase(),
        mobileNumber: phoneDigits,
        address: address.trim(),
        noOfAdults,
        noOfKids,
        primaryVolunteer: { interested: primaryInterested, areas: primaryInterested ? primaryAreas : [] },
        spouseVolunteer: { interested: hasSpouse && spouseInterested, areas: hasSpouse && spouseInterested ? spouseAreas : [] },
        additionalVolunteers: [],
        emailOptIn,
        textOptIn,
      });
      setSuccess(message);
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="Back" title="Membership" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={d.scroll} keyboardShouldPersistTaps="handled">
          <View style={{ gap: 6 }}>
            <Text style={d.eyebrow}>BELONG & PARTICIPATE</Text>
            <Text accessibilityRole="header" style={[d.title, { fontSize: 28 }]}>Become an AAYSSA member</Text>
            <Text style={d.body}>Register your household, stay connected, and volunteer with the Sangam.</Text>
          </View>

          <View style={[d.infoBox, { gap: 10 }]}>
            <Text style={d.rowTitle}>Already registered?</Text>
            <Text style={d.small}>Do not submit another registration. Sign in with your existing membership email.</Text>
            <Pressable accessibilityRole="button" onPress={() => router.replace({ pathname: '/login', params: { next: '/community' } })} style={({ pressed }) => [d.outline, pressed && d.pressed]}>
              <Text style={d.outlineText}>Member sign in</Text>
            </Pressable>
          </View>

          {success ? (
            <View style={[d.infoBox, { backgroundColor: colors.greenSoft, gap: 12 }]}>
              <Ionicons name="checkmark-circle" size={30} color={colors.green} />
              <Text accessibilityRole="header" style={d.rowTitle}>Registration submitted</Text>
              <Text style={d.body}>{success}</Text>
              <Pressable accessibilityRole="button" onPress={() => router.replace({ pathname: '/login', params: { next: '/community' } })} style={({ pressed }) => [d.primary, d.primaryGreen, pressed && d.pressed]}>
                <Text style={d.primaryText}>Continue to member sign in</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text accessibilityRole="header" style={d.section}>Member information</Text>
              <Field label="First name *" value={firstName} onChangeText={setFirstName} autoComplete="given-name" textContentType="givenName" />
              <Field label="Last name *" value={lastName} onChangeText={setLastName} autoComplete="family-name" textContentType="familyName" />
              <Field label="Email *" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
              <Field label="10-digit U.S. mobile number *" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
              <Field label="Address" value={address} onChangeText={setAddress} autoComplete="street-address" textContentType="fullStreetAddress" multiline />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}><Field label="Adults (18+)" value={noOfAdults} onChangeText={value => setNoOfAdults(value.replace(/\D/g, ''))} keyboardType="number-pad" /></View>
                <View style={{ flex: 1 }}><Field label="Kids" value={noOfKids} onChangeText={value => setNoOfKids(value.replace(/\D/g, ''))} keyboardType="number-pad" /></View>
              </View>

              <Text accessibilityRole="header" style={d.section}>Spouse information</Text>
              <Field label="Spouse first name" value={spouseFirstName} onChangeText={setSpouseFirstName} />
              <Field label="Spouse last name" value={spouseLastName} onChangeText={setSpouseLastName} />

              <Text accessibilityRole="header" style={d.section}>Volunteer with AAYSSA</Text>
              <VolunteerChoices title="Primary member" interested={primaryInterested} setInterested={setPrimaryInterested} selected={primaryAreas} toggle={area => toggleArea(area, primaryAreas, setPrimaryAreas)} />
              {hasSpouse ? <VolunteerChoices title="Spouse" interested={spouseInterested} setInterested={setSpouseInterested} selected={spouseAreas} toggle={area => toggleArea(area, spouseAreas, setSpouseAreas)} /> : null}

              <Text accessibilityRole="header" style={d.section}>Stay connected</Text>
              <CheckRow label="Email updates, announcements and event information" checked={emailOptIn} onPress={() => setEmailOptIn(value => !value)} />
              <CheckRow label="Text updates and important event notifications" checked={textOptIn} onPress={() => setTextOptIn(value => !value)} />

              {error ? <ErrorBox message={error} /> : null}
              {!valid && (email || mobileNumber) ? <Text style={[d.small, { color: colors.saffronDeep }]}>Enter your name, a valid email, and a 10-digit U.S. mobile number.</Text> : null}

              <Pressable accessibilityRole="button" disabled={!valid || busy} onPress={submit} style={({ pressed }) => [d.primary, d.primaryGreen, (!valid || busy) && d.disabled, pressed && d.pressed]}>
                <Text style={d.primaryText}>{busy ? 'Registering…' : 'Register with AAYSSA'}</Text>
              </Pressable>
              <Text style={[d.small, { textAlign: 'center' }]}>Internet access is required to submit registration.</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={d.label}>{label}</Text>
      <TextInput placeholderTextColor="#8A8174" style={[d.input, props.multiline && { minHeight: 88, textAlignVertical: 'top' }]} {...props} />
    </View>
  );
}

function VolunteerChoices({ title, interested, setInterested, selected, toggle }: { title: string; interested: boolean; setInterested: (value: boolean) => void; selected: string[]; toggle: (area: string) => void }) {
  return (
    <View style={[d.adminCard, { gap: 10 }]}>
      <Text style={d.rowTitle}>{title}</Text>
      <CheckRow label="Interested in volunteering" checked={interested} onPress={() => setInterested(!interested)} />
      {interested ? (
        <View style={d.pills}>
          {volunteerAreas.map(area => (
            <Pressable key={area} accessibilityRole="checkbox" accessibilityState={{ checked: selected.includes(area) }} onPress={() => toggle(area)} style={[d.pill, selected.includes(area) ? { backgroundColor: colors.greenSoft, borderColor: '#9DBFAE' } : { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Text style={[d.pillText, { color: selected.includes(area) ? colors.greenInk : colors.body }]}>{area}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function CheckRow({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={({ pressed }) => [d.row, { minHeight: 54 }, pressed && d.pressed]}>
      <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={23} color={checked ? colors.green : colors.muted} />
      <Text style={[d.body, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}
