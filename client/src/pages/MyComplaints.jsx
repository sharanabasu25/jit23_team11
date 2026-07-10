function MyComplaints() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>My Complaints</h1>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>101</td>
            <td>Pothole</td>
            <td>Road Department</td>
            <td>Pending</td>
          </tr>

          <tr>
            <td>102</td>
            <td>Garbage</td>
            <td>Municipality</td>
            <td>Resolved</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MyComplaints;