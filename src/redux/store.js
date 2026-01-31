import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./slices/MainSlices";

const store = configureStore({
  reducer: {
    main: mainSlice,

  },
});

export default store;
