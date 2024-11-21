import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "./axiosInstance";
import { useAuth } from "../Authenticate/useAuth";

interface ReferenceContextProps {
  equipmentReferenceOptions: Record<string, any> | null;
  userReferenceOptions: Record<string, any> | null;
  fetchReferences: () => Promise<void>;
}

const ReferenceContext = createContext<ReferenceContextProps | undefined>(
  undefined
);

export const ReferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [equipmentReferenceOptions, setEquipmentReferenceOptions] =
    useState<Record<string, any> | null>(null);
  const [userReferenceOptions, setUserReferenceOptions] = useState<Record<
    string,
    any
  > | null>(null);

  const { userInfo } = useAuth();

  // Функция для получения опций справочников
  const fetchReferences = async () => {
    try {
      const equipmentResponse = await axios.get(`${API_URL}/api/references/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      let equipmentData = equipmentResponse.data;

      const equipmentModelOptions = equipmentData
        .filter((item) => item.category === "eq")
        .map(({ id, name }) => [id, name]);

      const engineModelOptions = equipmentData
        .filter((item) => item.category === "en")
        .map(({ id, name }) => [id, name]);

      const transmissionModelOptions = equipmentData
        .filter((item) => item.category === "tr")
        .map(({ id, name }) => [id, name]);

      const driveAxleModelOptions = equipmentData
        .filter((item) => item.category === "da")
        .map(({ id, name }) => [id, name]);

      const steerAxleModelOptions = equipmentData
        .filter((item) => item.category === "sa")
        .map(({ id, name }) => [id, name]);

      const maintenanceTypeOptions = equipmentData
        .filter((item) => item.category === "mt")
        .map(({ id, name }) => [id, name]);

      const failureNodeOptions = equipmentData
        .filter((item) => item.category === "fn")
        .map(({ id, name }) => [id, name]);

      const repairMethodOptions = equipmentData
        .filter((item) => item.category === "rm")
        .map(({ id, name }) => [id, name]);

      setEquipmentReferenceOptions({
        equipment_model: equipmentModelOptions,
        engine_model: engineModelOptions,
        transmission_model: transmissionModelOptions,
        drive_axle_model: driveAxleModelOptions,
        steer_axle_model: steerAxleModelOptions,
        maintenance_type: maintenanceTypeOptions,
        failure_node: failureNodeOptions,
        repair_method: repairMethodOptions,
      });

      // Для справочных данных пользователей проверить роль
      if (userInfo?.role !== "mn" && userInfo?.role !== "superuser") {
        console.log("User role not authorized to fetch user references.");
        setUserReferenceOptions({
          client_name: [],
          service_company_name: [],
        });
        return;
      }

      const userResponse = await axios.get(`${API_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      let userData = userResponse.data;

      const clientOptions = userData
        .filter((item) => item.role === "cl")
        .map(({ id, company_name }) => [id, company_name]);

      const serviceCompanyOptions = userData
        .filter((item) => item.role === "sc")
        .map(({ id, company_name }) => [id, company_name]);

      setUserReferenceOptions({
        client_name: clientOptions,
        service_company_name: serviceCompanyOptions,
      });
    } catch (error) {
      console.error("Ошибка при получении справочников:", error);
    }
  };

  return (
    <ReferenceContext.Provider
      value={{
        equipmentReferenceOptions,
        userReferenceOptions,
        fetchReferences,
      }}
    >
      {children}
    </ReferenceContext.Provider>
  );
};

export const useReferences = () => {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error("useReferences must be used within a ReferenceProvider");
  }
  return context;
};
