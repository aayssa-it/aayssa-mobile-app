import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { api, errorMessage } from '../lib/api';
import { styles as s } from '../theme';

const categories = [
  'Pooja',
  'Annadhanam',
  'Bhajan',
  'Media',
  'Events and Programs',
  'Volunteering and Seva',
  'Membership and Member Portal',
  'Facilities and Logistics',
  'Finance and Donations',
  'General Suggestion',
  'Other',
] as const;

type FeedbackResponse = { success: boolean; message: string };

export function FeedbackCard() {
  const [category, setCategory] = useState<(typeof categories)[number]>('General Suggestion');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async () => {
    const message = feedback.trim();
    if(!message || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await api<FeedbackResponse>('/register?resource=feedback', {
        method: 'POST',
        body: {
          category,
          feedback: message,
          anonymous: true,
          name: '',
          email: '',
          phoneNumber: '',
          mayContact: false,
          website: '',
        },
      });
      setFeedback('');
      setSuccess(result.message || 'Thank you. Your feedback has been submitted to AAYSSA.');
    } catch(e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.homeSection}>
      <Text accessibilityRole="header" style={s.homeSectionTitle}>Help us serve better</Text>
      <Text style={s.body}>Share an anonymous comment or suggestion with AAYSSA.</Text>
      <View style={styles.card}>
        {success ? <>
          <Text accessibilityRole="header" style={s.cardTitle}>Thank you</Text>
          <Text accessibilityLiveRegion="polite" style={styles.success}>{success}</Text>
          <Pressable accessibilityRole="button" onPress={() => setSuccess('')} style={({ pressed }) => [s.button, pressed && s.pressed]}>
            <Text style={s.buttonText}>Submit another response</Text>
          </Pressable>
        </> : <>
          <Text style={styles.label}>Category</Text>
          <View accessibilityRole="radiogroup" style={styles.categories}>
            {categories.map(item => {
              const selected = category === item;
              return <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => setCategory(item)} style={({ pressed }) => [styles.category, selected && styles.categorySelected, pressed && s.pressed]}>
                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item}</Text>
              </Pressable>;
            })}
          </View>
          <Text nativeID="feedbackLabel" style={styles.label}>Feedback, comment, or suggestion</Text>
          <TextInput
            accessibilityLabelledBy="feedbackLabel"
            value={feedback}
            onChangeText={setFeedback}
            placeholder="How can AAYSSA serve the community better?"
            placeholderTextColor="#8A8174"
            multiline
            maxLength={5000}
            textAlignVertical="top"
            style={styles.input}
          />
          <Text style={styles.count}>{feedback.length}/5000</Text>
          {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || !feedback.trim() }} disabled={busy || !feedback.trim()} onPress={submit} style={({ pressed }) => [s.button, (busy || !feedback.trim()) && styles.disabled, pressed && s.pressed]}>
            <Text style={s.buttonText}>{busy ? 'Submitting…' : 'Submit feedback'}</Text>
          </Pressable>
          <Text style={s.small}>Feedback is submitted anonymously.</Text>
        </>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#E7DCCD',
    borderRadius: 22,
  },
  label: {
    marginTop: 6,
    marginBottom: 10,
    color: '#3B3125',
    fontSize: 14,
    fontWeight: '700',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  category: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCCDBA',
    backgroundColor: '#F7F1E8',
  },
  categorySelected: {
    borderColor: '#B84A0A',
    backgroundColor: '#B84A0A',
  },
  categoryText: {
    color: '#5F5549',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#FFF9E9',
  },
  input: {
    minHeight: 130,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DCCDBA',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    color: '#3B3125',
    fontSize: 15,
    lineHeight: 22,
  },
  count: {
    marginTop: 6,
    color: '#8A8174',
    fontSize: 11,
    textAlign: 'right',
  },
  error: {
    marginTop: 12,
    color: '#A12D24',
    fontSize: 14,
    lineHeight: 20,
  },
  success: {
    marginTop: 10,
    color: '#286A3B',
    fontSize: 15,
    lineHeight: 23,
  },
  disabled: {
    opacity: 0.5,
  },
});
