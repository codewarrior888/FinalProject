import '../../styles/Equipment.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Authenticate/useAuth';
import { API_URL } from '../api';
import Table from 'react-bootstrap/Table';
import DetailCardEquipment from '../DetailCard/DetailCardEquipment';
import EquipmentFilter from '../Filters/EquipmentFilter';

const Equipment: React.FC = () => {
  const { userInfo } = useAuth();
  const [equipmentData, setEquipmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    equipment_model_name: [],
    engine_model_name: [],
    transmission_model_name: [],
    drive_axle_model_name: [],
    steer_axle_model_name: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/equipment/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        let data = response.data;

        // Apply role-based filtering if the user's role is "client"
        if (userInfo?.role === 'cl') {
          data = data.filter(
            (item) => item.client === userInfo.id || item.client_name === userInfo.company_name
          );
        } else if (userInfo?.role === 'sc') {
          data = data.filter(
            (item) => item.service_company === userInfo.id || item.service_company_name === userInfo.company_name
          );
        }

        setEquipmentData(data);
        setFilteredData(data);

        // Calculate unique filter options
        const options = {
          equipment_model_name: Array.from(new Set(data.map(item => item.equipment_model_name))),
          engine_model_name: Array.from(new Set(data.map(item => item.engine_model_name))),
          transmission_model_name: Array.from(new Set(data.map(item => item.transmission_model_name))),
          drive_axle_model_name: Array.from(new Set(data.map(item => item.drive_axle_model_name))),
          steer_axle_model_name: Array.from(new Set(data.map(item => item.steer_axle_model_name))),
        };
        setFilterOptions(options);

        // Extract and store equipment_serial values in localStorage
        const equipmentSerials = data.map((item) => item.equipment_serial);
        localStorage.setItem('equipmentSerials', JSON.stringify(equipmentSerials));

      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchData();
  }, [userInfo]);

  // Handle filter changes
  const handleFilterChange = (selectedFilters: { [key: string]: string | number | null }) => {
    let updatedData = equipmentData;

    Object.keys(selectedFilters).forEach((filterKey) => {
      const filterValue = selectedFilters[filterKey];
      if (filterValue && filterValue !== 'all') {
        updatedData = updatedData.filter((item) => item[filterKey] === filterValue);
      }
    });

    setFilteredData(updatedData);
  };

  const handleRowClick = (equipment: any) => {
    setExpandedRow(expandedRow === equipment.equipment_serial ? null : equipment.equipment_serial);
  };

  const handleCardClick = (equipmentSerial: string) => {
    setExpandedCard(expandedCard === equipmentSerial ? null : equipmentSerial);
  };

  return (
    <div className="equipment">
      <h2 className="equipment__title">Информация о комплектации и технических характеристиках Вашей техники</h2>

      <EquipmentFilter onFilterChange={handleFilterChange} filterOptions={filterOptions} />


      {filteredData.length ? (
        <div className="equipment__table-container">
          <div className="equipment__table-scroll">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Техника</th>
                  <th>Двигатель</th>
                  <th>Трансмиссия</th>
                  <th>Ведущий мост</th>
                  <th>Управляемый мост</th>
                  <th>Договор поставки №, дата</th>
                  <th>Дата отгрузки</th>
                  <th>Грузополучатель</th>
                  <th>Адрес поставки</th>
                  <th>Комплектация</th>
                  <th>Клиент</th>
                  <th>Сервисная компания</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((equipment) => (
                  <React.Fragment key={equipment.equipment_serial}>
                    <tr onClick={() => handleRowClick(equipment)}>
                      <th>Модель<br />Зав.№</th>
                      <td>{equipment.equipment_model_name}<br />{equipment.equipment_serial}</td>
                      <td>{equipment.engine_model_name}<br />{equipment.engine_serial}</td>
                      <td>{equipment.transmission_model_name}<br />{equipment.transmission_serial}</td>
                      <td>{equipment.drive_axle_model_name}<br />{equipment.drive_axle_serial}</td>
                      <td>{equipment.steer_axle_model_name}<br />{equipment.steer_axle_serial}</td>
                      <td>{equipment.contract}</td>
                      <td>{equipment.shipment_date}</td>
                      <td>{equipment.consignee}</td>
                      <td>{equipment.delivery_address}</td>
                      <td>{equipment.model_options_preview}</td>
                      <td>{equipment.client_name}</td>
                      <td>{equipment.service_company_name}</td>
                    </tr>
                    {expandedRow === equipment.equipment_serial && (
                      <tr>
                        <td colSpan={12}>
                          <div className="equipment__details-container">
                            <div className="equipment__cards-container">
                              {["equipment", "engine", "transmission", "drive_axle", "steer_axle"].map((type) => (
                                <DetailCardEquipment
                                  key={type}
                                  header={
                                    type === "equipment" ? "Техника" : type === "engine" ? "Двигатель" : 
                                    type === "transmission" ? "Трансмиссия" : type === "drive_axle" ? "Ведущий мост" : "Управляемый мост"}
                                  model={equipment[`${type}_model_name`]}
                                  serial={equipment[`${type}_serial`]}
                                  description={equipment[`${type}_model_description`] || "Отсутствует"}
                                  isExpanded={expandedCard === `${type}-${equipment.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${equipment.equipment_serial}`)}
                                />
                              ))}
                              {["contract", "shipment_date", "consignee", "delivery_address", 
                              "model_options", "client_name", "service_company_name"].map((type) => (
                                <DetailCardEquipment
                                  key={type}
                                  header={
                                    type === "contract" ? "Договор" : type === "shipment_date" ? "Дата отгрузки" : 
                                    type === "consignee" ? "Получатель" : type === "delivery_address" ? "Адрес доставки" : 
                                    type === "model_options" ? "Опции модели" : type === "client_name" ? "Клиент" : "Сервисная компания"
                                  }
                                  model={equipment[`${type}`]}
                                  serial={""} // не используется в данном контексте
                                  description={""} // не используется в данном контексте
                                  isExpanded={expandedCard === `${type}-${equipment.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${equipment.equipment_serial}`)}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <p>База данных пуста</p>
      )}
    </div>
  );
};

export default Equipment;