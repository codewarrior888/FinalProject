import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { useAuth } from "../Authenticate/useAuth";
import Table from "react-bootstrap/Table";
import DetailCardMaintenance from "../DetailCard/DetailCardMaintenance";
import MaintenanceFilter from "../Filters/MaintenanceFilter";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import "../../styles/Maintenance.scss";

const Maintenance: React.FC = () => {
  const { userInfo } = useAuth();
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    maintenance_type_name: [],
    service_company_name: [],
    equipment_serial: [],
  });
  const [referenceOptions, setReferenceOptions] = useState({
    maintenance_type_name: [],
  })
  const [editMode, setEditMode] = useState<{ [id: number]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [id: number]: any }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteMaintenanceId, setDeleteMaintenanceId] = useState<
    number | null
  >(null);

  const fetchData = async () => {
    try {
      // Fetch maintenance data
      const response = await axios.get(`${API_URL}/api/maintenance/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      let data = response.data;

      setMaintenanceData(data);
      setFilteredData(data);

      // Calculate unique filter options
      const options = {
        equipment_serial: Array.from(
          new Set(data.map((item) => item.equipment_serial))
        ),
        maintenance_type_name: Array.from(
          new Set(data.map((item) => item.maintenance_type_name))
        ),
        service_company_name: Array.from(
          new Set(data.map((item) => item.service_company_name))
        ),
      };
      setFilterOptions(options);

      const maintenanceIds = data.map((item) => item.id);
      localStorage.setItem("maintenanceIds", JSON.stringify(maintenanceIds));

    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  const fetchReferences = async () => {
    try {
      const referenceResponse = await axios.get(`${API_URL}/api/references/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      const maintenanceTypeOptions = referenceResponse.data
        .filter((item) => item.category === "mt")
        .map((item) => item.name);
  
      setReferenceOptions({
        maintenance_type_name: maintenanceTypeOptions,
      });
  
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchReferences();
  }, [userInfo]);

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
    setExpandedRow(
      expandedRow === maintenance.equipment_serial
        ? null
        : maintenance.equipment_serial
    );
  };

  const handleCardClick = (maintenanceId: number) => {
    setExpandedCard(expandedCard === maintenanceId ? null : maintenanceId);
  };

  const handleEditClick = (id: number) => {
    const selectedItem = filteredData.find(
      (item) => item.id === id
    );
    if (selectedItem) {
      setEditValues((prev) => ({
        ...prev,
        [id]: {
          ...selectedItem,
          maintenance_type: selectedItem.maintenance_type,
          service_company: selectedItem.service_company,
        },
      }));
      setEditMode((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleSaveClick = async (id: number) => {
    try {
      const editedData = editValues[id];
      if (!editedData) return;

      const selectedServiceCompanyName = editValues[id].service_company_name;
      const selectedMaintenanceTypeName = editValues[id].maintenance_type_name;

      const service_company = maintenanceData.find(
        (item) => item.service_company_name === selectedServiceCompanyName
      )?.service_company;

      const maintenance_type = maintenanceData.find(
        (item) => item.maintenance_type_name === selectedMaintenanceTypeName
      )?.maintenance_type;

      const maintenanceUpdates = {
        ...editedData,
        service_company,
        service_company_name: selectedServiceCompanyName,
        maintenance_type,
        maintenance_type_name: selectedMaintenanceTypeName,
      };

      await axios.put(
        `${API_URL}/api/maintenance/${id}/`,
        maintenanceUpdates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
        await axios.delete(
          `${API_URL}/api/maintenance/${deleteMaintenanceId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
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
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Зав.№ техники</th>
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
                      <td>
                        {editMode[maintenance.id] ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveClick(maintenance.id);
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(maintenance.id);
                              }}
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
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(maintenance.id);
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        {editMode[maintenance.id] ? (
                          <select
                            value={
                              editValues[maintenance.id]
                                ?.equipment_serial ||
                              maintenance.equipment_serial
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  equipment_serial: e.target.value,
                                },
                              }))
                            }
                          >
                            {filterOptions.equipment_serial.map(
                              (modelName) => (
                                <option key={modelName} value={modelName}>
                                  {modelName}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          maintenance.equipment_serial
                        )}
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
                            {referenceOptions.maintenance_type_name.map(
                              (maintenanceTypeName) => (
                                <option key={maintenanceTypeName} value={maintenanceTypeName}>
                                  {maintenanceTypeName}
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
                              editValues[maintenance.id]
                                ?.maintenance_date ||
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
                              editValues[maintenance.id]
                                ?.engine_hours || maintenance.engine_hours
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
                              editValues[maintenance.id]
                                ?.order_number || maintenance.order_number
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
                              editValues[maintenance.id]
                                ?.order_date || maintenance.order_date
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
                          <select
                            value={
                              editValues[maintenance.id]
                                ?.service_company_name ||
                              maintenance.service_company_name
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [maintenance.id]: {
                                  ...prev[maintenance.id],
                                  service_company_name: e.target.value,
                                },
                              }))
                            }
                          >
                            {filterOptions.service_company_name.map(
                              (modelName) => (
                                <option key={modelName} value={modelName}>
                                  {modelName}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          maintenance.service_company_name
                        )}
                      </td>
                    </tr>
                    {expandedRow === maintenance.equipment_serial && (
                      <tr>
                        <td colSpan={12}>
                          <div className="maintenance__details-container">
                            <div className="maintenance__cards-container">
                              {["equipment"].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={
                                    type === "equipment" ? "Техника" : "Вид ТО"
                                  }
                                  model={maintenance[`${type}_model_name`]}
                                  serial={maintenance[`${type}_serial`]}
                                  isExpanded={
                                    expandedCard ===
                                    maintenance.id
                                  }
                                  onClick={() =>
                                    handleCardClick(
                                      maintenance.id
                                    )
                                  }
                                />
                              ))}
                              {[
                                "maintenance_type_name",
                                "maintenance_date",
                                "engine_hours",
                                "order_number",
                                "order_date",
                                "service_company_name",
                              ].map((type) => (
                                <DetailCardMaintenance
                                  key={type}
                                  header={
                                    type === "maintenance_type_name"
                                      ? "Вид ТО"
                                      : type === "maintenance_date"
                                      ? "Дата проведения ТО"
                                      : type === "engine_hours"
                                      ? "Наработка, м/час"
                                      : type === "order_number"
                                      ? "№ заказ-наряда"
                                      : type === "order_date"
                                      ? "Дата заказ-наряда"
                                      : "Сервисная компания"
                                  }
                                  model={maintenance[`${type}`]}
                                  serial={""} // не используется в данном случае
                                  isExpanded={
                                    expandedCard ===
                                    maintenance.id
                                  }
                                  onClick={() =>
                                    handleCardClick(
                                      maintenance.id
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
