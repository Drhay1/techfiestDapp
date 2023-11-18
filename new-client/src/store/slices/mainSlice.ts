import {
  ActionReducerMapBuilder,
  CaseReducer,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { MainSliceProps } from '../interfaces/mainSlice.interface';
import axios from 'axios';
import { proxyAddress } from '../../utils/Link';

const initialState: MainSliceProps = {
  appVersion: 'v1.0',
  paymentTicker: 'USD',
  allowHacks: false,
  allowing: false,
  allowed: false,
  errMsg: null,
};

export const allowHacksLaunch = createAsyncThunk<any, any>(
  'allowHacks',
  async (value: boolean) => {
    const token = localStorage.getItem('token');

    try {
      const { data }: any = await axios.put(
        `${proxyAddress}/user/allow`,
        { value },
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

export const mainSlice = createSlice<
  MainSliceProps,
  {
    resetErrMsg: CaseReducer<MainSliceProps>;
    resetAllowed: CaseReducer<MainSliceProps>;
  },
  'main'
>({
  name: 'main',
  initialState,
  reducers: {
    resetErrMsg: (state) => ({ ...state, errMsg: null }),
    resetAllowed: (state) => ({ ...state, allowed: false }),
  },
  extraReducers(builder: ActionReducerMapBuilder<MainSliceProps>) {
    builder.addCase(allowHacksLaunch.pending, (state) => {
      state.allowing = true;
    });

    builder.addCase(allowHacksLaunch.fulfilled, (state, { payload }) => {
      state.allowing = false;
      state.allowed = true;
      state.canLaunchHacks = payload.value;
    });

    builder.addCase(allowHacksLaunch.rejected, (state, action) => {
      state.allowed = true;
      state.errMsg = {
        msg: action.error.message!,
        Id: 'CONFIG_ERROR',
      };
    });
  },
});

export const { resetAllowed, resetErrMsg } = mainSlice.actions;

export default mainSlice.reducer;