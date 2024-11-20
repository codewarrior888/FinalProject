import "../../styles/Equipment.scss";
import React, { useState, useEffect, useRef } from "react";
import { fetchEquipmentData, saveEquipmentData, deleteEquipment } from "../API/apiService";
import { useAuth } from "../Authenticate/useAuth";
import Table from "react-bootstrap/Table";
import DetailCardEquipment from "../DetailCard/DetailCardEquipment";
import EquipmentFilter from "../Filters/EquipmentFilter";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import { useReferences } from "../API/ReferenceContext";

const Equipment: React.FC = () => {
  const { userInfo } = useAuth();
  const { equipmentReferenceOptions, userReferenceOptions, fetchReferences } =
    useReferences();
  const [equipmentData, setEquipmentData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteSerial, setDeleteSerial] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState({});
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
  const [isDimmed, setIsDimmed] = useState(false);

  // Ref to detect clicks outside the expanded details container
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const createFilterOptions = (data) => {
    return {
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
  };

  const filterByRole = (data, userInfo) => {
    if (userInfo?.role === "cl") {
      return data.filter(
        (item) =>
          item.client === userInfo.id ||
          item.client_name === userInfo.company_name
      );
    } else if (userInfo?.role === "sc") {
      return data.filter(
        (item) =>
          item.service_company === userInfo.id ||
          item.service_company_name === userInfo.company_name
      );
    }
    return data;
  };

  const storeEquipmentSerials = (data) => {
    const equipmentSerials = data.map((item) => item.equipment_serial);
    localStorage.setItem("equipmentSerials", JSON.stringify(equipmentSerials));
  };

  const fetchData = async () => {
    try {
      const equipmentData = await fetchEquipmentData();

      let data = equipmentData;

      // Apply role-based filtering
      data = filterByRole(data, userInfo);

      setEquipmentData(data);
      setFilteredData(data);

      // Store the initial data as a reference for comparisons
      const initialData = data.reduce((acc, item) => {
        acc[item.equipment_serial] = item; // Use serial as the key
        return acc;
      }, {});
      setOriginalData(initialData);

      // Setup unique filter options
      const options = createFilterOptions(data);
      setFilterOptions(options);

      // Store equipment_serial values in localStorage
      storeEquipmentSerials(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (!equipmentReferenceOptions || !userReferenceOptions) {
      fetchReferences();
    }
  }, [
    equipmentReferenceOptions,
    userReferenceOptions,
    fetchReferences,
    userInfo,
  ]);

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

  // Handle clicks outside the expanded container
  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    if (
      detailsRef.current &&
      !detailsRef.current.contains(event.target as Node)
    ) {
      setExpandedRow(null);
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

  const handleRowClick = (equipment: any) => {
    setExpandedRow((prev) => {
      const newExpandedRow =
        prev === equipment.equipment_serial ? null : equipment.equipment_serial;
      setIsDimmed(newExpandedRow !== null);
      return newExpandedRow;
    });
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
        },
      }));

      setEditMode((prev) => ({
        ...prev,
        [serial]: true,
      }));
    }
  };

  const formatDateForAPI = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  interface EditedData {
    client_name?: string;
    service_company_name?: string;
    equipment_model_name?: string;
    engine_model_name?: string;
    transmission_model_name?: string;
    drive_axle_model_name?: string;
    steer_axle_model_name?: string;
  }

  const handleModelFields = (
    editedData,
    originalData,
    equipmentReferenceOptions
  ) => {
    const equipmentUpdates: Record<string, any> = {};
    const modelFields = [
      "equipment_model",
      "engine_model",
      "transmission_model",
      "drive_axle_model",
      "steer_axle_model",
    ];

    modelFields.forEach((field) => {
      const modelNameField = `${field}_name`;
      const originalValue = originalData[modelNameField];
      const editedValue = editedData[modelNameField];

      if (editedValue && editedValue !== originalValue) {
        const selectedOption = equipmentReferenceOptions[field]?.find(
          ([, name]) => name === editedValue
        );
        if (selectedOption) {
          equipmentUpdates[field] = selectedOption[0]; // Add ID
          equipmentUpdates[`${field}_name`] = editedValue; // Add name
        }
      } else {
        // Keep the original values if unchanged
        equipmentUpdates[field] = originalData[field];
        equipmentUpdates[`${field}_name`] = originalValue;
      }
    });

    return equipmentUpdates;
  };

  const handleUserFields = (editedData, originalData, userReferenceOptions) => {
    const equipmentUpdates: Record<string, any> = {};
    const userFields = ["client", "service_company"];

    userFields.forEach((field) => {
      const fieldName = `${field}_name`;
      const originalValue = originalData[fieldName];
      const editedValue = editedData[fieldName];

      if (editedValue && editedValue !== originalValue) {
        const selectedOption = userReferenceOptions[`${field}_name`]?.find(
          ([, name]) => name === editedValue
        );
        if (selectedOption) {
          equipmentUpdates[field] = selectedOption[0]; // Add ID
          equipmentUpdates[fieldName] = editedValue; // Add name
        }
      } else {
        // Keep the original values if unchanged
        equipmentUpdates[field] = originalData[field];
        equipmentUpdates[fieldName] = originalValue;
      }
    });

    return equipmentUpdates;
  };

  const handleOtherFields = (editedData, originalData) => {
    const equipmentUpdates: Record<string, any> = {};
    const otherFields = [
      "equipment_serial",
      "engine_serial",
      "transmission_serial",
      "drive_axle_serial",
      "steer_axle_serial",
      "contract",
      "shipment_date",
      "consignee",
      "delivery_address",
      "model_options",
    ];

    otherFields.forEach((field) => {
      if (field === "shipment_date") {
        equipmentUpdates[field] = editedData[field]
          ? formatDateForAPI(editedData[field]) // Format new date
          : formatDateForAPI(originalData[field]); // Format unchanged date
      } else {
        equipmentUpdates[field] =
          editedData[field] !== undefined
            ? editedData[field] // New value
            : originalData[field]; // Original value
      }
    });

    return equipmentUpdates;
  };

  const handleSaveClick = async (serial: string) => {
    try {
      const editedData: EditedData = editValues[serial];
      if (!editedData) return;

      const original = originalData[serial];
      let equipmentUpdates: Record<string, any> = {};

      equipmentUpdates = {
        ...equipmentUpdates,
        ...handleModelFields(editedData, original, equipmentReferenceOptions),
      };

      equipmentUpdates = {
        ...equipmentUpdates,
        ...handleUserFields(editedData, original, userReferenceOptions),
      };

      equipmentUpdates = {
        ...equipmentUpdates,
        ...handleOtherFields(editedData, original),
      };

      // Make the PUT request
      await saveEquipmentData(serial, equipmentUpdates);

      // Update states and refresh data
      setEditMode((prev) => ({ ...prev, [serial]: false }));
      setEditValues((prev) => ({ ...prev, [serial]: null }));
      fetchData();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleCancelClick = (serial: string) => {
    setEditMode((prev) => ({ ...prev, [serial]: false }));
    setEditValues((prev) => ({ ...prev, [serial]: null }));
  };

  const handleDeleteClick = (equipmentSerial: string) => {
    setDeleteSerial(equipmentSerial);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteSerial) {
      try {
        await deleteEquipment(deleteSerial);

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
    <div className={`equipment ${expandedRow ? "dimmed" : ""}`}>
      <div className="equipment__top-section">
        <h2 className="equipment__title">
          Информация о комплектации и технических характеристиках Вашей техники
        </h2>
        <div className="equipment__filter-container">
          <EquipmentFilter onFilterChange={handleFilterChange} filterOptions={filterOptions} />
        </div>
      </div>

      {filteredData.length ? (
        <div className="equipment__table-container">
          <div className="equipment__table-scroll">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th></th>
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
                  <th>
                    Договор поставки
                    <br /> №, дата
                  </th>
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
                      <td className="equipment__fixed-column">
                        {editMode[equipment.equipment_serial] ? (
                          <div className="button-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveClick(equipment.equipment_serial);
                              }}
                              hidden={
                                userInfo?.role === "cl" ||
                                userInfo?.role === "sc"
                              }
                              className="save-button"
                            >
                              Save
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(equipment.equipment_serial);
                              }}
                              hidden={
                                userInfo?.role === "cl" ||
                                userInfo?.role === "sc"
                              }
                              className="cancel-button"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="button-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(equipment.equipment_serial);
                              }}
                              hidden={
                                userInfo?.role === "cl" ||
                                userInfo?.role === "sc"
                              }
                              className="edit-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(equipment.equipment_serial);
                              }}
                              hidden={
                                userInfo?.role === "cl" ||
                                userInfo?.role === "sc"
                              }
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </div>
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
                              {equipmentReferenceOptions.equipment_model.map(
                                ([id, name]) => (
                                  <option key={id} value={name}>
                                    {name}
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
                          <>
                            {equipment.equipment_model_name} /
                            <br />
                            {equipment.equipment_serial}
                          </>
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
                              {equipmentReferenceOptions.engine_model.map(
                                ([id, name]) => (
                                  <option key={id} value={name}>
                                    {name}
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
                          <>
                            {equipment.engine_model_name} /
                            <br />
                            {equipment.engine_serial}
                          </>
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
                              {equipmentReferenceOptions.transmission_model.map(
                                ([id, name]) => (
                                  <option key={id} value={name}>
                                    {name}
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
                          <>
                            {equipment.transmission_model_name} /
                            <br />
                            {equipment.transmission_serial}
                          </>
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
                              {equipmentReferenceOptions.drive_axle_model.map(
                                ([id, name]) => (
                                  <option key={id} value={name}>
                                    {name}
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
                          <>
                            {equipment.drive_axle_model_name} /
                            <br />
                            {equipment.drive_axle_serial}
                          </>
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
                              {equipmentReferenceOptions.steer_axle_model.map(
                                ([id, name]) => (
                                  <option key={id} value={name}>
                                    {name}
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
                          <>
                            {equipment.steer_axle_model_name} /
                            <br />
                            {equipment.steer_axle_serial}
                          </>
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
                            type="date"
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
                            {userReferenceOptions.client_name.map(
                              ([id, name]) => (
                                <option key={id} value={name}>
                                  {name}
                                </option>
                              )
                            )}
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
                            {userReferenceOptions.service_company_name.map(
                              ([id, name]) => (
                                <option key={id} value={name}>
                                  {name}
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
                        <td colSpan={13}>
                          <div className="equipment__details-container" ref={detailsRef}>
                            <h2 className="equipment__details-title">Детали</h2>
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
                                  className={expandedCard === `${type}-${equipment.equipment_serial}` ? "expanded" : ""}
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
          <p>База данных пуста.</p>
        )}
    </div>
  );
};

export default Equipment;
