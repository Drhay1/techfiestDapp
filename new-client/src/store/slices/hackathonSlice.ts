import {
  ActionReducerMapBuilder,
  CaseReducer,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { proxyAddress } from '../../utils/Link';
import {
  HackathonProps,
  HackathonStateProps,
} from '../interfaces/hackathon.interface';

/*========= Define the initial state for the Hackathon slice start here ======== */
const initialState: HackathonStateProps = {};

/*========= Async thunk for initial of a Hackathon Start Here =========*/
export const initHackathon: any = createAsyncThunk<any, any>(
  'init-hackathon',
  async (values) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/hackathon/init`,
        values,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for sending a Hackathon Start Here =========*/
export const sendHackathon = createAsyncThunk<any, string | undefined>(
  'create-hackathon',
  async (values) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/hackathon/send`,
        values,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

// Async thunk for Updating a Hackathon
export const updateHackathon: any = createAsyncThunk<void, any>(
  'update-hackathon',
  async (values: any) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.put(
        `${proxyAddress}/hackathon/update`,
        values,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting a Hackathon Start Here =========*/
export const getMyHackathons = createAsyncThunk<any, string | undefined>(
  'myhacks',
  async () => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/my-hacks`,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting a Hackathon Requests Start Here =========*/
export const getHackathonRequests: any = createAsyncThunk<
  HackathonProps[] | void
>('myhacks', async () => {
  const token = localStorage.getItem('token');

  try {
    const { data }: any = await axios.get<HackathonProps>(
      `${proxyAddress}/hackathon/requests`,
      {
        headers: { 'x-access-token': token },
      },
    );
    return data;
  } catch (e: any | unknown) {
    throw new Error(e.response.data.error.message);
  }
});

/*========= Async thunk for getting all Hackathon Start Here =========*/
export const getAllHackathons = createAsyncThunk<
  HackathonProps[],
  void | undefined
>('gethacks', async () => {
  const token = localStorage.getItem('token');

  try {
    const { data }: any = await axios.get<HackathonProps>(
      `${proxyAddress}/hackathon?page=1&limit=10`,
      {
        headers: { 'x-access-token': token },
      },
    );
    return data;
  } catch (e: any | unknown) {
    throw new Error(e.response.data.error.message);
  }
});

// Async thunk for getting Hackathon Details  for Admin
export const getHackathonDetailForAdmin: any = createAsyncThunk<any>(
  'getAHackForAdmin',
  async (id) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/adetail/${id}`,
        {
          headers: { 'x-access-token': token },
        },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting a Hackathon  for client =========*/
export const getHackathonDetailForClient: any = createAsyncThunk(
  'getAHackForClient',
  async (id) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/cdetail/${id}`,
        {
          headers: { 'x-access-token': token },
        },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting Hackathon submission download for Admin =========*/
export const getHackathonSubmissionsDownloadForAdmin: any = createAsyncThunk(
  'getAHackSubmissionsDownloadForAdmin',
  async (id) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/adownload-submissions/${id}`,
        {
          headers: { 'x-access-token': token },
          responseType: 'blob',
        },
      );

      const blobUrl = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `hackathon-submissions-techFiesta.xlsx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      return blobUrl;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting Hackathon submission download for Client =========*/
export const getHackathonSubmissionsDownloadForClient: any = createAsyncThunk(
  'getAHackSubmissionsDownloadForClient',
  async (id) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/cdownload-submissions/${id}`,
        {
          headers: { 'x-access-token': token },
          responseType: 'blob',
        },
      );

      const blobUrl = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `hackathon-submissions-techFiesta.xlsx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      return blobUrl;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for publsihing Hackathon =========*/
export const publishAHackathon: any = createAsyncThunk<HackathonProps, number>(
  'publishAHackathon',
  async (id: number) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.put<HackathonProps>(
        `${proxyAddress}/hackathon/publish/${id}`,
        { id },
        {
          headers: { 'x-access-token': token },
        },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting Hackathon Listings =========*/
export const getHackathonListings = createAsyncThunk<HackathonProps[]>(
  'hackathon-listings',
  async () => {
    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/all?page=1&limit=10`,
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*======== get sponsors =========*/
export const getSponsors = createAsyncThunk<any[]>(
  'hackathon-sponsors',
  async () => {
    try {
      const { data }: any = await axios.get<any>(
        `${proxyAddress}/hackathon/sponsors`,
      );

      return data;
    } catch (e: any | unknown) {
      console.log(e);
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting Hackathon Details for all =========*/
export const getHackathonDetail: any = createAsyncThunk<
  { hackathon: HackathonProps },
  number
>('getHackathon-for-all', async (id) => {
  const token = localStorage.getItem('token');

  try {
    const { data }: any = await axios.get<HackathonProps>(
      `${proxyAddress}/hackathon/hacks/${id}`,
      {
        headers: { 'x-access-token': token },
      },
    );

    return data;
  } catch (e: any | unknown) {
    throw new Error(e.response.data.error.message);
  }
});

/*========= Async thunk to register for an Hackathon =========*/
export const registerForAHack: any = createAsyncThunk(
  'registerFoAHack',
  async (values: any) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.post<HackathonProps>(
        `${proxyAddress}/hackathon/register`,
        values,
        { headers: { 'x-access-token': token } },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for getting Client Hackathons =========*/
export const getClientHacks = createAsyncThunk<any, string | undefined>(
  'getClientHacks',
  async () => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get<HackathonProps>(
        `${proxyAddress}/hackathon/client-hacks?page=1&limit=10`,
        {
          headers: { 'x-access-token': token },
        },
      );
      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for submitting Hackathons result =========*/
export const submitHackResult: any = createAsyncThunk(
  'submitHackResult',
  async (values) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.put(
        `${proxyAddress}/hackathon/submit-result`,
        values,
        {
          headers: { 'x-access-token': token },
        },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for setting a Participant Score =========*/
export const setParticipantScore: any = createAsyncThunk<
  any,
  string | undefined
>('setParticipantScore', async (values, { getState }: any) => {
  const token = localStorage.getItem('token');
  const { clientHackathons, clientHackInfo } = getState().hackathon;

  try {
    const { data }: any = await axios.put(
      `${proxyAddress}/hackathon/set-score`,
      values,
      { headers: { 'x-access-token': token } },
    );

    if (data?.result) {
      const { result } = data;

      const resultIndex = clientHackInfo.submissions
        .map(function (x: any) {
          return x._id;
        })
        .indexOf(result._id);

      const clonedSubmissions = clientHackInfo.submissions.slice();
      clonedSubmissions[resultIndex] = {
        ...clonedSubmissions[resultIndex],
        ...result,
      };

      let newHackInfo = {
        ...clientHackInfo,
        submissions: clonedSubmissions,
      };

      const updatedClientHacks = clientHackathons.map(
        (hackathon: HackathonProps) => {
          if (hackathon._id === result.hackathon) {
            const updatedSubmissions = hackathon.submissions
              .map((submission) => {
                if (submission._id === result._id) {
                  return result;
                }
                return submission;
              })
              .sort((a, b) => b.score - a.score);

            return { ...hackathon, submissions: updatedSubmissions };
          }
          return hackathon;
        },
      );

      return { newHackInfo, updatedClientHacks };
    }
  } catch (e: any | unknown) {
    throw new Error(e.response.data.error.message);
  }
});

/*========= Async thunk for accepting a Participant Result =========*/
export const acceptParticipantResult: any = createAsyncThunk<
  any,
  string | undefined
>('setAcceptParticipantResult', async (values, { getState }: any) => {
  const token = localStorage.getItem('token');
  const { clientHackathons, clientHackInfo } = getState().hackathon;

  try {
    const { data }: any = await axios.put(
      `${proxyAddress}/hackathon/accept-result`,
      values,
      { headers: { 'x-access-token': token } },
    );

    if (data?.result) {
      const { result } = data;

      const resultIndex = clientHackInfo.submissions
        .map(function (x: any) {
          return x._id;
        })
        .indexOf(result._id);

      const clonedSubmissions = clientHackInfo.submissions.slice();
      clonedSubmissions[resultIndex] = {
        ...clonedSubmissions[resultIndex],
        ...result,
      };

      const newHackInfo = {
        ...clientHackInfo,
        submissions: clonedSubmissions,
      };

      const updatedClientHacks = clientHackathons.map(
        (hackathon: HackathonProps) => {
          if (hackathon._id === result.hackathon) {
            const updatedSubmissions = hackathon.submissions.map(
              (submission: any) => {
                if (submission._id === result._id) {
                  return result;
                }
                return submission;
              },
            );
            return { ...hackathon, submissions: updatedSubmissions };
          }
          return hackathon;
        },
      );

      return { newHackInfo, updatedClientHacks };
    }
  } catch (e: any | unknown) {
    throw new Error(e.response.data.error.message);
  }
});

/*========= Async thunk for Payout request =========*/
export const payoutReq: any = createAsyncThunk(
  'payoutReq',
  async (values: any) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.post<HackathonProps>(
        `${proxyAddress}/hackathon/payout`,
        values,
        { headers: { 'x-access-token': token } },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for create offchain hackathon =========*/
export const createOffChainHackathon: any = createAsyncThunk(
  'create-offchain-hackathon',
  async (values: any) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.post<HackathonProps>(
        `${proxyAddress}/hackathon/create-offchain-hackathon`,
        values,
        { headers: { 'x-access-token': token } },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for paid user =========*/
export const paidUser: any = createAsyncThunk(
  'paid-user',
  async (values, { getState }: any) => {
    const token = localStorage.getItem('token');
    const thisHackathon = getState()?.hackathon?.clientHackInfo;
    const winners = thisHackathon?.winners.slice();

    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/hackathon/paid-user`,
        values,
        {
          headers: { 'x-access-token': token },
        },
      );

      winners.push({ _id: data.userId });
      const updatedWinners = thisHackathon.winners.concat(winners);

      return { updatedWinners };
    } catch (e: any | unknown) {
      throw new Error(e.response.data.error.message);
    }
  },
);

/*========= Async thunk for check if user is paid =========*/
export const checkIfUserIsPaid: any = createAsyncThunk(
  'api/checkUserIsPaid',
  async ({ userId, hackathonId }: any) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.get(
        `${proxyAddress}/hackathon/check-paid/${userId}/${hackathonId}`,
        {
          headers: { 'x-access-token': token },
        },
      );

      return data;
    } catch (e: any | unknown) {
      throw new Error(e.response?.data?.error?.message || 'An error occurred');
    }
  },
);

/*=========  Define the Hackathon slice =========*/
export const hackathonSlice = createSlice<
  HackathonStateProps,
  {
    /*=========  Define case reducers for resetting various states =========*/
    resetInitialized: CaseReducer<HackathonStateProps>;
    resetFetchedRequest: CaseReducer<HackathonStateProps>;
    resetSent: CaseReducer<HackathonStateProps>;
    resetUpdated: CaseReducer<HackathonStateProps>;
    resetRegistered: CaseReducer<HackathonStateProps>;
    resetErrMsg: CaseReducer<HackathonStateProps>;
    resetPublished: CaseReducer<HackathonStateProps>;
    resetSubmitted: CaseReducer<HackathonStateProps>;
    resetScored: CaseReducer<HackathonStateProps>;
    setIsPayingOut: CaseReducer<HackathonStateProps>;
    resetIsPayingOut: CaseReducer<HackathonStateProps>;
    resetPayed: CaseReducer<HackathonStateProps>;
    resetUserIsNowPaid: CaseReducer<HackathonStateProps>;
    resetIsCreatedOffChainHackathon: CaseReducer<HackathonStateProps>;
  },
  'hackathon-state'
>({
  name: 'hackathon-state',
  initialState,
  reducers: {
    resetInitialized: (state) => ({ ...state, initialized: false }),
    resetSent: (state) => ({ ...state, sent: false }),
    resetUpdated: (state) => ({ ...state, updatedHackathon: false }),
    resetRegistered: (state) => ({ ...state, registered: false }),
    resetErrMsg: (state) => ({ ...state, errMsg: null }),
    resetFetchedRequest: (state) => ({ ...state, fetchedRequest: false }),
    resetPublished: (state) => ({ ...state, published: false }),
    resetSubmitted: (state) => ({ ...state, submitted: false }),
    resetScored: (state) => ({ ...state, scored: false }),
    setIsPayingOut: (state) => ({ ...state, paying: true }),
    resetIsPayingOut: (state) => ({ ...state, paying: false }),
    resetPayed: (state) => ({ ...state, paid: false }),
    resetUserIsNowPaid: (state) => ({ ...state, userIsNowPaid: false }),
    resetIsCreatedOffChainHackathon: (state) => ({
      ...state,
      createdOffChainHackathon: false,
    }),
  },

  /*=========  Define extra reducers for the Hackathon slice =========*/

  extraReducers: (builder: ActionReducerMapBuilder<HackathonStateProps>) => {
    /*=========   initializing the Hackathon =========*/
    builder.addCase(initHackathon.pending, (state) => {
      state.initializing = true;
    });

    builder.addCase(initHackathon.fulfilled, (state, { payload }) => {
      state.initializing = false;
      state.initialized = true;
      state.escrowProps = payload;
    });

    builder.addCase(initHackathon.rejected, (state, action) => {
      state.initializing = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'INIT_ESCROW_ERROR',
      };
    });

    /*=========   sending the Hackathon =========*/
    builder.addCase(sendHackathon.pending, (state) => {
      state.sending = true;
    });

    builder.addCase(sendHackathon.fulfilled, (state, { payload }) => {
      state.sending = false;
      state.sent = true;
      state.escrowProps = payload;
    });

    builder.addCase(sendHackathon.rejected, (state, action) => {
      state.sending = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'CREATE_HACKATHON_ERROR',
      };
    });

    /*=========   updating the Hackathon =========*/
    builder.addCase(updateHackathon.pending, (state) => {
      state.updatingHackathon = true;
    });

    builder.addCase(updateHackathon.fulfilled, (state, { payload }) => {
      state.updatingHackathon = false;
      state.updatedHackathon = payload.updated;
    });

    builder.addCase(updateHackathon.rejected, (state, action) => {
      state.updatingHackathon = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'UPDATE_HACKATHON_ERROR',
      };
    });

    /*=========   getting Hackathons Request =========*/
    builder.addCase(getHackathonRequests.pending, (state) => {
      state.fetchingRequest = true;
    });

    builder.addCase(getHackathonRequests.fulfilled, (state, { payload }) => {
      state.fetchingRequest = false;
      state.fetchedRequests = true;
      state.hackathonToReview = payload;
    });

    builder.addCase(getHackathonRequests.rejected, (state, action) => {
      state.fetchingRequest = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'FETCHING_ONREVIEW_HACKATHON_ERROR',
      };
    });

    /*=========   getting all Hackathons =========*/
    builder.addCase(getAllHackathons.pending, (state) => {
      state.fetchingRequest = true;
    });

    builder.addCase(getAllHackathons.fulfilled, (state, { payload }) => {
      state.fetchingRequest = false;
      state.hackathons = payload;
    });

    builder.addCase(getAllHackathons.rejected, (state, action) => {
      state.fetchingRequest = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'FETCHING_HACKATHONS_ERROR',
      };
    });

    /*=========   getting Hackathons Detail for Admin =========*/
    builder.addCase(getHackathonDetailForAdmin.pending, (state) => {
      state.fetchingHackInfo = true;
    });

    builder.addCase(
      getHackathonDetailForAdmin.fulfilled,
      (state, { payload }) => {
        state.fetchingHackInfo = false;
        state.adminHackInfo = payload.hackathon;
      },
    );

    builder.addCase(getHackathonDetailForAdmin.rejected, (state, action) => {
      state.fetchingHackInfo = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'FETCHING_HACK_INFO_ERROR',
      };
    });

    /*=========   getting Hackathons submission download for Admin =========*/
    builder.addCase(
      getHackathonSubmissionsDownloadForAdmin.pending,
      (state) => {
        state.fetchingAdminHackSubmissionsDownload = true;
      },
    );

    builder.addCase(
      getHackathonSubmissionsDownloadForAdmin.fulfilled,
      (state) => {
        state.fetchingAdminHackSubmissionsDownload = false;
        state.fetchedAdminHackSubmissionsDownload = true;
      },
    );

    builder.addCase(
      getHackathonSubmissionsDownloadForAdmin.rejected,
      (state, action) => {
        state.fetchingAdminHackSubmissionsDownload = false;
        state.errMsg = {
          msg: action.error.message,
          Id: 'FETCHING_HACK_SUBMISSIONS_DOWNLOAD_ERROR',
        };
      },
    );

    /*=========   Publish Hackathan =========*/
    builder.addCase(publishAHackathon.pending, (state) => {
      state.publishing = true;
    });

    builder.addCase(publishAHackathon.fulfilled, (state, { payload }) => {
      state.publishing = false;
      // @ts-ignore
      state.adminHackInfo = { ...state.adminHackInfo, status: payload.status };
      state.published = true;
    });

    builder.addCase(publishAHackathon.rejected, (state, action) => {
      state.publishing = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'PUBLISHING_HACKATHON_ERROR',
      };
    });

    /*=========   Get Hackathon Listing =========*/
    builder.addCase(getHackathonListings.pending, (state) => {
      state.fetchingHacks = true;
    });

    builder.addCase(getHackathonListings.fulfilled, (state, { payload }) => {
      state.fetchingHacks = false;
      state.fetchedHacks = true;
      state.hackathons = payload;
    });

    builder.addCase(getHackathonListings.rejected, (state, action) => {
      state.fetchingHacks = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'GET_HACKATHON_LISTING_ERROR',
      };
    });

    /*=========   Get Hackathon Detail =========*/
    builder.addCase(getHackathonDetail.pending, (state) => {
      state.fetchingHacks = true;
    });

    builder.addCase(getHackathonDetail.fulfilled, (state, { payload }) => {
      state.fetchingHacks = false;
      state.fetchedHacks = true;
      state.hackathonInfo = payload.hackathon;
    });

    builder.addCase(getHackathonDetail.rejected, (state, action) => {
      state.fetchingHacks = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'GET_HACKATHON_DETAIL_ERROR',
      };
    });

    /*=========   Register for a Hackathon =========*/
    builder.addCase(registerForAHack.pending, (state) => {
      state.registering = true;
    });

    builder.addCase(registerForAHack.fulfilled, (state, { payload }) => {
      state.registering = false;
      state.registered = true;
      // @ts-ignore
      state.hackathonInfo = {
        ...state.hackathonInfo,
        participants: [
          ...(state.hackathonInfo?.participants || []),
          payload.userId,
        ],
      };
    });

    builder.addCase(registerForAHack.rejected, (state, action) => {
      state.registering = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'REGISTER_FOR_HACKATHON_ERROR',
      };
    });

    /*=========   Getting Client Hackathon =========*/
    builder.addCase(getClientHacks.pending, (state) => {
      state.fetchingHacks = true;
    });

    builder.addCase(getClientHacks.fulfilled, (state, { payload }) => {
      state.fetchingHacks = false;
      state.fetchedHacks = true;
      state.clientHackathons = payload;
    });

    builder.addCase(getClientHacks.rejected, (state, action) => {
      state.fetchingHacks = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'GET_CLIENT_HACKATHON_LISTING_ERROR',
      };
    });

    /*=========   Submit Hackathon Result =========*/
    builder.addCase(submitHackResult.pending, (state) => {
      state.submitting = true;
    });

    builder.addCase(submitHackResult.fulfilled, (state) => {
      state.submitted = true;
      state.submitting = false;
    });

    builder.addCase(submitHackResult.rejected, (state, action) => {
      state.submitting = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'SUBMIT_HACKATHON_ERROR',
      };
    });

    /*=========   getting hackathon details for client =========*/
    builder.addCase(getHackathonDetailForClient.pending, (state) => {
      state.fetchingClientHack = true;
    });

    builder.addCase(
      getHackathonDetailForClient.fulfilled,
      (state, { payload }) => {
        state.fetchingClientHack = false;
        state.clientHackInfo = payload.hackathon;
      },
    );

    builder.addCase(getHackathonDetailForClient.rejected, (state, action) => {
      state.fetchedClientHack = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'GET_CLIENT_HACKATHON_DETAIL_ERROR',
      };
    });

    /*=========   getting hackathon submissions download for client =========*/
    builder.addCase(
      getHackathonSubmissionsDownloadForClient.pending,
      (state) => {
        state.fetchingClientHackSubmissionsDownload = true;
      },
    );

    builder.addCase(
      getHackathonSubmissionsDownloadForClient.fulfilled,
      (state) => {
        state.fetchingClientHackSubmissionsDownload = false;
        state.fetchedClientHackSubmissionsDownload = true;
      },
    );

    builder.addCase(
      getHackathonSubmissionsDownloadForClient.rejected,
      (state, action) => {
        state.fetchedClientHackSubmissionsDownload = false;
        state.errMsg = {
          msg: action.error.message,
          Id: 'GET_CLIENT_HACKATHON_SUBMISSIONS_DOWNLOAD_ERROR',
        };
      },
    );

    /*=========   setting a participant score =========*/
    builder.addCase(setParticipantScore.pending, (state) => {
      state.scoring = true;
    });

    builder.addCase(
      setParticipantScore.fulfilled,
      (state, { payload }: any) => {
        state.scoring = false;
        state.clientHackathons = payload.updatedClientHacks;
        state.clientHackInfo = payload.newHackInfo;
        state.scored = true;
      },
    );

    builder.addCase(setParticipantScore.rejected, (state, action) => {
      state.scoring = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'SCORED_RESULT_ERROR',
      };
    });

    /*=========   accepting a participant result =========*/
    builder.addCase(acceptParticipantResult.pending, (state) => {
      state.scoring = true;
    });

    builder.addCase(
      acceptParticipantResult.fulfilled,
      (state: any, { payload }: any) => {
        state.scoring = false;
        state.clientHackathons = payload.updatedClientHacks;
        state.clientHackInfo = payload.newHackInfo;
        state.scored = true;
      },
    );

    builder.addCase(acceptParticipantResult.rejected, (state, action) => {
      state.scoring = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'ACCEPT_RESULT_ERROR',
      };
    });

    /*=========   payout request =========*/
    builder.addCase(payoutReq.pending, (state) => {
      state.paying = true;
    });

    builder.addCase(payoutReq.fulfilled, (state) => {
      state.paying = false;
      state.paid = true;
    });

    builder.addCase(payoutReq.rejected, (state, action) => {
      state.paying = false;
      state.errMsg = {
        msg: action.error.message,
        Id: 'PAYOUT_REQUEST_ERROR',
      };
    });

    /*=========   create offchain hackathon =========*/
    builder.addCase(createOffChainHackathon.pending, (state) => {
      state.isCreatingOffChainHackathonLoading = true;
    });

    builder.addCase(createOffChainHackathon.fulfilled, (state) => {
      state.isCreatingOffChainHackathonLoading = false;
      state.createdOffChainHackathon = true;
    });

    builder.addCase(createOffChainHackathon.rejected, (state, action) => {
      state.isCreatingOffChainHackathonLoading = false;
      state.createdOffChainHackathon = true;
      state.errMsg = {
        msg: action.error.message,
        Id: 'CREATE_OFFCHAIN_HACKATHON_ERROR',
      };
    });

    /*=========   paid user =========*/
    builder.addCase(paidUser.fulfilled, (state, { payload }) => {
      if (state.clientHackInfo)
        state.clientHackInfo.winners = payload.updatedWinners;

      state.userIsNowPaid = true;
    });

    builder.addCase(paidUser.rejected, (state, action) => {
      state.errMsg = {
        msg: action.error.message,
        Id: 'PAYOUT_REQUEST_ERROR',
      };
    });

    /*=========   check if user is paid =========*/
    builder.addCase(checkIfUserIsPaid.pending, (state) => {
      state.checkingUserIsPaid = true;
    });

    builder.addCase(checkIfUserIsPaid.fulfilled, (state) => {
      state.checkingUserIsPaid = false;
    });

    builder.addCase(checkIfUserIsPaid.rejected, (state, action) => {
      state.checkingUserIsPaid = false;

      state.errMsg = {
        msg: action.error.message,
        Id: 'PAYOUT_REQUEST_ERROR',
      };
    });

    /*=========  get sponsors =========*/
    builder.addCase(getSponsors.fulfilled, (state, { payload }) => {
      state.sponsors = payload;
    });

    builder.addCase(getSponsors.rejected, (state, action) => {
      state.checkingUserIsPaid = false;

      state.errMsg = {
        msg: action.error.message,
        Id: 'GET_SPONSORS_ERROR',
      };
    });
  },
});

/*=========  Export the Hackathon slice actions =========*/
export const {
  resetInitialized,
  resetSent,
  resetUpdated,
  resetErrMsg,
  resetPublished,
  resetFetchedRequest,
  resetRegistered,
  resetScored,
  setIsPayingOut,
  resetPayed,
  resetIsPayingOut,
  resetSubmitted,
  resetIsCreatedOffChainHackathon,
  resetUserIsNowPaid,
} = hackathonSlice.actions;

export default hackathonSlice.reducer;
