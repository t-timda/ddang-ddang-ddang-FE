/**
 * Java LocalDateTime 배열 형태를 JavaScript Date 객체로 변환
 * @param dateArray [year, month, day, hour, minute, second, nanoseconds]
 * @returns Date 객체
 */
export function parseLocalDateTimeArray(dateArray: number[]): Date {
  if (!Array.isArray(dateArray) || dateArray.length < 6) {
    throw new Error('Invalid date array format');
  }

  const [year, month, day, hour, minute, second] = dateArray;

  // Java의 month는 1-based (1=January), JavaScript는 0-based (0=January)
  return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * Date 객체를 읽기 쉬운 문자열로 포맷팅
 * @param date Date 객체
 * @returns 'YYYY.MM.DD HH:MM' 형식의 문자열
 */
export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

/**
 * 현재 시간이 주어진 deadline을 넘었는지 확인
 * @param deadline Date 객체 또는 배열 형태
 * @returns deadline을 넘었으면 true
 */
export function isDeadlinePassed(deadline: Date | number[]): boolean {
  const deadlineDate = Array.isArray(deadline)
    ? parseLocalDateTimeArray(deadline)
    : deadline;

  return new Date() > deadlineDate;
}
