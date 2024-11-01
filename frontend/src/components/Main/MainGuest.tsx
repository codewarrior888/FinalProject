import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import '../../styles/MainGuest.scss';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const MainGuest: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track expanded row

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/equipment/public/`);
        setEquipmentData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      // Reset search if input is empty
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
      handleSearch(); // Trigger search on Enter key
    }
  };

  const handleFocus = () => {
    if (searchQuery.trim() === '') {
      // Show all data when input is focused and empty
      setFilteredData(equipmentData);
    }
  };

  const handleRowClick = (equipment: any) => {
    // Toggle row expansion
    setExpandedRow(expandedRow === equipment.equipment_serial ? null : equipment.equipment_serial);
  };

  return (
    <div className="main-guest__container">
      <h2>Информация о комплектации и <br />технических характеристиках Вашей техники</h2>

      <div className="main-guest__search">
        <Form.Control
          type="text"
          placeholder="Заводской номер"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // Add keydown event handler
          onFocus={handleFocus} // Add focus event handler
          className="search-field"
        />
        <Button onClick={handleSearch} variant="primary" className="search-button">Поиск</Button>
      </div>

      <h3>{searchQuery ? 'Результат поиска:' : ''}</h3>

      {filteredData.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th></th>
              <th>Техника</th>
              <th>Двигатель</th>
              <th>Трансмиссия</th>
              <th>Ведущий мост</th>
              <th>Управляемый мост</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((equipment) => (
              <React.Fragment key={equipment.equipment_serial}>
                <tr onClick={() => handleRowClick(equipment)}>
                  <th>Модель<br />Зав.№</th>
                  <td>{equipment.equipment_model}<br />{equipment.equipment_serial}</td>
                  <td>{equipment.engine_model}<br />{equipment.engine_serial}</td>
                  <td>{equipment.transmission_model}<br />{equipment.transmission_serial}</td>
                  <td>{equipment.drive_axle_model}<br />{equipment.drive_axle_serial}</td>
                  <td>{equipment.steer_axle_model}<br />{equipment.steer_axle_serial}</td>
                </tr>
                {expandedRow === equipment.equipment_serial && (
                  <tr>
                    <td colSpan={6}>
                      <div className="detailsContainer">
                        <h5>Детали</h5>
                        <ul>
                          <li>Модель техники: {equipment.equipment_model}</li>
                          <li>Зав.№ техники: {equipment.equipment_serial}</li>
                          <li>Модель двигателя: {equipment.engine_model}</li>
                          <li>Зав.№ двигателя: {equipment.engine_serial}</li>
                          <li>Модель трансмиссии: {equipment.transmission_model}</li>
                          <li>Зав.№ трансмиссии: {equipment.transmission_serial}</li>
                          <li>Модель ведущего моста: {equipment.drive_axle_model}</li>
                          <li>Зав.№ ведущего моста: {equipment.drive_axle_serial}</li>
                          <li>Модель управляемого моста: {equipment.steer_axle_model}</li>
                          <li>Зав.№ управляемого моста: {equipment.steer_axle_serial}</li>
                        </ul>
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