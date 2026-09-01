/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SansText } from '../../../components/reusable/Text/SansText';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { useNavigation } from '@react-navigation/native';
import { useProvideNotesMutation } from '../../../redux/features/consultation/consultationApi';
import { useRoute } from '@react-navigation/native';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppBar from '../../../components/reusable/AppBar/AppBar';

const ProvideNotes = () => {
  const route = useRoute<any>();
  const params = route.params as any;
  const id = params?.consultationId;

  const navigation = useNavigation<any>();
  const [content, setContent] = useState('');
  const richText = useRef<any>(null);

  const [provideNotes, { isLoading }] = useProvideNotesMutation();

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      const payload = {
        recommendations: content,
      };
      const response = await provideNotes({ id: id, data: payload }).unwrap();
      if (response?.success) {
        navigation.navigate('SessionHistoryDetailsScreen', {
          consultationId: id,
        });
      }

      setContent('');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <ScreenWrapper>
      <AppBar title="Provide Notes" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Static Header Section (Label + Toolbar) */}
          <View style={styles.headerSection}>
            <SansText style={styles.label}>Notes</SansText>
            <RichToolbar
              editor={richText}
              selectedIconTint="#111"
              iconTint="#575757"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.heading1,
                actions.heading2,
                actions.heading3,
                actions.undo,
                actions.redo,
              ]}
              style={styles.toolbar}
            />
          </View>

          {/* Scrollable Editor Area */}
          <ScrollView
            style={styles.editorScroll}
            contentContainerStyle={styles.editorScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            <RichEditor
              ref={richText}
              placeholder="Add your recommendations ..."
              initialContentSize={320}
              editorStyle={{
                backgroundColor: '#E9D8A6',
                color: '#0D0D0D',
                placeholderColor: '#575757',
                contentCSSText: `
                                font-size: 16px;
                                line-height: 26px;
                                padding: 16px;
                                color: #0D0D0D;
                              `,
              }}
              style={styles.editor}
              onChange={html => {
                setContent(html);
              }}
            />

            {/* Submit Button (Scrolls with content) */}
            <View style={styles.buttonContainer}>
              <ReusableButton
                title={isLoading ? 'Please wait...' : 'Submit'}
                width="100%"
                disabled={isLoading}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ProvideNotes;

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Static Header Section (Label + Toolbar stay fixed)
  headerSection: {
    zIndex: 10,
    paddingBottom: 0,
  },

  label: {
    fontSize: 16,
    color: '#0D0D0D',
    marginBottom: 10,
    marginTop: 18,
  },

  toolbar: {
    backgroundColor: '#FBF7EB',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1.2,
    borderBottomWidth: 0,
    borderColor: '#D4AF37',
    minHeight: 54,
  },

  // Scrollable Editor Area
  editorScroll: {
    flex: 1,
  },

  editorScrollContent: {
    paddingBottom: 40,
  },

  editor: {
    minHeight: 320,
    borderWidth: 1.2,
    borderColor: '#D4AF37',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#E9D8A6',
    overflow: 'hidden',
  },

  buttonContainer: {
    marginTop: 20,
  },
});
