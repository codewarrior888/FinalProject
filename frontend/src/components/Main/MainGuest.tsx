import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../API/apiService";
import "../../styles/MainGuest.scss";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import DetailCardGuest from "../DetailCard/DetailCardGuest";
import RoleLabel from "../Authenticate/RoleLabel";

const MainGuest: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isDimmed, setIsDimmed] = useState(false);

  // Ref to detect clicks outside the expanded details container
  const detailsRef = useRef<HTMLDivElement | null>(null);

  // Fetch equipment data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/equipment/public/`);
        setEquipmentData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };
    fetchData();
  }, []);

  // Handle clicks outside the expanded container
  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    if (
      detailsRef.current &&
      !detailsRef.current.contains(event.target as Node)
    ) {
      setExpandedRow(null); // Collapse the expanded details
    }
  };

  // Add and remove event listeners for mouse and touch
  useEffect(() => {
    if (expandedRow) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [expandedRow]);

  // Search logic
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredData(equipmentData);
    } else {
      const results = equipmentData.filter((equipment: any) =>
        equipment.equipment_serial.includes(searchQuery)
      );
      setFilteredData(results.length ? results : []);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocus = () => {
    if (searchQuery.trim() === "") {
      setFilteredData(equipmentData);
    }
  };

  // Row and Card Click Handlers
  const handleRowClick = (equipment: any) => {
    setExpandedRow((prev) => {
      const newExpandedRow =
        prev === equipment.equipment_serial ? null : equipment.equipment_serial;
      setIsDimmed(newExpandedRow !== null); // Update the dimmed state based on the new row
      return newExpandedRow;
    });
  };

  const handleCardClick = (equipmentSerial: string) => {
    setExpandedCard(expandedCard === equipmentSerial ? null : equipmentSerial);
  };

  return (
    <div className={`main-guest ${expandedRow ? "dimmed" : ""}`}>
      <div className="main-guest__top-section">
        <RoleLabel />
        <h2 className="main-guest__title">Информация о комплектации и технических характеристиках техники</h2>
        
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
          <button onClick={handleSearch} className="main-guest__search-button">
            Поиск
          </button>
        </div>
      </div>

      <h3>{searchQuery ? "Результат поиска:" : ""}</h3>

      <div className="main-guest__table-container">
        {filteredData.length ? (
          <Table bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>
                  Техника
                  <br />
                  модель / зав.№
                </th>
                <th>
                  Двигатель
                  <br />
                  модель / зав.№
                </th>
                <th>
                  Трансмиссия
                  <br />
                  модель / зав.№
                </th>
                <th>
                  Ведущий мост
                  <br />
                  модель / зав.№
                </th>
                <th>
                  Управляемый мост
                  <br />
                  модель / зав.№
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((equipment) => (
                <React.Fragment key={equipment.equipment_serial}>
                  <tr onClick={() => handleRowClick(equipment)}>
                    <td>
                      {equipment.equipment_model_name}
                      <br />
                      {equipment.equipment_serial}
                    </td>
                    <td>
                      {equipment.engine_model_name}
                      <br />
                      {equipment.engine_serial}
                    </td>
                    <td>
                      {equipment.transmission_model_name}
                      <br />
                      {equipment.transmission_serial}
                    </td>
                    <td>
                      {equipment.drive_axle_model_name}
                      <br />
                      {equipment.drive_axle_serial}
                    </td>
                    <td>
                      {equipment.steer_axle_model_name}
                      <br />
                      {equipment.steer_axle_serial}
                    </td>
                  </tr>
                  {expandedRow === equipment.equipment_serial && (
                    <tr>
                      <td colSpan={6}>
                        <div className="main-guest__details-container" ref={detailsRef}>
                          <h2 className="main-guest__title">Детали</h2>
                          <div className="main-guest__cards-container">
                            {["equipment", "engine", "transmission", "drive", "steer"

                            ].map((type) => (
                              <DetailCardGuest
                                key={type}
                                header={
                                  type === "equipment" 
                                  ? "Техника" 
                                  : type === "engine" 
                                  ? "Двигатель" 
                                  : type === "transmission"
                                  ? "Трансмиссия" 
                                  : type === "drive" 
                                  ? "Ведущий мост" 
                                  : "Управляемый мост"
                                }
                                model={equipment[`${type}_model_name`]}
                                serial={equipment[`${type}_serial`]}
                                description={
                                  equipment[`${type}_model_description`] ||
                                  "Отсутствует"
                                }
                                isExpanded={
                                  expandedCard ===
                                  `${type}-${equipment.equipment_serial}`
                                }
                                onClick={() =>
                                  handleCardClick(
                                    `${type}-${equipment.equipment_serial}`
                                  )
                                }
                                className={expandedCard === `${type}-${equipment.equipment_serial}` ? "expanded" : ""}
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
        ) : (
          <p>База данных пуста.</p>
        )}
      </div>
    </div>
  );
};

export default MainGuest;
