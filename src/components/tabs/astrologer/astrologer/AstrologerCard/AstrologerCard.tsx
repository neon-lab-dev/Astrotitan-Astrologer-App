import StarIcon from '@/assets/icons/visual/star.svg';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../../../../layout/AnimatedScreen';
import { SatoshiText } from '../../../../reusable/Text/SatoshiText';
import { SansText } from '../../../../reusable/Text/SansText';
import ReusableButton from '../../../../reusable/ReusableButton/ReusableButton';
import { useNavigation } from '@react-navigation/native';

export const AstrologerCard = ({
    item,
}: any) => {
    const navigation = useNavigation<any>();
    return (
        <AnimatedScreen>
            <TouchableOpacity onPress={()=>{ navigation.navigate("AstrologerDetailsScreen", { id: item._id, })}}  style={styles.card}>
                <View style={styles.cardTop}
                >
                    <Image
                        source={{ uri: item?.profilePicture, }}
                        style={styles.avatar}
                    />
                    <View style={{ flex: 1, }}                    >
                        <SatoshiText style={styles.name}> {item?.displayName}</SatoshiText>
                        <SansText style={styles.sub}>
                            {item?.areaOfPractice?.length
                                ? item?.areaOfPractice.slice(0, 2).join(" • ")
                                : "General Astrology"}
                        </SansText>

                        <View
                            style={{
                                flexDirection: "row",
                                gap: 4,
                                alignItems: "center",
                            }}
                        >
                            <StarIcon
                                height={20}
                                width={20}
                            />

                            <SatoshiText style={styles.rating}> {item.rating}
                            </SatoshiText>

                            <SansText
                                style={{ color: "#757575", }}>(
                                {item
                                    ?.reviews
                                    ?.length || 0}{" "}
                                Reviews) </SansText>
                        </View>

                        <SansText style={styles.desc}>
                            {item?.bio
                                ? item?.bio.slice(0, 30) + "..."
                                : "No description available"}
                        </SansText>
                    </View>
                </View>

                <ReusableButton

                    onPress={() =>
                        navigation.navigate("RequestConsultationForm", { id: item._id, })
                    }
                    title="Consult now"
                    variant="outline"
                    style={{
                        marginTop: 16,
                        borderRadius: 12,
                    }}
                    iconName="ChatIcon"
                    iconPosition="left"
                />
            </TouchableOpacity>
        </AnimatedScreen>
    );
};
const styles =
    StyleSheet.create({

        card: {
            backgroundColor: "#FBF7EB",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#D4AF37",
        },

        cardTop: {
            flexDirection: "row",
            gap: 12,
        },

        avatar: {
            width: 124,
            height: 124,
            borderRadius: 12,
            backgroundColor: "#F0E8CD"
        },

        name: {
            fontSize: 18,
            lineHeight: 26,
            fontFamily: "Satoshi-Bold",
            color: "#0D0D0D",
        },

        sub: {
            fontSize: 12,
            color: "#0D0D0D",
            lineHeight: 20,
        },

        rating: {
            fontSize: 18,
            color: "#0D0D0D",
            fontFamily:
                "Satoshi-Bold",
        },

        desc: {
            fontSize: 13,
            marginTop: 4,
            color: "#444",
        },
    });