import React from 'react';
import SwaggerUI from 'swagger-ui-react';

import '../../styles/OpenAPI.scss';

const OpenAPI: React.FC = () => {
  const swaggerUrl = 'http://localhost:8000/api/schema/';

  return (
    <div className="openapi-title">
      <h1>API Документация</h1>
      <SwaggerUI url={swaggerUrl} />
    </div>
  );
};

export default OpenAPI;
