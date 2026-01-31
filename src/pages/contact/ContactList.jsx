import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch contacts on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/contact`);
        const data = res.data.contacts || [];

        // Add static status field
        const withStatus = data.map((item) => ({
          ...item,
          status: "Pending", // static for now
        }));

        setContacts(withStatus);
        setFiltered(withStatus);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchData();
  }, []);

  // Filter + Search functionality
  useEffect(() => {
    let temp = [...contacts];

    if (statusFilter !== "all") {
      temp = temp.filter((item) => item.status === statusFilter);
    }

    if (search.trim() !== "") {
      temp = temp.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [search, statusFilter, contacts]);

  // CSV Export
  const exportCSV = () => {
    if (filtered.length === 0) return;

    const header = ["Sl No,Name,Email,Phone,Project,Date,Status\n"];    

    const rows = filtered
      .map((item, index) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        return `${index + 1},${item.name},${item.email},${item.phone},${item.project},${date},${item.status}`;
      })
      .join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "contacts.csv");
  };

  return (
    <section className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Contact Leads</h1>
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />

        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Responded">Responded</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-purple-600 text-white px-4 py-2 rounded shadow"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Sl No</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">Project</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, idx) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{item.name}</td>
                <td className="border px-3 py-2">{item.email}</td>
                <td className="border px-3 py-2">{item.phone}</td>
                <td className="border px-3 py-2">{item.project}</td>
                <td className="border px-3 py-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-3 py-2">
                  <select className="border rounded px-2 py-1">
                    <option>Pending</option>
                    <option>Responded</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </section>
  );
};

export default ContactList;
