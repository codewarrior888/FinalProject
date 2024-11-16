import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import '../../styles/MainGuest.scss';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DetailCardGuest from '../DetailCard/DetailCardGuest';
import RoleLabel from '../Authenticate/RoleLabel';

const MainGuest: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track expanded row
  const [expandedCard, setExpandedCard] = useState<string | null>(null); // Track expanded card

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/equipment/public/`);
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
    <div className="main-guest">
      <RoleLabel />
      <h2>Информация о комплектации и технических характеристиках техники</h2>

      <div className="main-guest__search">
        <Form.Control
          type="text"
          placeholder="Заводской номер"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="main-guest__search-field"
        />
        <button onClick={handleSearch} className="main-guest__search-button">Поиск</button>
      </div>

      <h3>{searchQuery ? 'Результат поиска:' : ''}</h3>

      {filteredData.length ? (
        <Table bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Техника<br />модель / зав.№</th>
              <th>Двигатель<br />модель / зав.№</th>
              <th>Трансмиссия<br />модель / зав.№</th>
              <th>Ведущий мост<br />модель / зав.№</th>
              <th>Управляемый мост<br />модель / зав.№</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((equipment) => (
              <React.Fragment key={equipment.equipment_serial}>
                <tr onClick={() => handleRowClick(equipment)}>
                  <td>{equipment.equipment_model_name}<br />{equipment.equipment_serial}</td>
                  <td>{equipment.engine_model_name}<br />{equipment.engine_serial}</td>
                  <td>{equipment.transmission_model_name}<br />{equipment.transmission_serial}</td>
                  <td>{equipment.drive_axle_model_name}<br />{equipment.drive_axle_serial}</td>
                  <td>{equipment.steer_axle_model_name}<br />{equipment.steer_axle_serial}</td>
                </tr>
                {expandedRow === equipment.equipment_serial && (
                  <tr>
                    <td colSpan={6}>
                      <div className="main-guest__details-container">
                        <h2>Детали</h2>
                        <div className="main-guest__cards-container">
                          <DetailCardGuest
                            header="Техника"
                            model={equipment.equipment_model_name}
                            serial={equipment.equipment_serial}
                            description={equipment.equipment_model_description || "Описание отсутствует"} // Adjust as needed
                            isExpanded={expandedCard === 'equipment-' + equipment.equipment_serial}
                            onClick={() => handleCardClick('equipment-' + equipment.equipment_serial)}
                          />
                          <DetailCardGuest
                            header="Двигатель"
                            model={equipment.engine_model_name}
                            serial={equipment.engine_serial}
                            description={equipment.engine_model_description || "Описание отсутствует"} // Adjust as needed
                            isExpanded={expandedCard === 'engine-' + equipment.equipment_serial}
                            onClick={() => handleCardClick('engine-' + equipment.equipment_serial)}
                          />
                          <DetailCardGuest
                            header="Трансмиссия"
                            model={equipment.transmission_model_name}
                            serial={equipment.transmission_serial}
                            description={equipment.transmission_description || "Описание отсутствует"} // Adjust as needed
                            isExpanded={expandedCard === 'transmission-' + equipment.equipment_serial}
                            onClick={() => handleCardClick('transmission-' + equipment.equipment_serial)}
                          />
                          <DetailCardGuest
                            header="Ведущий мост"
                            model={equipment.drive_axle_model_name}
                            serial={equipment.drive_axle_serial}
                            description={equipment.drive_axle_description || "Описание отсутствует"} // Adjust as needed
                            isExpanded={expandedCard === 'drive-axle-' + equipment.equipment_serial}
                            onClick={() => handleCardClick('drive-axle-' + equipment.equipment_serial)}
                          />
                          <DetailCardGuest
                            header="Управляемый мост"
                            model={equipment.steer_axle_model_name}
                            serial={equipment.steer_axle_serial}
                            description={equipment.steer_axle_description || "Описание отсутствует"} // Adjust as needed
                            isExpanded={expandedCard === 'steer-axle-' + equipment.equipment_serial}
                            onClick={() => handleCardClick('steer-axle-' + equipment.equipment_serial)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No equipment found.</p>
      )}
    </div>
  );
};

export default MainGuest;