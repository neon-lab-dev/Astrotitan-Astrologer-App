import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/account/login",
        method: "POST",
        body: userInfo,
      }),
    }),

    signup: builder.mutation({
      query: (signupData) => ({
        method: "POST",
        url: "/account/signup",
        body: signupData,
      }),
    }),
    verifyLoginOtp: builder.mutation({
      query: (otpData) => ({
        method: "POST",
        url: "/account/verify-login-otp", // ✅ FIXED
        body: otpData,
      }),
    }),

    verifySignupOtp: builder.mutation({
      query: (otpData) => ({
        method: "POST",
        url: "/account/verify-signup-otp",
        body: otpData,
      }),
    }),

    resendLoginOtp: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/account/resend-login-otp",
        body: data,
      }),
    }),

    resendSignupOtp: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/account/resend-signup-otp",
        body: data,
      }),
    }),
    completeProfile: builder.mutation({
      query: (data) => ({
        url: "/account/complete-profile",
        method: "PUT",
        body: data,
      }),
    }),

    getMe: builder.query({
      query: () => ({
        method: "GET",
        url: "/account/me",
        credentials: "include",
      }),
      providesTags: ["users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    updateProfile: builder.mutation({
      query: ({
        file,
        intents = [],
        dateOfBirth,
        firstName,
        gender,
        lastName,
        phoneNumber,
        placeOfBirth,
        timeOfBirth,
      }) => {
        const formData = new FormData();

        /* IMAGE */

        if (file?.uri) {
          formData.append("file", {
            uri: file.uri,
            name: file.fileName || `profile-${Date.now()}.jpg`,
            type: file.mimeType || "image/jpeg",
          } as any);
        }

        /* TEXT FIELDS */

        if (intents && intents.length > 0) {
          formData.append("intents", JSON.stringify(intents));
        }

        if (dateOfBirth) {
          formData.append("dateOfBirth", dateOfBirth);
        }

        if (firstName) {
          formData.append("firstName", firstName);
        }

        if (gender) {
          formData.append("gender", gender);
        }

        if (lastName) {
          formData.append("lastName", lastName);
        }

        if (phoneNumber) {
          formData.append("phoneNumber", phoneNumber);
        }

        if (placeOfBirth) {
          formData.append("placeOfBirth", placeOfBirth);
        }

        if (timeOfBirth) {
          formData.append("timeOfBirth", timeOfBirth);
        }

        console.log("UPLOADING FILE:", file);

        return {
          url: "/account/update-profile",
          method: "PUT",
          body: formData,
          credentials: "include",
        };
      },

      invalidatesTags: ["users"],
    }),

    savePushNotificationToken: builder.mutation({
      query: (profileUpdatedData) => ({
        method: "POST",
        url: `/auth/save-push-notification-token`,
        body: profileUpdatedData,
      }),
      invalidatesTags: ["users"],
    }),

    getAllPushNotificationForUser: builder.query({
      query: (userId) => ({
        method: "GET",
        url: `/pushNotification/${userId}`,
      }),
      providesTags: ["users"],

      // notifications/my
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useResendLoginOtpMutation,
  useResendSignupOtpMutation,
  useVerifyLoginOtpMutation,
  useVerifySignupOtpMutation,
  useCompleteProfileMutation,
  useGetMeQuery,
  useDeleteUserMutation,
  useSavePushNotificationTokenMutation,
  useGetAllPushNotificationForUserQuery,
  useLazyGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
