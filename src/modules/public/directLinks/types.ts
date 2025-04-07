export interface DirectLink {
  _id: string;
  title: string;
  url: string;
  icon: string;
}

export interface DirectLinksState {
  items: DirectLink[];
  loading: boolean;
  error: string | null;
}

export enum DirectLinksActionTypes {
  FETCH_LINKS_REQUEST = 'FETCH_LINKS_REQUEST',
  FETCH_LINKS_SUCCESS = 'FETCH_LINKS_SUCCESS',
  FETCH_LINKS_FAILURE = 'FETCH_LINKS_FAILURE'
}

export type DirectLinksAction =
  | { type: DirectLinksActionTypes.FETCH_LINKS_REQUEST }
  | { type: DirectLinksActionTypes.FETCH_LINKS_SUCCESS; payload: DirectLink[] }
  | { type: DirectLinksActionTypes.FETCH_LINKS_FAILURE; payload: string };
