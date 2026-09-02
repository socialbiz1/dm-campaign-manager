# DM 캠페인 관리자 신청 페이지

NHN DATA 소셜비즈 **DM 캠페인 관리자(계정 통합 관리)** 도입 신청 랜딩 페이지.
엔터프라이즈 마케터(브랜드 마케팅팀 · 마케팅 대행사 · MCN)를 대상으로, 기능을 소개하고 신청서를 접수받는다.

- 배포: <https://socialbiz1.github.io/dm-campaign-manager/>
- 원본 기획: 두레이 `META-InstagramMessenger/388` — DM 캠페인 관리자 - 계정 통합 관리 (피그마 V3.2 / 어드민 V6.3)
- 자매 페이지: [socialbiz-consulting](https://github.com/socialbiz1/socialbiz-consulting)(무료 상담) · [enterprise-setting](https://github.com/socialbiz1/enterprise-setting)(세팅 대행)

## 구성

| 파일 | 설명 |
|---|---|
| `index.html` | 페이지 전체 (빌드 없는 단일 파일 — HTML + CSS + JS) |
| `google-apps-script.js` | 신청 내용을 구글시트에 적재하는 Apps Script 웹훅 |
| `docs/spec.md` | 기능 정리 · 설계 결정 · 수집 항목 근거 |

## 접수 흐름

```
신청서 제출
  ├─ FormSubmit.co  → yonghwan.kim@nhndata.com 즉시 메일
  └─ Apps Script    → 구글시트 한 행 적재
        ↓
  담당자가 1영업일 내 전화
```

메일 전송이 성공해야 완료 화면으로 넘어간다. 실패하면 재시도 안내를 띄운다.
구글시트 적재는 `no-cors` 라 성공 여부를 알 수 없어 완료 판정 근거로 쓰지 않는다.

## 배포 후 해야 할 설정 2가지

### 1. 구글시트 연결 (선택이지만 권장)

`APPS_SCRIPT_URL` 이 비어 있으면 메일만 가고 시트 적재는 건너뛴다. 시트도 쓰려면:

1. <https://sheets.new> → 새 스프레드시트 생성 (이름 예: `DM캠페인관리자 신청 접수`)
2. 그 시트에서 **확장 프로그램 → Apps Script**
   (시트에 바인딩되므로 스프레드시트 ID 를 복사할 필요가 없다)
3. 기본 코드를 지우고 `google-apps-script.js` 전체를 붙여넣고 저장
4. **배포 → 새 배포 → 유형 웹 앱** / 실행 **나(본인)** / 액세스 **모든 사용자** → 배포
5. 승인 창에서 `고급 → (안전하지 않음)으로 이동 → 허용`
   (본인이 만든 스크립트이며 시트 편집 권한만 요청한다)
6. 나온 웹 앱 URL 을 브라우저로 열어 `{"result":"ok"}` 확인
7. 그 URL 을 `index.html` 의 `const APPS_SCRIPT_URL = '';` 에 채우고 커밋·푸시

스크립트를 수정한 뒤에는 **배포 → 배포 관리 → 수정(연필) → 버전 "새 버전" → 배포** 를 해야 반영된다.
저장만으로는 반영되지 않으며, 이 경로로 하면 웹 앱 URL 은 유지된다.

### 2. FormSubmit 활성화 확인

`yonghwan.kim@nhndata.com` 은 `socialbiz-consulting` · `enterprise-setting` 에서 이미 쓰고 있어
추가 인증이 필요 없을 가능성이 높다. 첫 제출 후 메일이 안 오면 FormSubmit 활성화 메일을 확인할 것.

## 로컬 확인

```bash
python -m http.server 8899
```

→ <http://localhost:8899/>

## 수정할 때 주의

- **개인정보 수집·이용 동의 문구**는 임시 표준 문구다. 두레이 `META-InstagramMessenger/388` 첨부
  `소셜비즈_캠페인관리자_개인정보 수집 및 이용 동의_V2.0.docx` 확정본으로 교체해야 한다.
  해당 위치에 `⚠️ 법무 확정본 교체 필요` 주석을 달아 두었다.
- 폼 필드 이름(`name` 속성)을 바꾸면 `google-apps-script.js` 의 `HEADERS` 도 같이 바꿔야
  시트 열이 어긋나지 않는다.
- 요금은 **별도 협의**로만 표기한다. 금액을 페이지에 박지 않는다(연동 계정 수·기간·컨택 규모에 따라 달라짐).
