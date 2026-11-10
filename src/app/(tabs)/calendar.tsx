import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomePoojaAccess } from '../../components/calendar/HomePoojaAccess';
import { errorMessage } from '../../lib/api';
import { fetchHomePoojaCalendar, type CalendarDate, type HomePoojaCalendar } from '../../lib/calendar';
import { calendarCells, monthKey, monthKeys } from '../../lib/calendarGrid';
import { useOpenLink } from '../../providers/LinkProvider';

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

function labelForMonth(key: string) {
  const [year, month] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
}

function labelForDate(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(year, month - 1, day));
}

function eventTitle(item: CalendarDate) {
  if(item.status === 'Blocked') return item.eventName || item.reason || 'AAYSSA event';
  if(item.status === 'Booked') return item.requesterName ? `Home Pooja · ${item.requesterName}` : 'Home Pooja';
  return 'Home Pooja available';
}

export default function CalendarScreen() {
  const { openExternal } = useOpenLink();
  const [calendar, setCalendar] = useState<HomePoojaCalendar | null>(null);
  const [activeMonth, setActiveMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if(refresh) setRefreshing(true);
    try {
      const next = await fetchHomePoojaCalendar();
      setError('');
      setCalendar(next);
      const keys = monthKeys(next.from, next.to);
      const preferred = keys.includes(monthKey(todayKey)) ? monthKey(todayKey) : keys[0] ?? '';
      setActiveMonth(current => keys.includes(current) ? current : preferred);
      setSelectedDate(current => next.dates.some(item => item.date === current)
        ? current
        : next.dates.find(item => monthKey(item.date) === preferred)?.date ?? '');
    } catch(caught) {
      setError(errorMessage(caught));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Loading from the live calendar API is the external synchronization for this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const months = useMemo(() => calendar ? monthKeys(calendar.from, calendar.to) : [], [calendar]);
  const dates = useMemo(() => new Map(calendar?.dates.map(item => [item.date, item]) ?? []), [calendar]);
  const cells = useMemo(() => activeMonth ? calendarCells(activeMonth) : [], [activeMonth]);
  const selected = selectedDate ? dates.get(selectedDate) : undefined;
  const selectedAddress = selected?.eventAddress || selected?.poojaAddress;
  const monthIndex = months.indexOf(activeMonth);

  const changeMonth = (offset: number) => {
    const next = months[monthIndex + offset];
    if(!next) return;
    setActiveMonth(next);
    setSelectedDate(calendar?.dates.find(item => monthKey(item.date) === next)?.date ?? '');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={['#B84A0A']} tintColor="#B84A0A" />}>
      <View style={styles.intro}>
        <View style={styles.eyebrowRow}>
          <Ionicons name="calendar-outline" size={16} color="#B84A0A" />
          <Text style={styles.eyebrow}>HOME POOJA & EVENTS</Text>
        </View>
        <Text accessibilityRole="header" style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Plan your visit and view current Home Pooja availability.</Text>
      </View>

      {error ? (
        <View style={styles.messageCard}>
          <Ionicons name="cloud-offline-outline" size={28} color="#A54008" />
          <Text style={styles.messageTitle}>Calendar unavailable</Text>
          <Text style={styles.messageBody}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => load()} style={({ pressed }) => [styles.retry, pressed && styles.pressed]}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!calendar && !error ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Loading calendar…</Text>
        </View>
      ) : null}

      {calendar ? (
        <>
          <View style={styles.calendarCard}>
            <View style={styles.monthHeader}>
              <Pressable accessibilityRole="button" accessibilityLabel="Previous month" disabled={monthIndex <= 0} onPress={() => changeMonth(-1)} style={({ pressed }) => [styles.monthButton, monthIndex <= 0 && styles.disabled, pressed && styles.pressed]}>
                <Ionicons name="chevron-back" size={22} color="#704300" />
              </Pressable>
              <Text accessibilityRole="header" style={styles.monthTitle}>{labelForMonth(activeMonth)}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Next month" disabled={monthIndex < 0 || monthIndex >= months.length - 1} onPress={() => changeMonth(1)} style={({ pressed }) => [styles.monthButton, (monthIndex < 0 || monthIndex >= months.length - 1) && styles.disabled, pressed && styles.pressed]}>
                <Ionicons name="chevron-forward" size={22} color="#704300" />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {weekdays.map((day, index) => <Text key={`${day}-${index}`} style={styles.weekday}>{day}</Text>)}
            </View>
            <View style={styles.grid}>
              {cells.map((date, index) => {
                const item = date ? dates.get(date) : undefined;
                const selectedCell = date === selectedDate;
                const statusStyle = item?.status === 'Available'
                  ? styles.available
                  : item?.status === 'Booked'
                    ? styles.booked
                    : item?.status === 'Blocked'
                      ? styles.blocked
                      : undefined;
                return (
                  <View key={date ?? `empty-${index}`} style={styles.cellWrap}>
                    {date ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${labelForDate(date)}${item ? `, ${eventTitle(item)}` : ', no published event'}`}
                        onPress={() => item && setSelectedDate(date)}
                        style={({ pressed }) => [styles.day, statusStyle, selectedCell && styles.selected, date === todayKey && styles.today, pressed && item && styles.pressed]}>
                        <Text style={[styles.dayNumber, item && styles.activeDayNumber, selectedCell && styles.selectedText]}>{Number(date.slice(-2))}</Text>
                        {item ? <View style={[styles.dot, item.status === 'Available' ? styles.availableDot : item.status === 'Booked' ? styles.bookedDot : styles.blockedDot]} /> : null}
                      </Pressable>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}><View style={[styles.legendDot, styles.availableDot]} /><Text style={styles.legendText}>Available</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, styles.bookedDot]} /><Text style={styles.legendText}>Home Pooja</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, styles.blockedDot]} /><Text style={styles.legendText}>AAYSSA event</Text></View>
            </View>
          </View>

          {selected ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailDate}>{labelForDate(selected.date).toUpperCase()}</Text>
              <Text accessibilityRole="header" style={styles.detailTitle}>{eventTitle(selected)}</Text>
              <View style={styles.detailLine}>
                <Ionicons name="time-outline" size={19} color="#8A5126" />
                <Text style={styles.detailText}>{selected.eventTime || selected.bookingTime || selected.time || 'Time to be announced'}</Text>
              </View>
              {selectedAddress ? (
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={`Open ${selectedAddress} in Google Maps`}
                  onPress={() => openExternal(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`)}
                  style={({ pressed }) => [styles.detailLine, styles.addressLink, pressed && styles.pressed]}>
                  <Ionicons name="location-outline" size={19} color="#8A5126" />
                  <Text style={styles.detailText}>{selectedAddress}</Text>
                  <Ionicons name="open-outline" size={18} color="#8A5126" />
                </Pressable>
              ) : null}
              {selected.reason && selected.reason !== eventTitle(selected) ? <Text style={styles.detailNote}>{selected.reason}</Text> : null}
            </View>
          ) : (
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>No published dates this month</Text>
              <Text style={styles.detailNote}>Use the arrows to view another month, or pull down to refresh.</Text>
            </View>
          )}

          <HomePoojaAccess selectedDate={selectedDate} selectedItem={selected} onChanged={() => load()} />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBF8F2' },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 20, paddingBottom: 36, gap: 20 },
  intro: { gap: 8 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrow: { color: '#94542C', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#362F26', fontSize: 32, lineHeight: 38, fontWeight: '800' },
  subtitle: { color: '#6E6255', fontSize: 15, lineHeight: 22 },
  calendarCard: { backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#E8DED0', borderRadius: 24, padding: 14, shadowColor: '#5A3418', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  monthButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5EBDD', alignItems: 'center', justifyContent: 'center' },
  monthTitle: { color: '#4D3523', fontSize: 19, fontWeight: '800' },
  disabled: { opacity: 0.28 },
  pressed: { opacity: 0.65 },
  weekRow: { flexDirection: 'row', marginBottom: 5 },
  weekday: { flex: 1, color: '#8B7C6C', fontSize: 11, fontWeight: '800', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrap: { width: '14.2857%', padding: 2 },
  day: { aspectRatio: 0.92, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent', backgroundColor: '#FAF7F1', gap: 5 },
  dayNumber: { color: '#AAA095', fontSize: 14, fontWeight: '600' },
  activeDayNumber: { color: '#40362C', fontWeight: '800' },
  available: { backgroundColor: '#E9F6ED', borderColor: '#B9DBC3' },
  booked: { backgroundColor: '#FFF0C9', borderColor: '#E3B95E' },
  blocked: { backgroundColor: '#EEEAE5', borderColor: '#D5D1CC' },
  selected: { borderWidth: 2, borderColor: '#B84A0A', backgroundColor: '#B84A0A' },
  selectedText: { color: '#FFF9E9' },
  today: { borderColor: '#B84A0A' },
  dot: { width: 5, height: 5, borderRadius: 3 },
  availableDot: { backgroundColor: '#3C8B55' },
  bookedDot: { backgroundColor: '#C68111' },
  blockedDot: { backgroundColor: '#766E65' },
  legend: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 14, marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#74685B', fontSize: 11, fontWeight: '600' },
  detailCard: { backgroundColor: '#FFF7E8', borderWidth: 1, borderColor: '#EAD1AC', borderRadius: 22, padding: 20, gap: 12 },
  detailDate: { color: '#A55017', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  detailTitle: { color: '#3E3125', fontSize: 20, lineHeight: 27, fontWeight: '800' },
  detailLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  addressLink: { minHeight: 44, paddingVertical: 8, marginVertical: -8 },
  detailText: { flex: 1, color: '#5D5146', fontSize: 14, lineHeight: 21 },
  detailNote: { color: '#76685B', fontSize: 13, lineHeight: 20 },
  messageCard: { alignItems: 'center', backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#E8DED0', borderRadius: 22, padding: 26, gap: 10 },
  messageTitle: { color: '#3E3125', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  messageBody: { color: '#76685B', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  retry: { backgroundColor: '#B84A0A', borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12, marginTop: 4 },
  retryText: { color: '#FFF9E9', fontSize: 14, fontWeight: '800' },
});
