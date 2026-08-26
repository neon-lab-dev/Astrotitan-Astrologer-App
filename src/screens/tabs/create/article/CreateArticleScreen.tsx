/* eslint-disable react-native/no-inline-styles */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useRoute } from '@react-navigation/native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { useAddBlogMutation } from '../../../../redux/features/blog/blogApi';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../../../../navigation/types';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import { SansText } from '../../../../components/reusable/Text/SansText';
import AppInput from '../../../../components/reusable/InputField/AppInput';
import ReusableButton from '../../../../components/reusable/ReusableButton/ReusableButton';
import { launchImageLibrary } from 'react-native-image-picker';
import AppBar from '../../../../components/reusable/AppBar/AppBar';

const categories = [
  // Existing ones
  { label: 'Wealth & Finance', value: 'Wealth & Finance' },
  { label: 'Education', value: 'Education' },
  { label: 'Marriage', value: 'Marriage' },
  { label: 'Health & Wellness', value: 'Health & Wellness' },
  { label: 'Career Growth', value: 'Career Growth' },
  { label: 'Love & Relationship', value: 'Love & Relationship' },

  // Astrology Categories
  { label: 'Vedic Astrology', value: 'Vedic Astrology' },
  { label: 'Birth Chart Analysis', value: 'Birth Chart Analysis' },
  { label: 'Kundli Matching', value: 'Kundli Matching' },
  { label: 'Remedies & Rituals', value: 'Remedies & Rituals' },
  { label: 'Gemstone Recommendations', value: 'Gemstone Recommendations' },
  {
    label: 'Muhurat & Auspicious Timing',
    value: 'Muhurat & Auspicious Timing',
  },
  { label: 'Planetary Transits', value: 'Planetary Transits' },
  { label: 'Dosha Analysis', value: 'Dosha Analysis' },
  { label: 'Karma & Past Life', value: 'Karma & Past Life' },
  { label: 'Spiritual Growth', value: 'Spiritual Growth' },
  { label: 'Meditation & Mindfulness', value: 'Meditation & Mindfulness' },
  { label: 'Feng Shui & Vastu', value: 'Feng Shui & Vastu' },
  { label: 'Dream Interpretation', value: 'Dream Interpretation' },
  { label: 'Tarot Reading', value: 'Tarot Reading' },
  { label: 'Numerology', value: 'Numerology' },
  { label: 'Palmistry', value: 'Palmistry' },
  { label: 'Gemology', value: 'Gemology' },
  { label: 'Children & Parenting', value: 'Children & Parenting' },
  { label: 'Property & Real Estate', value: 'Property & Real Estate' },
  {
    label: 'Business & Entrepreneurship',
    value: 'Business & Entrepreneurship',
  },
  {
    label: 'Travel & Foreign Settlements',
    value: 'Travel & Foreign Settlements',
  },
  { label: 'Legal Astrology', value: 'Legal Astrology' },
  { label: 'Astro Psychology', value: 'Astro Psychology' },
];

// Zodiac signs for dropdown
const zodiacSigns = [
  { label: 'Aries', value: 'Aries' },
  { label: 'Taurus', value: 'Taurus' },
  { label: 'Gemini', value: 'Gemini' },
  { label: 'Cancer', value: 'Cancer' },
  { label: 'Leo', value: 'Leo' },
  { label: 'Virgo', value: 'Virgo' },
  { label: 'Libra', value: 'Libra' },
  { label: 'Scorpio', value: 'Scorpio' },
  { label: 'Sagittarius', value: 'Sagittarius' },
  { label: 'Capricorn', value: 'Capricorn' },
  { label: 'Aquarius', value: 'Aquarius' },
  { label: 'Pisces', value: 'Pisces' },
];

// Elements for dropdown
const elements = [
  { label: 'Fire', value: 'Fire' },
  { label: 'Earth', value: 'Earth' },
  { label: 'Air', value: 'Air' },
  { label: 'Water', value: 'Water' },
];

