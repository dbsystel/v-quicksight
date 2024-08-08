import type {
  DashboardContentOptions,
  FrameOptions,
  VisualContentOptions,
  ConsoleContentOptions,
  QSearchContentOptions,
  GenerativeQnAContentOptions
} from 'amazon-quicksight-embedding-sdk'
export type { ThemeConfiguration } from '@aws-sdk/client-quicksight/dist-types'

export type VQuicksightFrameOptions = Omit<FrameOptions, 'onChange' | 'container'>
export type VQuicksightDashboardContentOptions = Omit<DashboardContentOptions, 'onMessage'>
export type VQuicksightVisualContentOptions = Omit<VisualContentOptions, 'onMessage'>
export type VQuicksightConsoleContentOptions = Omit<ConsoleContentOptions, 'onMessage'>
export type VQuicksightSearchContentOptions = Omit<QSearchContentOptions, 'onMessage'>
export type VQuicksightGenerativeQnAContentOptions = Omit<GenerativeQnAContentOptions, 'onMessage'>
