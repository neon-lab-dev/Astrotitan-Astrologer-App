import { StyleSheet, View } from "react-native";
import ReusableButton from "../ReusableButton/ReusableButton";
import { SatoshiText } from "../Text/SatoshiText";
import { SansText } from "../Text/SansText";

type Props = {
    onCancel: () => void;
    onDelete: () => void;
};

const DeleteQuerySection = ({ onCancel, onDelete }: Props) => {
    return (
        <View style={styles.container}>
            <View style={{ gap: 8 }}><SatoshiText style={styles.title}>Are you sure?</SatoshiText>

                <SansText style={styles.description}>
                    Once deleted it cannot be retrieved.
                </SansText></View>


            <View style={styles.buttonRow}>
                <View style={{ flex: 1 }}>
                    <ReusableButton
                        title="Cancel"
                        onPress={onCancel}
                        variant="outline"
                        width="100%"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <ReusableButton
                        title="Delete"
                        onPress={onDelete}
                        variant="error"
                        width="100%"
                    />
                </View>
            </View>
        </View>
    );
};

export default DeleteQuerySection;

const styles = StyleSheet.create({
    container: {
        flex: 1, // 🔥 THIS is the key
        paddingHorizontal: 20,
        paddingVertical: 56,
        justifyContent: "space-between",
    },

    title: {
        fontSize: 21,
        fontFamily: "Satoshi-Bold",
        color: "#0D0D0D",
    },

    description: {
        fontSize: 16,
        color: "#000",
        lineHeight: 26,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 100,
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#D4AF37",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
    },

    cancelText: {
        color: "#000",
        fontFamily: "GeneralSans-Medium",
    },

    logoutBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#D4AF37",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
    },

    logoutText: {
        color: "#000",
        fontFamily: "GeneralSans-Medium",
    },
});