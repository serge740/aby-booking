import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import info from '@/constants/info';
import { useClientAuth } from '@/contexts/ClientAuthContext';

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
}

type TabType = 'all' | 'upcoming' | 'past';

const BusTicketHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const {client} = useClientAuth()

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
    },
  ];

  const upcomingTickets = tickets.filter((t) => t.status === 'upcoming');
  const pastTickets = tickets.filter((t) => t.status === 'completed');
  const displayTickets =
    activeTab === 'all'
      ? tickets
      : activeTab === 'upcoming'
      ? upcomingTickets
      : pastTickets;

  const renderTicketCard = (ticket: Ticket) => (
    <View key={ticket.id} style={styles.ticketCard}>
      {/* Status and Company */}
      <View style={styles.ticketHeader}>
        <Text style={styles.companyName}>{ticket.company}</Text>
        <View
          style={[
            styles.statusBadge,
            ticket.status === 'upcoming'
              ? styles.statusUpcoming
              : styles.statusCompleted,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              ticket.status === 'upcoming'
                ? styles.statusTextUpcoming
                : styles.statusTextCompleted,
            ]}
          >
            {ticket.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>From</Text>
          <Text style={styles.locationText}>{ticket.from}</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color={info.primary[500]} />
          <Text style={styles.durationText}>{ticket.duration}</Text>
        </View>

        <View style={[styles.locationContainer, styles.locationRight]}>
          <Text style={styles.locationLabel}>To</Text>
          <Text style={styles.locationText}>{ticket.to}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>{ticket.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>{ticket.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="ticket-outline" size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>Seat {ticket.seatNumber}</Text>
        </View>
      </View>

      {/* Price and Action */}
      <View style={styles.footerContainer}>
        <View>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceText}>{ticket.price}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

        {/* Header */}
        
        <LinearGradient
          colors={[info.primary[500], info.primary[600]]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.userName}>{client.name}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="menu" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search destinations..."
              placeholderTextColor={'#fff'}
              style={styles.searchInput}
            />
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconGreen]}>
              <Ionicons name="ticket" size={24} color="#10B981" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{upcomingTickets.length}</Text>
              <Text style={styles.statLabel}>Upcoming Trips</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconBlue]}>
              <Ionicons name="calendar" size={24} color="#3B82F6" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{pastTickets.length}</Text>
              <Text style={styles.statLabel}>Past Trips</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.tabTextActive,
              ]}
            >
              All Tickets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.tabTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.tabTextActive,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

<ScrollView showsVerticalScrollIndicator={false}>
        {/* Tickets List */}
        <View style={styles.ticketsContainer}>
          {displayTickets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="ticket-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No tickets found</Text>
            </View>
          ) : (
            displayTickets.map(renderTicketCard)
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={[info.primary[500], info.primary[600]]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userName: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -30,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconGreen: {
    backgroundColor: '#D1FAE5',
  },
  statIconBlue: {
    backgroundColor: '#DBEAFE',
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: info.primary[500],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFF',
  },
  ticketsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusUpcoming: {
    backgroundColor: '#D1FAE5',
  },
  statusCompleted: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextUpcoming: {
    color: '#059669',
  },
  statusTextCompleted: {
    color: '#6B7280',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flex: 1,
  },
  locationRight: {
    alignItems: 'flex-end',
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  arrowContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  durationText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: info.primary[500],
  },
  detailsButton: {
    backgroundColor: info.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFF',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BusTicketHome;