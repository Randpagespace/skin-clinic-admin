export type Customer = { id: string; name: string; birthDate: string; gender: string; phone: string; source: string; consent: boolean; firstVisit: string; memo: string };

export const previewCustomers: Customer[] = Array.from({ length: 103 }, (_, index) => ({
  id: index === 0 ? 'demo' : `sample-${index}`,
  name: index === 0 ? '이수진' : `${['김민서','박지우','최서연','정도윤','한유진','윤수아','강하준','조예은'][index % 8]} ${String(index).padStart(3,'0')}`,
  birthDate: index === 0 ? '1983-05-12' : `${1985 + index % 20}-06-15`,
  gender: index % 3 === 0 ? '여' : '남',
  phone: index === 0 ? '010-0000-5030' : `010-0000-${String(index).padStart(4,'0')}`,
  source: ['지인 소개','검색','인스타','기타'][index % 4], consent: index % 3 === 0,
  firstVisit: index === 0 ? '2024-11-03' : '2026-07-01',
  memo: index === 0 ? '피부 진정 위주 선호. 다음 방문 시 리프팅 잔여 안내 필요. 여름 전 제모 패키지 재구매 의사 있음.' : '',
}));

export function selectCustomers<T extends { name: string; phone: string }>(rows: T[], query: string, requestedPage: number, size: 10 | 50 | 100) {
  const term = query.trim().toLocaleLowerCase();
  const digits = term.replace(/[\s-]/g, '');
  const filtered = rows.filter(row => row.name.toLocaleLowerCase().includes(term) || (/^\d+$/.test(digits) && row.phone.replace(/\D/g,'').includes(digits)));
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const page = Math.min(pages, Math.max(1, requestedPage));
  return { items: filtered.slice((page - 1) * size, page * size), total: filtered.length, pages, page };
}

export function validateCustomer(input: { name: string; birthDate: string; phone: string }) {
  if (!input.name.trim() || input.name.trim().length > 50) return '이름은 1~50자로 입력해 주세요.';
  const date = new Date(`${input.birthDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== input.birthDate || date.getTime() > Date.now()) return '올바른 생년월일을 입력해 주세요.';
  if (!/^[\d\s-]+$/.test(input.phone) || !/^0\d{8,10}$/.test(input.phone.replace(/\D/g,''))) return '올바른 연락처를 입력해 주세요.';
  return '';
}
