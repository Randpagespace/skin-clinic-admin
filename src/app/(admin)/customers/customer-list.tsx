"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { selectCustomers, validateCustomer, type Customer } from '@/lib/customer-preview';
import { useCustomers } from './customer-store';
import styles from './customers.module.css';

export default function CustomerList() {
  const store = useCustomers();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  const result = selectCustomers(store.customers, store.query, store.page, store.size);
  const firstPage = Math.max(1, Math.min(result.page - 2, result.pages - 4));
  const pages = Array.from({length: Math.min(5, result.pages)}, (_, i) => firstPage + i);

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const customer: Customer = {
      id: crypto.randomUUID(), name: String(values.get('name') || '').trim(),
      birthDate: String(values.get('birthDate') || ''), phone: String(values.get('phone') || '').trim(),
      gender: String(values.get('gender')), source: String(values.get('source')),
      consent: values.get('consent') === 'on', memo: String(values.get('memo') || '').trim(), firstVisit: '',
    };
    const problem = validateCustomer(customer);
    if (problem) { setError(problem); return; }
    store.addCustomer(customer);
    store.setQuery(''); store.setPage(1);
    dialog.current?.close();
    router.push(`/customers/${customer.id}`);
  }

  return <>
    <header className="admin-header"><h1>고객</h1><button className={styles.primary} onClick={() => {setError(''); form.current?.reset(); dialog.current?.showModal();}}>+ 신규 고객 추가</button></header>
    <div className={styles.content}>
      <p className={styles.notice}>예시 데이터 · 실제 고객 정보를 입력하지 마세요. 추가한 고객은 새로고침하거나 로그아웃하면 초기화됩니다.</p>
      <section className={styles.tablePanel} aria-label="고객 목록">
        <div className={styles.toolbar}>
          <div><h2>고객 목록 <span>{store.customers.length.toLocaleString()}</span></h2><p>고객 이름을 선택하면 상세 정보를 확인할 수 있습니다.</p></div>
          <div className={styles.search}><label htmlFor="customer-search" className={styles.srOnly}>이름 또는 연락처 검색</label><input id="customer-search" type="search" value={store.query} placeholder="이름 또는 연락처 검색" onChange={event => {store.setQuery(event.target.value); store.setPage(1);}} />{store.query && <button type="button" onClick={() => {store.setQuery(''); store.setPage(1);}}>초기화</button>}</div>
        </div>
        <div className={styles.summary}><p aria-live="polite">검색 결과 <strong>{result.total.toLocaleString()}</strong>명</p><label>페이지당 <select aria-label="페이지당 고객 수" value={store.size} onChange={event => {store.setSize(Number(event.target.value) as 10 | 50 | 100); store.setPage(1);}}><option value={10}>10개</option><option value={50}>50개</option><option value={100}>100개</option></select> 보기</label></div>
        <div className={styles.tableScroll}><table className={styles.table}>
          <thead><tr><th scope="col">고객명</th><th scope="col">연락처</th><th scope="col">생년월일</th><th scope="col">성별</th><th scope="col">유입경로</th><th scope="col">마케팅 수신</th><th scope="col">첫 방문</th></tr></thead>
          <tbody>{result.items.map(customer => <tr key={customer.id}><td><Link href={`/customers/${customer.id}`} className={styles.customerLink}><span className={styles.avatar} aria-hidden="true">{customer.name[0]}</span>{customer.name}</Link></td><td>{customer.phone}</td><td>{customer.birthDate}</td><td>{customer.gender}</td><td>{customer.source}</td><td><span className={customer.consent ? styles.consent : styles.noConsent}>{customer.consent ? '동의' : '미동의'}</span></td><td>{customer.firstVisit || '—'}</td></tr>)}{result.total === 0 && <tr><td colSpan={7} className={styles.empty}>검색 결과가 없습니다. 이름이나 연락처를 다시 확인해 주세요.</td></tr>}</tbody>
        </table></div>
        <div className={styles.pagination}><span>{result.total ? (result.page - 1) * store.size + 1 : 0}–{Math.min(result.page * store.size, result.total)} / {result.total}명</span><nav aria-label="고객 목록 페이지"><button disabled={result.page === 1} onClick={() => store.setPage(1)} aria-label="첫 페이지">«</button><button disabled={result.page === 1} onClick={() => store.setPage(result.page - 1)} aria-label="이전 페이지">‹</button>{pages.map(page => <button key={page} aria-label={`${page}페이지`} aria-current={page === result.page ? 'page' : undefined} onClick={() => store.setPage(page)}>{page}</button>)}<button disabled={result.page === result.pages} onClick={() => store.setPage(result.page + 1)} aria-label="다음 페이지">›</button><button disabled={result.page === result.pages} onClick={() => store.setPage(result.pages)} aria-label="마지막 페이지">»</button></nav><span>{result.page} / {result.pages} 페이지</span></div>
      </section>
    </div>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="new-customer-title">
      <div className={styles.dialogHeading}><h2 id="new-customer-title">신규 고객 추가</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="등록 창 닫기">×</button></div>
      <p className={styles.notice}>화면 확인용 등록입니다. 서버에 저장되지 않습니다.</p>
      <form ref={form} onSubmit={register}>
        <div className={styles.formGrid}>
          <label>이름 <span>*</span><input name="name" required maxLength={50} autoComplete="off" /></label>
          <label>연락처 <span>*</span><input name="phone" type="tel" required maxLength={20} placeholder="010-0000-0000" autoComplete="off" /></label>
          <label>생년월일 <span>*</span><input name="birthDate" type="date" required /></label>
          <label>성별<select name="gender" defaultValue="미선택"><option>미선택</option><option>여</option><option>남</option></select></label>
          <label>유입경로<select name="source" defaultValue="미입력"><option>미입력</option><option>지인 소개</option><option>검색</option><option>인스타</option><option>기타</option></select></label>
        </div>
        <label className={styles.checkbox}><input name="consent" type="checkbox" />마케팅 정보 수신 동의</label>
        <label className={styles.memo}>상담 메모<textarea name="memo" rows={3} maxLength={1000} /></label>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.dialogActions}><button type="button" onClick={() => dialog.current?.close()}>취소</button><button type="submit" className={styles.primary}>고객 추가</button></div>
      </form>
    </dialog>
  </>;
}
