
export class PageRequest<T> {
  page: number;
  order?: string;
  desc?: boolean;
  model:T;
  pageNumber?: number;
}

