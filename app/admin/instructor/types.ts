export interface GenericDataType {
  id: number | null;
  name?: string;
  modules?: any;
}
export type TeacherType = {
  id: number;
  name: string;
  lesson_count?: number;
  maxSlot: number;
  enabled?: boolean;
};
export interface ProgramTimeSlot {
  time_slot_id: number;
}

export interface SelectedDataType {
  classcode_id: number | null;
  period_id: number | null;
  classroom_id: number | null;
  person_limit: number;
  // Diğer alanlar burada tanımlanabilir
}
export interface ScheduleDataType {
  id: number | null;
  time_slot_id: number;
  teachers: { id: number; name: string } | null;
  classrooms: { id: number; name: string } | null;
  classcodes?: { id: number; name: string } | null;
}

export type TeacherCountType = {
  teacher_id: number;
  lesson_count: number;
};

export interface AssignmentRow {
  teacher_id: number;
  teacher_name: string;
  classroom_id: number;
  classroom_name: string;
  time_slot_ids: number[];
}