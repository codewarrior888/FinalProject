import React from 'react';
import LineBreaks from './LineBreaks';
import '../../styles/DetailCardClaim.scss';

interface DetailCardClaimProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

const DetailCardClaim: React.FC<DetailCardClaimProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
  className
}) => {
  return (
    <div className={`claim-detail-card ${isExpanded ? "expanded" : ""} ${className || ""}`} onClick={onClick}>
      <div className={`claim-detail-card__header ${isExpanded ? 'expanded' : ''}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="claim-detail-card__details">
          {serial && (
            <>
              <span className="claim-detail-card__serial">Зав.№:</span>
              <div>{serial}</div>
            </>
          )}
          {header === "Дата отказа" && <div>{model}</div>}
          {header === "Наработка, м/час" && <div>{model}</div>}
          {header === "Узел отказа" && <div>{model}</div>}
          {header === "Описание отказа" && <div>{model}</div>}
          {header === "Способ восстановления" && <div>{model}</div>}
          {description && (
            <>
              <span className="claim-detail-card__description">Описание:</span>
              <div>
                <LineBreaks text={description} />
              </div>
            </>
          )}
          {header === "Используемые запчасти" && <div>{model}</div>}
          {header === "Дата восстановления" && <div>{model}</div>}
          {header === "Время простоя техники" && <div>{model}</div>}
          {header === "Сервисная компания" && <div>{model}</div>}
        </div>
      )}
    </div>
  );
};

export default DetailCardClaim;