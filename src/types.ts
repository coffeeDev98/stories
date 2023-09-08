export type Maybe<T> = T | null;

export type Story = {
  url: string;
  id?: string;
  thumbnailUrl?: string;
  duration: number;
  __typename?: string;
};

export type Cursor = {
  step: number;
  clip: number;
};
