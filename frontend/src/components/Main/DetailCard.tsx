import React from 'react';
// import ReactMarkdown from 'react-markdown';
import LineBreaks from '../LineBreaks';
import '../../styles/DetailCard.scss';

interface DetailCardProps {
  header: string; // Added header prop
  model: string;
  serial: string;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({
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

export default DetailCard;