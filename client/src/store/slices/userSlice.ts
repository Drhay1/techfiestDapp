import axios from 'axios';
import { proxyAddress } from '../../utils/Link';
import {
  ActionReducerMapBuilder,
  CaseReducer,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  AuthProps,
  CompanyProps,
  InviteUsersProps,
  LoginProps,
  NotificationsProps,
  UserProps,
  UserStateProps,
} from '../interfaces/user.interface';
import { ClientSignupProps } from '../../pages/Auth/Client/ClientSignup';
import { UserSignupProps } from '../../pages/Auth/User/UserSignup';

const initialState: UserStateProps = {
  defaultCurrency: 'USDC',
};

export const signupClient = createAsyncThunk<UserStateProps, ClientSignupProps>(
  'signup-client',
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/client-register`,
        values,
      );

      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const signupUser = createAsyncThunk<UserStateProps, UserSignupProps>(
  'user-signup',
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/user-register`,
        values,
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const login = createAsyncThunk<UserStateProps, LoginProps>(
  'login-user',
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/login`,
        values,
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const requestPassword = createAsyncThunk<
  { msg: string; passwordRequested: boolean; email: string },
  AuthProps
>('request-password', async (values) => {
  try {
    const { data }: any = await axios.post(
      `${proxyAddress}/user/request-password`,
      values,
    );
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
});

export const changePassword = createAsyncThunk<any, AuthProps>(
  'change-password',
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/change-password`,
        values,
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const loadUser = createAsyncThunk<UserStateProps>(
  'load-user',
  async () => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<UserStateProps>(
        `${proxyAddress}/user`,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const getAllUsersCount = createAsyncThunk<{ usersCount: number }>(
  'all-users-count',
  async () => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get(
        `${proxyAddress}/user/all-users-count`,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting all users emails for Admin =========*/
export const getUsersEmailsForAdmin: any = createAsyncThunk(
  'getUsersEmailsForAdmin',
  async () => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get(
        `${proxyAddress}/user/download-users-emails`,
        {
          headers: { 'x-access-token': token },
          responseType: 'blob',
        },
      );

      const blobUrl = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `users-emails-techFiesta.xlsx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      return blobUrl;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const profileUpdate = createAsyncThunk<UserStateProps, LoginProps>(
  'update-user-profile',
  async (values) => {
    const token = localStorage.getItem('token');
    const headers = { 'x-access-token': token };

    try {
      const { data }: any = await axios.put(`${proxyAddress}/user`, values, {
        headers,
      });
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const clientCompanyUpdate = createAsyncThunk<any, CompanyProps>(
  'update-client-company-details',
  async (values) => {
    const token = localStorage.getItem('token');
    const headers = { 'x-access-token': token };

    try {
      const { data }: any = await axios.put(`${proxyAddress}/company`, values, {
        headers,
      });
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const updateNotificationsSettings = createAsyncThunk<
  any,
  NotificationsProps
>('update-notifications-settings', async (values) => {
  const token = localStorage.getItem('token');
  const headers = { 'x-access-token': token };
  try {
    const { data }: any = await axios.put(
      `${proxyAddress}/user/notifications`,
      values,
      {
        headers,
      },
    );
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
});

export const loadUserStats: any = createAsyncThunk<any>(
  'load-user-stats',
  async () => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<UserProps>(
        `${proxyAddress}/user/stats`,
        {
          headers: { 'x-access-token': token },
        },
      );

      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  },
);

export const inviteUsers: any = createAsyncThunk<
  { createdUsers: any[] },
  InviteUsersProps
>('invite-users', async (values) => {
  const token = localStorage.getItem('token');
  const headers = { 'x-access-token': token };
  try {
    const { data }: any = await axios.post(
      `${proxyAddress}/user/invite-users`,
      values,
      { headers },
    );
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
});

export const userSlice = createSlice<
  UserStateProps,
  {
    resetUser: CaseReducer<UserStateProps>;
    logoutUser: CaseReducer<UserStateProps>;
    setAccount: CaseReducer<UserStateProps, any>;
    resetReqdPass: CaseReducer<UserStateProps>;
    resetRegErrMsg: CaseReducer<UserStateProps>;
    resetRegistered: CaseReducer<UserStateProps>;
    resetInvitedUser: CaseReducer<UserStateProps>;
    resetCreatedUser: CaseReducer<UserStateProps>;
    resetInvitingUser: CaseReducer<UserStateProps>;
    resetProfileUpdated: CaseReducer<UserStateProps>;
    resetCompanyUpdated: CaseReducer<UserStateProps>;
    resetChangedRequested: CaseReducer<UserStateProps>;
    resetPasswordRequested: CaseReducer<UserStateProps>;
    resetNotificationsUpdated: CaseReducer<UserStateProps>;
  },
  'user'
>({
  name: 'user',
  initialState,
  reducers: {
    setAccount: (state, { payload }: PayloadAction<any>) => ({
      ...state,
      account: payload,
    }),
    resetRegErrMsg: (state) => {
      state.errMsg = null;
    },
    resetRegistered: (state) => {
      state.isRegistered = false;
    },
    resetUser: (state) => {
      state.user = null;
    },
    resetPasswordRequested: (state) => ({
      ...state,
      passwordRequestedProps: null,
    }),
    resetChangedRequested: (state) => {
      state.changedPasswordProps = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
    },
    resetReqdPass: (state) => ({ ...state, reqdResetPass: false }),
    resetCreatedUser: (state) => ({ ...state, createdUsers: null }),
    resetInvitedUser: (state) => ({ ...state, invitedUsers: false }),
    resetInvitingUser: (state) => ({ ...state, invitingUsers: false }),
    resetCompanyUpdated: (state) => ({ ...state, updatedCompany: false }),
    resetProfileUpdated: (state) => ({ ...state, updatedProfile: false }),
    resetNotificationsUpdated: (state) => ({
      ...state,
      updatedNotifications: false,
    }),
  },
  extraReducers(builder: ActionReducerMapBuilder<UserStateProps>) {
    //signup client
    builder.addCase(signupClient.pending, (state) => {
      state.isRegistering = true;
    });

    builder.addCase(signupClient.fulfilled, (state, { payload }) => {
      state.isRegistering = false;
      state.isRegistered = true;
      state.user = payload.user;
    });

    builder.addCase(signupClient.rejected, (state, action) => {
      state.isRegistering = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'CLIENT_REGISTER_ERROR',
      };
    });

    //signup user
    builder.addCase(signupUser.pending, (state) => {
      state.isRegistering = true;
    });

    builder.addCase(signupUser.fulfilled, (state, { payload }) => {
      state.isRegistering = false;
      state.isRegistered = payload.isRegistered;
      state.user = payload.user;
    });

    builder.addCase(signupUser.rejected, (state, action) => {
      state.isRegistering = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'USER_REGISTER_ERROR',
      };
    });

    //login user
    builder.addCase(login.pending, (state) => {
      state.loggin = true;
    });

    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loggin = false;
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('token', payload.token);
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loggin = false;
      state.user = null;
      state.errMsg = {
        msg: action.error.message,
        Id: 'LOGIN_ERROR',
      };
    });

    // forgot password
    builder.addCase(requestPassword.pending, (state) => {
      state.reqResettingPass = true;
    });

    builder.addCase(requestPassword.fulfilled, (state, { payload }) => {
      state.reqResettingPass = false;
      state.passwordRequestedProps = payload;
    });

    builder.addCase(requestPassword.rejected, (state, action) => {
      state.reqResettingPass = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'REQUEST_PASSWORD_ERROR',
      };
    });

    // change password
    builder.addCase(changePassword.pending, (state) => {
      state.reqResettingPass = false;
    });

    builder.addCase(changePassword.fulfilled, (state, { payload }) => {
      state.reqResettingPass = false;
      state.changedPasswordProps = payload;
    });

    builder.addCase(changePassword.rejected, (state, action) => {
      state.reqResettingPass = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'CHANGE_PASSWORD_ERROR',
      };
    });

    //load user
    builder.addCase(loadUser.pending, (state) => ({ ...state }));

    builder.addCase(loadUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
    });

    builder.addCase(loadUser.rejected, (state, action) => {
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      state.errMsg = {
        msg: action.error.message,
        Id: 'LOAD_USER_ERROR',
      };
    });

    // gets all hackathon
    builder.addCase(getAllUsersCount.pending, (state) => {
      state.loadingUsers = true;
    });

    builder.addCase(getAllUsersCount.fulfilled, (state, { payload }) => {
      state.loadingUsers = false;
      state.usersCount = payload.usersCount;
    });

    builder.addCase(getAllUsersCount.rejected, (state, action) => {
      state.loadingUsers = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'FETCHING_USERS_COUNT_ERROR',
      };
    });

    // client profile settings
    builder.addCase(profileUpdate.pending, (state) => {
      state.updatingProfile = true;
    });

    builder.addCase(profileUpdate.fulfilled, (state, { payload }) => {
      state.updatingProfile = false;
      state.updatedProfile = payload.updated;
    });

    builder.addCase(profileUpdate.rejected, (state, action) => {
      state.updatingProfile = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'PROFILE_UPDATE_ERROR',
      };
    });

    // client company settings
    builder.addCase(clientCompanyUpdate.pending, (state) => {
      state.updatingCompany = true;
    });

    builder.addCase(clientCompanyUpdate.fulfilled, (state) => {
      state.updatingCompany = false;
      state.updatedCompany = true;
    });

    builder.addCase(clientCompanyUpdate.rejected, (state, action) => {
      state.updatingCompany = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'CLIENT_COMPANY_SETTINGS_ERROR',
      };
    });

    // client notification settings
    builder.addCase(updateNotificationsSettings.pending, (state) => {
      state.updatingNotifications = true;
    });

    builder.addCase(updateNotificationsSettings.fulfilled, (state) => {
      state.updatingNotifications = false;
      state.updatedNotifications = true;
    });

    builder.addCase(updateNotificationsSettings.rejected, (state, action) => {
      state.updatingNotifications = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'CLIENT_NOTIFICATIONS_SETTINGS_ERROR',
      };
    });

    // load user stats
    builder.addCase(loadUserStats.pending, (state) => {
      state.loadingStats = true;
    });

    builder.addCase(loadUserStats.fulfilled, (state, { payload }) => {
      state.loadingStats = false;
      state.stats = payload;
    });

    builder.addCase(loadUserStats.rejected, (state, action) => {
      state.loadingStats = true;
      state.errMsg = {
        msg: action.error.message,
        Id: 'LOAD_HACK_STATS_ERROR',
      };
    });

    //=================== invite users ===================
    builder.addCase(inviteUsers.pending, (state) => {
      state.invitingUsers = true;
    });

    builder.addCase(inviteUsers.fulfilled, (state, { payload }) => {
      console.log(payload);
      state.invitedUsers = true;
      state.createdUsers = payload.createdUsers;
    });

    builder.addCase(inviteUsers.rejected, (state, action) => {
      state.invitingUsers = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'INVITE_USER_ERROR',
      };
    });
  },
});

export const {
  resetUser,
  logoutUser,
  setAccount,
  resetReqdPass,
  resetRegErrMsg,
  resetRegistered,
  resetInvitedUser,
  resetCreatedUser,
  resetInvitingUser,
  resetCompanyUpdated,
  resetProfileUpdated,
  resetChangedRequested,
  resetPasswordRequested,
  resetNotificationsUpdated,
} = userSlice.actions;

export default userSlice.reducer;
