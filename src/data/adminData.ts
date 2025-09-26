// Dummy data for admin dashboard

export const dummyPrayers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+254 123 456 789",
    prayerRequest: "Please pray for my family's health and financial stability.",
    createdAt: "2024-01-15T10:30:00Z",
    status: "pending"
  },
  {
    id: 2,
    name: "Mary Smith",
    email: "mary@example.com",
    phone: "+254 987 654 321",
    prayerRequest: "Pray for my job search and career direction.",
    createdAt: "2024-01-14T14:20:00Z",
    status: "reviewed"
  },
  {
    id: 3,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+254 555 123 456",
    prayerRequest: "Please pray for healing from my illness.",
    createdAt: "2024-01-13T09:15:00Z",
    status: "pending"
  }
];

export const dummyBaptisms = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+254 111 222 333",
    dateOfBirth: "1990-05-15",
    address: "123 Main St, Nairobi",
    previousBaptism: "No",
    testimony: "I want to publicly declare my faith in Jesus Christ.",
    createdAt: "2024-01-16T11:00:00Z",
    status: "approved"
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+254 444 555 666",
    dateOfBirth: "1985-12-20",
    address: "456 Oak Ave, Nairobi",
    previousBaptism: "Yes",
    testimony: "I want to renew my commitment to Christ through baptism.",
    createdAt: "2024-01-15T16:30:00Z",
    status: "pending"
  }
];

export const dummyDedications = [
  {
    id: 1,
    childName: "Emma Thompson",
    parentNames: "Robert and Linda Thompson",
    email: "thompson@example.com",
    phone: "+254 777 888 999",
    childDateOfBirth: "2023-08-10",
    address: "789 Pine St, Nairobi",
    preferredDate: "2024-02-15",
    specialRequests: "Would like grandparents to be included in the ceremony.",
    createdAt: "2024-01-17T13:45:00Z",
    status: "pending"
  }
];

export const dummyMemberships = [
  {
    id: 1,
    name: "James Miller",
    email: "james@example.com",
    phone: "+254 999 888 777",
    currentChurch: "Grace Baptist Church",
    pastorName: "Pastor Williams",
    pastorContact: "+254 666 555 444",
    reasonForTransfer: "Relocating to this area for work",
    membershipDuration: "5 years",
    createdAt: "2024-01-18T10:20:00Z",
    status: "pending"
  }
];

export const dummyBenevolence = [
  {
    id: 1,
    name: "Grace Mwangi",
    email: "grace@example.com",
    phone: "+254 333 444 555",
    address: "321 Cedar Rd, Nairobi",
    familySize: "4",
    income: "20000",
    requestType: "Food assistance",
    description: "Lost job due to company closure, need food support for family",
    urgency: "High",
    createdAt: "2024-01-19T08:30:00Z",
    status: "under_review"
  }
];

export const dummyContacts = [
  {
    id: 1,
    name: "Peter Kamau",
    email: "peter@example.com",
    phone: "+254 222 333 444",
    subject: "Service Inquiry",
    message: "I would like to know more about your youth programs.",
    createdAt: "2024-01-20T15:10:00Z",
    status: "new"
  }
];

export const dummyAnnouncements = [
  {
    id: 1,
    title: "Weekly Church Announcements",
    content: "Join us for our weekly service announcements and updates.",
    date: "2024-01-21",
    author: "Admin",
    fileUrl: "/announcements/CHURCHANNOUNCEMENT20THSEPTEMBER.pdf",
    status: "published",
    createdAt: "2024-01-21T09:00:00Z"
  }
];

export const dummyEvents = [
  {
    id: 1,
    title: "Youth Camp 2024",
    description: "Annual youth camp for ages 13-25",
    date: "2024-03-15",
    time: "09:00",
    location: "Church Grounds",
    organizer: "Youth Department",
    capacity: 100,
    registrations: 45,
    status: "published",
    createdAt: "2024-01-22T12:00:00Z"
  }
];

export const dummyBlogs = [
  {
    id: 1,
    title: "Walking in Faith During Difficult Times",
    content: "In times of uncertainty, our faith becomes our anchor...",
    author: "Pastor John",
    authorId: 1,
    category: "Spiritual Growth",
    tags: ["faith", "trials", "encouragement"],
    status: "pending",
    featured: false,
    createdAt: "2024-01-23T14:30:00Z",
    publishDate: null
  },
  {
    id: 2,
    title: "The Power of Community Prayer",
    content: "When believers come together in prayer, miracles happen...",
    author: "Elder Mary",
    authorId: 2,
    category: "Prayer",
    tags: ["prayer", "community", "unity"],
    status: "published",
    featured: true,
    createdAt: "2024-01-20T11:15:00Z",
    publishDate: "2024-01-21T06:00:00Z"
  }
];

export const dummyAuthors = [
  {
    id: 1,
    name: "Pastor John",
    email: "pastor@church.com",
    bio: "Senior Pastor with 15 years of ministry experience",
    avatar: "/leaders/pastor.JPG",
    status: "active",
    postsCount: 12,
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Elder Mary",
    email: "elder@church.com",
    bio: "Church Elder and Prayer Ministry Leader",
    avatar: "/leaders/elder.jpg",
    status: "active",
    postsCount: 8,
    createdAt: "2023-02-01T00:00:00Z"
  }
];

export const dummyUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@church.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-23T16:45:00Z",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Editor User",
    email: "editor@church.com",
    role: "editor",
    status: "active",
    lastLogin: "2024-01-22T10:20:00Z",
    createdAt: "2023-06-01T00:00:00Z"
  }
];

export const dashboardStats = {
  totalPrayers: dummyPrayers.length,
  pendingPrayers: dummyPrayers.filter(p => p.status === 'pending').length,
  totalBaptisms: dummyBaptisms.length,
  pendingBaptisms: dummyBaptisms.filter(b => b.status === 'pending').length,
  totalDedications: dummyDedications.length,
  pendingDedications: dummyDedications.filter(d => d.status === 'pending').length,
  totalMemberships: dummyMemberships.length,
  pendingMemberships: dummyMemberships.filter(m => m.status === 'pending').length,
  totalBenevolence: dummyBenevolence.length,
  pendingBenevolence: dummyBenevolence.filter(b => b.status === 'under_review').length,
  totalContacts: dummyContacts.length,
  newContacts: dummyContacts.filter(c => c.status === 'new').length,
  totalBlogs: dummyBlogs.length,
  pendingBlogs: dummyBlogs.filter(b => b.status === 'pending').length,
  totalEvents: dummyEvents.length,
  publishedEvents: dummyEvents.filter(e => e.status === 'published').length,
};