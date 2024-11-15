import "../../styles/Equipment.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Authenticate/useAuth";
import { API_URL } from "../api";
import Table from "react-bootstrap/Table";
import DetailCardEquipment from "../DetailCard/DetailCardEquipment";
import EquipmentFilter from "../Filters/EquipmentFilter";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

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
    client_name: [],
    service_company_name: [],
  });
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteSerial, setDeleteSerial] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/equipment/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      let data = response.data;

      // // Apply role-based filtering if the user's role is "client"
      // if (userInfo?.role === "cl") {
      //   data = data.filter(
      //     (item) =>
      //       item.client === userInfo.id ||
      //       item.client_name === userInfo.company_name
      //   );
      // } else if (userInfo?.role === "sc") {
      //   data = data.filter(
      //     (item) =>
      //       item.service_company === userInfo.id ||
      //       item.service_company_name === userInfo.company_name
      //   );
      // }

      setEquipmentData(data);
      setFilteredData(data);

      // Calculate unique filter options
      const options = {
        equipment_model_name: Array.from(
          new Set(data.map((item) => item.equipment_model_name))
        ),
        engine_model_name: Array.from(
          new Set(data.map((item) => item.engine_model_name))
        ),
        transmission_model_name: Array.from(
          new Set(data.map((item) => item.transmission_model_name))
        ),
        drive_axle_model_name: Array.from(
          new Set(data.map((item) => item.drive_axle_model_name))
        ),
        steer_axle_model_name: Array.from(
          new Set(data.map((item) => item.steer_axle_model_name))
        ),
        client_name: Array.from(
          new Map(
            data.map((item) => [
              item.client,
              { id: item.client, name: item.client_name },
            ])
          ).values()
        ),
        service_company_name: Array.from(
          new Map(
            data.map((item) => [
              item.service_company,
              { id: item.service_company, name: item.service_company_name },
            ])
          ).values()
        ),
      };
      setFilterOptions(options);

      // Extract and store equipment_serial values in localStorage
      const equipmentSerials = data.map((item) => item.equipment_serial);
      localStorage.setItem(
        "equipmentSerials",
        JSON.stringify(equipmentSerials)
      );
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userInfo]);

  // Handle filter changes
  const handleFilterChange = (selectedFilters: {
    [key: string]: string | number | null;
  }) => {
    let updatedData = equipmentData;

    Object.keys(selectedFilters).forEach((filterKey) => {
      const filterValue = selectedFilters[filterKey];
      if (filterValue && filterValue !== "all") {
        updatedData = updatedData.filter(
          (item) => item[filterKey] === filterValue
        );
      }
    });

    setFilteredData(updatedData);
  };

  const handleRowClick = (equipment: any) => {
    setExpandedRow(
      expandedRow === equipment.equipment_serial
        ? null
        : equipment.equipment_serial
    );
  };

  const handleCardClick = (equipmentSerial: string) => {
    setExpandedCard(expandedCard === equipmentSerial ? null : equipmentSerial);
  };

  // Handle edit actions
  const handleEditClick = (serial: string) => {
    const selectedItem = filteredData.find(
      (item) => item.equipment_serial === serial
    );

    if (selectedItem) {
      setEditValues((prev) => ({
        ...prev,
        [serial]: {
          ...selectedItem,
          equipment_model_id: selectedItem.equipment_model, // Ensure IDs for reference models are stored
          engine_model_id: selectedItem.engine_model,
          transmission_model_id: selectedItem.transmission_model,
          drive_axle_model_id: selectedItem.drive_axle_model,
          steer_axle_model_id: selectedItem.steer_axle_model,
        },
      }));

      setEditMode((prev) => ({
        ...prev,
        [serial]: true,
      }));
    }
  };

  const handleSaveClick = async (serial: string) => {
    try {
      const editedData = editValues[serial];
      if (!editedData) return;

      const referenceFieldMapping = {
        equipment_model_name: { category: "eq", idField: "equipment_model_id" },
        engine_model_name: { category: "en", idField: "engine_model_id" },
        transmission_model_name: {
          category: "tr",
          idField: "transmission_model_id",
        },
        drive_axle_model_name: {
          category: "da",
          idField: "drive_axle_model_id",
        },
        steer_axle_model_name: {
          category: "sa",
          idField: "steer_axle_model_id",
        },
      };

      // Update Reference model fields if applicable
      for (const [field, { category, idField }] of Object.entries(
        referenceFieldMapping
      )) {
        if (field in editedData) {
          const referenceName = editedData[field];
          const referenceId = editedData[idField];

          if (
            referenceId &&
            referenceName !==
              filteredData.find((item) => item.equipment_serial === serial)[
                field
              ]
          ) {
            await axios.put(
              `${API_URL}/api/references/${referenceId}/`,
              { category, name: referenceName },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
          }
        }
      }

      // Fetch correct IDs for client and service_company based on names
      const selectedClientName = editValues[serial].client_name;
      const selectedServiceCompanyName =
        editValues[serial].service_company_name;

      const client = filterOptions.client_name.find(
        (option) => option.name === selectedClientName
      )?.id;
      const service_company = filterOptions.service_company_name.find(
        (option) => option.name === selectedServiceCompanyName
      )?.id;

      const equipmentUpdates = {
        ...editedData,
        client:
          client ??
          equipmentData.find((item) => item.equipment_serial === serial)
            ?.client,
        service_company:
          service_company ??
          equipmentData.find((item) => item.equipment_serial === serial)
            ?.service_company,
      };

      // PUT request to update equipment data
      await axios.put(`${API_URL}/api/equipment/${serial}/`, equipmentUpdates, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // Exit edit mode, clear values, and refresh data
      setEditMode((prev) => ({ ...prev, [serial]: false }));
      setEditValues((prev) => ({ ...prev, [serial]: null }));
      fetchData();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleCancelClick = (serial: string) => {
    setEditMode((prev) => ({ ...prev, [serial]: false }));
  };

  const handleDeleteClick = (equipmentSerial: string) => {
    setDeleteSerial(equipmentSerial);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteSerial) {
      try {
        await axios.delete(`${API_URL}/api/equipment/${deleteSerial}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setEquipmentData((prev) =>
          prev.filter((item) => item.equipment_serial !== deleteSerial)
        );
        setFilteredData((prev) =>
          prev.filter((item) => item.equipment_serial !== deleteSerial)
        );
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      } finally {
        setShowConfirm(false);
        setDeleteSerial(null);
      }
    }
  };

  return (
    <div className="equipment">
      <h2 className="equipment__title">
        Информация о комплектации и технических характеристиках Вашей техники
      </h2>

      <EquipmentFilter
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
      />

      {filteredData.length ? (
        <div className="equipment__table-container">
          <div className="equipment__table-scroll">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Техника<br /><p style={{ fontSize: "14px", fontWeight: "normal" }}>модель / зав.№</p></th>
                  <th>Двигатель<br /><p style={{ fontSize: "14px", fontWeight: "normal" }}>модель / зав.№</p></th>
                  <th>Трансмиссия<br /><p style={{ fontSize: "14px", fontWeight: "normal" }}>модель / зав.№</p></th>
                  <th>Ведущий мост<br /><p style={{ fontSize: "14px", fontWeight: "normal" }}>модель / зав.№</p></th>
                  <th>Управляемый мост<br /><p style={{ fontSize: "14px", fontWeight: "normal" }}>модель / зав.№</p></th>
                  <th>Договор поставки<br /><p style={{ fontSize: "14px", fontWeight: "normal" }}> №, дата</p></th>
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
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveClick(equipment.equipment_serial);
                              }}
                              hidden={userInfo?.role === "cl" || userInfo?.role  === "sc"}
                            >
                              Save
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(equipment.equipment_serial);
                              }}
                              hidden={userInfo?.role  === "cl" || userInfo?.role  === "sc"}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(equipment.equipment_serial);
                              }}
                              hidden={userInfo?.role  === "cl" || userInfo?.role  === "sc"}
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(equipment.equipment_serial);
                              }}
                              hidden={userInfo?.role  === "cl" || userInfo?.role  === "sc"}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <>
                            <select
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.equipment_model_name ||
                                equipment.equipment_model_name
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    equipment_model_name: e.target.value,
                                  },
                                }))
                              }
                            >
                              {filterOptions.equipment_model_name.map(
                                (modelName) => (
                                  <option key={modelName} value={modelName}>
                                    {modelName}
                                  </option>
                                )
                              )}
                            </select>
                            <input
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.equipment_serial ||
                                equipment.equipment_serial
                              }
                              onClick={(e) => e.stopPropagation()}
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
                            <select
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.engine_model_name ||
                                equipment.engine_model_name
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    engine_model_name: e.target.value,
                                  },
                                }))
                              }
                            >
                              {filterOptions.engine_model_name.map(
                                (modelName) => (
                                  <option key={modelName} value={modelName}>
                                    {modelName}
                                  </option>
                                )
                              )}
                            </select>
                            <input
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.engine_serial || equipment.engine_serial
                              }
                              onClick={(e) => e.stopPropagation()}
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
                            <select
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.transmission_model_name ||
                                equipment.transmission_model_name
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    transmission_model_name: e.target.value,
                                  },
                                }))
                              }
                            >
                              {filterOptions.transmission_model_name.map(
                                (modelName) => (
                                  <option key={modelName} value={modelName}>
                                    {modelName}
                                  </option>
                                )
                              )}
                            </select>
                            <input
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.transmission_serial ||
                                equipment.transmission_serial
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    transmission_serial: e.target.value,
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
                            <select
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.drive_axle_model_name ||
                                equipment.drive_axle_model_name
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    drive_axle_model_name: e.target.value,
                                  },
                                }))
                              }
                            >
                              {filterOptions.drive_axle_model_name.map(
                                (modelName) => (
                                  <option key={modelName} value={modelName}>
                                    {modelName}
                                  </option>
                                )
                              )}
                            </select>
                            <input
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.drive_axle_serial ||
                                equipment.drive_axle_serial
                              }
                              onClick={(e) => e.stopPropagation()}
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
                            <select
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.steer_axle_model_name ||
                                equipment.steer_axle_model_name
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [equipment.equipment_serial]: {
                                    ...prev[equipment.equipment_serial],
                                    steer_axle_model_name: e.target.value,
                                  },
                                }))
                              }
                            >
                              {filterOptions.steer_axle_model_name.map(
                                (modelName) => (
                                  <option key={modelName} value={modelName}>
                                    {modelName}
                                  </option>
                                )
                              )}
                            </select>
                            <input
                              value={
                                editValues[equipment.equipment_serial]
                                  ?.steer_axle_serial ||
                                equipment.steer_axle_serial
                              }
                              onClick={(e) => e.stopPropagation()}
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
                            value={
                              editValues[equipment.equipment_serial]
                                ?.contract || equipment.contract
                            }
                            onClick={(e) => e.stopPropagation()}
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
                            value={
                              editValues[equipment.equipment_serial]
                                ?.shipment_date || equipment.shipment_date
                            }
                            onClick={(e) => e.stopPropagation()}
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
                            value={
                              editValues[equipment.equipment_serial]
                                ?.consignee || equipment.consignee
                            }
                            onClick={(e) => e.stopPropagation()}
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
                            value={
                              editValues[equipment.equipment_serial]
                                ?.delivery_address || equipment.delivery_address
                            }
                            onClick={(e) => e.stopPropagation()}
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
                            value={
                              editValues[equipment.equipment_serial]
                                ?.model_options || equipment.model_options
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  model_options: e.target.value,
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
                          <select
                            value={
                              editValues[equipment.equipment_serial]
                                ?.client_name || equipment.client_name
                            }
                            onChange={(e) => {
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  client_name: e.target.value,
                                },
                              }));
                            }}
                          >
                            {filterOptions.client_name.map((option) => (
                              <option key={option.id} value={option.name}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          equipment.client_name
                        )}
                      </td>
                      <td>
                        {editMode[equipment.equipment_serial] ? (
                          <select
                            value={
                              editValues[equipment.equipment_serial]
                                ?.service_company_name ||
                              equipment.service_company_name
                            }
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [equipment.equipment_serial]: {
                                  ...prev[equipment.equipment_serial],
                                  service_company_name: e.target.value,
                                },
                              }))
                            }
                          >
                            {filterOptions.service_company_name.map(
                              (option) => (
                                <option key={option.id} value={option.name}>
                                  {option.name}
                                </option>
                              )
                            )}
                          </select>
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
                              {[
                                "equipment",
                                "engine",
                                "transmission",
                                "drive_axle",
                                "steer_axle",
                              ].map((type) => (
                                <DetailCardEquipment
                                  key={type}
                                  header={
                                    type === "equipment"
                                      ? "Техника"
                                      : type === "engine"
                                      ? "Двигатель"
                                      : type === "transmission"
                                      ? "Трансмиссия"
                                      : type === "drive_axle"
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
                                />
                              ))}
                              {[
                                "contract",
                                "shipment_date",
                                "consignee",
                                "delivery_address",
                                "model_options",
                                "client_name",
                                "service_company_name",
                              ].map((type) => (
                                <DetailCardEquipment
                                  key={type}
                                  header={
                                    type === "contract"
                                      ? "Договор поставки №, дата"
                                      : type === "shipment_date"
                                      ? "Дата отгрузки"
                                      : type === "consignee"
                                      ? "Грузополучатель"
                                      : type === "delivery_address"
                                      ? "Адрес поставки"
                                      : type === "model_options"
                                      ? "Комплектация"
                                      : type === "client_name"
                                      ? "Клиент"
                                      : "Сервисная компания"
                                  }
                                  model={equipment[`${type}`]}
                                  serial={""}
                                  description={""}
                                  isExpanded={
                                    expandedCard ===
                                    `${type}-${equipment.equipment_serial}`
                                  }
                                  onClick={() =>
                                    handleCardClick(
                                      `${type}-${equipment.equipment_serial}`
                                    )
                                  }
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
            {showConfirm && (
              <ConfirmationDialog
                message={`Вы уверены, что хотите удалить модель ${deleteSerial} и все связанные с ней данные?`}
                onConfirm={confirmDelete}
                onCancel={() => {
                  setShowConfirm(false);
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <p>База данных пуста</p>
      )}
    </div>
  );
};

export default Equipment;
