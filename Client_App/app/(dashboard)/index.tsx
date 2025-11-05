import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  ImageBackground,
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { useTranslation } from 'react-i18next'; // ADD THIS
import { useFocusEffect } from 'expo-router';

interface Ticket {
  id: number;
  from: string;
  to: string;
  date: string;
  time: string;
  seatNumber: string;
  busNumber: string;
  status: 'upcoming' | 'completed';
  price: string;
  duration: string;
  company: string;
  image: string;
}

type TabType = 'all' | 'upcoming' | 'past';

const BusTicketHome: React.FC = () => {
  const { t } = useTranslation(); // ADD THIS
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { client } = useClientAuth();

  // Hardcoded ticket data — NOT localized
  const tickets: Ticket[] = [
    {
      id: 1,
      from: 'Kigali',
      to: 'Musanze',
      date: '2024-11-05',
      time: '08:30 AM',
      seatNumber: 'A12',
      busNumber: 'RW-1234',
      status: 'upcoming',
      price: '5,000 RWF',
      duration: '2h 30m',
      company: 'Volcano Express',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    },
    {
      id: 2,
      from: 'Kigali',
      to: 'Huye',
      date: '2024-10-28',
      time: '10:00 AM',
      seatNumber: 'B08',
      busNumber: 'RW-5678',
      status: 'completed',
      price: '3,500 RWF',
      duration: '2h 15m',
      company: 'South Transit',
      image: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=400&q=80',
    },
    {
      id: 3,
      from: 'Kigali',
      to: 'Rubavu',
      date: '2024-10-20',
      time: '02:00 PM',
      seatNumber: 'C15',
      busNumber: 'RW-9012',
      status: 'completed',
      price: '6,000 RWF',
      duration: '3h 00m',
      company: 'Lake Kivu Lines',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    },
    {
      id: 4,
      from: 'Musanze',
      to: 'Kigali',
      date: '2024-10-15',
      time: '06:00 PM',
      seatNumber: 'A05',
      busNumber: 'RW-3456',
      status: 'completed',
      price: '5,000 RWF',
      duration: '2h 30m',
      company: 'Volcano Express',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    },
  ];


  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const backAction = () => {
        // Show exit confirmation when on home screen
        Alert.alert(
          t('dashboard.exitApp.title') || 'Exit App',
          t('dashboard.exitApp.message') || 'Do you want to exit the app?',
          [
            {
              text: t('dashboard.exitApp.cancel') || 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: t('dashboard.exitApp.confirm') || 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [t])
  );

  const upcomingTickets = tickets.filter((t) => t.status === 'upcoming');
  const pastTickets = tickets.filter((t) => t.status === 'completed');
  const displayTickets =
    activeTab === 'all'
      ? tickets
      : activeTab === 'upcoming'
      ? upcomingTickets
      : pastTickets;

  const quickActions = [
    {
      icon: 'search',
      label: t('dashboard.index.quick_actions.find_routes'),
      color: '#0e8a74',
      bgColor: '#0e8a7415',
    },
    {
      icon: 'time',
      label: t('dashboard.index.quick_actions.schedule'),
      color: '#3B82F6',
      bgColor: '#3B82F615',
    },
    {
      icon: 'location',
      label: t('dashboard.index.quick_actions.stations'),
      color: '#F59E0B',
      bgColor: '#F59E0B15',
    },
    {
      icon: 'help-circle',
      label: t('dashboard.index.quick_actions.help'),
      color: '#8B5CF6',
      bgColor: '#8B5CF615',
    },
  ];

  const renderTicketCard = (ticket: Ticket) => (
    <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
      <ImageBackground
        source={{ uri: ticket.image }}
        style={styles.ticketImage}
        imageStyle={styles.ticketImageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
          style={styles.ticketImageGradient}
        >
          <View style={styles.ticketImageContent}>
            <View
              style={[
                styles.statusBadge,
                ticket.status === 'upcoming'
                  ? styles.statusUpcoming
                  : styles.statusCompleted,
              ]}
            >
              <Ionicons
                name={ticket.status === 'upcoming' ? 'time' : 'checkmark-circle'}
                size={12}
                color={ticket.status === 'upcoming' ? '#059669' : '#6B7280'}
              />
              <Text
                style={[
                  styles.statusText,
                  ticket.status === 'upcoming'
                    ? styles.statusTextUpcoming
                    : styles.statusTextCompleted,
                ]}
              >
                {ticket.status === 'upcoming'
                  ? t('dashboard.index.status.upcoming')
                  : t('dashboard.index.status.completed')}
              </Text>
            </View>
            <Text style={styles.companyNameImage}>{ticket.company}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.ticketContent}>
        {/* Route */}
        <View style={styles.routeContainer}>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>{ticket.from}</Text>
          </View>

          <View style={styles.routeLine}>
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
            <Text style={styles.durationText}>{ticket.duration}</Text>
          </View>

          <View style={[styles.locationContainer, styles.locationRight]}>
            <View style={[styles.locationDot, styles.locationDotEnd]} />
            <Text style={styles.locationText}>{ticket.to}</Text>
          </View>
        </View>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text style={styles.detailText}>
              {new Date(ticket.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={styles.detailText}>{ticket.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={14} color="#9CA3AF" />
            <Text style={styles.detailText}>{ticket.seatNumber}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.ticketFooter}>
          <Text style={styles.priceText}>{ticket.price}</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>{t('dashboard.index.ticket.details')}</Text>
            <Ionicons name="chevron-forward" size={16} color="#0e8a74" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#0e8a74', '#0a6d5c']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <LinearGradient
                colors={['#fff', '#e0e0e0']}
                style={styles.avatarContainer}
              >
                <Ionicons name="person" size={22} color="#0e8a74" />
              </LinearGradient>
              <View>
                <Text style={styles.welcomeText}>{t('dashboard.index.welcome')}</Text>
                <Text style={styles.userName}>{client?.name || 'Guest'}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={22} color="#FFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder={t('dashboard.index.search_placeholder')}
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={20} color="#0e8a74" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionButton}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                  <Ionicons name={action.icon as any} size={20} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="rocket" size={28} color="#FFF" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{upcomingTickets.length}</Text>
              <Text style={styles.statLabel}>{t('dashboard.index.upcoming_trips')}</Text>
            </View>
            <View style={styles.statDecoration}>
              <View style={styles.statCircle} />
              <View style={[styles.statCircle, styles.statCircleSmall]} />
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-done" size={28} color="#FFF" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{pastTickets.length}</Text>
              <Text style={styles.statLabel}>{t('dashboard.index.completed_trips')}</Text>
            </View>
            <View style={styles.statDecoration}>
              <View style={styles.statCircle} />
              <View style={[styles.statCircle, styles.statCircleSmall]} />
            </View>
          </LinearGradient>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80' }}
            style={styles.promoImage}
            imageStyle={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={['rgba(14,138,116,0.9)', 'rgba(10,109,92,0.9)']}
              style={styles.promoGradient}
            >
              <View style={styles.promoContent}>
                <Ionicons name="gift" size={32} color="#FFF" />
                <View style={styles.promoText}>
                  <Text style={styles.promoTitle}>{t('dashboard.index.promo_title')}</Text>
                  <Text style={styles.promoSubtitle}>{t('dashboard.index.promo_subtitle')}</Text>
                </View>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>{t('dashboard.index.promo_button')}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.index.section_title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('dashboard.index.section_subtitle')}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              {t('dashboard.index.tabs.all')} ({tickets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              {t('dashboard.index.tabs.upcoming')} ({upcomingTickets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              {t('dashboard.index.tabs.past')} ({pastTickets.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tickets List */}
        <View style={styles.ticketsContainer}>
          {displayTickets.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="ticket-outline" size={64} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>{t('dashboard.index.empty.no_tickets')}</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming'
                  ? t('dashboard.index.empty.no_upcoming')
                  : activeTab === 'past'
                  ? t('dashboard.index.empty.no_history')
                  : t('dashboard.index.empty.start_booking')}
              </Text>
              <TouchableOpacity style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>{t('dashboard.index.empty.book_now')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            displayTickets.map(renderTicketCard)
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#0e8a74', '#0a6d5c']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/* Styles – unchanged                                                 */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  welcomeText: { color: '#e0f2f1', fontSize: 14, fontWeight: '500' },
  userName: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row' },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#EF4444', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0e8a74' },
  notificationText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#1F2937', fontSize: 15 },
  filterButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#0e8a7410', alignItems: 'center', justifyContent: 'center' },
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  quickActionButton: { flex: 1, alignItems: 'center' },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickActionLabel: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: -30, gap: 12, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6, overflow: 'hidden', position: 'relative' },
  statIconContainer: { marginBottom: 12 },
  statInfo: { zIndex: 1 },
  statNumber: { fontSize: 32, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  statDecoration: { position: 'absolute', right: -20, top: -20, opacity: 0.2 },
  statCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', marginBottom: 10 },
  statCircleSmall: { width: 60, height: 60, borderRadius: 30, marginLeft: 20 },
  promoBanner: { marginHorizontal: 20, marginBottom: 24, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  promoImage: { height: 120 },
  promoGradient: { flex: 1, justifyContent: 'center' },
  promoContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 16 },
  promoText: { flex: 1 },
  promoTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  promoSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  promoButton: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  promoButtonText: { color: '#0e8a74', fontSize: 14, fontWeight: '700' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#6B7280' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 16, padding: 4, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#0e8a74' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#FFF' },
  ticketsContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  ticketCard: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  ticketImage: { height: 80 },
  ticketImageStyle: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  ticketImageGradient: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  ticketImageContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 },
  companyNameImage: { color: '#FFF', fontSize: 15, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  ticketContent: { padding: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusUpcoming: { backgroundColor: 'rgba(209, 250, 229, 0.95)' },
  statusCompleted: { backgroundColor: 'rgba(243, 244, 246, 0.95)' },
  statusText: { fontSize: 12, fontWeight: '600' },
  statusTextUpcoming: { color: '#059669' },
  statusTextCompleted: { color: '#6B7280' },
  routeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  locationContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationRight: { justifyContent: 'flex-end' },
  locationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0e8a74' },
  locationDotEnd: { backgroundColor: '#3B82F6' },
  locationText: { fontSize: 16, fontWeight: '700', color: '#1F2937', flex: 1 },
  routeLine: { alignItems: 'center', marginHorizontal: 12 },
  durationText: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  priceText: { fontSize: 20, fontWeight: '700', color: '#0e8a74' },
  viewButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0e8a7410', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  viewButtonText: { color: '#0e8a74', fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, backgroundColor: '#FFF', borderRadius: 20 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 24, paddingHorizontal: 40, lineHeight: 20 },
  emptyButton: { backgroundColor: '#0e8a74', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 25 },
  emptyButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});

export default BusTicketHome;