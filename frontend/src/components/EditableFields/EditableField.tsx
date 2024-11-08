import React from 'react';

interface EditableFieldProps {
  isEditing: boolean;
  fieldName: string;
  fieldValue: string;
  serialValue?: string;
  onChange: (field: string, value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ isEditing, fieldName, fieldValue, serialValue, onChange }) => {
  if (isEditing) {
    return (
      <>
        <input
          value={fieldValue}
          onChange={(e) => onChange(fieldName, e.target.value)}
        />
        {serialValue !== undefined && (
          <input
            value={serialValue}
            onChange={(e) => onChange(`${fieldName}_serial`, e.target.value)}
          />
        )}
      </>
    );
  }
  return <>{serialValue !== undefined ? `${fieldValue} / ${serialValue}` : fieldValue}</>;
};

export default EditableField;