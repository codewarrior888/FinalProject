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
}) => {
  const isEquipmentType = CARD_CONFIGS.EQUIPMENT_TYPE.includes(header);

  const renderContent = () => {
    if (!isExpanded) return null;

    if (isEquipmentType) {
      return (
        <>
          <span className="detail-card__model">Модель:</span>
          <div>{model}</div>
          <span className="detail-card__serial">Зав.№:</span>
          <div>{serial}</div>
          <span className="detail-card__description">Описание:</span>
          <div>
            <LineBreaks text={description} />
          </div>
        </>
      );
    }

    return <div>{model}</div>;
  };

  return (
    <div
      className={`detail-card ${isExpanded ? "expanded" : ""}`}
      onClick={onClick}
    >
      <div className={`detail-card__header ${isExpanded ? "expanded" : ""}`}>
        {header}
      </div>
      <div className="detail-card__details">{renderContent()}</div>
    </div>
  );
};

export default DetailCardEquipment;
