export interface Position {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  audioUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ToiletLocation {
  id: string;
  name: string;
  position: Position;
  paid: boolean;
  price?: string;
  hygieneRating: number;
  wheelchairAccessible: boolean;
  sanitaryProducts: boolean;
  showers: boolean;
  reviews: Review[];
}

export interface CommunityOpinion {
  id: string;
  userName: string;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike';
}