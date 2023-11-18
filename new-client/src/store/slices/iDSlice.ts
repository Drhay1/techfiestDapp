import { createSlice } from '@reduxjs/toolkit';
import { ConcordiumIDInterface } from '../models/interfaces';

const initialState: ConcordiumIDInterface = {
  authToken: undefined,
};

export const iDSlice = createSlice({
  name: 'identification',
  initialState,
  reducers: {
    setAuthToken: (state, { payload }) => ({
      ...state,
      authToken: payload.authToken,
    }),
  },
});

export const { setAuthToken } = iDSlice.actions;

export default iDSlice.reducer;
