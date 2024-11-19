import { useState } from "react";
import axios from "axios";
import { API_URL } from "../API/apiService";
import { useAuth } from "../Authenticate/useAuth";

const useEquipmentData = () => {
    const { userInfo } = useAuth();
    const [equipmentData, setEquipmentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [equipmentReferenceOptions, setEquipmentReferenceOptions] = useState({});
    const [userReferenceOptions, setUserReferenceOptions] = useState({});

    const fetchEquipmentData = async () => {
        try {
        const response = await axios.get(`${API_URL}/api/equipment/`, { 
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });

        let data = response.data;
        
        // Apply role-based filtering if the user's role is "client"
        if (userInfo?.role === "cl") {
            data = data.filter(
            (item) =>
                item.client === userInfo.id ||
                item.client_name === userInfo.company_name
            );
        } else if (userInfo?.role === "sc") {
            data = data.filter(
            (item) =>
                item.service_company === userInfo.id ||
                item.service_company_name === userInfo.company_name
            );
        }

        setEquipmentData(data);
        setFilteredData(data);

        const options = {
            equipment_model_name: [...new Set(data.map((item) => item.equipment_model_name))],
            engine_model_name: [...new Set(data.map((item) => item.engine_model_name))],
            transmission_model_name: [...new Set(data.map((item) => item.transmission_model_name))],
            drive_axle_model_name: [...new Set(data.map((item) => item.drive_axle_model_name))],
            steer_axle_model_name: [...new Set(data.map((item) => item.steer_axle_model_name))],
            client_name: [...new Map(
                data.map((item) => [
                    item.client,
                    { id: item.client, name: item.client_name },
                ])
            ).values()],
            service_company_name: [...new Map(
                data.map((item) => [
                    item.service_company,
                    { id: item.service_company, name: item.service_company_name },
                ])
            ).values()],
        }
        setFilterOptions(options);

        const equipmentSerials = data.map((item) => item.serial);
        localStorage.setItem("equipmentSerials", JSON.stringify(equipmentSerials));

        } catch (error) {
        console.error("Error fetching equipment data", error);
        }
    };

    const fetchEquipmentReferences = async () => {
        try {
        const referenceResponse = await axios.get(`${API_URL}/api/references/`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    
        const equipmentModelOptions = referenceResponse.data
            .filter((item) => item.category === "eq")
            .map(({ id, name }) => [id, name]);
    
        const engineModelOptions = referenceResponse.data
            .filter((item) => item.category === "en")
            .map(({ id, name }) => [id, name]);
    
        const transmissionModelOptions = referenceResponse.data
            .filter((item) => item.category === "tr")
            .map(({ id, name }) => [id, name]);
    
        const driveAxleModelOptions = referenceResponse.data
            .filter((item) => item.category === "da")
            .map(({ id, name }) => [id, name]);
    
        const steerAxleModelOptions = referenceResponse.data
            .filter((item) => item.category === "sa")
            .map(({ id, name }) => [id, name]);
    
        setEquipmentReferenceOptions({
            equipment_model: equipmentModelOptions,
            engine_model: engineModelOptions,
            transmission_model: transmissionModelOptions,
            drive_axle_model: driveAxleModelOptions,
            steer_axle_model: steerAxleModelOptions,
        });
    
        } catch (error) {
        console.error("Error fetching references:", error);
        }
    };

    const fetchUserReferences = async () => {
        try {
        const referenceResponse = await axios.get(`${API_URL}/api/users/`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        const serviceCompanyOptions = referenceResponse.data
        .filter((item) => item.category === "sc")
        .map(({ id, company_name }) => [id, company_name]);

        const clientOptions = referenceResponse.data
        .filter((item) => item.category === "cl")
        .map(({ id, company_name }) => [id, company_name]);

        setUserReferenceOptions({
            service_company_name: serviceCompanyOptions,
            client_name: clientOptions,
        });
        } catch (error) {
        console.error("Error fetching references:", error);
        }
    };

    const updateEquipment = async (serial: string, updates: any) => {
        try {
        await axios.put(`${API_URL}/api/equipment/${serial}/`, updates);
        fetchEquipmentData();
        } catch (error) {
        console.error("Error updating equipment", error);
        }
    };

    const deleteEquipment = async (serial: string) => {
        try {
        await axios.delete(`${API_URL}/api/equipment/${serial}/`);
        fetchEquipmentData();
        } catch (error) {
        console.error("Error deleting equipment", error);
        }
    };

    return { equipmentData, filteredData, filterOptions, fetchEquipmentData, fetchEquipmentReferences, updateEquipment, deleteEquipment };
    };


export default useEquipmentData;