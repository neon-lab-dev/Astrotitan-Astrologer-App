/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SansText } from '../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import { useGetSingleKundliRequestQuery } from '../../../redux/features/kundliRequest/kundliRequestApi';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import { getKundliTypeLabel } from './../../../components/KundliPage/AllKundliRequests/KundliRequestCard';

const STATUS_COLORS: any = {
  completed: { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' },
  accepted: { bg: '#E3F2FD', text: '#1565C0', dot: '#2196F3' },
  pending: { bg: '#FFF8E1', text: '#827717', dot: '#FFC107' },
  cancelled: { bg: '#FFEBEE', text: '#C62828', dot: '#F44336' },
};

const KundliRequestDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id;
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch, isLoading } = useGetSingleKundliRequestQuery(id);
  const request = data?.data || data;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading)
    return (
      <View style={styles.center}>
        <SansText>Loading...</SansText>
      </View>
    );
  if (!request)
    return (
      <View style={styles.center}>
        <SansText>Request not found.</SansText>
      </View>
    );

  const statusStyle = STATUS_COLORS[request.status] || STATUS_COLORS.pending;
  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* --- SLIM PROFESSIONAL HEADER --- */}
      <View style={styles.header}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <SansText style={styles.backIcon}>←</SansText>
            <SansText style={styles.backLabel}>Back</SansText>
          </TouchableOpacity>
          <View
            style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusStyle.dot }]}
            />
            <SansText style={[styles.statusText, { color: statusStyle.text }]}>
              {request.status?.toUpperCase()}
            </SansText>
          </View>
        </View>

        <View style={styles.headerTitleArea}>
          <SatoshiText style={styles.headerId}>
            Request #{request._id?.slice(-8).toUpperCase()}
          </SatoshiText>
          <SansText style={styles.headerSub}>
            {request.requestType === 'generateKundli'
              ? 'Detailed Kundli Generation'
              : 'Expert Kundli Analysis'}
          </SansText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#816B22"
            colors={['#816B22']}
            progressBackgroundColor="#FBF7EB"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- SECTION: SUMMARY METRICS --- */}
        <View style={styles.metaRow}>
          <MetaItem
            label="Requested On"
            value={formatDate(request.createdAt)}
          />
          <MetaItem
            label="Kundli Type"
            value={getKundliTypeLabel(request.kundliType)}
          />
        </View>

        <View style={styles.lineDivider} />

        {/* --- SECTION: SUBJECT DETAILS --- */}
        <SatoshiText style={styles.sectionHeading}>
          Personal Details
        </SatoshiText>
        <View style={styles.grid}>
          <GridItem label="Full Name" value={request.userName} />
          <GridItem label="Gender" value={request.userGender} />
          <GridItem
            label="Date of Birth"
            value={formatDate(request.dateOfBirth)}
          />
          <GridItem label="Time of Birth" value={request.timeOfBirth} />
          <GridItem label="Birth Place" value={request.placeOfBirth} span={2} />
        </View>

        <View style={styles.lineDivider} />

        {/* --- SECTION: CONTACT --- */}
        <SatoshiText style={styles.sectionHeading}>Contact Details</SatoshiText>
        <View style={styles.grid}>
          <GridItem label="Email Address" value={request.userEmail} />
          <GridItem label="Phone Number" value={request.userPhoneNumber} />
        </View>

        {/* --- SECTION: NOTES --- */}
        {request.userNotes && (
          <View style={styles.notesContainer}>
            <SatoshiText style={styles.notesLabel}>Concern</SatoshiText>
            <SansText style={styles.notesText}>{request.userNotes}</SansText>
          </View>
        )}

        {/* --- SECTION: ATTACHMENTS --- */}
        {request.existingKundliFiles?.length > 0 && (
          <View style={styles.attachmentSection}>
            <SatoshiText style={styles.sectionHeading}>
              Reference Documents
            </SatoshiText>
            {request.existingKundliFiles.map((url: string, i: number) => (
              <TouchableOpacity
                key={i}
                style={styles.fileLink}
                onPress={() => Linking.openURL(url)}
              >
                <SansText style={styles.fileLinkText}>
                  View Document {i + 1} ↗
                </SansText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* --- SECTION: ASSIGNED EXPERT --- */}
        {request?.astrologerId && (
          <TouchableOpacity
            style={styles.expertSection}
            onPress={() =>
              navigation.navigate('AstrologerProfile', {
                id: request?.astrologerId?._id,
              })
            }
            activeOpacity={0.6}
          >
            <View style={styles.expertAvatar}>
              {request?.astrologerId?.profilePicture ? (
                <Image
                  source={{ uri: request?.astrologerId?.profilePicture }}
                  style={styles.expertAvatarImage}
                />
              ) : (
                <SansText style={styles.avatarLetter}>
                  {request?.astrologerId?.displayName
                    ?.charAt(0)
                    ?.toUpperCase() || 'A'}
                </SansText>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <SansText style={styles.expertLabel}>
                Consulting Specialist
              </SansText>
              <SatoshiText style={styles.expertName}>
                {request?.astrologerId?.displayName}
              </SatoshiText>
            </View>
            <SansText style={styles.arrow}>❯</SansText>
          </TouchableOpacity>
        )}

        {/* --- ACTION BUTTON --- */}
        {request.status === 'completed' && request.reportUrl && (
          <View style={{ marginTop: 20 }}>
            <ReusableButton
              title=" Download Completed Report"
              variant="solid"
              onPress={() => Linking.openURL(request.reportUrl!)}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <View>
    <SansText style={styles.metaLabel}>{label}</SansText>
    <SatoshiText style={styles.metaValue}>{value}</SatoshiText>
  </View>
);

const GridItem = ({
  label,
  value,
  span = 1,
}: {
  label: string;
  value?: string;
  span?: number;
}) => (
  <View style={[styles.gridItem, { width: span === 2 ? '100%' : '48%' }]}>
    <SansText style={styles.gridLabel}>{label}</SansText>

    <SatoshiText
      style={[
        styles.gridValue,
        label === 'Gender' ? { textTransform: 'capitalize' } : {},
      ]}
    >
      {value || '—'}
    </SatoshiText>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Clean Header
  header: {
    backgroundColor: '#EDDEAD',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5,
  },
  backIcon: {
    fontSize: 22,
    color: '#1A1A1A',
    marginRight: 5,
    marginBottom: 10,
  },
  backLabel: { fontSize: 16, color: '#1A1A1A' },

  headerTitleArea: { marginTop: 15 },
  headerId: { fontSize: 18, color: '#1A1A1A', fontWeight: '800' },
  headerSub: { fontSize: 14, color: '#616162', marginTop: 4 },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },

  // Content Layout
  scrollContent: { paddingHorizontal: 20, paddingTop: 25 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: {
    fontSize: 11,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: { fontSize: 15, color: '#1A1A1A', fontWeight: '600' },

  lineDivider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 25 },

  sectionHeading: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 18,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: { marginBottom: 18 },
  gridLabel: { fontSize: 12, color: '#A0A0A0', marginBottom: 2 },
  gridValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  notesContainer: {
    backgroundColor: '#FBFBFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  notesText: { fontSize: 14, color: '#444', lineHeight: 22 },

  attachmentSection: { marginTop: 10 },
  fileLink: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileLinkText: { color: '#007AFF', fontWeight: '500', fontSize: 14 },

  expertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 20,
  },
  expertAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  expertAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarLetter: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#D4AF37',
  },
  expertLabel: { fontSize: 11, color: '#8E8E93' },
  expertName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  arrow: { color: '#CCC', fontSize: 12 },

  primaryButton: {
    backgroundColor: '#1A1A1A', // Darker, more professional button
    marginTop: 30,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});

export default KundliRequestDetails;
