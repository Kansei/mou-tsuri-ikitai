import Papa from 'papaparse';
import type { Ship, Booking, BookingStatus } from '../types';

const SPREADSHEET_ID = '1IaTFfiPPv6SsdeEM5Ohh1emwK0JhqW6fpJKgxatYG0U';
const SHIPS_GID = '0';
const BOOKING_GID = '132070850';

const getCSVUrl = (gid: string) =>
  `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

export async function fetchShips(): Promise<Ship[]> {
  const response = await fetch(getCSVUrl(SHIPS_GID));
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvText, {
      complete: (results) => {
        const rows = results.data;
        if (rows.length < 2) {
          resolve([]);
          return;
        }

        const ships: Ship[] = rows.slice(1).filter(row => row[0]).map((row) => ({
          shipname: row[0] || '',
          url: row[1] || '',
          phonenumber: row[2] || '',
          address: row[3] || '',
          departure_port: row[4] || '',
          anglers_follower: row[5] || '',
          external_url: row[6] || '',
          payment_method: row[7] || '',
          booking_method: row[8] || '',
          calander_id: row[9] || '',
          calander_url: row[10] || '',
          calender_status: row[11] || '',
          review: row[12] || '',
          visit_count: row[13] || '',
          memo: row[14] || '',
        }));

        resolve(ships);
      },
      error: (error: Error) => reject(error),
    });
  });
}

export async function fetchBookings(): Promise<Booking[]> {
  const response = await fetch(getCSVUrl(BOOKING_GID));
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvText, {
      complete: (results) => {
        const rows = results.data;
        if (rows.length < 2) {
          resolve([]);
          return;
        }

        const bookings: Booking[] = rows.slice(1).filter(row => row[0]).map((row) => ({
          shipname: row[0] || '',
          datedtime: row[1] || '',
          category: row[2] || '',
          status: (row[3] as BookingStatus) || 'undefined',
          capacityCount: parseInt(row[4]) || 0,
          calendarTitle: row[5] || '',
        }));

        resolve(bookings);
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Handle format like "2026/01/19" or "2026/1/19"
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  return new Date(dateStr);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function formatDateForDisplay(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];

  return `${month}/${day}(${weekday})`;
}
