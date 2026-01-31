export type BookingStatus = 'open' | 'full' | 'close' | 'undefined';

export type FishingCategory = 'ジギング' | 'SLJ' | 'キャスティング' | 'タイラバ' | 'その他';

export interface Ship {
  shipname: string;
  url: string;
  phonenumber: string;
  address: string;
  departure_port: string;
  anglers_follower: string;
  external_url: string;
  payment_method: string;
  booking_method: string;
  calander_id: string;
}

export interface Booking {
  shipname: string;
  datedtime: string;
  category: string;
  status: BookingStatus;
  capacityCount: number;
  calendarTitle: string;
}

export interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  category: string;
  showOnlyAvailable: boolean;
  shipname: string;
}
