import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Interact {
  totalInteractions: number,
  lastInteractDate: Date | null
}

interface InteractState {
  interacts: Array<Interact>
}

const initialState: InteractState = {
  interacts: Array<Interact>(10).fill({ 
    totalInteractions: 0, 
    lastInteractDate: null
  })
};

const interactSlice = createSlice({
  name: "agentInteracts",
  initialState,
  reducers: {
    increaseInteract: (state, action: PayloadAction<{index: number, date: Date}>) => {
      state.interacts[action.payload.index].totalInteractions ++;
      state.interacts[action.payload.index].lastInteractDate = action.payload.date;
    },
  },
});

export default interactSlice.reducer;
