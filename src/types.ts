import type {
  DashboardContentOptions,
  FrameOptions,
  VisualContentOptions,
  ConsoleContentOptions
} from 'amazon-quicksight-embedding-sdk/dist/types'

export type VQuicksightFrameOptions = Omit<FrameOptions, 'onChange' | 'container'>
export type VQuicksightDashboardContentOptions = Omit<DashboardContentOptions, 'onMessage'>
export type VQuicksightVisualContentOptions = Omit<VisualContentOptions, 'onMessage'>
export type VQuicksightConsoleContentOptions = Omit<ConsoleContentOptions, 'onMessage'>
