//@ts-nocheck
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { rairSDK } from "../components/common/rairSDK";

import { dataStatuses } from "./commonTypes";

interface NotificationState {
  notifications: Array<any>;
  totalCount: number;
  totalUnreadCount: number;
  notificationsStatus: dataStatuses;
}

interface NotificaitonItem {
  createdAt: string;
  data: Array<any>;
  read: boolean;
  tokenData: Array<any>;
  type: string;
  updatedAt: string;
  user: string;
  _id: string;
}

const initialState: NotificationState = {
  notifications: [],
  totalCount: 0,
  totalUnreadCount: 0,
  notificationsStatus: dataStatuses.Uninitialized,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchData",
  async (pageNum?: number) => {
    const responseData = await rairSDK.notifications.listNotifications({
      pageNum: pageNum,
    });

    const responseUnreadData = await rairSDK.notifications.listNotifications({
      onlyUnread: true,
    });

    return {
      data: responseData,
      unreadData: responseUnreadData,
    };
  }
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.notificationsStatus = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsStatus = dataStatuses.Loading;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction) => {
        state.notificationsStatus = dataStatuses.Complete;
        const sortedNotifications = action.payload.data.notifications.sort(
          (a, b) => {
            if (!a.read && b.read) return -1;
            if (a.read && !b.read) return 1;

            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return dateB - dateA;
          }
        );

        state.notifications = sortedNotifications;
        state.totalCount = action.payload.data.totalCount;
        state.totalUnreadCount = action.payload.unreadData.totalCount;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationsStatus = dataStatuses.Failed;
      });
  },
});

export const { clearResults } = notificationsSlice.actions;
export default notificationsSlice.reducer;
