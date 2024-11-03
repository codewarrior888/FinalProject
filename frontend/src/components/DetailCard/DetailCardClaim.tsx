import React from 'react';
import LineBreaks from '../LineBreaks';
import '../../styles/DetailCardClaim.scss';

interface DetailCardClaimProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
}

const DetailCardClaim: React.FC<DetailCardClaimProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
}) => {
  return (
    <div className={`detail-card-claim ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className={`detail-card-claim__header ${isExpanded ? 'expanded' : ''}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="detail-card-claim__details">
          {header === "Техника" && (
            <>
              <span className="detail-card-claim__model">Модель:</span><div>{model}</div>
              <span className="detail-card-claim__serial">Зав.№:</span><div>{serial}</div>
              <span className="detail-card-claim__description">Описание:</span><div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Дата отказа" && <div>{model}</div>}
          {header === "Наработка, м/час" && <div>{model}</div>}
          {header === "Узел отказа" && <div>{model}</div>}
          {header === "Описание отказа" && <div>{model}</div>}
          {header === "Способ восстановления" && <div>{model}</div>}
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