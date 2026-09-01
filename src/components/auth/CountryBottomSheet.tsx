// components/auth/CountryBottomSheet.tsx
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import { SatoshiText } from '../reusable/Text/SatoshiText';
import { SansText } from '../reusable/Text/SansText';
import BottomSheetService from '../../redux/features/ui/GlobalSheet/BottomSheetService';
import Ionicons from '@react-native-vector-icons/ionicons';

const countries = [
  { name: 'Afghanistan', code: 'AF', callingCode: '93', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', callingCode: '355', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', callingCode: '213', flag: '🇩🇿' },
  { name: 'Andorra', code: 'AD', callingCode: '376', flag: '🇦🇩' },
  { name: 'Angola', code: 'AO', callingCode: '244', flag: '🇦🇴' },
  { name: 'Antigua and Barbuda', code: 'AG', callingCode: '1-268', flag: '🇦🇬' },
  { name: 'Argentina', code: 'AR', callingCode: '54', flag: '🇦🇷' },
  { name: 'Armenia', code: 'AM', callingCode: '374', flag: '🇦🇲' },
  { name: 'Australia', code: 'AU', callingCode: '61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', callingCode: '43', flag: '🇦🇹' },
  { name: 'Azerbaijan', code: 'AZ', callingCode: '994', flag: '🇦🇿' },

  { name: 'Bahamas', code: 'BS', callingCode: '1-242', flag: '🇧🇸' },
  { name: 'Bahrain', code: 'BH', callingCode: '973', flag: '🇧🇭' },
  { name: 'Bangladesh', code: 'BD', callingCode: '880', flag: '🇧🇩' },
  { name: 'Barbados', code: 'BB', callingCode: '1-246', flag: '🇧🇧' },
  { name: 'Belarus', code: 'BY', callingCode: '375', flag: '🇧🇾' },
  { name: 'Belgium', code: 'BE', callingCode: '32', flag: '🇧🇪' },
  { name: 'Belize', code: 'BZ', callingCode: '501', flag: '🇧🇿' },
  { name: 'Benin', code: 'BJ', callingCode: '229', flag: '🇧🇯' },
  { name: 'Bhutan', code: 'BT', callingCode: '975', flag: '🇧🇹' },
  { name: 'Bolivia', code: 'BO', callingCode: '591', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', code: 'BA', callingCode: '387', flag: '🇧🇦' },
  { name: 'Botswana', code: 'BW', callingCode: '267', flag: '🇧🇼' },
  { name: 'Brazil', code: 'BR', callingCode: '55', flag: '🇧🇷' },
  { name: 'Brunei', code: 'BN', callingCode: '673', flag: '🇧🇳' },
  { name: 'Bulgaria', code: 'BG', callingCode: '359', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: 'BF', callingCode: '226', flag: '🇧🇫' },
  { name: 'Burundi', code: 'BI', callingCode: '257', flag: '🇧🇮' },

  { name: 'Cabo Verde', code: 'CV', callingCode: '238', flag: '🇨🇻' },
  { name: 'Cambodia', code: 'KH', callingCode: '855', flag: '🇰🇭' },
  { name: 'Cameroon', code: 'CM', callingCode: '237', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', callingCode: '1', flag: '🇨🇦' },
  { name: 'Central African Republic', code: 'CF', callingCode: '236', flag: '🇨🇫' },
  { name: 'Chad', code: 'TD', callingCode: '235', flag: '🇹🇩' },
  { name: 'Chile', code: 'CL', callingCode: '56', flag: '🇨🇱' },
  { name: 'China', code: 'CN', callingCode: '86', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', callingCode: '57', flag: '🇨🇴' },
  { name: 'Comoros', code: 'KM', callingCode: '269', flag: '🇰🇲' },
  { name: 'Congo, Democratic Republic of the', code: 'CD', callingCode: '243', flag: '🇨🇩' },
  { name: 'Congo, Republic of the', code: 'CG', callingCode: '242', flag: '🇨🇬' },
  { name: 'Costa Rica', code: 'CR', callingCode: '506', flag: '🇨🇷' },
  { name: 'Croatia', code: 'HR', callingCode: '385', flag: '🇭🇷' },
  { name: 'Cuba', code: 'CU', callingCode: '53', flag: '🇨🇺' },
  { name: 'Cyprus', code: 'CY', callingCode: '357', flag: '🇨🇾' },
  { name: 'Czechia', code: 'CZ', callingCode: '420', flag: '🇨🇿' },

  { name: 'Denmark', code: 'DK', callingCode: '45', flag: '🇩🇰' },
  { name: 'Djibouti', code: 'DJ', callingCode: '253', flag: '🇩🇯' },
  { name: 'Dominica', code: 'DM', callingCode: '1-767', flag: '🇩🇲' },
  { name: 'Dominican Republic', code: 'DO', callingCode: '1-809', flag: '🇩🇴' },

  { name: 'Ecuador', code: 'EC', callingCode: '593', flag: '🇪🇨' },
  { name: 'Egypt', code: 'EG', callingCode: '20', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', callingCode: '503', flag: '🇸🇻' },
  { name: 'Equatorial Guinea', code: 'GQ', callingCode: '240', flag: '🇬🇶' },
  { name: 'Eritrea', code: 'ER', callingCode: '291', flag: '🇪🇷' },
  { name: 'Estonia', code: 'EE', callingCode: '372', flag: '🇪🇪' },
  { name: 'Eswatini', code: 'SZ', callingCode: '268', flag: '🇸🇿' },
  { name: 'Ethiopia', code: 'ET', callingCode: '251', flag: '🇪🇹' },

  { name: 'Fiji', code: 'FJ', callingCode: '679', flag: '🇫🇯' },
  { name: 'Finland', code: 'FI', callingCode: '358', flag: '🇫🇮' },
  { name: 'France', code: 'FR', callingCode: '33', flag: '🇫🇷' },

  { name: 'Gabon', code: 'GA', callingCode: '241', flag: '🇬🇦' },
  { name: 'Gambia', code: 'GM', callingCode: '220', flag: '🇬🇲' },
  { name: 'Georgia', code: 'GE', callingCode: '995', flag: '🇬🇪' },
  { name: 'Germany', code: 'DE', callingCode: '49', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', callingCode: '233', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', callingCode: '30', flag: '🇬🇷' },
  { name: 'Grenada', code: 'GD', callingCode: '1-473', flag: '🇬🇩' },
  { name: 'Guatemala', code: 'GT', callingCode: '502', flag: '🇬🇹' },
  { name: 'Guinea', code: 'GN', callingCode: '224', flag: '🇬🇳' },
  { name: 'Guinea-Bissau', code: 'GW', callingCode: '245', flag: '🇬🇼' },
  { name: 'Guyana', code: 'GY', callingCode: '592', flag: '🇬🇾' },

  { name: 'Haiti', code: 'HT', callingCode: '509', flag: '🇭🇹' },
  { name: 'Honduras', code: 'HN', callingCode: '504', flag: '🇭🇳' },
  { name: 'Hungary', code: 'HU', callingCode: '36', flag: '🇭🇺' },

  { name: 'Iceland', code: 'IS', callingCode: '354', flag: '🇮🇸' },
  { name: 'India', code: 'IN', callingCode: '91', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', callingCode: '62', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', callingCode: '98', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', callingCode: '964', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', callingCode: '353', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', callingCode: '972', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', callingCode: '39', flag: '🇮🇹' },

  { name: 'Jamaica', code: 'JM', callingCode: '1-876', flag: '🇯🇲' },
  { name: 'Japan', code: 'JP', callingCode: '81', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', callingCode: '962', flag: '🇯🇴' },

  { name: 'Kazakhstan', code: 'KZ', callingCode: '7', flag: '🇰🇿' },
  { name: 'Kenya', code: 'KE', callingCode: '254', flag: '🇰🇪' },
  { name: 'Kiribati', code: 'KI', callingCode: '686', flag: '🇰🇮' },
  { name: 'Kuwait', code: 'KW', callingCode: '965', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', code: 'KG', callingCode: '996', flag: '🇰🇬' },

  { name: 'Laos', code: 'LA', callingCode: '856', flag: '🇱🇦' },
  { name: 'Latvia', code: 'LV', callingCode: '371', flag: '🇱🇻' },
  { name: 'Lebanon', code: 'LB', callingCode: '961', flag: '🇱🇧' },
  { name: 'Lesotho', code: 'LS', callingCode: '266', flag: '🇱🇸' },
  { name: 'Liberia', code: 'LR', callingCode: '231', flag: '🇱🇷' },
  { name: 'Libya', code: 'LY', callingCode: '218', flag: '🇱🇾' },
  { name: 'Liechtenstein', code: 'LI', callingCode: '423', flag: '🇱🇮' },
  { name: 'Lithuania', code: 'LT', callingCode: '370', flag: '🇱🇹' },
  { name: 'Luxembourg', code: 'LU', callingCode: '352', flag: '🇱🇺' },

  { name: 'Madagascar', code: 'MG', callingCode: '261', flag: '🇲🇬' },
  { name: 'Malawi', code: 'MW', callingCode: '265', flag: '🇲🇼' },
  { name: 'Malaysia', code: 'MY', callingCode: '60', flag: '🇲🇾' },
  { name: 'Maldives', code: 'MV', callingCode: '960', flag: '🇲🇻' },
  { name: 'Mali', code: 'ML', callingCode: '223', flag: '🇲🇱' },
  { name: 'Malta', code: 'MT', callingCode: '356', flag: '🇲🇹' },
  { name: 'Marshall Islands', code: 'MH', callingCode: '692', flag: '🇲🇭' },
  { name: 'Mauritania', code: 'MR', callingCode: '222', flag: '🇲🇷' },
  { name: 'Mauritius', code: 'MU', callingCode: '230', flag: '🇲🇺' },
  { name: 'Mexico', code: 'MX', callingCode: '52', flag: '🇲🇽' },
  { name: 'Micronesia', code: 'FM', callingCode: '691', flag: '🇫🇲' },
  { name: 'Moldova', code: 'MD', callingCode: '373', flag: '🇲🇩' },
  { name: 'Monaco', code: 'MC', callingCode: '377', flag: '🇲🇨' },
  { name: 'Mongolia', code: 'MN', callingCode: '976', flag: '🇲🇳' },
  { name: 'Montenegro', code: 'ME', callingCode: '382', flag: '🇲🇪' },
  { name: 'Morocco', code: 'MA', callingCode: '212', flag: '🇲🇦' },
  { name: 'Mozambique', code: 'MZ', callingCode: '258', flag: '🇲🇿' },
  { name: 'Myanmar', code: 'MM', callingCode: '95', flag: '🇲🇲' },

  { name: 'Namibia', code: 'NA', callingCode: '264', flag: '🇳🇦' },
  { name: 'Nauru', code: 'NR', callingCode: '674', flag: '🇳🇷' },
  { name: 'Nepal', code: 'NP', callingCode: '977', flag: '🇳🇵' },
  { name: 'Netherlands', code: 'NL', callingCode: '31', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', callingCode: '64', flag: '🇳🇿' },
  { name: 'Nicaragua', code: 'NI', callingCode: '505', flag: '🇳🇮' },
  { name: 'Niger', code: 'NE', callingCode: '227', flag: '🇳🇪' },
  { name: 'Nigeria', code: 'NG', callingCode: '234', flag: '🇳🇬' },
  { name: 'North Korea', code: 'KP', callingCode: '850', flag: '🇰🇵' },
  { name: 'North Macedonia', code: 'MK', callingCode: '389', flag: '🇲🇰' },
  { name: 'Norway', code: 'NO', callingCode: '47', flag: '🇳🇴' },

  { name: 'Oman', code: 'OM', callingCode: '968', flag: '🇴🇲' },

  { name: 'Pakistan', code: 'PK', callingCode: '92', flag: '🇵🇰' },
  { name: 'Palau', code: 'PW', callingCode: '680', flag: '🇵🇼' },
  { name: 'Palestine', code: 'PS', callingCode: '970', flag: '🇵🇸' },
  { name: 'Panama', code: 'PA', callingCode: '507', flag: '🇵🇦' },
  { name: 'Papua New Guinea', code: 'PG', callingCode: '675', flag: '🇵🇬' },
  { name: 'Paraguay', code: 'PY', callingCode: '595', flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', callingCode: '51', flag: '🇵🇪' },
  { name: 'Philippines', code: 'PH', callingCode: '63', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', callingCode: '48', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', callingCode: '351', flag: '🇵🇹' },

  { name: 'Qatar', code: 'QA', callingCode: '974', flag: '🇶🇦' },

  { name: 'Romania', code: 'RO', callingCode: '40', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', callingCode: '7', flag: '🇷🇺' },
  { name: 'Rwanda', code: 'RW', callingCode: '250', flag: '🇷🇼' },

  { name: 'Saint Kitts and Nevis', code: 'KN', callingCode: '1-869', flag: '🇰🇳' },
  { name: 'Saint Lucia', code: 'LC', callingCode: '1-758', flag: '🇱🇨' },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
    callingCode: '1-784',
    flag: '🇻🇨',
  },
  { name: 'Samoa', code: 'WS', callingCode: '685', flag: '🇼🇸' },
  { name: 'San Marino', code: 'SM', callingCode: '378', flag: '🇸🇲' },
  { name: 'Sao Tome and Principe', code: 'ST', callingCode: '239', flag: '🇸🇹' },
  { name: 'Saudi Arabia', code: 'SA', callingCode: '966', flag: '🇸🇦' },
  { name: 'Senegal', code: 'SN', callingCode: '221', flag: '🇸🇳' },
  { name: 'Serbia', code: 'RS', callingCode: '381', flag: '🇷🇸' },
  { name: 'Seychelles', code: 'SC', callingCode: '248', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: 'SL', callingCode: '232', flag: '🇸🇱' },
  { name: 'Singapore', code: 'SG', callingCode: '65', flag: '🇸🇬' },
  { name: 'Slovakia', code: 'SK', callingCode: '421', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', callingCode: '386', flag: '🇸🇮' },
  { name: 'Solomon Islands', code: 'SB', callingCode: '677', flag: '🇸🇧' },
  { name: 'Somalia', code: 'SO', callingCode: '252', flag: '🇸🇴' },
  { name: 'South Africa', code: 'ZA', callingCode: '27', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', callingCode: '82', flag: '🇰🇷' },
  { name: 'South Sudan', code: 'SS', callingCode: '211', flag: '🇸🇸' },
  { name: 'Spain', code: 'ES', callingCode: '34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', callingCode: '94', flag: '🇱🇰' },
  { name: 'Sudan', code: 'SD', callingCode: '249', flag: '🇸🇩' },
  { name: 'Suriname', code: 'SR', callingCode: '597', flag: '🇸🇷' },
  { name: 'Sweden', code: 'SE', callingCode: '46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', callingCode: '41', flag: '🇨🇭' },
  { name: 'Syria', code: 'SY', callingCode: '963', flag: '🇸🇾' },

  { name: 'Tajikistan', code: 'TJ', callingCode: '992', flag: '🇹🇯' },
  { name: 'Tanzania', code: 'TZ', callingCode: '255', flag: '🇹🇿' },
  { name: 'Thailand', code: 'TH', callingCode: '66', flag: '🇹🇭' },
  { name: 'Timor-Leste', code: 'TL', callingCode: '670', flag: '🇹🇱' },
  { name: 'Togo', code: 'TG', callingCode: '228', flag: '🇹🇬' },
  { name: 'Tonga', code: 'TO', callingCode: '676', flag: '🇹🇴' },
  { name: 'Trinidad and Tobago', code: 'TT', callingCode: '1-868', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', callingCode: '216', flag: '🇹🇳' },
  { name: 'Türkiye', code: 'TR', callingCode: '90', flag: '🇹🇷' },
  { name: 'Turkmenistan', code: 'TM', callingCode: '993', flag: '🇹🇲' },
  { name: 'Tuvalu', code: 'TV', callingCode: '688', flag: '🇹🇻' },

  { name: 'Uganda', code: 'UG', callingCode: '256', flag: '🇺🇬' },
  { name: 'Ukraine', code: 'UA', callingCode: '380', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', callingCode: '971', flag: '🇦🇪' },
  { name: 'United Kingdom', code: 'GB', callingCode: '44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', callingCode: '1', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', callingCode: '598', flag: '🇺🇾' },
  { name: 'Uzbekistan', code: 'UZ', callingCode: '998', flag: '🇺🇿' },

  { name: 'Vanuatu', code: 'VU', callingCode: '678', flag: '🇻🇺' },
  { name: 'Vatican City', code: 'VA', callingCode: '379', flag: '🇻🇦' },
  { name: 'Venezuela', code: 'VE', callingCode: '58', flag: '🇻🇪' },
  { name: 'Vietnam', code: 'VN', callingCode: '84', flag: '🇻🇳' },

  { name: 'Yemen', code: 'YE', callingCode: '967', flag: '🇾🇪' },

  { name: 'Zambia', code: 'ZM', callingCode: '260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', callingCode: '263', flag: '🇿🇼' },
];

interface CountryBottomSheetProps {
  selectedCountry: {
    name: string;
    code: string;
    callingCode: string;
    flag: string;
  };
  onSelectCountry: (country: any) => void;
}

const CountryBottomSheet = ({
  selectedCountry,
  onSelectCountry,
}: CountryBottomSheetProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(text.toLowerCase()) ||
        country.callingCode.includes(text)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  };

  const handleSelect = (country: any) => {
    onSelectCountry(country);
    BottomSheetService.close();
  };

  const renderCountry = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        selectedCountry?.code === item.code && styles.selectedCountryItem,
      ]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.countryContent}>
        <SansText style={styles.flag}>{item.flag}</SansText>
        <View style={styles.countryInfo}>
          <SatoshiText style={styles.countryName}>{item.name}</SatoshiText>
          <SansText style={styles.countryCode}>+{item.callingCode}</SansText>
        </View>
        {selectedCountry?.code === item.code && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.headerTitle}>Select Country</SatoshiText>
        <TouchableOpacity
          onPress={BottomSheetService.close}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search country..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#999999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        renderItem={renderCountry}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'GeneralSans-Regular',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  countryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedCountryItem: {
    borderColor: '#D4AF37',
    backgroundColor: '#FDF8EF',
  },
  countryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  flag: {
    fontSize: 32,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: '#0D0D0D',
    fontFamily: 'Satoshi-Medium',
  },
  countryCode: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    marginTop: 2,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CountryBottomSheet;