import { Platform, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBF8F2'
  },
  safeHeader: {
    backgroundColor: '#FBF8F2'
  },
  pressed: {
    opacity: 0.7
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E1D5'
  },
  logo: {
    width: 48,
    height: 48
  },
  brand: {
    flex: 1,
    marginLeft: 10
  },
  brandName: {
    fontSize: 23,
    fontWeight: '800',
    color: '#3A3127',
    letterSpacing: 2
  },
  brandSub: {
    fontSize: 8,
    letterSpacing: 1.1,
    color: '#746553',
    marginTop: 3
  },
  member: {
    padding: 10,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFE6D8',
    borderRadius: 24
  },
  content: {
    padding: 22,
    paddingBottom: 30
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#99713A',
    marginBottom: 16
  },
  hero: {
    backgroundColor: '#B84A0A',
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden'
  },
  halo: {
    position: 'absolute',
    right: -68,
    top: -74,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: '#FFFFFF26',
    backgroundColor: '#FFFFFF08',
    alignItems: 'center',
    justifyContent: 'center'
  },
  haloInner: {
    width: 166,
    height: 166,
    borderRadius: 83,
    borderWidth: 1,
    borderColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 1,
    gap: 8,
    backgroundColor: '#FFFFFF14',
    borderWidth: 1,
    borderColor: '#FFFFFF30',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 26
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5CE9B'
  },
  heroKicker: {
    flexShrink: 1,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    lineHeight: 16,
    color: '#FFF9E9'
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.9,
    color: '#FFF9E9'
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 24,
    color: '#FFF9E9',
    marginTop: 16,
    maxWidth: 310
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 56,
    backgroundColor: '#FFF9EF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 24
  },
  heroButtonText: {
    flex: 1,
    color: '#A54008',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24
  },
  heroFooterLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF35'
  },
  heroFoot: {
    flexShrink: 1,
    color: '#FFF9E9',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'center'
  },
  homeGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18
  },
  homeEyebrow: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 1.2,
    color: '#94542C'
  },
  homePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  homeSection: {
    marginTop: 30,
    gap: 16
  },
  homeSectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.5,
    color: '#362F26'
  },
  homeMapCard: {
    overflow: 'hidden',
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#E7DCCD',
    borderRadius: 22,
    paddingBottom: 16
  },
  homeMapPreview: {
    height: 132,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDE9DF'
  },
  homeMapRoad: {
    position: 'absolute',
    height: 17,
    borderWidth: 4,
    borderColor: '#F4EFE6',
    backgroundColor: '#FFFFFF'
  },
  homeMapPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B84A0A',
    borderWidth: 4,
    borderColor: '#FFF9E9'
  },
  homeMapCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 15
  },
  homeSocialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  homeSocialButton: {
    width: '48%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#E7DCCD',
    borderRadius: 15,
    backgroundColor: '#FFFDF9'
  },
  homeSocialText: {
    flex: 1,
    color: '#493D31',
    fontSize: 13,
    fontWeight: '700'
  },
  homeNotice: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#EFDFD0',
    borderRadius: 24,
    padding: 22
  },
  homeNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18
  },
  homeNoticeIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E3',
    borderRadius: 14
  },
  homeNoticeTag: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 1.5,
    color: '#A54008'
  },
  homeNoticeTitle: {
    fontSize: 21,
    fontWeight: '600',
    lineHeight: 28,
    color: '#3B3125'
  },
  homeNoticeBody: {
    fontSize: 14,
    lineHeight: 23,
    marginTop: 10,
    color: '#70665A'
  },
  homeNoticeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 56,
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#B84A0A',
    borderRadius: 16
  },
  homeNoticeButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    color: '#FFF9E9'
  },
  section: {
    fontSize: 21,
    fontWeight: '600',
    color: '#362F26',
    marginTop: 28,
    marginBottom: 14
  },
  notice: {
    padding: 22,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#E8DDCB',
    borderRadius: 18,
    marginTop: 6
  },
  tag: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: '#8E6428',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '600',
    color: '#3B3125'
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: '#70665A',
    marginTop: 10,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#B84A0A',
    borderRadius: 11,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
    minHeight: 48
  },
  buttonText: {
    color: '#FFF9E9',
    fontSize: 14,
    fontWeight: '700'
  },
  secondary: {
    backgroundColor: '#F1EADD'
  },
  secondaryText: {
    color: '#3D4B3C'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },
  tile: {
    flexBasis: '45%',
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#EFDFD0',
    padding: 18,
    borderRadius: 22,
    minHeight: 162,
    shadowColor: '#6B341E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 18
  },
  tileMark: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E3',
    borderRadius: 15
  },
  tileTitle: {
    color: '#3B3125',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700'
  },
  tileSubtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: '#776858'
  },
  quote: {
    marginTop: 28,
    padding: 22,
    borderRadius: 22,
    gap: 12,
    backgroundColor: '#F6ECE0'
  },
  quoteText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 20,
    lineHeight: 29,
    color: '#69452C'
  },
  quoteAttribution: {
    fontSize: 11,
    lineHeight: 18,
    color: '#776858'
  },
  small: {
    fontSize: 12,
    lineHeight: 19,
    color: '#776E61'
  },
  pageTitle: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2E4435'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0D4',
    minHeight: 82
  },
  symbol: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#EEE6D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  rowCopy: {
    flex: 1,
    minWidth: 0
  },
  rowTitle: {
    fontSize: 16,
    color: '#394334',
    fontWeight: '600',
    marginBottom: 4
  },
  info: {
    padding: 16,
    backgroundColor: '#EFEEE7',
    borderRadius: 12,
    marginTop: 22
  },
  search: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#DCD4C6',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
    color: '#263D31'
  },
  location: {
    padding: 20,
    backgroundColor: '#F0EBE1',
    borderRadius: 16,
    marginTop: 24
  },
  footer: {
    fontSize: 10,
    lineHeight: 17,
    color: '#92877A',
    textAlign: 'center',
    marginTop: 30
  }
});
