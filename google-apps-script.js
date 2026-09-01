/**
 * 소셜비즈 DM 캠페인 관리자 신청 — Google Apps Script (구글시트 적재)
 *
 * [배포 방법]
 * 1. 구글 스프레드시트를 새로 만들고 URL 의 /d/ 뒤 문자열(스프레드시트 ID)을 복사
 * 2. https://script.google.com → 새 프로젝트 → 이 코드 전체 붙여넣기
 * 3. 아래 SPREADSHEET_ID 를 1번에서 복사한 값으로 교체
 * 4. 배포 → 새 배포 → 유형: 웹 앱
 *      - 다음 사용자로 실행: 나(본인)
 *      - 액세스 권한: 모든 사용자
 * 5. 배포 후 나오는 웹 앱 URL 을 index.html 의 APPS_SCRIPT_URL 에 붙여넣기
 * 6. 웹 앱 URL 을 브라우저로 열어 {"result":"ok"} 가 뜨면 배포 정상
 */

// ← 여기에 스프레드시트 ID 입력
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// 시트 첫 행 헤더 (첫 제출 시 자동 생성)
const HEADERS = [
  '제출_시간',
  '회사_브랜드명',
  '담당자_성함',
  '직책_부서',
  '연락처',
  '이메일',
  '회사_유형',
  '예정_계정_수',
  '도입_희망_시기',
  '현재_소셜비즈_이용여부',
  '관심_기능',
  '문의_내용',
  '통화_가능_시간대',
  '개인정보_수집이용_동의',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(HEADERS.map(function (key) {
      if (key === '제출_시간') {
        return data[key] || new Date().toLocaleString('ko-KR');
      }
      return data[key] || '';
    }));

    return json({ result: 'ok' });
  } catch (err) {
    return json({ result: 'error', message: String(err) });
  }
}

// 배포 확인용 — 웹 앱 URL 을 브라우저로 열면 호출된다
function doGet() {
  return json({ result: 'ok' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
