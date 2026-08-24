import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import { SansText } from '../../../components/reusable/Text/SansText';
import { ICONS } from '../../../assets/svg';
import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSubmitKundliReportMutation } from '../../../redux/features/kundliRequest/kundliRequestApi';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppBar from '../../../components/reusable/AppBar/AppBar';

const UploadReport = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [submitKundliReport, { isLoading }] = useSubmitKundliReportMutation();
  const IconComponent = ICONS.UploadFile;
  const IconComponentDelete = ICONS.DeleteIcon;

  const [selectedFile, setSelectedFile] = useState<any>(null);

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleFilePick = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 1,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick file. Please try again.');
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedFile({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            fileName: asset.fileName || 'file.jpg',
          });
        }
      },
    );
  };

  const onSubmit = async () => {
    try {
      if (!selectedFile) {
        Alert.alert('Error', 'Please select a file to upload.');
        return;
      }

      const formData = new FormData();

      // Append single file with field name 'file'
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type || 'image/jpeg',
        name: selectedFile.fileName || 'report.jpg',
      });

      const response = await submitKundliReport({
        id: id,
        data: formData,
      }).unwrap();

      if (response.success) {
        Alert.alert(
          'Report Submitted',
          'Your kundli report has been submitted successfully. Thank you!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('KundliRequestDetails', { id: id }),
            },
          ],
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to submit report. Please try again.',
      );
      console.error('Submit error:', error);
    }
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar title="Upload Report" />

        <View style={styles.fileUploadSection}>
          <SatoshiText style={styles.fileUploadTitle}>
            Upload Kundli Report
          </SatoshiText>
          <SansText style={styles.fileUploadSubtext}>
            Please upload the report in PNG, JPG, or PDF format.
          </SansText>

          <TouchableOpacity
            style={styles.fileUploadContainer}
            onPress={handleFilePick}
          >
            <IconComponent width={28} height={28} />
            <SansText style={styles.fileUploadText}>
              {selectedFile ? selectedFile.fileName : 'Tap to upload file'}
            </SansText>
            <SansText style={styles.fileUploadSubtextSmall}>
              Max file size: 5MB
            </SansText>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.filesList}>
              <View style={styles.fileItem}>
                <SansText style={styles.fileName} numberOfLines={1}>
                  {selectedFile.fileName || 'Selected file'}
                </SansText>
                <TouchableOpacity onPress={removeFile}>
                  <IconComponentDelete width={20} height={20} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <ReusableButton
              title="Back"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.backButtonStyle}
            />
            <ReusableButton
              title="Submit"
              variant="solid"
              loading={isLoading}
              onPress={onSubmit}
              disabled={!selectedFile}
              style={styles.nextButton}
            />
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default UploadReport;

const styles = StyleSheet.create({
  fileUploadSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  fileUploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  fileUploadTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  fileUploadSubtext: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 12,
  },
  fileUploadContainer: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    minHeight: 100,
  },
  fileUploadText: {
    fontSize: 14,
    color: '#1a1a2e',
    marginTop: 8,
    fontFamily: 'Satoshi-Medium',
  },
  fileUploadSubtextSmall: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  filesList: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 12,
    color: '#1a1a2e',
  },
  backButtonStyle: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
});
