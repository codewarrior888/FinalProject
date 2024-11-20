import React from 'react';
import LineBreaks from './LineBreaks';
import '../../styles/DetailCardMaintenance.scss';

interface DetailCardMaintenanceProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

const DetailCardMaintenance: React.FC<DetailCardMaintenanceProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
  className
}) => {
  return (
    <div className={`maintenance-detail-card ${isExpanded ? "expanded" : ""} ${className || ""}`} onClick={onClick}>
      <div className={`maintenance-detail-card__header ${isExpanded ? 'expanded' : ''}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="maintenance-detail-card__details">
          {serial && (
            <>
              <span className="maintenance-detail-card__serial">Зав.№:</span>
              <div>{serial}</div>
            </>
          )}
          {header === "Вид ТО" && <div>{model}</div>}
          {description && (
            <>
              <span className="maintenance-detail-card__description">Описание:</span>
              <div>
                <LineBreaks text={description} />
              </div>
            </>
          )}
          {header === "Дата проведения ТО" && <div>{model}</div>}
          {header === "Наработка, м/час" && <div>{model}</div>}
          {header === "№ заказ-наряда" && <div>{model}</div>}
          {header === "Дата заказ-наряда" && <div>{model}</div>}
          {header === "Орг-ция, проводившая ТО" && <div>{model}</div>}
          {header === "Сервисная компания" && <div>{model}</div>}
        </div>
      )}
    </div>
  );
};

export default DetailCardMaintenance;