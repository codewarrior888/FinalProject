import React from "react";
import LineBreaks from "./LineBreaks";
import "../../styles/DetailCardEquipment.scss";

interface DetailCardEquipmentProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

// Configuration object for card types
const CARD_CONFIGS = {
  EQUIPMENT_TYPE: [
    "Техника",
    "Двигатель",
    "Трансмиссия",
    "Ведущий мост",
    "Управляемый мост",
  ],
  INFO_TYPE: [
    "Договор поставки №, дата",
    "Дата отгрузки",
    "Грузополучатель",
    "Адрес поставки",
    "Комплектация",
    "Клиент",
    "Сервисная компания",
  ],
};

const DetailCardEquipment: React.FC<DetailCardEquipmentProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
  className,
}) => {
  const isEquipmentType = CARD_CONFIGS.EQUIPMENT_TYPE.includes(header);

  const renderContent = () => {
    if (!isExpanded) return null;

    if (isEquipmentType) {
      return (
        <>
          <span className="equipment-detail-card__model">Модель:</span>
          <div>{model}</div>
          <span className="equipment-detail-card__serial">Зав.№:</span>
          <div>{serial}</div>
          <span className="equipment-detail-card__description">Описание:</span>
          <div>
            <LineBreaks text={description} />
          </div>
        </>
      );
    }

    return <div>{model}</div>;
  };

  return (
    <div className={`equipment-detail-card ${isExpanded ? "expanded" : ""} ${className || ""}`} onClick={onClick}>
      <div className={`equipment-detail-card__header ${isExpanded ? "expanded" : ""}`}>
        {header}
      </div>
      <div className="equipment-detail-card__details">{renderContent()}</div>
    </div>
  );
};

export default DetailCardEquipment;
