import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableConfigService {
  getDefaultConfig() {
    return {
      paginationOptions: [10, 25, 50, 100],
      statusOptions: [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' }
      ],
      defaultFilterState: {
        status: { field: 'active_status', value: null },
        search: { value: '' },
        sort: { field: null, order: 1 }
      }
    };
  }

  getColumnConfig(entityType: string) {
    const configs: Record<string, any> = {
      sliders: {
        columns: [
          { field: 'id', header: 'ID', sortable: true, width: '10%' },
          { field: 'image', header: 'Image', sortable: false, width: '15%' },
          { field: 'en_title', header: 'English Title', sortable: true, width: '20%' },
          { field: 'created_at', header: 'Created', sortable: true, width: '20%' },
          { field: 'active_status', header: 'Status', sortable: false, width: '15%' },
          { field: 'actions', header: 'Actions', sortable: false, width: '20%' }
        ],
        searchFields: ['id', 'en_title', 'image', 'created_at']
      }
    };

    return configs[entityType] || configs['sliders'];
  }
}