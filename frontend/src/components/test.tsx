// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch maintenance data
//         const response = await axios.get(`${API_URL}/api/maintenance/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         });
//         let data = response.data;
  
//         const equipmentSerials = JSON.parse(localStorage.getItem('equipmentSerials') || '[]');
  
//         // Filter maintenance data based on equipment_serials
//         data = data.filter((item) => equipmentSerials.includes(item.equipment_serial));
  
//         setMaintenanceData(data);
//         setFilteredData(data);
  
//           // Calculate unique filter options
//           const options = {
//             maintenance_type_name: Array.from(new Set(data.map(item => item.maintenance_type_name))),
//             service_company_name: Array.from(new Set(data.map(item => item.service_company_name))),
//             equipment_serial: Array.from(new Set(data.map(item => item.equipment_serial))),
//           };
//           setFilterOptions(options);
          
//         } catch (error) {
//           console.error('Ошибка при получении данных:', error);
//         }
//       };
//       fetchData();
//     }, [userInfo]);
  
//     // Handle filter changes
//     const handleFilterChange = (selectedFilters: { [key: string]: string | number | null }) => {
//       let updatedData = maintenanceData;
  
//       Object.keys(selectedFilters).forEach((filterKey) => {
//         const filterValue = selectedFilters[filterKey];
//         if (filterValue && filterValue !== 'all') {
//           updatedData = updatedData.filter((item) => item[filterKey] === filterValue);
//         }
//       });
  
//       setFilteredData(updatedData);
//     };