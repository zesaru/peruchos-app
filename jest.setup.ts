jest.mock("expo-haptics", () => ({
  NotificationFeedbackType: {
    Success: "success",
  },
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native/Libraries/LayoutAnimation/LayoutAnimation", () => ({
  configureNext: jest.fn(),
  Presets: {
    easeInEaseOut: {},
  },
}));
