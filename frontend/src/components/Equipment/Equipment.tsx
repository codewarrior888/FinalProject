import '../../styles/Equipment.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DetailCardEquipment from '../DetailCard/DetailCardEquipment';

const Equipment: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/equipment/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setEquipmentData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredData(equipmentData);
    } else {
      const results = equipmentData.filter((equipment: any) =>
        equipment.equipment_serial.includes(searchQuery)
      );
      setFilteredData(results.length ? results : []);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFocus = () => {
    if (searchQuery.trim() === '') {
      setFilteredData(equipmentData);
    }
  };

  const handleRowClick = (equipment: any) => {
    setExpandedRow(expandedRow === equipment.equipment_serial ? null : equipment.equipment_serial);
  };

  const handleCardClick = (equipmentSerial: string) => {
    setExpandedCard(expandedCard === equipmentSerial ? null : equipmentSerial);
  };

  return (
    <div className="equipment">
      <h2>Информация о комплектации и <br />технических характеристиках Вашей техники</h2>

      <div className="equipment__search">
        <Form.Control
          type="text"
          placeholder="Заводской номер"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="equipment__search-field"
        />
        <button onClick={handleSearch} className="equipment__search-button">Поиск</button>
      </div>

      <h3>{searchQuery ? 'Результат поиска:' : ''}</h3>

      {filteredData.length ? (
        <div className="equipment__table-container">
          <div className="table-scroll">
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
                      <td>{equipment.model_options}</td>
                      <td>{equipment.service_company_name}</td>
                    </tr>
                    {expandedRow === equipment.equipment_serial && (
                      <tr>
                        <td colSpan={12}>
                          <div className="equipment__details-container">
                            <h2>Детали</h2>
                            <div className="equipment__cards-container">
                              {["equipment", "engine", "transmission", "drive_axle", "steer_axle"].map((type) => (
                                <DetailCardEquipment
                                  key={type}
                                  header={type === "equipment" ? "Техника" : type === "engine" ? "Двигатель" : type === "transmission" ? "Трансмиссия" : type === "drive_axle" ? "Ведущий мост" : "Управляемый мост"}
                                  model={equipment[`${type}_model_name`]}
                                  serial={equipment[`${type}_serial`]}
                                  description={equipment[`${type}_model_description`] || "Описание отсутствует"}
                                  isExpanded={expandedCard === `${type}-${equipment.equipment_serial}`}
                                  onClick={() => handleCardClick(`${type}-${equipment.equipment_serial}`)}
                                />
                              ))}
                              {["contract", "shipment_date", "consignee", "delivery_address", "model_options", "service_company_name"].map((type) => (
                                <DetailCardEquipment
                                  key={type}
                                  header={type === "contract" ? "Договор" : type === "shipment_date" ? "Дата отгрузки" : type === "consignee" ? "Получатель" : type === "delivery_address" ? "Адрес доставки" : type === "model_options" ? "Опции модели" : "Сервисная компания"}
                                  model={equipment[`${type}`]}
                                  serial={""} // не используется в данном случае
                                  description={""} // не используется в данном случае
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
        <p>No equipment found.</p>
      )}
    </div>
  );
};

export default Equipment;