import React, { useState, useEffect } from "react";
import { deleteMaintenance, fetchMaintenanceData, saveMaintenanceData } from "../API/apiService";
import { useReferences } from "../API/ReferenceContext";
import { useAuth } from "../Authenticate/useAuth";
import Table from "react-bootstrap/Table";
import DetailCardMaintenance from "../DetailCard/DetailCardMaintenance";
import MaintenanceFilter from "../Filters/MaintenanceFilter";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import "../../styles/Maintenance.scss";

const Maintenance: React.FC = () => {
  const { userInfo } = useAuth();
  const { equipmentReferenceOptions, userReferenceOptions, fetchReferences } = useReferences();
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<any | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    maintenance_type_name: [],
    service_company_name: [],
    maintenance_company_name: [],
    equipment_serial: [],
  });
  const [editMode, setEditMode] = useState<{ [id: number]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [id: number]: any }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteMaintenanceId, setDeleteMaintenanceId] = useState<number | null>(
    null
  );
  const [ originalData, setOriginalData ] = useState([]);

  const createFilterOptions = (data) => {
    return {
      equipment_serial: Array.from(
        new Set(data.map((item) => item.equipment_serial))
      ),
      maintenance_type_name: Array.from(
        new Set(data.map((item) => item.maintenance_type_name))
      ),
      service_company_name: Array.from(
        new Set(data.map((item) => item.service_company_name))
      ),
      maintenance_company_name: Array.from(
        new Set(data.map((item) => item.maintenance_company_name))
      ),
    };
  };

  const equipmentSerials = JSON.parse(localStorage.getItem("equipmentSerials")) || [];

  const filterByRole = (data, userInfo) => {  
    if (userInfo?.role === "cl") {
      const filteredData = data.filter(
        (item) =>
          equipmentSerials.includes(item.equipment_serial)
      );
      return filteredData;
    } else if (userInfo?.role === "sc") {
      const filteredData = data.filter(
        (item) =>
          equipmentSerials.includes(item.equipment_serial)
      );
      return filteredData;
    }
    return data;
  };

  const storeMaintenanceIds = (data) => {
    const maintenanceIds = data.map((item) => item.id);
      localStorage.setItem("maintenanceIds", JSON.stringify(maintenanceIds));
  };

  // const equipmentSerials = JSON.parse(localStorage.getItem("equipmentSerials")) || [];

  const fetchData = async () => {
    try {
      const maintenanceData = await fetchMaintenanceData();
      let data = maintenanceData;
      console.log("maintenanceData", maintenanceData);

      data = filterByRole(data, userInfo);
      console.log("data", data);

      setMaintenanceData(data);
      setFilteredData(data);

      // Store the initial data as a reference for comparisons
      const initialData = data.reduce((acc, item) => {
        acc[item.id] = item; // Use serial as the key
        return acc;
      }, {});
      setOriginalData(initialData);

      // Calculate unique filter options
      const options = createFilterOptions(data);
      setFilterOptions(options);

      storeMaintenanceIds(data);
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
    let updatedData = maintenanceData;

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

  const handleRowClick = (maintenance: any) => {
    setExpandedRow(expandedRow === maintenance.id ? null : maintenance.id);
  };

  const handleCardClick = (maintenanceId: any) => {
    setExpandedCard(expandedCard === maintenanceId ? null : maintenanceId);
  };

  const handleEditClick = (id: number) => {
    const selectedItem = filteredData.find((item) => item.id === id);
    if (selectedItem) {
      setEditValues((prev) => ({
        ...prev,
        [id]: {
          ...selectedItem,
        },
      }));
      setEditMode((prev) => ({ ...prev, [id]: true }));
    }
  };

  const formatDateForAPI = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // const formatDateForDisplay = (dateString: string) => {
  //   const [month, day, year] = dateString.split("/");
  //   return `${year}-${month}-${day}`;
  // }

  const handleMaintenanceTypeField = (
    editedData,
    originalData,
    equipmentReferenceOptions
  ) => {
    const maintenanceUpdates: Record<string, any> = {};
    const maintenanceTypeField = ["maintenance_type"];

    maintenanceTypeField.forEach((field) => {
      const fieldName = `${field}_name`;
      const originalValue = originalData[fieldName];
      const editedValue = editedData[fieldName];

      if (editedValue && editedValue !== originalValue) {
        const selectedOption =
          equipmentReferenceOptions[field]?.find(
            ([, name]) => name === editedValue
          );
        if (selectedOption) {
          maintenanceUpdates[field] = selectedOption[0]; // Add ID
          maintenanceUpdates[fieldName] = editedValue; // Add name
          console.log('maintenanceUpdates', maintenanceUpdates)
        }
      } else {
        // Keep the original values if unchanged
        maintenanceUpdates[field] = originalData[field];
        maintenanceUpdates[fieldName] = originalValue;
      }
    });

    return maintenanceUpdates;
  };
  
  const handleOtherFields = (editedData, originalData) => {
    const maintenanceUpdates: Record<string, any> = {};
    const otherFields = ["maintenance_date", "engine_hours", "order_number", "order_date", "maintenance_company_name"];

    otherFields.forEach((field) => {
      if (field === "maintenance_date" || field === "order_date") {
        maintenanceUpdates[field] = editedData[field] ? formatDateForAPI(editedData[field])
         : formatDateForAPI(originalData[field]);
      } else {
        maintenanceUpdates[field] = editedData[field] !== undefined ? editedData[field] : originalData[field];
      }
    });

    // Include required non-editable fields
  maintenanceUpdates["equipment"] = originalData["equipment"]; // Always include equipment ID
  maintenanceUpdates["service_company"] = originalData["service_company"]; // Always include service company ID

    return maintenanceUpdates;
  };

  const handleSaveClick = async (id: number) => {
    try {
      const editedData = editValues[id];
      if (!editedData) return;

      const original = originalData[id];
      let maintenanceUpdates: Record<string, any> = {};

      maintenanceUpdates = {
        ...maintenanceUpdates,
        ...handleOtherFields(editedData, original),
      };

      maintenanceUpdates = {
        ...maintenanceUpdates,
        ...handleMaintenanceTypeField(editedData, original, equipmentReferenceOptions),
      };

      await saveMaintenanceData(id, maintenanceUpdates);

      setEditMode((prev) => ({ ...prev, [id]: false }));
      setEditValues((prev) => ({ ...prev, [id]: null }));
      fetchData();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleCancelClick = (id: number) => {
    setEditMode((prev) => ({ ...prev, [id]: false }));
    setEditValues((prev) => ({ ...prev, [id]: null }));
  };

  const handleDeleteClick = (id: number) => {
    setDeleteMaintenanceId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteMaintenanceId) {
      try {
        await deleteMaintenance(deleteMaintenanceId);

        setMaintenanceData((prev) =>
          prev.filter((item) => item.id !== deleteMaintenanceId)
        );
        setFilteredData((prev) =>
          prev.filter((item) => item.id !== deleteMaintenanceId)
        );
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      } finally {
        setShowConfirm(false);
        setDeleteMaintenanceId(null);
      }
    }
  };

  return (
    <div className="maintenance">
      <h2 className="maintenance__title">
        Информация о проведенных ТО Вашей техники
      </h2>

      <MaintenanceFilter
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
      />

      {filteredData.length ? (
        <div className="maintenance__table-container">
          <div className="maintenance__table-scroll">
            <Table bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th></th>
                  <th>Зав.№ техники</th>
                  <th>Вид ТО</th>
                  <th>Дата проведения ТО</th>
                  <th>Наработка, м/час</th>
                  <th>№ заказ-наряда</th>
                  <th>Дата заказ-наряда</th>
                  <th>Орг-ция, проводившая ТО</th>
                  <th>Сервисная компания</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((maintenance) => (
                  <React.Fragment key={maintenance.id}>
                    <tr onClick={() => handleRowClick(maintenance)}>
                      <td>
                        {editMode[maintenance.id] ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveClick(maintenance.id);
                              }}
                              className="save-button"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(maintenance.id);
                              }}
                              className="cancel-button"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(maintenance.id);
                              }}
                              className="edit-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(maintenance.id);
                              }}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        {maintenance.equipment_serial}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <select
                            value={
                              editValues[maintenance.id]
                                ?.maintenance_type_name ||
                              maintenance.maintenance_type_name
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  maintenance_type_name: e.target.value,
                                },
                              }))
                            }
                          >
                            {equipmentReferenceOptions.maintenance_type.map(
                              ([id, name]) => (
                                <option
                                  key={id}
                                  value={name}
                                >
                                  {name}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          maintenance.maintenance_type_name
                        )}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <input
                            type="date"
                            value={
                              editValues[maintenance.id]?.maintenance_date ||
                              maintenance.maintenance_date
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  maintenance_date: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          maintenance.maintenance_date
                        )}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <input
                            value={
                              editValues[maintenance.id]?.engine_hours ||
                              maintenance.engine_hours
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  engine_hours: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          maintenance.engine_hours
                        )}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <input
                            value={
                              editValues[maintenance.id]?.order_number ||
                              maintenance.order_number
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  order_number: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          maintenance.order_number
                        )}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <input
                            type="date"
                            value={
                              editValues[maintenance.id]?.order_date ||
                              maintenance.order_date
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  order_date: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          maintenance.order_date
                        )}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <input
                            value={
                              editValues[maintenance.id]?.maintenance_company_name ||
                              maintenance.maintenance_company_name
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  maintenance_company_name: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          maintenance.maintenance_company_name
                        )}
                      </td>
                      <td>
                        {maintenance.service_company_name}
                      </td>
                    </tr>
                    {expandedRow === maintenance.id && (
                      <tr>
                        <td colSpan={12}>
                          <div className="maintenance__details-container">
                            <div className="maintenance__cards-container">
                              {["equipment"].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={
                                    type === "equipment" ? "Техника" : ""
                                  }
                                  model={maintenance[`${type}_model_name`]}
                                  serial={maintenance[`${type}_serial`]}
                                  description={
                                    maintenance[`${type}_model_description`] ||
                                    "Отсутствует"
                                  }
                                  isExpanded={
                                    expandedCard === `${type}-${maintenance.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${maintenance.id}`)
                                  }
                                />
                              ))}
                              {["maintenance_type"].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={
                                    type === "maintenance_type" ? "Вид ТО" : ""
                                  }
                                  model={maintenance[`${type}_name`]}
                                  serial={maintenance[`${type}_serial`]}
                                  description={
                                    maintenance[`${type}_description`] ||
                                    "Отсутствует"
                                  }
                                  isExpanded={
                                    expandedCard === `${type}-${maintenance.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${maintenance.id}`)
                                  }
                                />
                              ))}
                              {[
                                "maintenance_date",
                                "engine_hours",
                                "order_number",
                                "order_date",
                                "maintenance_company_name",
                                "service_company_name",
                              ].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={
                                    type === "maintenance_date"
                                      ? "Дата проведения ТО"
                                      : type === "engine_hours"
                                      ? "Наработка, м/час"
                                      : type === "order_number"
                                      ? "№ заказ-наряда"
                                      : type === "order_date"
                                      ? "Дата заказ-наряда"
                                      : type === "maintenance_company_name"
                                      ? "Орг-ция, проводившая ТО"
                                      : "Сервисная компания"
                                  }
                                  model={maintenance[`${type}`]}
                                  serial={""} // не используется в данном случае
                                  description={""}
                                  isExpanded={
                                    expandedCard === `${type}-${maintenance.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${maintenance.id}`)
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
                message={`Вы уверены, что хотите удалить заказ ТО ${deleteMaintenanceId} и все связанные с ней данные?`}
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

export default Maintenance;
