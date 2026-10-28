import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, Linking, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

const SITE = 'https://atlantaayyappasevasangam.org';
type Tab = 'Home' | 'Events' | 'Resources' | 'Community';
type Resource = { title: string; subtitle: string; path: string; mark: string };
const resources: Resource[] = [
  {title:'Bhajan book',subtitle:'Devotional songs for your practice',path:'/bhajan-book',mark:'♫'},
  {title:'Vratham guidelines',subtitle:'Prepare for your spiritual journey',path:'/vratham-guidelines',mark:'☼'},
  {title:'Pooja items',subtitle:'A guide to preparing for worship',path:'/pooja-items',mark:'✧'},
  {title:'Namaskara slokam',subtitle:'Prayers and devotional verses',path:'/namaskara-slokam',mark:'◈'},
];
const services: Resource[] = [
  {title:'Maaladharana',subtitle:'Explore the tradition and guidance',path:'/maaladharana',mark:'◉'},
  {title:'Padi pooja',subtitle:'Learn about worship and seva',path:'/padi-pooja',mark:'✧'},
  {title:'Irumudi / Kettu Nira',subtitle:'Find guidance on the official website',path:'/irumudi%2F-kettu-nira',mark:'◈'},
  {title:'Annadhanam',subtitle:'Service through sharing food',path:'/annadhanam',mark:'♡'},
];
type AppPage = { url: string; title: string };
function WebsitePage({ page, close }: { page: AppPage; close: () => void }) {
  const web = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [uri, setUri] = useState(page.url);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const back = () => { if (canGoBack) web.current?.goBack(); else close(); };
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) web.current?.goBack(); else close();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack, close]);
  return <View style={{flex:1}}>
    <View style={{flexDirection:'row',alignItems:'center',padding:14,borderBottomWidth:1,borderBottomColor:'#E9E1D5',gap:12}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={back} style={{padding:10,minHeight:44}}><Text style={{color:'#B84A0A',fontWeight:'700'}}>‹ Back</Text></Pressable>
      <Text numberOfLines={1} style={{flex:1,fontSize:17,fontWeight:'600',color:'#3B3125'}}>{page.title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Close page and return to app" onPress={close} style={{padding:10,minHeight:44}}><Text style={{color:'#B84A0A',fontWeight:'700'}}>Done</Text></Pressable>
    </View>
    {failed ? <View style={{padding:24,flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text accessibilityRole="alert" style={{fontSize:18,fontWeight:'600',color:'#3a3023'}}>This page could not load.</Text>
      <Text style={{marginTop:12,textAlign:'center',color:'#70665A'}}>Check your internet connection and try again.</Text>
      <Pressable accessibilityRole="button" onPress={()=>{setFailed(false);setLoading(true);setAttempt(v=>v+1);}} style={{padding:16,backgroundColor:'#B84A0A',borderRadius:12,marginTop:20}}><Text style={{color:'white',fontWeight:'700'}}>Try again</Text></Pressable>
    </View> : Platform.OS === 'web' ? React.createElement('iframe', {src:uri,title:page.title,style:{flex:1,width:'100%',border:0},onLoad:()=>setLoading(false)}) : <WebView
      key={attempt}
      ref={web}
      source={{uri}}
      style={{flex:1,backgroundColor:'#FBF8F2'}}
      onLoadStart={()=>setLoading(true)}
      onLoadEnd={()=>setLoading(false)}
      onError={()=>{setFailed(true);setLoading(false);}}
      onHttpError={(event)=>{if(event.nativeEvent.url===uri){setFailed(true);setLoading(false);}}}
      onNavigationStateChange={state=>setCanGoBack(state.canGoBack)}
      onOpenWindow={event=>{const target=event.nativeEvent.targetUrl;if(target.startsWith('https://')){setUri(target);setLoading(true);}}}
      onShouldStartLoadWithRequest={request=>{
        if(request.url.startsWith('https://') || request.url==='about:blank') return true;
        if(request.url.startsWith('mailto:') || request.url.startsWith('tel:')) Linking.openURL(request.url).catch(()=>{});
        return false;
      }}
      allowsBackForwardNavigationGestures
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
    />}
    {loading && !failed && <View pointerEvents="none" style={{position:'absolute',top:72,left:0,right:0,alignItems:'center'}}><ActivityIndicator size="small" color="#B84A0A"/><Text style={{color:'#70665A',backgroundColor:'#FBF8F2',padding:4,fontSize:12}}>Loading…</Text></View>}
  </View>;
}
export default function App() {
  const [page,setPage] = useState<AppPage | null>(null);
  const [tab,setTab] = useState<Tab>('Home');
  const [query,setQuery] = useState('');
  const [error,setError] = useState('');
  async function open(path:string) {
    setError('');
    const url = path === '/calendar' ? 'https://portal.atlantaayyappasevasangam.org/home-pooja-calendar.html' : path === '/member-login' ? 'https://portal.atlantaayyappasevasangam.org/' : path.startsWith('https://') ? path : SITE+path;
    const host = new URL(url).hostname;
    if (host === 'atlantaayyappasevasangam.org' || host.endsWith('.atlantaayyappasevasangam.org')) {
      const labels: Record<string,string> = {'/calendar':'Calendar','/gallery':'Gallery','/contact-us':'Contact us','/member-login':'Member login','/member-registration':'Become a member','/maaladharan-registration':'Maaladharan registration','/about-us':'About AAYSSA','/feedback':'Feedback'};
      const resource = [...resources,...services].find(item=>item.path===path);
      setPage({url,title:resource?.title ?? labels[path] ?? (host.startsWith('portal.') ? 'Member portal' : 'AAYSSA')});
      return;
    }
    try { await Linking.openURL(url); }
    catch { setError('This link could not be opened. Please try again or visit '+SITE); }
  }
  const button = (label:string,path:string,secondary=false) => <Pressable accessibilityRole="link" onPress={()=>open(path)} style={[s.button,secondary&&s.secondary]}><Text style={[s.buttonText,secondary&&s.secondaryText]}>{label} ↗</Text></Pressable>;
  const row = (r:Resource) => <Pressable key={r.path} accessibilityRole="link" onPress={()=>open(r.path)} style={s.row}><View style={s.symbol}><Text style={s.symbolText}>{r.mark}</Text></View><View style={s.rowCopy}><Text style={s.rowTitle}>{r.title}</Text><Text style={s.small}>{r.subtitle}</Text></View><Text style={s.arrow}>↗</Text></Pressable>;
  if (page) return <SafeAreaProvider><SafeAreaView style={s.safe} edges={['top','bottom']}><View style={s.shell}><WebsitePage key={page.url} page={page} close={()=>setPage(null)}/></View></SafeAreaView></SafeAreaProvider>;
  return <SafeAreaProvider><SafeAreaView style={s.safe} edges={['top','bottom']}><StatusBar barStyle="dark-content"/><View style={s.shell}>
    <View style={s.header}><Image source={require('./assets/aayssa-logo.png')} style={s.logo} resizeMode="contain"/><View style={s.brand}><Text style={s.brandName}>AAYSSA</Text><Text style={s.brandSub}>ATLANTA AYYAPPA SEVA SANGAM</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Open community and membership" onPress={()=>setTab('Community')} style={s.member}><Text style={s.memberText}>♙</Text></Pressable></View>
    <ScrollView key={tab} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    {error ? <View accessibilityRole="alert" style={s.error}><Text>{error}</Text><Pressable accessibilityRole="button" onPress={()=>setError('')}><Text style={s.link}>Dismiss</Text></Pressable></View>:null}
    {tab==='Home' && <>
      <Text style={s.eyebrow}>SWAMIYE SARANAM AYYAPPA</Text>
      <View style={s.hero}><View style={s.halo}><Text style={s.heroSymbol}>✧</Text></View><Text style={s.heroKicker}>DEVOTION · UNITY · SEVA</Text><Text style={s.heroTitle}>A community.{'\n'}A shared devotion.</Text><Text style={s.heroBody}>Connect with Ayyappa devotees across Atlanta through worship, fellowship, and service.</Text><Pressable accessibilityRole="button" onPress={()=>setTab('Events')} style={s.heroButton}><Text style={s.heroButtonText}>Explore events  →</Text></Pressable><Text style={s.heroFoot}>THATHVAMASI</Text></View>
      <Text style={s.section}>From the Sangam</Text><View style={s.notice}><Text style={s.tag}>WEBSITE ANNOUNCEMENT</Text><Text style={s.cardTitle}>2026 Maaladharan registration</Text><Text style={s.body}>View the official page for current availability and registration details.</Text>{button('View registration','/maaladharan-registration')}</View>
      <Text style={s.section}>Your community, closer</Text><View style={s.grid}>{[{t:'Calendar',m:'▦',p:'/calendar'},{t:'Gallery',m:'▧',p:'/gallery'},{t:'Member login',m:'♙',p:'/member-login'},{t:'Contact us',m:'✉',p:'/contact-us'}].map(i=><Pressable key={i.t} accessibilityRole="link" onPress={()=>open(i.p)} style={s.tile}><Text style={s.tileMark}>{i.m}</Text><Text style={s.tileTitle}>{i.t} ↗</Text></Pressable>)}</View>
      <View style={s.quote}><Text style={s.quoteText}>Rooted in devotion.{'\n'}Brought together by service.</Text><Text style={s.small}>Atlanta Ayyappa Seva Sangam</Text></View>
    </>}
    {tab==='Events' && <><Text style={s.eyebrow}>COME TOGETHER</Text><Text style={s.pageTitle}>Events & seva</Text><Text style={s.body}>Find opportunities to worship, serve, and connect.</Text><View style={s.notice}><Text style={s.tag}>REGISTRATION</Text><Text style={s.cardTitle}>Maaladharan 2026</Text><Text style={s.body}>Dates and availability are maintained by the organizers on the official website.</Text>{button('Open registration','/maaladharan-registration')}{button('View full calendar','/calendar',true)}</View><Text style={s.section}>Worship & service</Text>{services.map(row)}<View style={s.info}><Text style={s.small}>Live event dates are not connected yet. Use the official calendar for the latest schedule.</Text></View></>}
    {tab==='Resources' && <><Text style={s.eyebrow}>FOR YOUR JOURNEY</Text><Text style={s.pageTitle}>Devotional resources</Text><Text style={s.body}>Keep helpful prayers and preparation guides within reach.</Text><TextInput accessibilityLabel="Search devotional resources" placeholder="Search resources…" placeholderTextColor="#77736B" value={query} onChangeText={setQuery} style={s.search} clearButtonMode="while-editing"/>{resources.filter(r=>(r.title+' '+r.subtitle).toLowerCase().includes(query.toLowerCase().trim())).map(row)}{!resources.some(r=>(r.title+' '+r.subtitle).toLowerCase().includes(query.toLowerCase().trim()))&&<Text style={s.body}>No resources found. Try “bhajan” or “pooja”.</Text>}<View style={s.info}><Text style={s.small}>Resources open inside the app from the official website. An internet connection is required.</Text></View></>}
    {tab==='Community' && <><Text style={s.eyebrow}>BELONG & PARTICIPATE</Text><Text style={s.pageTitle}>Our Sangam</Text><View style={s.notice}><Text style={s.cardTitle}>Welcome to the community</Text><Text style={s.body}>Join the Sangam or access your existing membership through the official member pages.</Text>{button('Member login','/member-login')}{button('Become a member','/member-registration',true)}<Text style={s.small}>Use your existing organization account to sign in on the member portal.</Text></View><Text style={s.section}>Stay connected</Text>{[{title:'Photo gallery',subtitle:'Moments from the community',path:'/gallery',mark:'▧'},{title:'About AAYSSA',subtitle:'Our organization and seva activities',path:'/about-us',mark:'◉'},{title:'Contact the organizers',subtitle:'Questions, volunteering, and assistance',path:'/contact-us',mark:'✉'},{title:'Share feedback',subtitle:'Reach the website team',path:'/feedback',mark:'♡'}].map(row)}<View style={s.location}><Text style={s.cardTitle}>Visit & connect</Text><Text style={s.body}>Shiloh Road, Cumming, Georgia</Text><Text style={s.small}>Confirm the venue with organizers before traveling.</Text>{button('Open map','https://www.google.com/maps/search/?api=1&query=Atlanta+Ayyappa+Seva+Sangam+Shiloh+Road+Cumming+GA',true)}</View><Text style={s.section}>Follow AAYSSA</Text>{button('YouTube','https://www.youtube.com/@AAYSSA',true)}{button('Instagram','https://www.instagram.com/atlanta_ayyappa_seva_sangam/',true)}</>}
    <Text style={s.footer}>AAYSSA • Development preview{'\n'}Website pages load live when opened</Text>
    </ScrollView>
    <View style={s.nav}>{(['Home','Events','Resources','Community'] as Tab[]).map((t,i)=><Pressable key={t} accessibilityRole="tab" accessibilityState={{selected:tab===t}} onPress={()=>{setTab(t);setError('');}} style={s.navItem}><Text style={[s.navIcon,tab===t&&s.active]}>{['⌂','▦','♫','♙'][i]}</Text><Text style={[s.navText,tab===t&&s.active]}>{t}</Text>{tab===t&&<View style={s.dot}/>}</Pressable>)}</View>
  </View></SafeAreaView></SafeAreaProvider>;
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#FBF8F2'},shell:{flex:1,width:'100%',maxWidth:680,alignSelf:'center'},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:22,paddingVertical:16,borderBottomWidth:1,borderBottomColor:'#E9E1D5'},logo:{width:48,height:48},brand:{flex:1,marginLeft:10},brandName:{fontSize:23,fontWeight:'800',color:'#3A3127',letterSpacing:2},brandSub:{fontSize:8,letterSpacing:1.1,color:'#746553',marginTop:3},member:{padding:10,backgroundColor:'#EFE6D8',borderRadius:24},memberText:{fontSize:23,color:'#785124'},content:{padding:22,paddingBottom:30},eyebrow:{fontSize:10,fontWeight:'700',letterSpacing:2,color:'#99713A',marginBottom:16},hero:{backgroundColor:'#B84A0A',borderRadius:24,padding:26,overflow:'hidden'},halo:{position:'absolute',right:-32,top:-40,width:180,height:180,borderRadius:100,borderWidth:1,borderColor:'#55705A',alignItems:'center',justifyContent:'center'},heroSymbol:{color:'#B89A60',fontSize:100},heroKicker:{fontSize:10,letterSpacing:2,color:'#DAC38B',marginBottom:24},heroTitle:{fontSize:34,lineHeight:41,fontWeight:'600',fontFamily:Platform.OS==='ios'?'Georgia':'serif',color:'#FFF9E9'},heroBody:{fontSize:15,lineHeight:23,color:'#D6E0D9',marginTop:16,maxWidth:310},heroButton:{alignSelf:'flex-start',backgroundColor:'#E8CE94',borderRadius:12,paddingHorizontal:18,paddingVertical:14,marginTop:24},heroButtonText:{color:'#263B31',fontWeight:'700',fontSize:14},heroFoot:{color:'#ABBCAE',fontSize:9,letterSpacing:4,marginTop:26},section:{fontSize:21,fontWeight:'600',color:'#362F26',marginTop:28,marginBottom:14},notice:{padding:22,backgroundColor:'#FFFDF9',borderWidth:1,borderColor:'#E8DDCB',borderRadius:18,marginTop:6},tag:{fontSize:9,letterSpacing:1.5,fontWeight:'700',color:'#8E6428',marginBottom:12},cardTitle:{fontSize:21,lineHeight:28,fontWeight:'600',color:'#3B3125'},body:{fontSize:15,lineHeight:24,color:'#70665A',marginTop:10,marginBottom:12},button:{backgroundColor:'#B84A0A',borderRadius:11,padding:15,marginTop:10,alignItems:'center',minHeight:48},buttonText:{color:'#FFF9E9',fontSize:14,fontWeight:'700'},secondary:{backgroundColor:'#F1EADD'},secondaryText:{color:'#3D4B3C'},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},tile:{width:'47%',flexGrow:1,backgroundColor:'#F0EBE1',padding:18,borderRadius:16,minHeight:112},tileMark:{fontSize:27,color:'#8F6A36',marginBottom:15},tileTitle:{color:'#3B3E32',fontSize:14,fontWeight:'600'},quote:{marginTop:28,borderLeftWidth:2,borderLeftColor:'#B69A60',paddingLeft:18,paddingVertical:6},quoteText:{fontFamily:Platform.OS==='ios'?'Georgia':'serif',fontSize:22,lineHeight:30,color:'#4E543E',marginBottom:10},small:{fontSize:12,lineHeight:19,color:'#776E61'},pageTitle:{fontSize:32,fontFamily:Platform.OS==='ios'?'Georgia':'serif',color:'#2E4435'},row:{flexDirection:'row',alignItems:'center',paddingVertical:18,borderBottomWidth:1,borderBottomColor:'#E8E0D4',minHeight:82},symbol:{width:45,height:45,borderRadius:13,backgroundColor:'#EEE6D6',alignItems:'center',justifyContent:'center',marginRight:13},symbolText:{fontSize:24,color:'#96743C'},rowCopy:{flex:1},rowTitle:{fontSize:16,color:'#394334',fontWeight:'600',marginBottom:4},arrow:{fontSize:21,color:'#8B7756',padding:8},info:{padding:16,backgroundColor:'#EFEEE7',borderRadius:12,marginTop:22},search:{backgroundColor:'#FFFDF9',borderWidth:1,borderColor:'#DCD4C6',borderRadius:12,padding:15,fontSize:15,marginTop:12,marginBottom:4,color:'#263D31'},location:{padding:20,backgroundColor:'#F0EBE1',borderRadius:16,marginTop:24},footer:{fontSize:10,lineHeight:17,color:'#92877A',textAlign:'center',marginTop:30},nav:{flexDirection:'row',borderTopWidth:1,borderTopColor:'#E1D9CB',backgroundColor:'#FFFDF8',paddingVertical:10},navItem:{flex:1,alignItems:'center',paddingVertical:4,minHeight:55},navIcon:{fontSize:23,color:'#9B9489'},navText:{fontSize:10,color:'#8B8277',marginTop:3},active:{color:'#244D3F',fontWeight:'700'},dot:{height:3,width:14,borderRadius:2,backgroundColor:'#B3904E',marginTop:4},error:{backgroundColor:'#FFE7D9',padding:14,borderRadius:12,marginBottom:16},link:{color:'#244D3F',fontWeight:'700',paddingTop:10}
});
