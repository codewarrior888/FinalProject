import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { useAuth } from "../Authenticate/useAuth";
import Table from "react-bootstrap/Table";
import DetailCardClaim from "../DetailCard/DetailCardClaim";
import ClaimFilter from "../Filters/ClaimFilter";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import "../../styles/Claim.scss";

const Claim: React.FC = () => {
  const { userInfo } = useAuth();
  const [claimData, setClaimData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    failure_node_name: [],
    repair_method_name: [],
    service_company_name: [],
    equipment_serial: [],
  });
  const [referenceOptions, setReferenceOptions] = useState({
    failure_node_name: [],
    repair_method_name: [],
  })
  const [editMode, setEditMode] = useState<{ [id: number]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [id: number]: any }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteClaimId, setDeleteClaimId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/claims/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      let data = response.data;

      const equipmentSerials = JSON.parse(localStorage.getItem("equipmentSerials")) || [];

        // Apply filtering based on the user's role
      if (userInfo?.role === "cl") {
        data = data.filter((item) => equipmentSerials.includes(item.equipment_serial));
      } else if (userInfo?.role === "sc") {
        // Optionally filter for service company if needed
        data = data.filter((item) => equipmentSerials.includes(item.equipment_serial));
      }

      setClaimData(data);
      setFilteredData(data);

      // Calculate unique filter options
      setFilterOptions({
        failure_node_name: Array.from(
          new Set(data.map((item) => item.failure_node_name))
        ),
        repair_method_name: Array.from(
          new Set(data.map((item) => item.repair_method_name))
        ),
        service_company_name: Array.from(
          new Set(data.map((item) => item.service_company_name))
        ),
        equipment_serial: Array.from(
          new Set(data.map((item) => item.equipment_serial))
        ),
      });

      const claimIds = data.map((item) => item.id);
      localStorage.setItem("claimIds", JSON.stringify(claimIds));

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
  
      const failureNodeOptions = referenceResponse.data
        .filter((item) => item.category === "fn")
        .map((item) => item.name);
  
      const repairMethodOptions = referenceResponse.data
        .filter((item) => item.category === "rm")
        .map((item) => item.name);
  
      setReferenceOptions({
        failure_node_name: failureNodeOptions,
        repair_method_name: repairMethodOptions,
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
    let updatedData = claimData;

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

  const handleRowClick = (claim: any) => {
    setExpandedRow(
      expandedRow === claim.equipment_serial ? null : claim.equipment_serial
    );
  };

  const handleCardClick = (claimId: number) => {
    setExpandedCard(expandedCard === claimId ? null : claimId);
  };

  const handleEditClick = (id: number) => {
    const selectedItem = filteredData.find((item) => item.id === id);
    if (selectedItem) {
      setEditValues((prev) => ({
        ...prev,
        [id]: {
          ...selectedItem,
          repair_method: selectedItem.repair_method,
          failure_node: selectedItem.failure_node,
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
      const selectEquipmentSerial = editValues[id].equipment_serial;
      const selectedRepairMethodName = editValues[id].repair_method_name;
      const selectedFailureNodeName = editValues[id].failure_node_name;

      const service_company = claimData.find(
        (item) => item.service_company_name === selectedServiceCompanyName
      )?.service_company;

      const equipment_serial = claimData.find(
        (item) => item.equipment_serial === selectEquipmentSerial
      )?.equipment_serial;

      const repair_method = claimData.find(
        (item) => item.repair_method_name === selectedRepairMethodName
      )?.repair_method;

      const failure_node = claimData.find(
        (item) => item.failure_node_name === selectedFailureNodeName
      )?.failure_node;

      const claimUpdates = {
        ...editedData,
        service_company,
        service_company_name: selectedServiceCompanyName,
        equipment_serial,
        repair_method,
        repair_method_name: selectedRepairMethodName,
        failure_node,
        failure_node_name: selectedFailureNodeName,
      };

      await axios.put(`${API_URL}/api/claims/${id}/`, claimUpdates, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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
    setDeleteClaimId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteClaimId) {
      try {
        await axios.delete(`${API_URL}/api/claims/${deleteClaimId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setClaimData((prev) =>
          prev.filter((item) => item.id !== deleteClaimId)
        );
        setFilteredData((prev) =>
          prev.filter((item) => item.id !== deleteClaimId)
        );
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      } finally {
        setShowConfirm(false);
        setDeleteClaimId(null);
      }
    }
  };

  return (
    <div className="claim">
      <h2 className="claim__title">Информация о рекламациях Вашей техники</h2>

      <ClaimFilter
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
      />

      {filteredData.length ? (
        <div className="claim__table-container">
          <div className="claim__table-scroll">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Зав.№ техники</th>
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
                      <td>
                        {editMode[claim.id] ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <select
                            value={
                              editValues[claim.id]?.equipment_serial ||
                              claim.equipment_serial
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  equipment_serial: e.target.value,
                                },
                              }))
                            }
                          >
                            {filterOptions.equipment_serial.map((serial) => (
                              <option key={serial} value={serial}>
                                {serial}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <>{claim.equipment_serial}</>
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <input
                            type="date"
                            value={
                              editValues[claim.id]?.failure_date ||
                              claim.failure_date
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  failure_date: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          claim.failure_date
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <input
                            value={
                              editValues[claim.id]?.engine_hours ||
                              claim.engine_hours
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  engine_hours: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          claim.engine_hours
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <select
                            value={
                              editValues[claim.id]?.failure_node_name ||
                              claim.failure_node_name
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  failure_node_name: e.target.value,
                                },
                              }))
                            }
                          >
                            {referenceOptions.failure_node_name.map((node) => (
                              <option key={node} value={node}>
                                {node}
                              </option>
                            ))}
                          </select>
                        ) : (
                          claim.failure_node_name
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <input
                            value={
                              editValues[claim.id]?.failure_description ||
                              claim.failure_description
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  failure_description: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          claim.failure_description
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <select
                            value={
                              editValues[claim.id]?.repair_method_name ||
                              claim.repair_method_name
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  repair_method_name: e.target.value,
                                },
                              }))
                            }
                          >
                            {referenceOptions.repair_method_name.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </select>
                        ) : (
                          claim.repair_method_name
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <input
                            value={
                              editValues[claim.id]?.spare_parts ||
                              claim.spare_parts
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  spare_parts: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          claim.spare_parts
                        )}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <input
                            type="date"
                            value={
                              editValues[claim.id]?.repair_date ||
                              claim.repair_date
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  repair_date: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          claim.repair_date
                        )}
                      </td>
                      <td>
                        {claim.downtime} {/* рассчитывается автоматически */}
                      </td>
                      <td>
                        {editMode[claim.id] ? (
                          <select
                            value={
                              editValues[claim.id]?.service_company_name ||
                              claim.service_company_name
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  service_company_name: e.target.value,
                                },
                              }))
                            }
                          >
                            {filterOptions.service_company_name.map(
                              (company) => (
                                <option key={company} value={company}>
                                  {company}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          claim.service_company_name
                        )}
                      </td>
                    </tr>
                    {expandedRow === claim.equipment_serial && (
                      <tr>
                        <td colSpan={12}>
                          <div className="claim__details-container">
                            <div className="claim__cards-container">
                              {["equipment"].map((type) => (
                                <DetailCardClaim
                                  key={type}
                                  header={
                                    type === "equipment" ? "Техника" : "нд."
                                  }
                                  model={claim[`${type}_model_name`]}
                                  serial={claim[`${type}_serial`]}
                                  description={
                                    claim[`${type}_model_description`] ||
                                    "Отсутствует"
                                  }
                                  isExpanded={expandedCard === claim.id}
                                  onClick={() => handleCardClick(claim.id)}
                                />
                              ))}
                              {[
                                "failure_date",
                                "engine_hours",
                                "failure_node_name",
                                "failure_description",
                                "repair_method_name",
                                "spare_parts",
                                "repair_date",
                                "downtime",
                                "service_company_name",
                              ].map((type) => (
                                <DetailCardClaim
                                  key={type}
                                  header={
                                    type === "failure_date"
                                      ? "Дата отказа"
                                      : type === "engine_hours"
                                      ? "Наработка, м/час"
                                      : type === "failure_node_name"
                                      ? "Узел отказа"
                                      : type === "failure_description"
                                      ? "Описание отказа"
                                      : type === "repair_method_name"
                                      ? "Способ восстановления"
                                      : type === "spare_parts"
                                      ? "Используемые запчасти"
                                      : type === "repair_date"
                                      ? "Дата восстановления"
                                      : type === "downtime"
                                      ? "Время простоя техники"
                                      : "Сервисная компания"
                                  }
                                  model={claim[`${type}`]}
                                  serial={""} // не используется в данном контексте
                                  description={""} // не используется в данном контексте
                                  isExpanded={expandedCard === claim.id}
                                  onClick={() => handleCardClick(claim.id)}
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
                message={`Вы уверены, что хотите удалить Рекламацию ${deleteClaimId} и все связанные с ней данные?`}
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

export default Claim;
