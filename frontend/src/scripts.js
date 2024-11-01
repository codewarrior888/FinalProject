document.addEventListener("DOMContentLoaded", () => {
    const equipmentData = [
      { modelName: 'Model A', serial: '0017', description: 'High-quality model for all terrains', image: 'path-to-image.jpg' },
      { modelName: 'Model B', serial: '0028', description: 'Durable and reliable engine', image: 'path-to-image2.jpg' },
      // Add more equipment data here
    ];
  
    const cardContainer = document.querySelector('.card-container');
  
    equipmentData.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.style.backgroundImage = `url(${item.image})`;
      card.innerHTML = `
        <h3>${item.modelName}</h3>
        <p>Serial: ${item.serial}</p>
        <p>${item.description}</p>
      `;
  
      card.addEventListener('click', () => {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
  
      cardContainer.appendChild(card);
    });
  });