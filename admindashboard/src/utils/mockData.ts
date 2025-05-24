import { Listing, User, DailyPostCount } from '../types/listing';
import { format, subDays } from 'date-fns';

export const users: User[] = [
  { id: 'user1', name: 'Ekpo' },
  { id: 'user2', name: 'Cheng' },
  { id: 'user3', name: 'Aisha' },
  { id: 'user4', name: 'Mike' },
];

export const listings: Listing[] = [
  {
    id: 'list1',
    title: 'iPhone 13 Pro Max 🔥',
    description: 'Yo, bruh! This one bukan calang-calang. Almost new condition, only used for 2 months. Comes with original box and accessories. Battery health 98%.',
    price: 2692,
    status: 'ready',
    userId: 'user1',
    createdAt: new Date().toISOString(),
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://facebook.com/marketplace',
  },
  {
    id: 'list2',
    title: 'Samsung Galaxy S21 Ultra',
    description: 'Excellent condition, used for 5 months. Comes with original charger and two cases. Minor scratches on the back. Still under warranty.',
    price: 1899,
    status: 'posted',
    userId: 'user2',
    createdAt: subDays(new Date(), 1).toISOString(),
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://facebook.com/marketplace',
  },
  {
    id: 'list3',
    title: 'MacBook Pro 2021 M1 Pro',
    description: 'Like new condition. 16GB RAM, 512GB SSD. Space Gray. Used lightly for web development. Comes with Apple Care+ valid until 2024.',
    price: 4999,
    status: 'draft',
    userId: 'user3',
    createdAt: subDays(new Date(), 2).toISOString(),
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'list4',
    title: 'Sony PlayStation 5 Disc Edition',
    description: 'Brand new sealed in box. Comes with extra controller and 3 games. Reason for selling: won in company lucky draw but already have one.',
    price: 2450,
    status: 'ready',
    userId: 'user4',
    createdAt: subDays(new Date(), 3).toISOString(),
    image: 'https://images.pexels.com/photos/13588922/pexels-photo-13588922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://facebook.com/marketplace',
  },
  {
    id: 'list5',
    title: 'iPad Pro 12.9" 2022',
    description: 'Perfect condition, only used for 1 month. 256GB, WiFi+Cellular. Comes with Apple Pencil 2 and Magic Keyboard. Selling due to upgrade.',
    price: 3899,
    status: 'posted',
    userId: 'user1',
    createdAt: subDays(new Date(), 4).toISOString(),
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://facebook.com/marketplace',
  },
  {
    id: 'list6',
    title: 'Mechanical Keyboard Keychron K2',
    description: 'Brown switches, RGB backlight. Used for 3 months. Comes with original box and keycap puller. In excellent condition, no issues.',
    price: 359,
    status: 'ready',
    userId: 'user2',
    createdAt: subDays(new Date(), 5).toISOString(),
    image: 'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://facebook.com/marketplace',
  },
  {
    id: 'list7',
    title: 'Nintendo Switch OLED Model',
    description: 'White Joy-Cons, perfect condition. Used for light gaming only. Comes with 5 games and carrying case. Still have box and all accessories.',
    price: 1299,
    status: 'draft',
    userId: 'user3',
    createdAt: subDays(new Date(), 6).toISOString(),
    image: 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'list8',
    title: 'Canon EOS R6 Camera',
    description: 'Like new condition. Shutter count under 2000. Comes with 24-105mm lens, extra battery, and memory card. Selling to upgrade to R5.',
    price: 8499,
    status: 'posted',
    userId: 'user4',
    createdAt: subDays(new Date(), 7).toISOString(),
    image: 'https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://facebook.com/marketplace',
  },
];

// Generate random consistency data for the last 7 days
export const generateConsistencyData = (): DailyPostCount[] => {
  const data: DailyPostCount[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    
    users.forEach(user => {
      // Random count between 0 and 5
      const count = Math.floor(Math.random() * 6);
      
      if (count > 0) {
        data.push({
          date,
          userId: user.id,
          count
        });
      }
    });
  }
  
  return data;
};

// Generate stats
export const getListingStats = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const listingsToday = listings.filter(
    listing => format(new Date(listing.createdAt), 'yyyy-MM-dd') === today
  ).length;
  
  // For demo purposes, using a random number
  const regenerationsToday = Math.floor(Math.random() * 10);
  
  // Count unique users who created listings today
  const activeUsersToday = new Set(
    listings
      .filter(listing => format(new Date(listing.createdAt), 'yyyy-MM-dd') === today)
      .map(listing => listing.userId)
  ).size;
  
  return {
    listingsToday,
    regenerationsToday,
    activeUsersToday
  };
};

export const consistencyData = generateConsistencyData();