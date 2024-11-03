import React from 'react';

import '../../styles/EquipmentFilter.scss';

interface EquipmentFilterProps {
  onFilterChange: (selectedFilters: { [key: string]: string | number | null }) => void;
  filterOptions: {
    equipment_model_name: string[];
    engine_model_name: string[];
    transmission_model_name: string[];
    drive_axle_model_name: string[];
    steer_axle_model_name: string[];
  };
}

const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ onFilterChange, filterOptions }) => {
  const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>, filterKey: string) => {
    onFilterChange({ [filterKey]: event.target.value === 'all' ? null : event.target.value });
  };

  return (
    <div className="equipment-filter">
      <label>
        Техника:
        <select onChange={(e) => handleFilterSelect(e, 'equipment_model_name')}>
          <option value="all">Все</option>
          {filterOptions.equipment_model_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Двигатель:
        <select onChange={(e) => handleFilterSelect(e, 'engine_model_name')}>
          <option value="all">Все</option>
          {filterOptions.engine_model_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Трансмиссия:
        <select onChange={(e) => handleFilterSelect(e, 'transmission_model_name')}>
          <option value="all">Все</option>
          {filterOptions.transmission_model_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Ведущий мост:
        <select onChange={(e) => handleFilterSelect(e, 'drive_axle_model_name')}>
          <option value="all">Все</option>
          {filterOptions.drive_axle_model_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Управляемый мост:
        <select onChange={(e) => handleFilterSelect(e, 'steer_axle_model_name')}>
          <option value="all">Все</option>
          {filterOptions.steer_axle_model_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default EquipmentFilter;