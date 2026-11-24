// Shape of one catalog entry, shared by the data modules and the UI.

export interface GameItem {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  featured?: boolean;
  version?: string;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
  clicks?: number;
  editorsPick?: boolean;
  mobile?: boolean;
  errorBug?: boolean;
  verified?: boolean;
}
