// components/TimePicker.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppInput from '../reusable/InputField/AppInput';
import { SatoshiText } from '../reusable/Text/SatoshiText';

const TimePicker = ({ value, setValue }: any) => {

    const hours = value?.hours || '';
    const minutes = value?.minutes || '';
    const period = value?.period || 'AM';

    const update = (key: string, val: string) => {
        setValue({
            ...value,
            [key]: val,
        });
    };

    return (
        <View style={styles.container}>
            {/* HOURS */}
            <View style={styles.boxContainer}>
                <SatoshiText style={styles.label}>Hrs</SatoshiText>
                <AppInput
                    value={hours}
                    onChangeText={(text) => {
                        const num = text.replace(/\D/g, '').slice(0, 2);
                        if (Number(num) > 12) return;
                        update('hours', num);
                    }}
                    style={{ width: 83 }}
                    isCenter={true}
                    keyboardType="numeric"
                    placeholder="01"
                />
            </View>

            {/* MINUTES */}
            <View style={styles.boxContainer}>
                <SatoshiText style={styles.label}>Mins</SatoshiText>
                <AppInput
                    value={minutes}
                    onChangeText={(text) => {
                        const num = text.replace(/\D/g, '').slice(0, 2);
                        if (Number(num) > 59) return;
                        update('minutes', num);
                    }}
                    style={{ width: 83 }}
                    isCenter={true}
                    keyboardType="numeric"
                    placeholder="00"
                />
            </View>

            {/* AM PM */}
            <View style={styles.periodContainer}>
                <TouchableOpacity onPress={() => update('period', 'AM')}>
                    <SatoshiText style={[styles.period, period === 'AM' && styles.active]}>
                        AM
                    </SatoshiText>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => update('period', 'PM')}>
                    <SatoshiText style={[styles.period, period === 'PM' && styles.active]}>
                        PM
                    </SatoshiText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TimePicker;

const styles = StyleSheet.create({
    container: {
        flex: 1, // 🔥 THIS IS THE FIX
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 46,
        marginTop: 24,
    }
    , boxContainer: {
        alignItems: 'center',
        marginBottom: 48
    },
    label: {
        fontSize: 12,
        color: '#0D0D0D',
        marginBottom: 12,
        fontFamily: "Satoshi-Bold"
    },

    periodContainer: {
        marginLeft: 18,
        justifyContent: 'center',

    },
    period: {
        fontSize: 16,
        color: '#949494',
        marginVertical: 24,
        fontFamily: "Satoshi-Bold"
    },
    active: {
        color: '#0D0D0D',
        fontWeight: '600',
    },
});