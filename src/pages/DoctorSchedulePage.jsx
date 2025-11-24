import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const DoctorSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ✅ Get userId from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.id || decoded.userId;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return null;
  };

  const getDoctorIdFromToken = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.doctorId || decoded.id;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return null;
  };

  // ✅ Fetch schedules from user profile
  const fetchSchedules = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8083/nepoHeal/user/getUserById/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.doctor?.schedule || []);
      } else {
        toast.error("Failed to fetch schedules");
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Error fetching schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ✅ Handle input changes for new or editing schedule
  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingSchedule((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewSchedule((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Add new schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    const doctorId = getDoctorIdFromToken();
    if (!doctorId) return;

    try {
      const response = await fetch(
        "http://localhost:8083/nepoHeal/user/addSchedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId: doctorId, ...newSchedule }),
        }
      );

      if (response.ok) {
        toast.success("Schedule added successfully!");
        setNewSchedule({ dayOfWeek: "", startTime: "", endTime: "" });
        fetchSchedules();
      } else {
        toast.error("Schedule already exist");
        
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast.error("Error adding schedule");
    }
  };

  // ✅ Update schedule
  const handleUpdateSchedule = async (scheduleId) => {
    try {
      const response = await fetch(
        `http://localhost:8083/nepoHeal/user/updateSchedule/${scheduleId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSchedule),
        }
      );

      if (response.ok) {
        toast.success("Schedule updated successfully!");
        setEditingSchedule(null);
        fetchSchedules();
      } else {
        toast.error("Failed to update schedule");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Error updating schedule");
    }
  };

  // ✅ Delete schedule
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await fetch(
        `http://localhost:8083/nepoHeal/user/deleteSchedule/${scheduleId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("Schedule deleted successfully!");
        fetchSchedules();
      } else {
        toast.error("Failed to delete schedule");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Error deleting schedule");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-green-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 w-full py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          Doctor Schedule
        </h1>

        {/* Add Schedule Form */}
        <form
          onSubmit={handleAddSchedule}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <select
            name="dayOfWeek"
            value={newSchedule.dayOfWeek}
            onChange={(e) => handleInputChange(e)}
            className="border p-2 rounded-md"
            required
          >
            <option value="">Select Day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
            <option value="SATURDAY">Saturday</option>
            <option value="SUNDAY">Sunday</option>
          </select>

          <input
            type="time"
            name="startTime"
            value={newSchedule.startTime}
            onChange={(e) => handleInputChange(e)}
            className="border p-2 rounded-md"
            required
          />

          <input
            type="time"
            name="endTime"
            value={newSchedule.endTime}
            onChange={(e) => handleInputChange(e)}
            className="border p-2 rounded-md"
            required
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Add Schedule
          </button>
        </form>

        {/* Schedule List */}
        <h2 className="text-lg font-semibold mb-3">Your Schedules</h2>
        {schedules.length === 0 ? (
          <p className="text-gray-600">No schedules found.</p>
        ) : (
          <ul className="space-y-4">
            {schedules.map((schedule) => (
              <li
                key={schedule.id}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                {editingSchedule?.doctorScheduleId === schedule.doctorScheduleId ? (
                  <div className="flex space-x-2">
                    <select
                      name="dayOfWeek"
                      value={editingSchedule?.dayOfWeek}
                      onChange={(e) => handleInputChange(e, true)}
                      className="border p-1 rounded-md"
                    >
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </select>
                    <input
                      type="time"
                      name="startTime"
                      value={editingSchedule?.startTime}
                      onChange={(e) => handleInputChange(e, true)}
                      className="border p-1 rounded-md"
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={editingSchedule?.endTime}
                      onChange={(e) => handleInputChange(e, true)}
                      className="border p-1 rounded-md"
                    />
                    <button
                      onClick={() => handleUpdateSchedule(schedule.id)}
                      className="bg-green-600 text-white px-3 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSchedule(null)}
                      className="bg-gray-400 text-white px-3 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-medium">{schedule.dayOfWeek}</span>{" "}
                      — {schedule.startTime} to {schedule.endTime}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingSchedule(schedule)}
                        className="bg-blue-500 text-white px-3 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="bg-red-500 text-white px-3 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedulePage;
