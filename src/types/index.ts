export interface PhotoData {
  url: string;
  caption: string;
}

export interface AppConfig {
  recipientName: string;
  messageText: string;
  photos: PhotoData[];
}

export interface BalloonData {
  id: number;
  color: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji?: string;
}
