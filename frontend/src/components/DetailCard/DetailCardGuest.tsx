import React from 'react';
import LineBreaks from '../LineBreaks';
import '../../styles/DetailCardGuest.scss';

interface DetailCardGuestProps {
  header: string;
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
}

const DetailCardGuest: React.FC<DetailCardGuestProps> = ({
  header,
  model,
  serial,
  description,
  isExpanded,
  onClick,
}) => {
  return (
    <div className={`detail-card ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className={`detail-card__header ${isExpanded ? 'expanded' : ''}`}>
        {header}
      </div>
      {isExpanded && (
        <div className="detail-card__details">
          <p>Модель: {model}</p>
          <p>Зав.№: {serial}</p>
          <LineBreaks text={description} />
        </div>
      )}
    </div>
  );
};

export default DetailCardGuest;