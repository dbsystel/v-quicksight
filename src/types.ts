import type {
  DashboardContentOptions,
  FrameOptions,
  VisualContentOptions,
} from "amazon-quicksight-embedding-sdk/dist/types"

export type VQuicksightFrameOptions = Omit<FrameOptions, "onChange" | "container">
export type VQuicksightDashboardContentOptions = Omit<DashboardContentOptions, "onMessage">
export type VQuicksightVisualContentOptions = Omit<VisualContentOptions, "onMessage">
