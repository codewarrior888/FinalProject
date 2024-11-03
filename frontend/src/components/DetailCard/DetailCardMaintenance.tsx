import React from 'react';
import LineBreaks from '../LineBreaks';
import '../../styles/DetailCardMaintenance.scss';

interface DetailCardMaintenanceProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
}

const DetailCardMaintenance: React.FC<DetailCardMaintenanceProps> = ({
  header,
  model,
  serial,
  description,
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
          <span className="detail-card-maintenance__model">Модель:</span>
          <div>{model}</div>
          {serial && (
            <>
              <span className="detail-card-maintenance__serial">Зав.№:</span>
              <div>{serial}</div>
            </>
          )}
          {description && (
            <>
              <span className="detail-card-maintenance__description">Описание:</span>
              <div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Вид ТО" && <div>{model}</div>}
          {header === "Дата проведения ТО" && <div>{model}</div>}
          {header === "Наработка, м/час" && <div>{model}</div>}
          {header === "Дата заказ-наряда" && <div>{model}</div>}
          {header === "Сервисная компания" && <div>{model}</div>}
        </div>
      )}
    </div>
  );
};

export default DetailCardMaintenance;