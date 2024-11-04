import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { useAuth } from '../Authenticate/useAuth';
import Table from 'react-bootstrap/Table';
import DetailCardClaim from '../DetailCard/DetailCardClaim';
import ClaimFilter from '../Filters/ClaimFilter';
import '../../styles/Claim.scss';

const Claim: React.FC = () => {
  const { userInfo } = useAuth();
  const [equipmentData, setEquipmentData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    failure_node_name: [],
    repair_method_name: [],
    service_company_name: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/claims/`, {
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
          failure_node_name: Array.from(new Set(data.map(item => item.failure_node_name))),
          repair_method_name: Array.from(new Set(data.map(item => item.repair_method_name))),
          service_company_name: Array.from(new Set(data.map(item => item.service_company_name))),
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
    <div className="claim">
      <h2 className="claim__title">Информация о рекламациях Вашей техники</h2>

      <ClaimFilter onFilterChange={handleFilterChange} filterOptions={filterOptions} />

      {filteredData.length ? (
        <div className="claim__table-container">
          <div className="claim__table-scroll">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Модель / Зав.№ техники</th>
                  <th>Дата отказа</th>
                  <th>Наработка, м/час</th>
                  <th>Узел отказа</th>
                  <th>Описание отказа</th>
                  <th>Способ восстановления</th>
                  <th>Используемые запчасти</th>
                  <th>Дата восстановления</th>
                  <th>Время простоя техники</th>
                  <th>Сервисная компания</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((claim) => (
                  <React.Fragment key={claim.id}>
                    <tr onClick={() => handleRowClick(claim)}>
                      <th>Модель<br />Зав.№</th>
                      <td>{claim.equipment_model_name}<br />{claim.equipment_serial}</td>
                      <td>{claim.failure_date}</td>
                      <td>{claim.engine_hours}</td>
                      <td>{claim.failure_node_name}</td>
                      <td>{claim.failure_description}</td>
                      <td>{claim.repair_method_name}</td>
                      <td>{claim.spare_parts}</td>
                      <td>{claim.repair_date}</td>
                      <td>{claim.downtime}</td>
                      <td>{claim.service_company_name}</td>
                    </tr>
                    {expandedRow === claim.equipment_serial && (
                      <tr>
                        <td colSpan={12}>
                          <div className="claim__details-container">
                            <div className="claim__cards-container">
                              {["equipment"].map((type) => (
                                <DetailCardClaim
                                  key={type}
                                  header={type === "equipment" ? "Техника" : "нд."}
                                  model={claim[`${type}_model_name`]}
                                  serial={claim[`${type}_serial`]}
                                  description={claim[`${type}_model_description`] || "Отсутствует"}
                                  isExpanded={expandedCard === `${type}-${claim.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${claim.equipment_serial}`)}
                                />
                              ))}
                              {["failure_date", "engine_hours", "failure_node_name", "failure_description", "repair_method_name", 
                              "spare_parts", "repair_date", "downtime", "service_company_name_name"].map((type) => (
                                <DetailCardClaim
                                  key={type}
                                  header={
                                    type === "failure_date" ? "Дата отказа" : type === "engine_hours" ? "Наработка, м/час" : 
                                    type === "failure_node_name" ? "Узел отказа" : type === "failure_description" ? "Описание отказа" : 
                                    type === "repair_method_name" ? "Способ восстановления" : type === "spare_parts" ? "Используемые запчасти" : 
                                    type === "repair_date" ? "Дата восстановления" : type === "downtime" ? "Время простоя техники"  : "Сервисная компания"
                                  }
                                  model={claim[`${type}`]}
                                  serial={""} // не используется в данном контексте
                                  description={""} // не используется в данном контексте
                                  isExpanded={expandedCard === `${type}-${claim.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${claim.equipment_serial}`)}
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

export default Claim;