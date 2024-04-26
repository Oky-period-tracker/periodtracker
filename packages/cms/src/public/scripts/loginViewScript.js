const dataTables = [
  { 
    tableName: 'encyclopedia',
    filters: [] 
  },
  {
    tableName: 'helpCenters',
    filters: []
  }
]
localStorage.removeItem('dataTableFilter');
localStorage.setItem('dataTableFilter', JSON.stringify(dataTables));