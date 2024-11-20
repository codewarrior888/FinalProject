import React from 'react';

import '../../styles/MaintenanceFilter.scss';

interface MaintenanceFilterProps {
  onFilterChange: (selectedFilters: { [key: string]: string | number | null }) => void;
  filterOptions: {
    equipment_serial: string[];
    maintenance_type_name: string[];
    service_company_name: string[];
  };
}

const MaintenanceFilter: React.FC<MaintenanceFilterProps> = ({ onFilterChange, filterOptions }) => {
  const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>, filterKey: string) => {
    onFilterChange({ [filterKey]: event.target.value === 'all' ? null : event.target.value });
  };

  return (
    <div className="maintenance-filter">
      <label>
        Зав.№ техники:
        <select onChange={(e) => handleFilterSelect(e, 'equipment_serial')}>
          <option value="all">Все</option>
          {filterOptions.equipment_serial.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Вид ТО:
        <select onChange={(e) => handleFilterSelect(e, 'maintenance_type_name')}>
          <option value="all">Все</option>
          {filterOptions.maintenance_type_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Сервисная компания:
        <select onChange={(e) => handleFilterSelect(e, 'service_company_name')}>
          <option value="all">Все</option>
          {filterOptions.service_company_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MaintenanceFilter;