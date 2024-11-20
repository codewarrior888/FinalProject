import axios from "axios";

export const API_URL = 'http://127.0.0.1:8000';

const getAuthorizationHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });
  
  export const fetchEquipmentData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/equipment/`, {
        headers: getAuthorizationHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching equipment data:", error);
      throw error; // Propagate the error
    }
  };
  
  export const saveEquipmentData = async (serial: string, equipmentUpdates: Record<string, any>) => {
    try {
      const response = await axios.put(`${API_URL}/api/equipment/${serial}/`, equipmentUpdates, {
        headers: getAuthorizationHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error saving equipment data:", error);
      throw error; // Propagate the error
    }
  };
  
  export const deleteEquipment = async (serial: string) => {
    try {
      await axios.delete(`${API_URL}/api/equipment/${serial}/`, {
        headers: getAuthorizationHeader(),
      });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      throw error; // Propagate the error
    }
  };

  export const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/maintenance/`, {
        headers: getAuthorizationHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
      throw error; // Propagate the error
    }
  };

  export const saveMaintenanceData = async (id: number, maintenanceUpdates: Record<string, any>) => {
    try {
      const response = await axios.put(`${API_URL}/api/maintenance/${id}/`, maintenanceUpdates, {
        headers: getAuthorizationHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error saving maintenance data:", error);
      throw error; // Propagate the error
    }
  };

  export const deleteMaintenance = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/maintenance/${id}/`, {
        headers: getAuthorizationHeader(),
      });
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      throw error; // Propagate the error
    }
  };

  export const fetchClaimsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/claims/`, {
        headers: getAuthorizationHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching claim data:", error);
      throw error; // Propagate the error
    }
  };

  export const saveClaimsData = async (id: number, claimsUpdates: Record<string, any>) => {
    try {
      const response = await axios.put(`${API_URL}/api/claims/${id}/`, claimsUpdates, {
        headers: getAuthorizationHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error saving claim data:", error);
      throw error; // Propagate the error
    }
  };

  export const deleteClaim = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/claims/${id}/`, {
        headers: getAuthorizationHeader(),
      });
    } catch (error) {
      console.error("Error deleting claim:", error);
      throw error; // Propagate the error
    }
  };