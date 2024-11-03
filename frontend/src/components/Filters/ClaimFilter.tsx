import React from 'react';

import '../../styles/MaintenanceFilter.scss';

interface MaintenanceFilterProps {
  onFilterChange: (selectedFilters: { [key: string]: string | number | null }) => void;
  filterOptions: {
    failure_node_name: string[];
    repair_method_name: string[];
    service_company_name: string[];
  };
}

const MaintenanceFilter: React.FC<MaintenanceFilterProps> = ({ onFilterChange, filterOptions }) => {
  const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>, filterKey: string) => {
    onFilterChange({ [filterKey]: event.target.value === 'all' ? null : event.target.value });
  };

  return (
    <div className="equipment-filter">
      <label>
        Узел отказа:
        <select onChange={(e) => handleFilterSelect(e, 'failure_node_name')}>
          <option value="all">Все</option>
          {filterOptions.failure_node_name.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        Способ восстановления:
        <select onChange={(e) => handleFilterSelect(e, 'repair_method_name')}>
          <option value="all">Все</option>
          {filterOptions.repair_method_name.map((option) => (
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