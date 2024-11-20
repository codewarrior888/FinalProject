import React from "react";
import LineBreaks from "./LineBreaks";
import "../../styles/DetailCardGuest.scss";

interface DetailCardGuestProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

const DetailCardGuest: React.FC<DetailCardGuestProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
  className,
}) => {
  return (
    <div className={`detail-card ${isExpanded ? "expanded" : ""} ${className || ""}`} onClick={onClick}>
      <div className={`detail-card__header ${isExpanded ? "expanded" : ""}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="detail-card__details">
          <div>Модель: {model}</div>
          <div>Зав.№: {serial}</div>
          <LineBreaks text={description} />
        </div>
      )}
    </div>
  );
};

export default DetailCardGuest;
