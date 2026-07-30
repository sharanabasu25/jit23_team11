import { createContext, useContext, useState } from "react";
import complaintsData from "../data/complaintsData";

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(complaintsData);

  const updateComplaintStatus = (id, newStatus, remarks = "") => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status: newStatus,
              officerRemarks: remarks,
            }
          : complaint
      )
    );
  };

  const getComplaintById = (id) => {
    return complaints.find((complaint) => complaint.id === id);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        updateComplaintStatus,
        getComplaintById,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  return useContext(ComplaintContext);
}