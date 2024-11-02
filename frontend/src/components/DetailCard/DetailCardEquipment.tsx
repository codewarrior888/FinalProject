import React from 'react';
import LineBreaks from '../LineBreaks';
import '../../styles/DetailCardEquipment.scss';

interface DetailCardEquipmentProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
}

const DetailCardEquipment: React.FC<DetailCardEquipmentProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
}) => {
  return (
    <div className={`detail-card-equipment ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className={`detail-card-equipment__header ${isExpanded ? 'expanded' : ''}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="detail-card-equipment__details">
          {header === "Техника" && (
            <>
              <p>Модель: {model}</p>
              <p>Зав.№: {serial}</p>
              <LineBreaks text={description} />
            </>
          )}
          {header === "Двигатель" && (
            <>
              <p>Модель: {model}</p>
              <p>Зав.№: {serial}</p>
              <LineBreaks text={description} />
            </>
          )}
          {header === "Трансмиссия" && (
            <>
              <p>Модель: {model}</p>
              <p>Зав.№: {serial}</p>
              <LineBreaks text={description} />
            </>
          )}
          {header === "Ведущий мост" && (
            <>
              <p>Модель: {model}</p>
              <p>Зав.№: {serial}</p>
              <LineBreaks text={description} />
            </>
          )}
          {header === "Управляемый мост" && (
            <>
              <p>Модель: {model}</p>
              <p>Зав.№: {serial}</p>
              <LineBreaks text={description} />
            </>
          )}
          {header === "Договор" && (
            <>
              <p>{model}</p>
              <LineBreaks text={description} />
            </>
          )}
          {header === "Дата отгрузки" && <p>{model}</p>}
          {header === "Получатель" && <p>{model}</p>}
          {header === "Адрес доставки" && <p>{model}</p>}
          {header === "Опции модели" && <p>{model}</p>}
          {header === "Сервисная компания" && <p>{model}</p>}
        </div>
      )}
    </div>
  );
};

export default DetailCardEquipment;