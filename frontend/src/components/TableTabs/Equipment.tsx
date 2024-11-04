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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    equipment_model_name: [],
    engine_model_name: [],
    transmission_model_name: [],
    drive_axle_model_name: [],
    steer_axle_model_name: [],
  });

  // Additional state to track edited values
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});

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

  // Handle edit actions
  const handleEditClick = (serial: string) => {
    setEditMode((prev) => ({ ...prev, [serial]: !prev[serial] }));
    setEditValues((prev) => ({ ...prev, [serial]: { ...equipmentData.find(item => item.equipment_serial === serial) } }));
  };

  const handleSaveClick = async (serial: string) => {
    try {
      // Save changes via API call
      await axios.put(`${API_URL}/api/equipment/${serial}/`, editValues[serial], {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setEditMode((prev) => ({ ...prev, [serial]: false }));
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleDeleteClick = async (equipmentSerial: string) => {
    try {
      await axios.delete(`${API_URL}/api/equipment/${equipmentSerial}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setEquipmentData((prev) => prev.filter((item) => item.equipment_serial !== equipmentSerial));
      setFilteredData((prev) => prev.filter((item) => item.equipment_serial !== equipmentSerial));
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
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
                  <th>Модель / Зав.№ техники</th>
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
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <button onClick={() => handleSaveClick(equipment.equipment_serial)}>Save</button>
                        ) : (
                          <button onClick={() => handleEditClick(equipment.equipment_serial)}>Edit</button>
                        )}
                        <button onClick={() => handleDeleteClick(equipment.equipment_serial)}>Delete</button>
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <>
                            <input
                              value={editValues[equipment.equipment_serial]?.equipment_model_name || equipment.equipment_model_name}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    equipment_model_name: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              value={editValues[equipment.equipment_serial]?.equipment_serial || equipment.equipment_serial}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    equipment_serial: e.target.value,
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          `${equipment.equipment_model_name} / ${equipment.equipment_serial}`
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <>
                            <input
                              value={editValues[equipment.equipment_serial]?.engine_model_name || equipment.engine_model_name}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    engine_model_name: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              value={editValues[equipment.equipment_serial]?.engine_serial || equipment.engine_serial}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    engine_serial: e.target.value,
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          `${equipment.engine_model_name} / ${equipment.engine_serial}`
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <>
                            <input
                              value={editValues[equipment.equipment_serial]?.transmission_model_name || equipment.transmission_model_name}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    transmission_model_name: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              value={editValues[equipment.equipment_serial]?.engine_serial || equipment.transmission_serial}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    engine_serial: e.target.value,
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          `${equipment.transmission_model_name} / ${equipment.transmission_serial}`
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <>
                            <input
                              value={editValues[equipment.equipment_serial]?.drive_axle_model_name || equipment.drive_axle_model_name}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    drive_axle_model_name: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              value={editValues[equipment.equipment_serial]?.drive_axle_serial || equipment.drive_axle_serial}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    drive_axle_serial: e.target.value,
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          `${equipment.drive_axle_model_name} / ${equipment.drive_axle_serial}`
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <>
                            <input
                              value={editValues[equipment.equipment_serial]?.steer_axle_model_name || equipment.steer_axle_model_name}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    steer_axle_model_name: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              value={editValues[equipment.equipment_serial]?.steer_axle_serial || equipment.steer_axle_serial}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    steer_axle_serial: e.target.value,
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          `${equipment.steer_axle_model_name} / ${equipment.steer_axle_serial}`
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.contract || equipment.contract}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  contract: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.contract
                        )}
                      </td>

                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.shipment_date || equipment.shipment_date}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  shipment_date: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.shipment_date
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.consignee || equipment.consignee}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  consignee: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.consignee
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.delivery_address || equipment.delivery_address}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  delivery_address: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.delivery_address
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.model_options_preview || equipment.model_options_preview}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  model_options_preview: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.model_options_preview
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.client_name || equipment.client_name}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  client_name: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.client_name
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <input
                            value={editValues[equipment.equipment_serial]?.service_company_name || equipment.service_company_name}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  service_company_name: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          equipment.service_company_name
                        )}
                      </td>
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