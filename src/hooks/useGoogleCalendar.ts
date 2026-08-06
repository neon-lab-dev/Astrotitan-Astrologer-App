/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import googleCalendarService from '../utils/googleCalendar.service';
import { API_URL } from '../redux/api/baseApi';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/features/auth/authSlice';

export const useGoogleCalendar = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [accessToken, setAccessToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector(selectToken)

    const checkStatus = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/v1/google-calendar/status`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setIsConnected(data.data?.isConnected ?? false);

                if (data.data?.user) {
                    setUser(data.data.user);
                } else if (data.data?.email) {
                    setUser({
                        email: data.data.email,
                    });
                } else {
                    setUser(null);
                }
            } else {
                setIsConnected(false);
                setUser(null);
            }
        } catch (err) {
            console.log('Status Error:', err);
            setIsConnected(false);
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const connectCalendar = useCallback(async () => {
        try {
            setIsLoading(true);

            const result = await googleCalendarService.signIn();

            await fetch(`${API_URL}/api/v1/google-calendar/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    accessToken: result.accessToken,
                }),
            });

            setUser(result.user);
            setAccessToken(result.accessToken);
            setIsConnected(true);

        } catch (error: any) {
            console.log(error);

            Alert.alert(
                'Error',
                error.message || 'Google Sign-In failed'
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const disconnectCalendar = useCallback(async () => {
        try {
            setIsLoading(true);

            await googleCalendarService.signOut();

            setIsConnected(false);
            setUser(null);
            setAccessToken('');

            Alert.alert(
                'Disconnected',
                'Google account disconnected.'
            );
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.message
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isConnected,
        user,
        accessToken,
        isLoading,
        connectCalendar,
        disconnectCalendar,
        refresh: checkStatus,
    };
};