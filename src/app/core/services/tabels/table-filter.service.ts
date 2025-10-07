import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  applyFilters<T>(
    items: T[],
    filters: {
      statusFilter?: { field: string; value: any },
      searchFilter?: { fields: string[]; value: string },
      sort?: { field: string; order: number }
    }
  ): T[] {
    let filtered = [...items];

    // Apply status filter if provided
    if (filters.statusFilter) {
      filtered = filtered.filter(item => 
        (item as any)[filters.statusFilter!.field] == filters.statusFilter!.value
      );
    }

    // Apply search filter if provided
    if (filters.searchFilter && filters.searchFilter.value) {
      const searchValue = filters.searchFilter.value.toLowerCase();
      filtered = filtered.filter(item => 
        filters.searchFilter!.fields.some(field => 
          String((item as any)[field]).toLowerCase().includes(searchValue)
        )
      );
    }

    // Apply sorting if provided
    if (filters.sort) {
      filtered.sort((a, b) => this.compareValues(a, b, filters.sort!.field, filters.sort!.order));
    }

    return filtered;
  }

  private compareValues(a: any, b: any, field: string, order: number): number {
    let valueA = this.getFieldValue(a, field);
    let valueB = this.getFieldValue(b, field);

    if (valueA === null || valueA === undefined) return order * -1;
    if (valueB === null || valueB === undefined) return order * 1;

    if (valueA < valueB) return order * -1;
    if (valueA > valueB) return order * 1;
    return 0;
  }

  private getFieldValue(item: any, field: string): any {
    if (field === 'created_at' || field === 'updated_at') {
      return new Date(item[field]);
    }
    return item[field];
  }
}