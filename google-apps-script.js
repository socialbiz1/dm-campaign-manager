/**
 * 소셜비즈 DM 캠페인 관리자 신청 — Google Apps Script (구글시트 적재)
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 배포 방법 (스프레드시트에 붙는 "바인딩 스크립트" 방식)      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * 1. https://sheets.new  →  새 스프레드시트가 열림. 이름을 아무거나 지정
 *    (예: "DM캠페인관리자 신청 접수")
 *
 * 2. 그 시트에서  [확장 프로그램] → [Apps Script]  클릭
 *    → 스크립트 편집기가 열림 (이 시트에 자동으로 묶임 = ID 복사 불필요)
 *
 * 3. 편집기에 있던 `function myFunction() {}` 를 지우고
 *    이 파일 내용 전체를 붙여넣기 → 저장(Ctrl+S)
 *
 * 4. 우측 상단 [배포] → [새 배포]
 *      - 톱니바퀴 아이콘 → 유형 선택 → **웹 앱**
 *      - 설명: 아무거나 (예: v1)
 *      - 다음 사용자로 실행: **나(본인 계정)**
 *      - 액세스 권한이 있는 사용자: **모든 사용자**   ← 반드시 이걸로
 *      - [배포] 클릭
 *
 * 5. "액세스 승인" 창이 뜨면 →  본인 구글 계정 선택
 *      → "Google에서 확인하지 않은 앱입니다" 경고가 나오면
 *        [고급] → [<프로젝트명>(으)로 이동(안전하지 않음)] → [허용]
 *      (본인이 만든 스크립트라 정상입니다. 시트 편집 권한만 요청합니다)
 *
 * 6. 배포 완료 화면의 **웹 앱 URL** 복사
 *    (https://script.google.com/macros/s/AKfy..../exec 형태)
 *
 * 7. 그 URL 을 브라우저 주소창에 붙여넣어 열어본다
 *    →  {"result":"ok"}  가 보이면 배포 성공
 *
 * 8. 그 URL 을 index.html 의  const APPS_SCRIPT_URL = '';  안에 붙여넣고 커밋·푸시
 *
 * ─────────────────────────────────────────────────────────────
 * 코드를 고친 뒤에는 반드시 [배포] → [배포 관리] → 연필(수정)
 * → 버전 "새 버전" → [배포] 를 해야 반영됩니다. 저장만으로는 안 됩니다.
 * (이 경로로 하면 웹 앱 URL 은 그대로 유지됩니다)
 * ─────────────────────────────────────────────────────────────
 */

// 신청 내용이 쌓일 시트 탭 이름 (없으면 자동 생성)
const SHEET_NAME = '신청';

// 바인딩 스크립트면 비워두면 된다.
// 독립 실행형(standalone) 스크립트로 만들었을 때만 스프레드시트 ID 를 넣는다.
const SPREADSHEET_ID = '';

// 시트 첫 행 헤더 (첫 제출 시 자동 생성). index.html 의 input name 과 1:1 로 맞출 것
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
    const sheet = getSheet();

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

function getSheet() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 배포 전에 편집기에서 직접 실행해 볼 수 있는 자가 점검 함수.
 * 실행 후 시트에 "테스트" 행이 한 줄 들어가면 정상. 확인 뒤 그 행은 지우면 된다.
 */
function selfTest() {
  doPost({
    postData: {
      contents: JSON.stringify({
        제출_시간: new Date().toLocaleString('ko-KR'),
        회사_브랜드명: '테스트',
        담당자_성함: '테스트',
        직책_부서: '테스트',
        연락처: '010-0000-0000',
        이메일: 'test@example.com',
        문의_내용: 'selfTest 로 넣은 확인용 행입니다. 확인 후 삭제하세요.',
        개인정보_수집이용_동의: '동의함',
      }),
    },
  });
}
