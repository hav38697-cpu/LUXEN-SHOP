import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';

type Product = { id: number; name: string; category: string; price: number; emoji: string };
type Tab = 'home' | 'cart' | 'favorites' | 'orders' | 'chat' | 'account';
const products: Product[] = [
  { id: 1, name: 'سيروم العناية بالبشرة', category: 'البشرة', price: 129, emoji: '✨' },
  { id: 2, name: 'فرشاة تصفيف الشعر', category: 'الشعر', price: 89, emoji: '💇' },
  { id: 3, name: 'مجموعة فرش المكياج', category: 'المكياج', price: 79, emoji: '💄' },
  { id: 4, name: 'مرآة تجميل مضيئة', category: 'الأجهزة', price: 149, emoji: '🪞' },
  { id: 5, name: 'عطر فاخر', category: 'العطور', price: 199, emoji: '🌹' },
  { id: 6, name: 'إكسسوارات أنيقة', category: 'الإكسسوارات', price: 59, emoji: '💍' },
];
const gold = '#E8C477';
const burgundy = '#300718';
export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [category, setCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ mine: boolean; text: string }[]>([{ mine: false, text: 'مرحبًا بك في LUXEN SHOP. هذه محادثة تجريبية وليست خدمة عملاء متصلة.' }]);
  const visible = useMemo(() => products.filter(p => (category === 'الكل' || p.category === category) && p.name.includes(search)), [category, search]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const changeQty = (id: number, delta: number) => setCart(old => ({ ...old, [id]: Math.max(0, (old[id] || 0) + delta) }));
  const toggleFav = (id: number) => setFavorites(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const send = () => {
    if (!message.trim()) return;
    setMessages(old => [...old, { mine: true, text: message.trim() }, { mine: false, text: 'وصلت رسالتك داخل النموذج التجريبي فقط. سيتم تفعيل الدعم بعد ربط الخادم.' }]);
    setMessage('');
  };
  const Button = ({ title, onPress }: { title: string; onPress: () => void }) => <TouchableOpacity style={styles.button} onPress={onPress}><Text style={styles.buttonText}>{title}</Text></TouchableOpacity>;
  const ProductCard = ({ p }: { p: Product }) => <View style={styles.product}>
    <Text style={styles.productEmoji}>{p.emoji}</Text>
    <Text style={styles.productName}>{p.name}</Text>
    <Text style={styles.price}>{p.price} ر.س</Text>
    <View style={styles.inline}><TouchableOpacity onPress={() => toggleFav(p.id)}><Text style={styles.heart}>{favorites.includes(p.id) ? '♥' : '♡'}</Text></TouchableOpacity><TouchableOpacity onPress={() => changeQty(p.id, 1)} style={styles.smallButton}><Text style={styles.smallButtonText}>أضف للسلة +</Text></TouchableOpacity></View>
  </View>;
  return <SafeAreaView style={styles.root}><StatusBar barStyle="light-content" backgroundColor={burgundy}/>
    <View style={styles.header}><Text style={styles.crown}>♛</Text><Text style={styles.brand}>LUXEN</Text><Text style={styles.shop}>S H O P</Text></View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {tab === 'home' && <>
        <TextInput style={styles.input} placeholder="ابحث عن منتج..." placeholderTextColor="#A48C93" value={search} onChangeText={setSearch} textAlign="right" />
        <View style={styles.hero}><Text style={styles.heroEmoji}>🌹 ✨</Text><Text style={styles.heroTitle}>جمالك يبدأ من هنا</Text><Text style={styles.heroText}>منتجات الجمال والعناية والإكسسوارات</Text><Button title="تسوق الآن" onPress={() => setCategory('الكل')}/></View>
        <Text style={styles.heading}>الأقسام</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>{['الكل','البشرة','الشعر','المكياج','الأجهزة','العطور','الإكسسوارات'].map(c => <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}><Text style={styles.chipText}>{c}</Text></TouchableOpacity>)}</ScrollView>
        <View style={styles.promo}><Text style={styles.promoText}>🎁 اكشط واربح بعد أول طلب يتم تسليمه</Text><Text style={styles.note}>الميزة قيد التطوير</Text></View>
        <Text style={styles.heading}>منتجات مختارة</Text><View style={styles.grid}>{visible.map(p => <ProductCard key={p.id} p={p}/>)}</View>
      </>}
      {tab === 'cart' && <><Text style={styles.heading}>سلة التسوق ({count})</Text>{products.filter(p => cart[p.id] > 0).map(p => <View key={p.id} style={styles.line}><Text style={styles.itemText}>{p.emoji} {p.name}</Text><Text style={styles.price}>{p.price * cart[p.id]} ر.س</Text><View style={styles.inline}><Button title="−" onPress={() => changeQty(p.id, -1)}/><Text style={styles.itemText}> {cart[p.id]} </Text><Button title="+" onPress={() => changeQty(p.id, 1)}/></View></View>)}<Text style={styles.heading}>الإجمالي: {total} ر.س</Text><Text style={styles.note}>الشحن والدفع بمدى وفيزا غير متصلين بعد.</Text><Button title="إتمام الطلب (تجريبي)" onPress={() => Alert.alert('نسخة تجريبية', 'لا يمكن تحصيل المدفوعات حتى ربط بوابة الدفع والشحن.')}/></>}
      {tab === 'favorites' && <><Text style={styles.heading}>المفضلة</Text><View style={styles.grid}>{products.filter(p => favorites.includes(p.id)).map(p => <ProductCard key={p.id} p={p}/>)}</View>{favorites.length === 0 && <Text style={styles.note}>لا توجد منتجات محفوظة بعد.</Text>}</>}
      {tab === 'orders' && <><Text style={styles.heading}>طلباتي</Text><Text style={styles.note}>سيظهر سجل الطلبات بعد تفعيل تسجيل الدخول وقاعدة البيانات.</Text></>}
      {tab === 'chat' && <><Text style={styles.heading}>💬 تحدث معنا</Text><Text style={styles.note}>معاينة فقط. لا توجد رسائل تُرسل إلى موظف حقيقي.</Text>{messages.map((m, i) => <View key={i} style={[styles.bubble, m.mine && styles.mine]}><Text style={styles.itemText}>{m.text}</Text></View>)}<TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="اكتب رسالتك..." placeholderTextColor="#A48C93" textAlign="right"/><Button title="إرسال" onPress={send}/></>}
      {tab === 'account' && <><Text style={styles.heading}>حسابي</Text>{['تسجيل الدخول برقم الجوال','معلوماتي الشخصية','عناويني','الكوبونات والخصومات','اكشط واربح','خدمة العملاء'].map(x => <TouchableOpacity key={x} style={styles.line} onPress={() => x === 'خدمة العملاء' ? setTab('chat') : Alert.alert(x, 'هذه الميزة ستُفعّل عند ربط الخادم.') }><Text style={styles.itemText}>{x}  ‹</Text></TouchableOpacity>)}</>}
    </ScrollView>
    <View style={styles.nav}>{([{id:'home',label:'الرئيسية',icon:'⌂'},{id:'favorites',label:'المفضلة',icon:'♡'},{id:'cart',label:`السلة ${count}`,icon:'🛒'},{id:'orders',label:'طلباتي',icon:'▣'},{id:'chat',label:'الشات',icon:'◉'},{id:'account',label:'حسابي',icon:'♙'}] as {id:Tab;label:string;icon:string}[]).map(n => <TouchableOpacity key={n.id} style={styles.navItem} onPress={() => setTab(n.id)}><Text style={[styles.navIcon, tab === n.id && styles.active]}>{n.icon}</Text><Text style={[styles.navLabel, tab === n.id && styles.active]}>{n.label}</Text></TouchableOpacity>)}</View>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:burgundy},header:{alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#7E3C4F'},crown:{fontSize:22,color:gold},brand:{fontSize:29,fontWeight:'bold',letterSpacing:3,color:gold},shop:{fontSize:11,letterSpacing:4,color:gold},content:{padding:14,paddingBottom:30},input:{backgroundColor:'#FFF7F3',borderRadius:14,padding:13,color:'#35101D',marginBottom:14},hero:{backgroundColor:'#691634',borderRadius:18,padding:20,alignItems:'center',marginBottom:18},heroEmoji:{fontSize:38},heroTitle:{fontSize:23,color:gold,fontWeight:'bold',marginVertical:8},heroText:{color:'#FFE8EF',marginBottom:12},heading:{color:gold,fontSize:19,fontWeight:'bold',textAlign:'right',marginVertical:12},categories:{gap:8,paddingBottom:10},chip:{borderColor:'#9E5C6C',borderWidth:1,borderRadius:25,paddingVertical:9,paddingHorizontal:15},chipActive:{backgroundColor:'#812344'},chipText:{color:'#FFF5F7'},promo:{backgroundColor:'#591029',borderRadius:15,padding:15,marginVertical:10},promoText:{color:gold,textAlign:'center',fontWeight:'bold'},note:{color:'#D8AFBD',textAlign:'center',marginVertical:10},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},product:{backgroundColor:'#511128',width:'48%',padding:12,borderRadius:15,marginBottom:12,minHeight:190},productEmoji:{fontSize:47,textAlign:'center',marginBottom:10},productName:{color:'#FFFFFF',textAlign:'right',fontWeight:'600',minHeight:42},price:{color:gold,fontWeight:'bold',textAlign:'right',marginVertical:7},inline:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:5},heart:{color:'#FFB9C9',fontSize:28},button:{backgroundColor:gold,paddingVertical:10,paddingHorizontal:14,borderRadius:12,alignItems:'center',marginVertical:3},buttonText:{color:'#3B091A',fontWeight:'bold'},smallButton:{backgroundColor:gold,borderRadius:9,padding:8},smallButtonText:{color:'#3B091A',fontSize:12,fontWeight:'bold'},line:{backgroundColor:'#511128',borderRadius:13,padding:15,marginBottom:10},itemText:{color:'#FFFFFF',textAlign:'right',fontSize:15},bubble:{backgroundColor:'#52253A',borderRadius:13,padding:14,marginVertical:5,maxWidth:'90%',alignSelf:'flex-start'},mine:{backgroundColor:'#8A2147',alignSelf:'flex-end'},nav:{flexDirection:'row',borderTopWidth:1,borderTopColor:'#824058',paddingVertical:8,justifyContent:'space-around'},navItem:{alignItems:'center',flex:1},navIcon:{color:'#E0BAC7',fontSize:20},navLabel:{color:'#E0BAC7',fontSize:10,marginTop:3},active:{color:gold,fontWeight:'bold'}
});
