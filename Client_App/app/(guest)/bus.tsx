import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function Bus() {
  const busCompanies = [
    'EBENEZER EXPRESS LTD', 'GICUMBI TRANSPORT COOP', 'KIVU BELT EXPRESS',
    'TRIPARTITE TOURS', 'SELECT EXPRESS', 'SHALOM TRANSPORT', 'JALI TRANSPORT',
    'ROYAL EXPRESS', 'KIGALI BUS SERVICES', 'LA COLOMBE EXPRESS', 'YAHOO CAR',
    'NYABUGOGO TC', 'KAYONZA TC', 'MUSANZE TC', 'NYAGATARE TC', 'NGOMA TC',
    'MUHANGA TC', 'HUYE TC', 'RUSIZI TC', 'STAR EXPRESS', 'DIFFERENT EXPRESS',
    'RUBAVU TC', 'RITCO LTD', 'RUHIRE EXPRESS', 'INDONYI EXPRESS', 'KIGALI COACH',
    'CAPITAL LTD', 'FIDELITY EXPRESS', 'CITY EXPRESS', 'EXCEL TRAVEL', 'VOLCANO LTD',
    'HORIZON EXPRESS', 'STELLA EXPRESS', 'MATUNDA EXPRESS', 'OMEGA LTD',
    'VIRUNGA EXPRESS', 'ALPHA EXPRESS', 'INTERNATIONAL EXPRESS', 'EA BUS & TRAVEL',
    'MASH BUS SERVICES', 'TRINITY TRANSPORTERS', 'SIMBA COACH', 'MODERN COAST'
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bus Companies in Rwanda</Text>
      <FlatList
        data={busCompanies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#111827',
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#1F2937',
  },
});
