export const sampleOfficer = {
  _id: "6adf1d8cdd5427cdd13b1302",
  fullName: "Officer Ramesh Patil",
  email: "officer@spgms.org",
  phoneNumber: "+919012345678",
  role: "Officer",
  department: "Road & Public Grievance Administration",
  designation: "Senior Public Grievance Officer",
  assignedArea: "Bengaluru Central Division"
};

export const sampleComplaints = [
  {
    _id: "3B138D",
    citizen: {
      fullName: "Suresh Kumar",
      phoneNumber: "+91 98765 43210",
      email: "suresh.kumar@spgms.org"
    },
    complaintCategory: "Water Leakage",
    address: "5th Block, Koramangala, Bengaluru, Karnataka 560095",
    priority: "Medium",
    status: "Resolved",
    department: "Water Department",
    createdAt: "2026-10-24T10:30:00.000Z",
    formattedDate: "24 Oct 2026 10:30 AM",
    manualDescription: "Continuous water pipe bursting on 5th main road causing drinking water wastage and low pressure.",
    aiGeneratedDescription: "Water pipeline rupture causing minor street flooding and visible loss of potable water supply.",
    complaintImageUrl: "/thumb-water.jpg",
    resolutionImage: "/thumb-water.jpg",
    officerRemarks: "Replaced faulty 4-inch connector joint and restored normal pressure."
  },
  {
    _id: "3B138C",
    citizen: {
      fullName: "Suresh Kumar",
      phoneNumber: "+91 98765 43210",
      email: "suresh.kumar@spgms.org"
    },
    complaintCategory: "Electricity Problem",
    address: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    priority: "High",
    status: "Pending",
    department: "Electrical Department",
    createdAt: "2026-10-25T14:15:00.000Z",
    formattedDate: "25 Oct 2026 02:15 PM",
    manualDescription: "Sparks flying from electric transformer during evening rain. Hazardous for pedestrians.",
    aiGeneratedDescription: "Severe electrical insulation hazard at neighborhood step-down transformer unit.",
    complaintImageUrl: "/thumb-streetlight.jpg",
    officerRemarks: ""
  },
  {
    _id: "3B138B",
    citizen: {
      fullName: "Suresh Kumar",
      phoneNumber: "+91 98765 43210",
      email: "suresh.kumar@spgms.org"
    },
    complaintCategory: "Pothole",
    address: "8th Cross Road, Malleshwaram, Bengaluru, Karnataka 560003",
    priority: "High",
    status: "In Progress",
    department: "Road Department",
    createdAt: "2026-10-26T09:45:00.000Z",
    formattedDate: "26 Oct 2026 09:45 AM",
    manualDescription: "Large pothole in the center of the road causing two-wheelers to slip during morning commute.",
    aiGeneratedDescription: "Deep crater asphalt deformation exceeding 15cm depth across traffic lane.",
    complaintImageUrl: "/thumb-pothole.jpg",
    officerRemarks: "Asphalt patch truck dispatched for leveling."
  }
];

export const sampleStats = {
  totalAssigned: 3,
  pending: 1,
  seen: 0,
  inProgress: 1,
  resolved: 1,
  priorityHigh: 2,
  priorityMedium: 1,
  priorityLow: 0
};

export const sampleNotifications = [
  {
    id: "notif-1",
    title: "New Complaint Assigned",
    description: "Road Damage complaint (ID: 3B138D) has been assigned to you by the Department.",
    time: "10 minutes ago",
    tag: "Road",
    tagColor: "#F97316",
    tagBg: "#FFF7ED",
    badge: "New Assignment",
    badgeType: "assignment",
    type: "assigned",
    unread: true,
    dotColor: "#10B981",
    complaintId: "3B138D"
  },
  {
    id: "notif-2",
    title: "Complaint Updated",
    description: "Garbage complaint (ID: 3B138C) status changed to In Progress.",
    time: "1 hour ago",
    tag: "Garbage",
    tagColor: "#0284C7",
    tagBg: "#F0F9FF",
    badge: "Status Update",
    badgeType: "update",
    type: "update",
    unread: true,
    dotColor: "#2563EB",
    complaintId: "3B138C"
  },
  {
    id: "notif-3",
    title: "Complaint Resolved",
    description: "Water Supply complaint (ID: 3B138A) has been successfully resolved.",
    time: "Yesterday, 2:30 PM",
    tag: "Water Supply",
    tagColor: "#008F83",
    tagBg: "#E6F7F4",
    badge: "Resolved",
    badgeType: "resolved",
    type: "resolved",
    unread: false,
    dotColor: "#10B981",
    complaintId: "3B138A"
  },
  {
    id: "notif-4",
    title: "High Priority Complaint",
    description: "Street Light issue (ID: 3B138E) has been reported in your jurisdiction.",
    time: "2 days ago",
    tag: "Electricity",
    tagColor: "#EF4444",
    tagBg: "#FEF2F2",
    badge: "High Priority",
    badgeType: "priority",
    type: "system",
    unread: true,
    dotColor: "#EF4444",
    complaintId: "3B138E"
  },
  {
    id: "notif-5",
    title: "New Comment Added",
    description: "Citizen has added a comment on complaint ID: 3B138C.",
    time: "3 days ago",
    tag: "General",
    tagColor: "#8B5CF6",
    tagBg: "#F5F3FF",
    badge: "New Comment",
    badgeType: "comment",
    type: "update",
    unread: false,
    dotColor: "#8B5CF6",
    complaintId: "3B138C"
  }
];
