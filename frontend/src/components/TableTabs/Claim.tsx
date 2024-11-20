import React, { useState, useEffect, useRef } from "react";
import { fetchClaimsData, saveClaimsData, deleteClaim } from "../API/apiService";
import { useReferences } from "../API/ReferenceContext";
import { useAuth } from "../Authenticate/useAuth";
import Table from "react-bootstrap/Table";
import DetailCardClaim from "../DetailCard/DetailCardClaim";
import ClaimFilter from "../Filters/ClaimFilter";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import "../../styles/Claim.scss";

const Claim: React.FC = () => {
  const { userInfo } = useAuth();
  const { equipmentReferenceOptions, userReferenceOptions, fetchReferences } = useReferences();
  const [claimsData, setClaimsData] = useState([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<any | null>(null);
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
  });
  const [editMode, setEditMode] = useState<{ [id: number]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [id: number]: any }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteClaimId, setDeleteClaimId] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState({});
  const [isDimmed, setIsDimmed] = useState(false);

  // Ref to detect clicks outside the expanded details container
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const createFilterOptions = (data) => {
    return {
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

  const storeClaimIds = (data) => {
    const claimIds = data.map((item) => item.id);
      localStorage.setItem("claimIds", JSON.stringify(claimIds));
  };

  const fetchData = async () => {
    try {
      const claimsData = await fetchClaimsData();
      let data = claimsData;
      console.log('claimsData', data)

      data = filterByRole(data, userInfo);

      setClaimsData(data);
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

      storeClaimIds(data);
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
    let updatedData = claimsData;

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

  const handleRowClick = (claim: any) => {
    setExpandedRow((prev) => {
      const newExpandedRow =
        prev === claim.id ? null : claim.id;
      setIsDimmed(newExpandedRow !== null);
      return newExpandedRow;
    });
  };

  const handleCardClick = (claimId: any) => {
    setExpandedCard(expandedCard === claimId ? null : claimId);
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

  const handleClaimRefFields = (
    editedData,
    originalData,
    equipmentReferenceOptions
  ) => {
    const claimsUpdates: Record<string, any> = {};
    const claimRefField = ["repair_method", "failure_node"];

    claimRefField.forEach((field) => {
      const fieldName = `${field}_name`;
      const originalValue = originalData[fieldName];
      const editedValue = editedData[fieldName];

      if (editedValue && editedValue !== originalValue) {
        const selectedOption =
          equipmentReferenceOptions[field]?.find(
            ([, name]) => name === editedValue
          );
        if (selectedOption) {
          claimsUpdates[field] = selectedOption[0]; // Add ID
          claimsUpdates[fieldName] = editedValue; // Add name
        }
      } else {
        // Keep the original values if unchanged
        claimsUpdates[field] = originalData[field];
        claimsUpdates[fieldName] = originalValue;
      }
    });

    return claimsUpdates;
  };

  const handleOtherFields = (editedData, originalData) => {
    const claimsUpdates: Record<string, any> = {};
    const otherFields = ["failure_date", "engine_hours", "failure_node_description", "repair_method_description", "spare_parts", "repair_date"];

    otherFields.forEach((field) => {
      if (field === "failure_date" || field === "repair_date") {
        claimsUpdates[field] = editedData[field] ? formatDateForAPI(editedData[field])
        : formatDateForAPI(originalData[field]);
      } else {
        claimsUpdates[field] = editedData[field] !== undefined ? editedData[field] : originalData[field];
      }
    })

    claimsUpdates["equipment"] = originalData["equipment"];
    claimsUpdates["downtime"] = originalData["downtime"];
    claimsUpdates["service_company"] = originalData["service_company"];

    return claimsUpdates;
  };

  const handleSaveClick = async (id: number) => {
    try {
      const editedData = editValues[id];
      if (!editedData) return;

      const original = originalData[id];
      let claimsUpdates: Record<string, any> = {};

      claimsUpdates = {
        ...claimsUpdates,
        ...handleOtherFields(editedData, original),
      };

      claimsUpdates = {
        ...claimsUpdates,
        ...handleClaimRefFields(editedData, original, equipmentReferenceOptions),
      };

      await saveClaimsData(id, claimsUpdates);

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
        await deleteClaim(deleteClaimId);

        setClaimsData((prev) =>
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
    <div className={`claim ${expandedRow ? "dimmed" : ""}`}>
      <div className="claim__top-section">
        <h2 className="claim__title">Информация о рекламациях Вашей техники</h2>
      </div>
      <div className="maintenance__filter-container">
        <ClaimFilter onFilterChange={handleFilterChange} filterOptions={filterOptions} />
      </div>

      {filteredData.length ? (
        <div className="claim__table-container">
          <div className="claim__table-scroll">
            <Table bordered hover size="sm">
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
                              className="save-button"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
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
                                handleEditClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
                              className="edit-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(claim.id);
                              }}
                              hidden={userInfo?.role === "cl"}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                      <td>{claim.equipment_serial}</td>
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
                            {equipmentReferenceOptions.failure_node.map(([id, name]) => (
                              <option key={id} value={name}>
                                {name}
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
                              editValues[claim.id]?.failure_node_description ||
                              claim.failure_node_description
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [claim.id]: {
                                  ...prev[claim.id],
                                  failure_node_description: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          claim.failure_node_description
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
                            {equipmentReferenceOptions.repair_method.map(
                              ([id, name]) => (
                                <option key={id} value={name}>
                                  {name}
                                </option>
                              )
                            )}
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
                      <td>{claim.service_company_name}</td>
                    </tr>
                    {expandedRow === claim.id && (
                      <tr>
                        <td colSpan={12}>
                          <div className="claim__details-container" ref={detailsRef}>
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
                                  isExpanded={
                                    expandedCard === `${type}-${claim.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${claim.id}`)
                                  }
                                  className={expandedCard === `${type}-${claim.id}` ? "expanded" : ""}
                                />
                              ))}
                              {[
                                "failure_date",
                                "engine_hours",
                                "failure_node_name",
                                "failure_node_description",
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
                                      : "Описание отказа"
                                  }
                                  model={claim[`${type}`]}
                                  serial={""} // не используется в данном контексте
                                  description={""} // не используется в данном контексте
                                  isExpanded={
                                    expandedCard === `${type}-${claim.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${claim.id}`)
                                  }
                                  className={expandedCard === `${type}-${claim.id}` ? "expanded" : ""}
                                />
                              ))}
                              {["repair_method"].map((type) => (
                                <DetailCardClaim
                                  key={type}
                                  header={
                                    type === "repair_method"
                                      ? "Способ восстановления"
                                      : ""
                                  }
                                  model={claim[`${type}_name`]}
                                  serial={""} // не используется в данном контексте
                                  description={
                                    claim[`${type}_description`] ||
                                    "Отсутствует"
                                  }
                                  isExpanded={
                                    expandedCard === `${type}-${claim.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${claim.id}`)
                                  }
                                  className={expandedCard === `${type}-${claim.id}` ? "expanded" : ""}
                                />
                              ))}
                              {[
                                "spare_parts",
                                "repair_date",
                                "downtime",
                                "service_company_name",
                              ].map((type) => (
                                <DetailCardClaim
                                  key={type}
                                  header={
                                    type === "spare_parts"
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
                                  isExpanded={
                                    expandedCard === `${type}-${claim.id}`
                                  }
                                  onClick={() =>
                                    handleCardClick(`${type}-${claim.id}`)
                                  }
                                  className={expandedCard === `${type}-${claim.id}` ? "expanded" : ""}
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
