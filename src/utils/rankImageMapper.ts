// src/utils/rankImageMapper.ts

// 칭호에 따른 프로필 이미지 매핑
const rankToProfileImage: Record<string, string> = {
  // 변호사
  '파트너 변호사': 'Lawyer',
  '시니어 변호사': 'Lawyer',
  '중견 변호사': 'Lawyer',
  '신입 변호사': 'Lawyer',

  // 로스쿨
  '로스쿨 졸업반': 'LawSchoolStudent',
  '로스쿨 2학년': 'LawSchoolStudent',
  '로스쿨 1학년': 'LawSchoolStudent',

  // 법대생
  '법대생 졸업반': 'LawStudent',
  '법대생 3학년': 'LawStudent',
  '법대생 2학년': 'LawStudent',
  '법대생 1학년': 'LawStudent',

  // 말싸움
  '말싸움 고수': 'ArguingMaster',
  '말싸움 중수': 'ArguingMaster',
  '말싸움 하수': 'ArguingMaster',
  '말싸움 풋내기': 'ArguingMaster',
};

// 칭호에 따른 닉네임 프레임 매핑
const rankToNicknameFrame: Record<string, string> = {
  // 변호사 (4개)
  '파트너 변호사': 'lawyer4',
  '시니어 변호사': 'lawyer3',
  '중견 변호사': 'lawyer2',
  '신입 변호사': 'lawyer1',

  // 로스쿨 (3개)
  '로스쿨 졸업반': 'lasSch3',
  '로스쿨 2학년': 'lawSch2',
  '로스쿨 1학년': 'lasSch1',

  // 법대생 (4개)
  '법대생 졸업반': 'lawStu4',
  '법대생 3학년': 'lawStu3',
  '법대생 2학년': 'lawStu2',
  '법대생 1학년': 'lawStu1',

  // 말싸움 (4개)
  '말싸움 풋내기': 'arguing1',
  '말싸움 하수': 'arguing2',
  '말싸움 중수': 'arguing3',
  '말싸움 고수': 'arguing4',
};

export const getRankProfileImage = (rank: string): string => {
  const imageName = rankToProfileImage[rank];
  if (!imageName) {
    // 기본 이미지 (ArguingMaster)
    return new URL(`../assets/mypageSvgs/profiles/ArguingMaster.svg`, import.meta.url).href;
  }
  return new URL(`../assets/mypageSvgs/profiles/${imageName}.svg`, import.meta.url).href;
};

export const getRankNicknameFrame = (rank: string): string => {
  const frameName = rankToNicknameFrame[rank];
  if (!frameName) {
    // 기본 프레임
    return new URL(`../assets/mypageSvgs/nickname/arguing4.svg`, import.meta.url).href;
  }
  return new URL(`../assets/mypageSvgs/nickname/${frameName}.svg`, import.meta.url).href;
};

// 칭호에서 기본 직급만 추출
export const getRankBase = (rank: string): string => {
  if (rank.includes('법대생')) return 'LawStudent';
  if (rank.includes('로스쿨')) return 'LawSchoolStudent';
  if (rank.includes('변호사')) return 'Lawyer';
  if (rank.includes('말싸움')) return 'ArguingMaster';
  return 'ArguingMaster';
};