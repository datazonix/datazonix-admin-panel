import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ScheduleList = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/schedule-call`);
        setCalls(res.data.calls || []);
      } catch (error) {
        console.error("Error fetching calls", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  const exportToCSV = () => {
    const headers = ["Sl No", "Name", "Email", "Phone", "Preferred Date", "Message", "Enquiry Date"];
    const rows = calls.map((call, index) => [
      index + 1,
      call.name,
      call.email,
      call.phone,
      call.preferredDate,
      call.message,
      new Date(call.createdAt).toLocaleDateString(),
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "schedule_calls.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredCalls = calls.filter((call) => {
    const matchesSearch = call.name.toLowerCase().includes(search.toLowerCase()) ||
      call.email.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "all") return matchesSearch;

    return matchesSearch; // status logic to be added later
  });

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Scheduled Calls</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
        />

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
          </select>

          <button
            onClick={exportToCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm">
                <th className="p-3 border">Sl No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Preferred Date</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Enquiry Date</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCalls.map((call, index) => (
                <tr key={call._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{call.name}</td>
                  <td className="p-3 border">{call.email}</td>
                  <td className="p-3 border">{call.phone}</td>
                  <td className="p-3 border">{call.preferredDate}</td>

                  <td className="p-3 border truncate max-w-[150px]">
                    {call.message?.length > 20 ? (
                      <button
                        className="text-blue-600 underline"
                        onClick={() => setSelectedCall(call)}
                      >
                        View Details
                      </button>
                    ) : (
                      call.message || "-"
                    )}
                  </td>

                  <td className="p-3 border">
                    {new Date(call.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 border">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md">
                      Mark Responded
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow">
            <h2 className="text-xl font-bold mb-4">Message Details</h2>
            <p className="mb-4 whitespace-pre-line">{selectedCall.message}</p>

            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setSelectedCall(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
