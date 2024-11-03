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
              <span className="detail-card-equipment__model">Модель:</span><div>{model}</div>
              <span className="detail-card-equipment__serial">Зав.№:</span><div>{serial}</div>
              <span className="detail-card-equipment__description">Описание:</span><div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Двигатель" && (
            <>
              <span className="detail-card-equipment__model">Модель:</span><div>{model}</div>
              <span className="detail-card-equipment__serial">Зав.№:</span><div>{serial}</div>
              <span className="detail-card-equipment__description">Описание:</span><div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Трансмиссия" && (
            <>
              <span className="detail-card-equipment__model">Модель:</span><div>{model}</div>
              <span className="detail-card-equipment__serial">Зав.№:</span><div>{serial}</div>
           <span className="detail-card-equipment__description">Описание:</span>   <div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Ведущий мост" && (
            <>
              <span className="detail-card-equipment__model">Модель:</span><div>{model}</div>
              <span className="detail-card-equipment__serial">Зав.№:</span><div>{serial}</div>
              <span className="detail-card-equipment__description">Описание:</span><div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Управляемый мост" && (
            <>
              <span className="detail-card-equipment__model">Модель:</span><div>{model}</div>
              <span className="detail-card-equipment__serial">Зав.№:</span><div>{serial}</div>
              <span className="detail-card-equipment__description">Описание:</span><div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Договор" && (
            <>
              <span className="detail-card-equipment__model">Модель:</span><div>{model}</div>
              <span className="detail-card-equipment__description">Описание:</span><div><LineBreaks text={description} /></div>
            </>
          )}
          {header === "Дата отгрузки" && <div>{model}</div>}
          {header === "Получатель" && <div>{model}</div>}
          {header === "Адрес доставки" && <div>{model}</div>}
          {header === "Опции модели" && <div>{model}</div>}
          {header === "Клиент" && <div>{model}</div>}
          {header === "Сервисная компания" && <div>{model}</div>}
        </div>
      )}
    </div>
  );
};

export default DetailCardEquipment;