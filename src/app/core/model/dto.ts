export interface NewDTO {
  id?: string;
}

export interface DTO extends NewDTO {
  id?: string;
}

export interface StoreDto<T extends DTO> extends DTO {
  id: string;
  item?: T;
  isLoading: boolean;
  hasError: boolean;
}
