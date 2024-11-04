import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { useAuth } from '../Authenticate/useAuth';
import Table from 'react-bootstrap/Table';
import DetailCardMaintenance from '../DetailCard/DetailCardMaintenance';
import MaintenanceFilter from '../Filters/MaintenanceFilter';
import '../../styles/Maintenance.scss';

const Maintenance: React.FC = () => {
  const { userInfo } = useAuth();
  const [equipmentData, setEquipmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    maintenance_type_name: [],
    service_company_name: [],
    equipment_serial: [],
  });

useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch maintenance data
      const response = await axios.get(`${API_URL}/api/maintenance/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      let data = response.data;

      const equipmentSerials = JSON.parse(localStorage.getItem('equipmentSerials') || '[]');

      // Filter maintenance data based on equipment_serials
      data = data.filter((item) => equipmentSerials.includes(item.equipment_serial));

      setEquipmentData(data);
      setFilteredData(data);

        // Calculate unique filter options
        const options = {
          maintenance_type_name: Array.from(new Set(data.map(item => item.maintenance_type_name))),
          service_company_name: Array.from(new Set(data.map(item => item.service_company_name))),
          equipment_serial: Array.from(new Set(data.map(item => item.equipment_serial))),
        };
        setFilterOptions(options);
        
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
    <div className="maintenance">
      <h2 className="maintenance__title">Информация о проведенных ТО Вашей техники</h2>

      <MaintenanceFilter onFilterChange={handleFilterChange} filterOptions={filterOptions} />

      {filteredData.length ? (
        <div className="maintenance__table-container">
          <div className="maintenance__table-scroll">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Техника</th>
                  <th>Вид ТО</th>
                  <th>Дата проведения ТО</th>
                  <th>Наработка, м/час</th>
                  <th>№ заказ-наряда</th>
                  <th>Дата заказ-наряда</th>
                  <th>Сервисная компания, проводившая ТО</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((maintenance) => (
                  <React.Fragment key={maintenance.id}>
                    <tr onClick={() => handleRowClick(maintenance)}>
                      <th>Модель<br />Зав.№</th>
                      <td>{maintenance.equipment_model_name}<br />{maintenance.equipment_serial}</td>
                      <td>{maintenance.maintenance_type_name}</td>
                      <td>{maintenance.maintenance_date}</td>
                      <td>{maintenance.engine_hours}</td>
                      <td>{maintenance.order_number}</td>
                      <td>{maintenance.order_date}</td>
                      <td>{maintenance.service_company_name}</td>
                    </tr>
                    {expandedRow === maintenance.equipment_serial && (
                      <tr>
                        <td colSpan={12}>
                          <div className="maintenance__details-container">
                            <div className="maintenance__cards-container">
                              {["equipment"].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={type === "equipment" ? "Техника" : "Вид ТО"}
                                  model={maintenance[`${type}_model_name`]}
                                  serial={maintenance[`${type}_serial`]}
                                  description={maintenance[`${type}_model_description`] || "Отсутствует"}
                                  isExpanded={expandedCard === `${type}-${maintenance.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${maintenance.equipment_serial}`)}
                                />
                              ))}
                              {["maintenance_type_name", "maintenance_date", "engine_hours", "order_number", "order_date", "service_company_name"].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={type === "maintenance_type_name" ? "Вид ТО" : type === "maintenance_date" ? "Дата проведения ТО" : type === "engine_hours" ? "Наработка, м/час" : type === "order_number" ? "№ заказ-наряда" : type === "order_date" ? "Дата заказ-наряда" : "Сервисная компания"}
                                  model={maintenance[`${type}`]}
                                  serial={""} // не используется в данном случае
                                  description={""} // не используется в данном случае
                                  isExpanded={expandedCard === `${type}-${maintenance.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${maintenance.equipment_serial}`)}
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
        <p>No equipment found.</p>
      )}
    </div>
  );
};

export default Maintenance;