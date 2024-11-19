import React from "react";

const EquipmentTableRow: React.FC<{
  equipment: any;
  editMode: boolean;
  editValues: any;
  setEditMode: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  setEditValues: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  onSaveClick: (serial: string) => void;
  onDeleteClick: () => void;
  onRowExpand: (serial: string | null) => void;
  expanded: boolean;
}> = ({
  equipment,
  editMode,
  editValues,
  setEditMode,
  setEditValues,
  onSaveClick,
  onDeleteClick,
  onRowExpand,
  expanded,
}) => {
  const { serial, model_name, client_name, service_company_name } = equipment;

  return (
    <>
      <tr>
        <td>{serial}</td>
        <td>
          {editMode ? (
            <input
              type="text"
              value={editValues?.model_name || model_name}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [serial]: { ...prev[serial], model_name: e.target.value },
                }))
              }
            />
          ) : (
            model_name
          )}
        </td>
        <td>{client_name}</td>
        <td>{service_company_name}</td>
        <td>
          {editMode ? (
            <button onClick={() => onSaveClick(serial)}>Save</button>
          ) : (
            <>
              <button onClick={() => setEditMode((prev) => ({ ...prev, [serial]: true }))}>Edit</button>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={() => onRowExpand(expanded ? null : serial)}>
                {expanded ? "Collapse" : "Expand"}
              </button>
            </>
          )}
        </td>
      </tr>
    </>
  );
};

export default EquipmentTableRow;