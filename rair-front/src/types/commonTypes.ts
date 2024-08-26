export interface ApiCallResponse {
  success: boolean;
  message?: string;
}

export interface PaginatedApiCall {
  itemsPerPage: number;
  pageNum: number;
}

export interface CustomModalStyle {
  overlay: React.CSSProperties;
  content: React.CSSProperties;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SplashPageProps {
  setIsSplashPage: React.Dispatch<React.SetStateAction<boolean>>;
}
