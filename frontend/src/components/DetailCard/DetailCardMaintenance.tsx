import React from 'react';
import '../../styles/DetailCardMaintenance.scss';

interface DetailCardMaintenanceProps {
  header: string;
  model: string;
  serial: string;
  isExpanded: boolean;
  onClick: () => void;
}

const DetailCardMaintenance: React.FC<DetailCardMaintenanceProps> = ({
  header,
  model,
  serial,
  isExpanded,
  onClick,
}) => {
  return (
    <div className={`detail-card-maintenance ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className={`detail-card-maintenance__header ${isExpanded ? 'expanded' : ''}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="detail-card-maintenance__details">
          {serial && (
            <>
              <span className="detail-card-maintenance__serial">Зав.№:</span>
              <div>{serial}</div>
            </>
          )}
          {header === "Вид ТО" && <div>{model}</div>}
          {header === "Дата проведения ТО" && <div>{model}</div>}
          {header === "Наработка, м/час" && <div>{model}</div>}
          {header === "№ заказ-наряда" && <div>{model}</div>}
          {header === "Дата заказ-наряда" && <div>{model}</div>}
          {header === "Сервисная компания" && <div>{model}</div>}
        </div>
      )}
    </div>
  );
};

export default DetailCardMaintenance;