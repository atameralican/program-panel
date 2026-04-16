import { AssignmentRow, ScheduleDataType, TeacherType } from "./types";


///////// ---- TYPE REVIZE ------ ///////
/** AssignmentRow[] → WeeklySchedulePicker'ın beklediği ScheduleDataType[]e göre tip düzenlemesi */
export function toPreviewSchedule(rows: AssignmentRow[]): ScheduleDataType[] {
  return rows.flatMap((row) =>
    row.time_slot_ids.map((slotId) => ({
      id: null,
      time_slot_id: slotId,
      teachers: { id: row.teacher_id, name: row.teacher_name },
      classrooms: { id: row.classroom_id, name: row.classroom_name },
    })),
  );
}



///////// ---- TEACHER ASSİGN FUNCTION FOR FREE SLOT ------ ///////
/**
 * Öğretmen atama preview işlemleri için teacherState, newTimeSlotList, selectedData.classroom_id, classroomName geliyor bunlarla atama işlemi yapıyor. gruplar oluşturuyor slotlara aktarılıyor. 
 * Grup yapılmasısının sebebi ard ardın timeslotidleri ardışıklığına bağlı gruplanıyor. bir sonraki ardışık gruba baska hoca atanıyor. eğer o ardışığın müsaitlğine uymuyorsa hoca bos slotu o zamankalanları atıyor. 
*/
function groupConsecutiveSlots(slots: number[]): number[][] {
  if (slots.length === 0) return [];

  const groups: number[][] = [];
  let currentGroup = [slots[0]];

  for (let i = 1; i < slots.length; i++) {
    if (slots[i] === slots[i - 1] + 1) {
      currentGroup.push(slots[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [slots[i]];
    }
  }

  groups.push(currentGroup);
  return groups;
}
export function buildAssignmentBalanced(
  teachers: TeacherType[],
  availableSlots: number[],
  classroomId: number,
  classroomName: string,
): AssignmentRow[] {
  const activeTeachers = teachers
    .filter((t) => t.enabled && t.maxSlot > 0)
    .map((t) => ({
      ...t,
      remaining: t.maxSlot,
      slots: [] as number[],
    }));

  if (activeTeachers.length === 0) return [];

  const groups = groupConsecutiveSlots(availableSlots);

  let teacherIndex = 0;

  for (const group of groups) {
    let assigned = false;

    // sıradaki hocadan başlayarak uygun olanı bul
    for (let i = 0; i < activeTeachers.length; i++) {
      const idx = (teacherIndex + i) % activeTeachers.length;
      const teacher = activeTeachers[idx];

      if (teacher.remaining >= group.length) {
        teacher.slots.push(...group);
        teacher.remaining -= group.length;

        //blok bitince sırayı ilerlet
        teacherIndex = (idx + 1) % activeTeachers.length;

        assigned = true;
        break;
      }
    }

    // blok verilemezse tek tek
    if (!assigned) {
      let lastAssignedTeacherId: number | null = null;

      for (const slot of group) {
        const availableTeachers = activeTeachers.filter((t) => t.remaining > 0);
        if (availableTeachers.length === 0) break;

        let selectedTeacher;

        // ilk aynı hocayı devam ettir
        if (lastAssignedTeacherId) {
          const sameTeacher = availableTeachers.find(
            (t) => t.id === lastAssignedTeacherId,
          );

          if (sameTeacher) {
            selectedTeacher = sameTeacher;
          }
        }

        //  yoksa en çok remaining
        if (!selectedTeacher) {
          availableTeachers.sort((a, b) => {
            if (b.remaining !== a.remaining) {
              return b.remaining - a.remaining;
            }
            return (a.lesson_count ?? 0) - (b.lesson_count ?? 0);
          });

          selectedTeacher = availableTeachers[0];
        }

        selectedTeacher.slots.push(slot);
        selectedTeacher.remaining--;

        // 
        lastAssignedTeacherId = selectedTeacher.id;

        teacherIndex = activeTeachers.findIndex(
          (t) => t.id === selectedTeacher.id,
        );
      }
    }
  }

  return activeTeachers
    .filter((t) => t.slots.length > 0)
    .map((t) => ({
      teacher_id: t.id,
      teacher_name: t.name,
      classroom_id: classroomId,
      classroom_name: classroomName,
      time_slot_ids: t.slots,
    }));
}

