import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBox, TopBar } from '../components/donate/parts';
import { colors, d } from '../components/donate/styles';
import { errorMessage } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';

const ALLOWED_NEXT = ['/my-donations', '/admin/campaigns', '/donate'] as const;
type Next = typeof ALLOWED_NEXT[number];

/** Member sign-in with the same email passcode as the website portal. */
export default function LoginScreen() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const destination: Next = ALLOWED_NEXT.find(path => path === next) ?? '/donate';
  const { requestCode, signIn } = useAuth();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validCode = /^\d{6,10}$/.test(code.trim());

  const sendCode = async () => {
    if(!validEmail || busy) return;
    setBusy(true);
    setError('');
    try {
      setMessage(await requestCode(email));
      setStep('code');
    } catch(e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if(!validCode || busy) return;
    setBusy(true);
    setError('');
    try {
      await signIn(email, code);
      router.replace(destination);
    } catch(e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={d.screen} edges={['top', 'left', 'right', 'bottom']}>
      <TopBar label="Back" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={d.scroll} keyboardShouldPersistTaps="handled">
          <View style={{ gap: 6 }}>
            <Text style={d.eyebrow}>MEMBERS</Text>
            <Text accessibilityRole="header" style={[d.title, { fontSize: 26 }]}>Member sign in</Text>
            <Text style={d.body}>
              {step === 'email'
                ? 'Enter your AAYSSA membership email (primary or spouse). We’ll email you a one-time passcode.'
                : message || 'Check your email for the passcode.'}
            </Text>
          </View>

          {step === 'email' ? (
            <View style={{ gap: 6 }}>
              <Text nativeID="emailLabel" style={d.label}>Email</Text>
              <TextInput
                accessibilityLabelledBy="emailLabel"
                accessibilityLabel="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={sendCode}
                placeholder="you@example.com"
                placeholderTextColor="#8A8174"
                style={d.input}
              />
            </View>
          ) : (
            <View style={{ gap: 6 }}>
              <Text nativeID="codeLabel" style={d.label}>Passcode</Text>
              <TextInput
                accessibilityLabelledBy="codeLabel"
                accessibilityLabel="Passcode"
                value={code}
                onChangeText={text => setCode(text.replace(/\D/g, ''))}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={verify}
                placeholder="123456"
                placeholderTextColor="#8A8174"
                style={[d.input, { fontSize: 22, letterSpacing: 4 }]}
              />
              <Pressable accessibilityRole="button" onPress={() => { setStep('email'); setCode(''); setError(''); }} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ color: colors.green, fontWeight: '700' }}>Use a different email</Text>
              </Pressable>
            </View>
          )}

          {error ? <ErrorBox message={error} /> : null}

          <Pressable
            accessibilityRole="button"
            disabled={busy || (step === 'email' ? !validEmail : !validCode)}
            onPress={step === 'email' ? sendCode : verify}
            style={({ pressed }) => [d.primary, d.primaryGreen, (busy || (step === 'email' ? !validEmail : !validCode)) && d.disabled, pressed && d.pressed]}>
            <Text style={d.primaryText}>{busy ? 'Please wait…' : step === 'email' ? 'Email me a passcode' : 'Sign in'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
