import { API_URL } from "./axiosInstance";
import axiosInstance from "./axiosInstance";

// export const API_URL = 'http://127.0.0.1:8000';

const getAuthorizationHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });
  
export const fetchEquipmentData = async () => {

  try {
    const response = await axiosInstance.get(`${API_URL}/api/equipment/`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных Техники:", error);
    throw error;
  }
};

export const saveEquipmentData = async (serial: string, equipmentUpdates: Record<string, any>) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/api/equipment/${serial}/`, equipmentUpdates, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при сохранении Техники:", error);
    throw error;
  }
};

export const deleteEquipment = async (serial: string) => {
  try {
    await axiosInstance.delete(`${API_URL}/api/equipment/${serial}/`, {
      headers: getAuthorizationHeader(),
    });
  } catch (error) {
    console.error("Ошибка при удалении Техники:", error);
    throw error;
  }
};

export const fetchMaintenanceData = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/api/maintenance/`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных ТО:", error);
    throw error;
  }
};

export const saveMaintenanceData = async (id: number, maintenanceUpdates: Record<string, any>) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/api/maintenance/${id}/`, maintenanceUpdates, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при сохранении ТО:", error);
    throw error;
  }
};

export const deleteMaintenance = async (id: number) => {
  try {
    await axiosInstance.delete(`${API_URL}/api/maintenance/${id}/`, {
      headers: getAuthorizationHeader(),
    });
  } catch (error) {
    console.error("Ошибка при удалении ТО:", error);
    throw error;
  }
};

export const fetchClaimsData = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/api/claims/`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных Рекламации:", error);
    throw error;
  }
};

export const saveClaimsData = async (id: number, claimsUpdates: Record<string, any>) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/api/claims/${id}/`, claimsUpdates, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при сохранении Рекламации:", error);
    throw error;
  }
};

export const deleteClaim = async (id: number) => {
  try {
    await axiosInstance.delete(`${API_URL}/api/claims/${id}/`, {
      headers: getAuthorizationHeader(),
    });
  } catch (error) {
    console.error("Ошибка при удалении Рекламации:", error);
    throw error;
  }
};