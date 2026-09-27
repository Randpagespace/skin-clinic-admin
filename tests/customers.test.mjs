import test from 'node:test';
import assert from 'node:assert/strict';
import { selectCustomers, validateCustomer } from '../src/lib/customer-preview.ts';
const rows = Array.from({length: 103}, (_, i) => ({id:String(i),name:i === 0 ? '이수진' : `예시${i}`,phone:`010-0000-${String(i).padStart(4,'0')}`}));
test('name and normalized phone searches filter before pagination', () => {
  assert.deepEqual(selectCustomers(rows,' 수진 ',1,10).items.map(x=>x.id),['0']);
  assert.deepEqual(selectCustomers(rows,'01000000002',1,10).items.map(x=>x.id),['2']);
});
test('10/50/100 boundaries and out-of-range pages are consistent', () => {
  for (const size of [10,50,100]) {
    const result=selectCustomers(rows,'',999,size);
    assert.equal(result.page,Math.ceil(103/size));
    assert.deepEqual(result.items.map(x=>x.id),['100','101','102']);
  }
  const empty=selectCustomers(rows,'없음',8,10);
  assert.deepEqual(empty.items,[]); assert.equal(empty.page,1); assert.equal(empty.total,0);
});
test('registration rejects blank names, impossible dates and malformed phones',()=>{
  assert.ok(validateCustomer({name:' ',birthDate:'2000-01-01',phone:'01012345678'}));
  assert.ok(validateCustomer({name:'홍길동',birthDate:'2024-02-30',phone:'01012345678'}));
  assert.ok(validateCustomer({name:'홍길동',birthDate:'2000-01-01',phone:'abc'}));
  assert.equal(validateCustomer({name:'홍길동',birthDate:'2000-02-29',phone:'010-1234-5678'}),'');
});
