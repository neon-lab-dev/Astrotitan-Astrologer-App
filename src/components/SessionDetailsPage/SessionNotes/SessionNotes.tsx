/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import ReusableButton from '../../reusable/ReusableButton/ReusableButton';
import RenderHTML, {
  defaultSystemFonts,
  MixedStyleDeclaration,
} from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';

const SessionNotes = ({ recommendations, consultationId }: any) => {
  const navigation = useNavigation<any>();

  const { width } = useWindowDimensions();

  const systemFonts = [
    ...defaultSystemFonts,
    'Satoshi-Regular',
    'Satoshi-Medium',
    'Satoshi-Bold',
  ];

  const htmlStyles: Record<string, MixedStyleDeclaration> = {
    body: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
    },

    div: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
      marginBottom: 12,
    },

    p: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
      marginBottom: 12,
    },

    b: {
      fontFamily: 'Satoshi-Bold',
      color: '#1A1A1A',
    },

    strong: {
      fontFamily: 'Satoshi-Bold',
      color: '#1A1A1A',
    },

    i: {
      fontStyle: 'italic',
    },

    em: {
      fontStyle: 'italic',
    },

    ul: {
      marginVertical: 10,
      fontFamily: 'Satoshi-Regular',
    },

    ol: {
      marginVertical: 10,
      fontFamily: 'Satoshi-Regular',
    },

    li: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
      marginBottom: 6,
    },
  };
  
  return (
    <View style={styles.section}>
      <ContentSection
        title="Session Notes"
        sectionStyle={styles.sectionHeader}
        titleFontSize={20}
      />

      {recommendations ? (
        <View style={styles.notesContainer}>
          <RenderHTML
            contentWidth={width - 40}
            source={{
              html: recommendations || '',
            }}
            systemFonts={systemFonts}
            tagsStyles={htmlStyles}
            baseStyle={{
              fontFamily: 'Satoshi',
              color: '#4A4A4A',
              fontSize: 16,
              lineHeight: 28,
            }}
          />
        </View>
      ) : (
        <View style={styles.emptyNotesContainer}>
          <SansText style={styles.emptyNotesText}>
            No session notes available
          </SansText>
          <ReusableButton
            title="Provide Note"
            onPress={() => {
              navigation.navigate('ProvideNotes', {
                consultationId: consultationId,
              });
            }}
            variant="outline"
            borderColor="#D4AF37"
            textColor="#D4AF37"
            width={160}
            height={40}
            style={styles.provideNoteButton}
          />
        </View>
      )}
    </View>
  );
};

export default SessionNotes;

const styles = StyleSheet.create({
  // Section
  section: {
    marginTop: 24,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  // Notes
  notesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  emptyNotesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  emptyNotesText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    marginBottom: 16,
  },

  provideNoteButton: {
    borderRadius: 10,
  },
});