// Compatibility options
const compatibilityOptions = [
  { label: 'Aries', value: 'Aries' },
  { label: 'Taurus', value: 'Taurus' },
  { label: 'Gemini', value: 'Gemini' },
  { label: 'Cancer', value: 'Cancer' },
  { label: 'Leo', value: 'Leo' },
  { label: 'Virgo', value: 'Virgo' },
  { label: 'Libra', value: 'Libra' },
  { label: 'Scorpio', value: 'Scorpio' },
  { label: 'Sagittarius', value: 'Sagittarius' },
  { label: 'Capricorn', value: 'Capricorn' },
  { label: 'Aquarius', value: 'Aquarius' },
  { label: 'Pisces', value: 'Pisces' },
];

const CreateArticleScreen = () => {
  const route = useRoute<any>();

  const { contentType } = route.params || {};
  const [addBlog] = useAddBlogMutation();
  const richText = useRef<any>(null);
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  // Common fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Zodiac specific fields (only for zodiacTips)
  const [zodiacSign, setZodiacSign] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [element, setElement] = useState('');
  const [luckyColor, setLuckyColor] = useState('');
  const [luckyNumber, setLuckyNumber] = useState('');
  const [compatibility, setCompatibility] = useState<string[]>([]);

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Live', value: 'live' },
  ];

  const isZodiacTips = contentType === 'zodiacTips';

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
        return;
      }

      const asset = result.assets?.[0];

      if (asset) {
        setCoverImage(asset);
      }
    } catch (error) {
      console.log('IMAGE PICK ERROR:', error);
    }
  };

  const handleAddCompatibility = (sign: string) => {
    if (!compatibility.includes(sign)) {
      setCompatibility([...compatibility, sign]);
    }
  };

  const handleRemoveCompatibility = (sign: string) => {
    setCompatibility(compatibility.filter(item => item !== sign));
  };

  const handlePublish = async () => {
    // Common validations
    if (!title.trim()) {
      // Alert.alert("Error", "Please enter article title");
      return;
    }
    if (!category) {
      // Alert.alert("Error", "Please select a category");
      return;
    }
    if (!content.trim()) {
      // Alert.alert("Error", "Please write article content");
      return;
    }
    if (!coverImage) {
      // Alert.alert("Error", "Please add a cover image");
      return;
    }

    // Zodiac specific validations
    if (isZodiacTips) {
      if (!zodiacSign) {
        // Alert.alert("Error", "Please select a zodiac sign");
        return;
      }
      if (!dateRange.trim()) {
        // Alert.alert("Error", "Please enter date range");
        return;
      }
      if (!element) {
        // Alert.alert("Error", "Please select an element");
        return;
      }
      if (!luckyColor.trim()) {
        // Alert.alert("Error", "Please enter lucky color");
        return;
      }
      if (!luckyNumber) {
        // Alert.alert("Error", "Please enter lucky number");
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Add common fields
      formData.append('title', title);
      formData.append('category', category);
      formData.append('content', content);
      formData.append('blogType', contentType || 'article');
      formData.append('status', status);

      // Add zodiac specific fields if it's zodiacTips
      if (isZodiacTips) {
        const zodiacSpecific = {
          zodiacSign,
          dateRange,
          element,
          luckyColor,
          luckyNumber: parseInt(luckyNumber),
          compatibility,
        };
        formData.append('zodiacSpecific', JSON.stringify(zodiacSpecific));
      }

      // Add image file
      const imageUri = coverImage.uri;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const imageType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('thumbnail', {
        uri: imageUri,
        name: filename || `thumbnail_${Date.now()}.jpg`,
        type: imageType,
      } as any);
      const response = await addBlog(formData).unwrap();
      if (response?.success) {
        navigation.replace('CreateScreen');
      }

      // Reset form
      setTitle('');
      setCategory('');
      setContent('');
      setStatus('draft');
      setCoverImage(null);
      if (isZodiacTips) {
        setZodiacSign('');
        setDateRange('');
        setElement('');
        setLuckyColor('');
        setLuckyNumber('');
        setCompatibility([]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to publish article. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            <AppBar
              title={isZodiacTips ? 'Write Zodiac Tips' : 'Write an Article'}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 180,
                gap: 20,
              }}
            >
              {/* Common Fields */}
              <AppInput
                label="Title"
                placeholder={
                  isZodiacTips
                    ? 'Daily Horoscope for Aries'
                    : 'How mars affects career growth in aries...'
                }
                value={title}
                onChangeText={setTitle}
              />

              <AppInput
                label="Category"
                variant="dropdown"
                placeholder="Select category"
                dropdownData={categories}
                value={category}
                onChangeText={setCategory}
              />

              <AppInput
                label="Status"
                variant="dropdown"
                placeholder="Select status"
                dropdownData={statusOptions}
                value={status}
                onChangeText={setStatus}
              />

              {/* Zodiac Specific Fields */}
              {isZodiacTips && (
                <>
                  <AppInput
                    label="Zodiac Sign"
                    variant="dropdown"
                    placeholder="Select zodiac sign"
                    dropdownData={zodiacSigns}
                    value={zodiacSign}
                    onChangeText={setZodiacSign}
                  />

                  <AppInput
                    label="Date Range"
                    placeholder="e.g., Mar 21 - Apr 19"
                    value={dateRange}
                    onChangeText={setDateRange}
                  />

                  <AppInput
                    label="Element"
                    variant="dropdown"
                    placeholder="Select element"
                    dropdownData={elements}
                    value={element}
                    onChangeText={setElement}
                  />

                  <AppInput
                    label="Lucky Color"
                    placeholder="e.g., Red, Blue, Green"
                    value={luckyColor}
                    onChangeText={setLuckyColor}
                  />

                  <AppInput
                    label="Lucky Number"
                    placeholder="e.g., 7, 12, 21"
                    keyboardType="numeric"
                    value={luckyNumber}
                    onChangeText={setLuckyNumber}
                  />

                  {/* Compatibility Section */}
                  <View>
                    <SansText style={styles.label}>Compatibility</SansText>
                    <AppInput
                      variant="dropdown"
                      placeholder="Add compatible signs"
                      dropdownData={compatibilityOptions}
                      value=""
                      onChangeText={value => {
                        if (value) handleAddCompatibility(value);
                      }}
                    />

                    {compatibility.length > 0 && (
                      <View style={styles.compatibilityContainer}>
                        {compatibility.map(sign => (
                          <TouchableOpacity
                            key={sign}
                            style={styles.compatibilityBadge}
                            onPress={() => handleRemoveCompatibility(sign)}
                          >
                            <SansText style={styles.compatibilityText}>
                              {sign} ✕
                            </SansText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* Content Editor */}
              <View>
                <SansText style={styles.label}>Content</SansText>
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
                <RichEditor
                  ref={richText}
                  placeholder="Write your content here..."
                  initialHeight={320}
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
              </View>

              {/* Cover Image */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.imageUploadBox}
                onPress={pickImage}
              >
                {coverImage?.uri ? (
                  <Image
                    source={{ uri: coverImage.uri }}
                    style={styles.coverImage}
                  />
                ) : (
                  <>
                    <SansText style={styles.uploadTitle}>
                      Add Cover Image
                    </SansText>
                    <SansText style={styles.uploadSubtitle}>
                      Tap to upload image
                    </SansText>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.bottomContainer}>
              <ReusableButton
                title={isLoading ? 'Publishing...' : 'Publish'}
                width="100%"
                disabled={isLoading}
                onPress={handlePublish}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default CreateArticleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1D7',
  },
  label: {
    fontSize: 16,
    color: '#0D0D0D',
    marginBottom: 10,
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
  editor: {
    minHeight: 320,
    borderWidth: 1.2,
    borderColor: '#D4AF37',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#E9D8A6',
    overflow: 'hidden',
  },
  imageUploadBox: {
    minHeight: 180,
    borderWidth: 1.4,
    borderColor: '#D4AF37',
    borderRadius: 16,
    backgroundColor: '#FBF7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 8,
    padding: 16,
  },
  uploadTitle: {
    fontSize: 16,
    color: '#0D0D0D',
    fontFamily: 'SatoshiBold',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#575757',
  },
  coverImage: {
    width: '100%',
    height: 220,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#F8F1D7',
  },
  compatibilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  compatibilityBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  compatibilityText: {
    color: '#0D0D0D',
    fontSize: 14,
  },
});
