import React, { useState, useEffect } from 'react';
import {
  Play, Search, Plus, Trash2, Edit3, Activity,
  X, Copy, Check, Lock, LogOut, FolderDown, Sparkles, Loader2,
  ChevronLeft, ChevronRight, ShieldCheck, MessageSquareQuote, Stethoscope
} from 'lucide-react';

// 1. 관리자 비밀번호
const ADMIN_PASSWORD = 'admin';

// 2. 웹하드 다운로드 링크
const WEBHARD_DOWNLOAD_URL = 'https://drive.google.com';

// 1~5번 임상 카테고리
const CATEGORIES = [
  '전체',
  '1. Hygiene Care – Inflammation Control',
  '2. Soft Tissue Cutting',
  '3. Soft & Hard Tissue – Definitive Treatment',
  '4. Esthetics',
  '5. Endodontics'
];

// 근거 상태 뱃지 스타일 매핑 (Waterlase iPlus 영업임상활용.html 기준)
const EVIDENCE_STYLES = {
  ok: { label: '확인됨', bg: '#e3f3ea', color: '#1f7a4d', desc: '제조사 공식 매뉴얼·가이드 확인' },
  mf: { label: '제조사 발표', bg: '#e7ecf6', color: '#13254b', desc: 'BIOLASE 공식 영상·가이드 발표' },
  lit: { label: '문헌', bg: '#fbf1d9', color: '#9a6a00', desc: '임상 논문 및 학술 문헌 근거' },
  chk: { label: '확인 필요', bg: '#fbe7dc', color: '#8a3b12', desc: '장비 화면 프리셋 최종 대조 권장' }
};

// 기존 5개 프로토콜 + 영업·임상 활용 데이터 통합
const INITIAL_PROTOCOLS = [
  {
    id: 'hygiene-care',
    title: 'Periodontitis',
    koTitle: '치주염 · REPAIR Perio™ 프로토콜',
    category: '1. Hygiene Care – Inflammation Control',
    model: 'Waterlase iPlus',
    youtubeId: 'di-9LKU-Xj8',
    tip: 'RFPT5',
    power: '1.5W / 30Hz - 75Hz',
    hz: '30Hz - 50Hz',
    waterAir: 'Water 40% / Air 40%',
    headline: '치주낭 내부 병적 육아조직과 바이오필름을 선택적으로 제거하고 혈병 형성을 유도하는 최소 침습 치주 프로토콜',
    indication: '적응증: 중등도~중증 만성 치주염(치주낭 깊이 5mm 이상), 비외과적 치주 재생(REPAIR Perio™), 기존 SRP 후 잔존 염증 부위',
    summary: '치주낭 내부 살균 및 염증 제어(Inflammation Control)를 위한 최소 침습 레이저 프로토콜',
    salesMent: `원장님, 기존 큐렛만으로 접근하기 어려운 깊은 치주낭 내벽의 염증성 육아조직과 세균막을 RFPT5 방사형 팁으로 열 손상 없이 선택적으로 제거할 수 있습니다.\n\n절개나 봉합 없이 출혈과 술 후 통증을 크게 줄이면서 안정적인 혈병(Blood Clot) 형성을 유도해 치주 조직 부착 회복에 도움을 줍니다.`,
    clinicalPoints: [
      'RFPT5 측면 방사 팁을 치주낭 기저부까지 삽입한 뒤 내벽 방향으로 천천히 스위핑하며 상피 및 육아조직을 제거합니다.',
      '치근 활택술(Root Planing) 후 스미어 레이어와 내독소를 무열 세척하여 치근면 생체친화성을 높입니다.',
      '마무리 단계에서 수분을 줄인 응고 모드로 안정적인 혈병 형성을 유도합니다.'
    ],
    protocolSteps: [
      { stage: '1단계 · 상피/육아조직 제거', tip: 'RFPT5', setting: '1.5W / 30Hz–50Hz', spray: 'Water 40% / Air 40%' },
      { stage: '2단계 · 치근면 디컨태미네이션', tip: 'RFPT5', setting: '1.5W / 50Hz–75Hz', spray: 'Water 40% / Air 40%' },
      { stage: '3단계 · 지혈 및 혈병 유도', tip: 'RFPT5', setting: '1.0W–1.5W / 30Hz', spray: 'Water 0%–10% / Air 20%' }
    ],
    evidences: [
      { status: 'ok', text: 'BIOLASE REPAIR Perio™ Protocol Guide & iPlus User Manual 기준 세팅' },
      { status: 'lit', text: 'Er,Cr:YSGG 레이저 병용 치주치료 시 치주낭 깊이(PD) 감소 및 임상부착수준(CAL) 개선 문헌 보고' }
    ],
    steps: [
      'Step 1: RFPT 팁을 이용해 치주낭 내 잔여 결합조직 및 육아조직 제거',
      'Step 2: 치근 활택술(Root Planing) 후 레이저로 스미어 레이어 및 세균막 제거',
      'Step 3: 응고 모드로 혈병(Blood Clot) 형성 유도'
    ]
  },
  {
    id: 'soft-tissue-cutting',
    title: 'Fibroma Removal',
    koTitle: '섬유종 제거 · 무혈 연조직 절제술',
    category: '2. Soft Tissue Cutting',
    model: 'Waterlase iPlus',
    youtubeId: 'rI90LuRUJj0',
    tip: 'MZ6',
    power: '0.5W - 2.75W / 40Hz - 50Hz',
    hz: '30Hz - 50Hz',
    waterAir: 'Water 1% - 40% / Air 20%',
    headline: '출혈을 최소화한 선명한 시야 하에 봉합 없이 정밀하게 구강 내 섬유종을 절제하는 연조직 프로토콜',
    indication: '적응증: 협점막·설측·치은부 자극성 섬유종(Irritation Fibroma), 유두종 및 양성 연조직 종물 절제 생검',
    summary: '출혈 없이 정밀하게 연조직을 절제(Soft Tissue Cutting)하고 지혈하는 프로토콜.',
    salesMent: `원장님, 구강 내 섬유종 제거 시 메스를 사용하면 출혈 때문에 시야 확보가 어렵고 봉합까지 해야 해 환자분 불편이 큽니다.\n\n워터레이저 MZ6 팁을 사용하면 절제와 동시에 지혈이 이루어져 무봉합(Sutureless)으로 빠르게 마무리할 수 있고, 주변 조직 열 변성이 적어 병리조직검사 표본 보존에도 유리합니다.`,
    clinicalPoints: [
      '가장 낮은 권장 출력(0.5W~1.5W)에서 시작해 조직 반응과 절개 속도를 확인하며 출력을 조정합니다.',
      '포셉으로 종물 상단을 가볍게 견인한 상태에서 MZ6 팁 끝을 기저부에 접촉시켜 브러시처럼 부드럽게 절제합니다.',
      '제거된 모든 종물 조직은 반드시 조직병리 검사를 의뢰합니다.'
    ],
    protocolSteps: [
      { stage: '1단계 · 절제 경계 마킹', tip: 'MZ6', setting: '1.0W–1.5W / 40Hz', spray: 'Water 10% / Air 20%' },
      { stage: '2단계 · 기저부 정밀 절제', tip: 'MZ6', setting: '1.5W–2.75W / 40Hz–50Hz', spray: 'Water 10%–40% / Air 20%' },
      { stage: '3단계 · 변연 지혈 및 정리', tip: 'MZ6', setting: '0.5W–1.0W / 30Hz–40Hz', spray: 'Water 1%–10% / Air 20%' }
    ],
    evidences: [
      { status: 'ok', text: 'WaterLase iPlus User Manual (Soft Tissue Excision / Fibroma) 권장 파라미터' },
      { status: 'mf', text: '열탄화(Charring) 최소화로 술 후 부종·통증 감소 및 무봉합 치유 유도' }
    ],
    steps: [
      'Step 1: 절제 라인 디자인 및 마킹',
      'Step 2: 접촉식 팁으로 부드러운 핸들링 절제',
      'Step 3: 주변 연조직 지혈 및 경계 정리'
    ]
  },
  {
    id: 'soft-hard-tissue',
    title: 'Peri Implantitis',
    koTitle: '임플란트 주위염 · REPAIR Implant™ 프로토콜',
    category: '3. Soft & Hard Tissue – Definitive Treatment',
    model: 'Waterlase iPlus',
    youtubeId: 'oaY5PYkLFf8',
    tip: 'RFPT5 / MZ6',
    power: '1.5W / 30Hz - 50Hz',
    hz: '15Hz - 20Hz',
    waterAir: 'Water 10% - 50% / Air 10% - 40%',
    headline: '티타늄 임플란트 표면 손상·열 변형 없이 나사선 사이의 바이오필름과 육아조직을 제거하는 프로토콜',
    indication: '적응증: 임플란트 주위 점막염(Peri-implant Mucositis), 골소실을 동반한 임플란트 주위염(Peri-implantitis)의 비외과적·외과적 디컨태미네이션',
    summary: '연조직 절제 및 치조골 삭제를 동시/순차적으로 진행하는 확정적 치료 프로토콜.',
    salesMent: `원장님, 임플란트 주위염 치료에서 가장 고민되는 부분이 티타늄 픽스처 표면에 스크래치나 열 손상을 주지 않으면서 나사선 틈새 세균막을 완벽히 닦아내는 것입니다.\n\n워터레이저는 물방울 에너지를 이용하기 때문에 임플란트 표면 변형이나 온도 상승 걱정 없이 나사선 사이 바이오필름과 염증성 육아조직만 선택적으로 제거해 골유착 재형성 환경을 만들어 줍니다.`,
    clinicalPoints: [
      '티타늄 임플란트 표면에 팁이 직접 강하게 긁히지 않도록 각도와 거리를 유지하며 조사합니다.',
      'RFPT5 측면 방사 팁을 활용하면 좁은 골내 결손부(Intrabony defect) 및 픽스처 나사선 하방까지 에너지를 전달할 수 있습니다.',
      '육아조직 제거와 표면 살균 후 생리식염수로 충분히 세척하고 필요시 GBR(골이식)을 병행합니다.'
    ],
    protocolSteps: [
      { stage: '1단계 · 육아조직 절제', tip: 'MZ6 / RFPT5', setting: '1.5W / 30Hz–50Hz', spray: 'Water 40%–50% / Air 40%' },
      { stage: '2단계 · 픽스처 표면 살균', tip: 'RFPT5', setting: '1.5W / 30Hz–50Hz', spray: 'Water 40%–50% / Air 40%' },
      { stage: '3단계 · 골결손부 디브라이드먼트', tip: 'MZ6', setting: '1.5W–2.5W / 15Hz–20Hz', spray: 'Water 50% / Air 40%' }
    ],
    evidences: [
      { status: 'ok', text: 'BIOLASE REPAIR Implant™ Protocol Guide 기준 권장 세팅' },
      { status: 'lit', text: 'Er,Cr:YSGG 2780nm 조사 시 티타늄 표면 미세구조 보존 및 바이오필름 제거 효과 문헌 입증' }
    ],
    steps: [
      'Step 1: 연조직 절제 및 생물학적 폭경 확보 라인 형성',
      'Step 2: 충분한 수분 주수 하에 치조골 무열 손상 삭제',
      'Step 3: 변연부 평탄화 및 최종 세척'
    ]
  },
  {
    id: 'esthetics-protocol',
    title: 'Veneer Removal',
    koTitle: '라미네이트 · 세라믹 비니어 비침습 제거',
    category: '4. Esthetics',
    model: 'Waterlase Express',
    youtubeId: '0zoU_VVlFcg',
    tip: 'MZ6',
    power: '3.5W / 20Hz',
    hz: '30Hz',
    waterAir: 'Water 50% / Air 50%',
    headline: '다이아몬드 버 삭제 없이 보철물을 투과한 레이저 에너지로 접착 레진만 선택적으로 연화시켜 비니어를 탈락시키는 프로토콜',
    indication: '적응증: 파절·변색·마진 불량 세라믹/포세린 라미네이트 비니어 재제작을 위한 비손상 보철 제거',
    summary: '베니어 제거 및 심미적 치료를 위한 에스테틱 프로토콜.',
    salesMent: `원장님, 기존 라미네이트 재치료 시 고속 핸드피스 버로 갈아내면 시간도 오래 걸리고 건전한 자연치 법랑질까지 손상될 위험이 있습니다.\n\n워터레이저는 세라믹을 투과해 내면의 레진 시멘트 물분자에만 반응하므로, 지대치 삭제나 치수 열자극 없이 수십 초 만에 비니어를 통째로 깔끔하게 분리할 수 있습니다.`,
    clinicalPoints: [
      '보철물 표면 전체를 일정한 속도(페인팅 모션)로 고르게 스캐닝하여 국소 과열을 방지합니다.',
      '충분한 수분 냉각(Water 50% / Air 50%)을 유지해야 치수 온도 상승을 막을 수 있습니다.',
      '두꺼운 지르코니아보다 투과율이 높은 포세린·리튬디실리케이트(e.max) 비니어에서 특히 빠르게 반응합니다.'
    ],
    protocolSteps: [
      { stage: '1단계 · 순면 전체 스캐닝', tip: 'MZ6', setting: '3.5W / 20Hz', spray: 'Water 50% / Air 50%' },
      { stage: '2단계 · 변연부 추가 조사', tip: 'MZ6', setting: '3.5W / 20Hz', spray: 'Water 50% / Air 50%' },
      { stage: '3단계 · 탐침/기구로 비니어 분리', tip: '수기구', setting: '접착층 연화 후 가볍게 탈락', spray: '-' }
    ],
    evidences: [
      { status: 'mf', text: 'BIOLASE All-Ceramic / Veneer Removal 임상 가이드 기준' },
      { status: 'chk', text: '보철물 두께 및 시멘트 종류에 따라 출력(3.5W~4.5W) 단계적 조정 필요' }
    ],
    steps: [
      'Step 1: 보철물 표면 및 변연부 균일 레이저 조사',
      'Step 2: 냉각 수분 조절을 통한 열손상 방지',
      'Step 3: 지대치 손상 없이 안전한 비침습 탈락'
    ]
  },
  {
    id: 'crown-removal-protocol',
    title: 'crown removal',
    koTitle: '올세라믹 · 지르코니아 크라운 제거 프로토콜',
    category: '4. Esthetics',
    model: 'Waterlase iPlus',
    youtubeId: 'UXMpwJBNNNA',
    tip: 'MZ6',
    power: '4.5W / 20Hz',
    hz: '50Hz',
    waterAir: 'Water 50% / Air 50%',
    headline: '보철물 절단(Sectioning) 스트레스와 버 소모 없이 세라믹·지르코니아 크라운을 신속하게 분리하는 프로토콜',
    indication: '적응증: 올세라믹(e.max), 지르코니아 크라운 재보철, 교합 조정·치수 치료를 위한 보철물 제거',
    summary: '크라운 제거 및 비침습 보철 탈락을 위한 워터레이즈 프로토콜',
    salesMent: `원장님, 지르코니아 크라운을 버로 잘라내려면 환자분도 진동과 소음 때문에 힘들어하고 체어타임과 버 소모 비용도 만만치 않습니다.\n\n워터레이저 4.5W 세팅으로 크라운 교합면과 협설면을 고르게 스캐닝하면 내부 레진 시멘트 결합력이 파괴되면서 지대치 손상 없이 크라운을 훨씬 빠르고 편하게 제거할 수 있습니다.`,
    clinicalPoints: [
      '교합면(Occlusal) → 협면(Buccal) → 설면(Lingual) 순으로 멈추지 않고 연속 스캐닝합니다.',
      '메탈(PFM, 골드) 크라운은 레이저가 투과하지 못하므로 올세라믹 및 지르코니아 보철물에 적용합니다.',
      '조사 후 크라운 리무버나 기구로 가볍게 비틀어 탈락 여부를 확인하며, 저항이 남으면 15~20초 추가 조사합니다.'
    ],
    protocolSteps: [
      { stage: '1단계 · 교합면 및 축면 스캐닝', tip: 'MZ6', setting: '4.5W / 20Hz', spray: 'Water 50% / Air 50%' },
      { stage: '2단계 · 치경부 마진 집중 조사', tip: 'MZ6', setting: '4.5W / 20Hz', spray: 'Water 50% / Air 50%' },
      { stage: '3단계 · 크라운 탈락 및 잔여 시멘트 정리', tip: '수기구', setting: '지대치 손상 없이 분리', spray: '-' }
    ],
    evidences: [
      { status: 'mf', text: 'BIOLASE Zirconia & Ceramic Crown Removal 임상 영상 프로토콜' },
      { status: 'chk', text: '장비 화면 프리셋(Crown Removal)과 출력·수분값 최종 확인 권장' }
    ],
    steps: [
      'Step 1: 보철물 마진 및 교합면 중심 레이저 조사',
      'Step 2: 접착 레진 결합 파괴 유도',
      'Step 3: 지대치 손상 없이 안전한 탈락 확인'
    ]
  }
];

// 제목 키워드 분석 기반 워터레이즈 표준 프로토콜 자동 매칭 함수
function inferProtocolFromTitle(title) {
  const lower = title.toLowerCase();

  if (lower.includes('endo') || lower.includes('root canal') || lower.includes('근관') || lower.includes('신경')) {
    return {
      category: '5. Endodontics',
      tip: 'RFT2 / RFT3',
      power: '1.25W / 50Hz',
      waterAir: 'Water 20% / Air 30%',
      summary: '근관 내 세균막 살균 및 스미어 레이어 제거를 위한 워터레이즈 근관 치료 프로토콜.',
      indication: '적응증: 치수 괴사, 치근단 병소, 재근관 치료 시 근관 내 세균막 및 스미어 레이어 제거',
      salesMent: '원장님, 기존 NaOCl 세척액이 닿지 않는 미세 상아세관과 측지근관까지 RFT 팁의 레이저 수압 충격파로 3차원 살균이 가능합니다.'
    };
  }
  if (lower.includes('implant') || lower.includes('임플란트') || lower.includes('bone') || lower.includes('crown lengthening') || lower.includes('치관연장')) {
    return {
      category: '3. Soft & Hard Tissue – Definitive Treatment',
      tip: 'RFPT5 / MZ6 / MZ8',
      power: '1.5W - 3.5W / 20Hz - 50Hz',
      waterAir: 'Water 40% - 60% / Air 40%',
      summary: '연조직 절제 및 경조직(치조골/임플란트 주위) 처치를 병행하는 확정적 치료 프로토콜.',
      indication: '적응증: 임플란트 주위염, 비절개 치관연장술, 치조골 성형술',
      salesMent: '원장님, 연조직 절제부터 골 삭제까지 핸드피스 교체 없이 출력 세팅 전환만으로 한 번에 무열 시술이 가능합니다.'
    };
  }
  if (lower.includes('veneer') || lower.includes('crown') || lower.includes('melanin') || lower.includes('depigmentation') || lower.includes('esthetic') || lower.includes('smile') || lower.includes('베니어') || lower.includes('크라운') || lower.includes('심미')) {
    return {
      category: '4. Esthetics',
      tip: 'MZ6',
      power: '3.5W - 4.5W / 20Hz',
      waterAir: 'Water 50% / Air 50%',
      summary: '보철물(베니어/크라운) 비침습 제거 및 심미적 치은 성형을 위한 에스테틱 프로토콜.',
      indication: '적응증: 세라믹 비니어·지르코니아 크라운 제거, 치은 멜라닌 색소 제거',
      salesMent: '원장님, 자연치 삭제나 치수 자극 없이 보철물 내부 시멘트만 선택적으로 반응시켜 안전하고 빠르게 제거할 수 있습니다.'
    };
  }
  if (lower.includes('fibroma') || lower.includes('frenectomy') || lower.includes('gingivectomy') || lower.includes('soft tissue') || lower.includes('cutting') || lower.includes('소대') || lower.includes('절제')) {
    return {
      category: '2. Soft Tissue Cutting',
      tip: 'MZ6',
      power: '1.5W - 2.5W / 40Hz - 50Hz',
      waterAir: 'Water 10% - 20% / Air 20%',
      summary: '출혈 없이 정밀하게 연조직을 절제(Soft Tissue Cutting)하고 지혈하는 프로토콜.',
      indication: '적응증: 섬유종 제거, 설소대·순소대 절제술, 치은 절제술',
      salesMent: '원장님, 절개와 동시에 지혈이 되어 봉합 없이 시술 시간을 단축하고 환자분의 술 후 통증과 부종을 최소화합니다.'
    };
  }
  return {
    category: '1. Hygiene Care – Inflammation Control',
    tip: 'RFPT5',
    power: '1.5W / 30Hz - 50Hz',
    waterAir: 'Water 30% - 40% / Air 40%',
    summary: '치주낭 내부 살균 및 염증 제어(Inflammation Control)를 위한 최소 침습 레이저 프로토콜.',
    indication: '적응증: 만성 치주염, 깊은 치주낭 내 살균 및 육아조직 제거',
    salesMent: '원장님, 절개 없이 깊은 치주낭 내부 세균막과 육아조직을 선택적으로 제거해 비외과적 치주 치료의 예지성을 높여줍니다.'
  };
}

export default function App() {
  const [protocols, setProtocols] = useState(() => {
    const saved = localStorage.getItem('waterlase_protocols_test_clinical_v1');
    return saved ? JSON.parse(saved) : INITIAL_PROTOCOLS;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('is_waterlase_admin') === 'true';
  });

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedMent, setCopiedMent] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    koTitle: '',
    category: CATEGORIES[1],
    model: 'Waterlase iPlus',
    youtubeUrl: '',
    tip: '',
    power: '',
    hz: '',
    waterAir: '',
    summary: '',
    indication: '',
    salesMent: '',
    clinicalPointsText: ''
  });

  useEffect(() => {
    localStorage.setItem('waterlase_protocols_test_clinical_v1', JSON.stringify(protocols));
  }, [protocols]);

  const filteredProtocols = protocols.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(q) ||
      (item.koTitle && item.koTitle.toLowerCase().includes(q)) ||
      item.summary.toLowerCase().includes(q) ||
      item.tip.toLowerCase().includes(q) ||
      (item.salesMent && item.salesMent.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  // 상세 모달 내 이전/다음 술식 이동 및 키보드 단축키 지원
  const navigateModal = (dir) => {
    if (!activeVideo || filteredProtocols.length === 0) return;
    const idx = filteredProtocols.findIndex(p => p.id === activeVideo.id);
    if (idx === -1) return;
    const nextIdx = (idx + dir + filteredProtocols.length) % filteredProtocols.length;
    setActiveVideo(filteredProtocols[nextIdx]);
    setCopiedMent(false);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!activeVideo) return;
      if (e.key === 'Escape') setActiveVideo(null);
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('is_waterlase_admin', 'true');
      setIsLoginModalOpen(false);
      setPasswordInput('');
      alert('관리자 모드로 전환되었습니다.');
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('is_waterlase_admin');
    alert('관리자 모드에서 로그아웃되었습니다.');
  };

  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.trim();
  };

  const handleAutoFillFromYoutube = async (urlInput) => {
    const targetUrl = urlInput || formData.youtubeUrl;
    if (!targetUrl) {
      alert('먼저 유튜브 URL을 입력해 주세요.');
      return;
    }

    const ytId = extractYoutubeId(targetUrl);
    if (!ytId || ytId.length !== 11) {
      alert('올바른 유튜브 링크 또는 11자리 영상 ID를 입력해 주세요.');
      return;
    }

    setIsFetchingMeta(true);
    try {
      const fullUrl = `https://www.youtube.com/watch?v=${ytId}`;
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(fullUrl)}`);
      const data = await res.json();

      if (data && data.title) {
        const inferred = inferProtocolFromTitle(data.title);
        setFormData(prev => ({
          ...prev,
          youtubeUrl: targetUrl,
          title: data.title,
          category: inferred.category,
          tip: inferred.tip,
          power: inferred.power,
          waterAir: inferred.waterAir,
          summary: inferred.summary,
          indication: inferred.indication,
          salesMent: inferred.salesMent
        }));
      } else {
        alert('영상 제목을 가져오지 못했습니다. 비공개 영상이거나 링크를 확인해 주세요.');
      }
    } catch (error) {
      console.error('Metadata fetch failed:', error);
      alert('유튜브 정보를 불러오는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (window.confirm('이 프로토콜 영상을 삭제하시겠습니까?')) {
      const updated = protocols.filter(item => item.id !== id);
      setProtocols(updated);
      if (activeVideo && activeVideo.id === id) {
        setActiveVideo(null);
      }
    }
  };

  const handleOpenEdit = (item, e) => {
    e.stopPropagation();
    setFormData({
      id: item.id,
      title: item.title,
      koTitle: item.koTitle || '',
      category: item.category,
      model: item.model || 'Waterlase iPlus',
      youtubeUrl: `https://youtu.be/${item.youtubeId}`,
      tip: item.tip,
      power: item.power,
      hz: item.hz || '',
      waterAir: item.waterAir,
      summary: item.summary,
      indication: item.indication || '',
      salesMent: item.salesMent || '',
      clinicalPointsText: (item.clinicalPoints || item.steps || []).join('\n')
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const ytId = extractYoutubeId(formData.youtubeUrl);
    const pointsArr = formData.clinicalPointsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updated = protocols.map(item => {
      if (item.id === formData.id) {
        return {
          ...item,
          title: formData.title,
          koTitle: formData.koTitle,
          category: formData.category,
          model: formData.model,
          youtubeId: ytId,
          tip: formData.tip,
          power: formData.power,
          hz: formData.hz,
          waterAir: formData.waterAir,
          summary: formData.summary,
          indication: formData.indication,
          salesMent: formData.salesMent,
          clinicalPoints: pointsArr.length ? pointsArr : item.clinicalPoints
        };
      }
      return item;
    });
    setProtocols(updated);
    setIsEditModalOpen(false);
    alert('수정이 완료되었습니다.');
  };

  const handleAddProtocol = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeUrl) {
      alert('제목과 유튜브 링크를 입력해주세요.');
      return;
    }
    const ytId = extractYoutubeId(formData.youtubeUrl);
    const pointsArr = formData.clinicalPointsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newEntry = {
      id: 'proto-' + Date.now(),
      title: formData.title,
      koTitle: formData.koTitle || formData.title,
      category: formData.category,
      model: formData.model,
      youtubeId: ytId,
      tip: formData.tip || 'MZ6 / RFPT',
      power: formData.power || '1.5W / 30Hz',
      hz: formData.hz || '30Hz',
      waterAir: formData.waterAir || 'Water 30% / Air 30%',
      headline: formData.summary || '임상 프로토콜 세팅 가이드',
      summary: formData.summary || '임상 프로토콜 세팅 가이드',
      indication: formData.indication || '적응증: 해당 임상 술식 적용 부위',
      salesMent: formData.salesMent || '원장님, 최소 침습 레이저 세팅으로 출혈과 술 후 통증을 줄여 빠르고 예지성 있는 시술이 가능합니다.',
      clinicalPoints: pointsArr.length ? pointsArr : ['시술 부위 준비 및 소독', '권장 파라미터 최저 출력에서 시작하여 조직 반응 확인', '시술 후 세척 및 치유 확인'],
      protocolSteps: [
        { stage: '1단계 · 기본 세팅 적용', tip: formData.tip || 'MZ6', setting: formData.power || '1.5W / 30Hz', spray: formData.waterAir || 'Water 30% / Air 30%' }
      ],
      evidences: [
        { status: 'chk', text: '장비 화면 프리셋 및 권장 출력 대조 확인 권장' }
      ],
      steps: pointsArr.length ? pointsArr : ['시술 부위 준비 및 소독', '지정 파라미터 세팅 후 시술 적용', '치유 확인 및 사후 처치']
    };
    setProtocols([newEntry, ...protocols]);
    setIsAddModalOpen(false);
  };

  const handleCopyParams = (item, e) => {
    if (e) e.stopPropagation();
    const text = `[${item.title}]\nTip: ${item.tip}\nPower: ${item.power}\nWater/Air: ${item.waterAir}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyMent = (mentText) => {
    navigator.clipboard.writeText(mentText);
    setCopiedMent(true);
    setTimeout(() => setCopiedMent(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: '"Apple SD Gothic Neo", "Malgun Gothic", system-ui, -apple-system, sans-serif' }}>
      {/* 헤더 */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 30, padding: '16px 24px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}>
              <Activity size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.02em', color: '#f8fafc' }}>Waterlase Clinical Hub</h1>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#b8913a', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                  영업·임상 통합 테스트
                </span>
                {isAdmin && (
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#059669', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    관리자 모드
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>메가젠임플란트 · 술식 영상 · 세팅 프로토콜 · 원장님 상담 멘트 · 근거 확인</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="술식, 팁(RFPT5, MZ6), 멘트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <a
              href={WEBHARD_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#334155',
                color: '#38bdf8',
                border: '1px solid #0284c7',
                padding: '9px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              <FolderDown size={16} /> 자료실 다운로드
            </a>

            {isAdmin && (
              <button
                onClick={() => {
                  setFormData({
                    id: '',
                    title: '',
                    koTitle: '',
                    category: CATEGORIES[1],
                    model: 'Waterlase iPlus',
                    youtubeUrl: '',
                    tip: '',
                    power: '',
                    hz: '',
                    waterAir: '',
                    summary: '',
                    indication: '',
                    salesMent: '',
                    clinicalPointsText: ''
                  });
                  setIsAddModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Plus size={16} /> 프로토콜 추가
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={handleAdminLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#334155',
                  color: '#f87171',
                  border: '1px solid #475569',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <LogOut size={15} /> 로그아웃
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                <Lock size={15} /> 관리자
              </button>
            )}
          </div>
        </div>

        {/* 2줄 카테고리 그리드 레이아웃 */}
        <div
          style={{
            maxWidth: '1600px',
            margin: '14px auto 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '8px'
          }}
        >
          {CATEGORIES.map(cat => {
            const count = cat === '전체' ? protocols.length : protocols.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  border: selectedCategory === cat ? '1px solid #38bdf8' : '1px solid #334155',
                  backgroundColor: selectedCategory === cat ? '#0369a1' : '#1e293b',
                  color: selectedCategory === cat ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{cat}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 리스트 그리드 */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            총 <b style={{ color: '#f8fafc' }}>{filteredProtocols.length}</b>개 술식 · 카드를 누르면 영상, 단계별 프로토콜, <b style={{ color: '#fbbf24' }}>원장님 상담 멘트</b>, 근거 확인 상태가 열립니다.
          </span>
        </div>

        {filteredProtocols.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem' }}>해당 조건의 프로토콜 영상이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
            {filteredProtocols.map((item, index) => {
              const primaryEv = item.evidences && item.evidences[0] ? EVIDENCE_STYLES[item.evidences[0].status] : EVIDENCE_STYLES.ok;
              return (
                <div
                  key={item.id}
                  onClick={() => { setActiveVideo(item); setCopiedMent(false); }}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '14px',
                    border: '1px solid #334155',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.75) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(2, 132, 199, 0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                        <Play size={22} color="#fff" fill="#fff" />
                      </div>
                    </div>

                    <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
                      #{String(index + 1).padStart(2, '0')} · {item.model || 'Waterlase iPlus'}
                    </span>

                    {/* 근거 확인 상태 뱃지 */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: primaryEv.bg,
                        color: primaryEv.color,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}
                    >
                      {primaryEv.label}
                    </span>

                    {isAdmin && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                        <button
                          onClick={(e) => handleOpenEdit(item, e)}
                          title="프로토콜 수정"
                          style={{
                            backgroundColor: 'rgba(14, 165, 233, 0.9)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          title="프로토콜 삭제"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, marginBottom: '4px' }}>
                        {item.category}
                      </div>
                      <h3 style={{ margin: '0 0 2px 0', fontSize: '1.08rem', lineHeight: '1.35', fontWeight: 700, color: '#f8fafc' }}>
                        {item.title}
                      </h3>
                      {item.koTitle && (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                          {item.koTitle}
                        </div>
                      )}
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                        {item.summary}
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#0f172a', padding: '10px 12px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>Tip: {item.tip}</span>
                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.power}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8' }}>{item.waterAir}</span>
                        <button
                          onClick={(e) => handleCopyParams(item, e)}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                          {copiedId === item.id ? '복사됨' : '세팅 복사'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 상세 모달: 영업·임상 통합 뷰 (좌측 영상+단계표 / 우측 상담멘트+임상포인트+근거) */}
      {activeVideo && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setActiveVideo(null); }}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
        >
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', width: '100%', maxWidth: '1160px', overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)' }}>
            {/* 모달 상단 바 */}
            <div style={{ padding: '16px 22px', backgroundColor: '#13254b', borderBottom: '1px solid #2a4a86', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontSize: '0.75rem', color: '#efe3c4', fontWeight: 600 }}>{activeVideo.category}</div>
                <h2 style={{ margin: '3px 0 0 0', fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{activeVideo.title}</span>
                  {activeVideo.koTitle && (
                    <span style={{ fontSize: '0.85rem', color: '#c9d3e6', fontWeight: 500 }}>({activeVideo.koTitle})</span>
                  )}
                </h2>
              </div>

              {/* 이전/다음 술식 이동 + 닫기 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => navigateModal(-1)}
                  title="이전 술식 (←)"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                >
                  <ChevronLeft size={16} /> 이전
                </button>
                <button
                  onClick={() => navigateModal(1)}
                  title="다음 술식 (→)"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                >
                  다음 <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, marginLeft: '4px' }}
                >
                  닫기 ✕
                </button>
              </div>
            </div>

            {/* 2단 레이아웃 본문 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))' }}>
              {/* 좌측: 유튜브 플레이어 + 단계별 세팅 프로토콜 표 */}
              <div style={{ padding: '20px 22px', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                    title={activeVideo.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* 단계별 세팅 프로토콜 표 */}
                <div style={{ border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                  <div style={{ backgroundColor: '#1c3566', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      단계별 권장 세팅 프로토콜 ({activeVideo.model || 'Waterlase iPlus'})
                    </span>
                    <button
                      onClick={(e) => handleCopyParams(activeVideo, e)}
                      style={{
                        backgroundColor: copiedId === activeVideo.id ? '#1f7a4d' : 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedId === activeVideo.id ? <Check size={13} /> : <Copy size={13} />}
                      {copiedId === activeVideo.id ? '파라미터 복사됨' : '파라미터 복사'}
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#1e293b', color: '#94a3b8', textAlign: 'left' }}>
                          <th style={{ padding: '8px 10px', borderBottom: '1px solid #334155' }}>단계</th>
                          <th style={{ padding: '8px 10px', borderBottom: '1px solid #334155' }}>Tip</th>
                          <th style={{ padding: '8px 10px', borderBottom: '1px solid #334155' }}>출력 / Hz</th>
                          <th style={{ padding: '8px 10px', borderBottom: '1px solid #334155' }}>Water / Air</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeVideo.protocolSteps && activeVideo.protocolSteps.length > 0
                          ? activeVideo.protocolSteps
                          : [{ stage: '기본 권장 세팅', tip: activeVideo.tip, setting: activeVideo.power, spray: activeVideo.waterAir }]
                        ).map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '9px 10px', color: '#38bdf8', fontWeight: 600 }}>{row.stage}</td>
                            <td style={{ padding: '9px 10px', color: '#f8fafc', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.tip}</td>
                            <td style={{ padding: '9px 10px', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{row.setting}</td>
                            <td style={{ padding: '9px 10px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>{row.spray}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding: '8px 12px', fontSize: '0.73rem', color: '#94a3b8', backgroundColor: '#131c31', borderTop: '1px solid #1e293b' }}>
                    ※ 가장 낮은 권장 출력에서 시작해 조직 반응을 보며 조정하며, 장비 화면 프리셋을 최종 기준으로 확인합니다.
                  </div>
                </div>
              </div>

              {/* 우측: 헤드라인 + 적응증 + 원장님 상담 멘트 + 임상 포인트 + 근거 확인 */}
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#172033' }}>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, lineHeight: '1.5', color: '#f8fafc' }}>
                  {activeVideo.headline || activeVideo.summary}
                </p>

                {/* 적응증 강조 박스 */}
                {activeVideo.indication && (
                  <div style={{ backgroundColor: 'rgba(184, 145, 58, 0.16)', borderLeft: '4px solid #b8913a', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', lineHeight: '1.55', color: '#efe3c4' }}>
                    {activeVideo.indication}
                  </div>
                )}

                {/* 원장님 상담 멘트 & 원클릭 복사 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquareQuote size={16} /> 원장님 상담 멘트
                    </h4>
                    <button
                      onClick={() => handleCopyMent(activeVideo.salesMent || activeVideo.summary)}
                      style={{
                        backgroundColor: copiedMent ? '#1f7a4d' : '#0f172a',
                        border: copiedMent ? '1px solid #34d399' : '1px solid #475569',
                        color: copiedMent ? '#fff' : '#38bdf8',
                        borderRadius: '7px',
                        padding: '5px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedMent ? <Check size={13} /> : <Copy size={13} />}
                      {copiedMent ? '멘트 복사 완료' : '멘트 복사'}
                    </button>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderLeft: '4px solid #b8913a', borderRadius: '10px', padding: '13px 15px', fontSize: '0.85rem', lineHeight: '1.7', color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                    {activeVideo.salesMent || activeVideo.summary}
                  </div>
                </div>

                {/* 임상 포인트 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Stethoscope size={16} /> 임상 포인트 (Clinical Pearls)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.83rem', color: '#cbd5e1', lineHeight: '1.65', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(activeVideo.clinicalPoints || activeVideo.steps || []).map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* 근거 · 확인 상태 */}
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed #334155' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} /> 근거 · 확인 상태
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {(activeVideo.evidences || [{ status: 'ok', text: 'BIOLASE 공식 프로토콜 가이드 기준' }]).map((ev, idx) => {
                      const st = EVIDENCE_STYLES[ev.status] || EVIDENCE_STYLES.ok;
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', lineHeight: '1.5' }}>
                          <span style={{ backgroundColor: st.bg, color: st.color, fontWeight: 700, fontSize: '0.7rem', padding: '2px 7px', borderRadius: '5px', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {st.label}
                          </span>
                          <span style={{ color: '#cbd5e1' }}>{ev.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 관리자 로그인 */}
      {isLoginModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleAdminLogin} style={{ backgroundColor: '#1e293b', borderRadius: '12px', width: '100%', maxWidth: '360px', padding: '24px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>관리자 인증</h3>
              </div>
              <button type="button" onClick={() => setIsLoginModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <input
              type="password"
              placeholder="관리자 비밀번호"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', marginBottom: '14px', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              인증 확인
            </button>
          </form>
        </div>
      )}

      {/* 모달: 추가 및 수정 공용 (상담 멘트 & 임상 포인트 편집 포함) */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <form onSubmit={isEditModalOpen ? handleSaveEdit : handleAddProtocol} style={{ backgroundColor: '#1e293b', borderRadius: '12px', width: '100%', maxWidth: '540px', maxHeight: '92vh', overflowY: 'auto', padding: '24px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{isEditModalOpen ? '프로토콜 · 상담 멘트 수정' : '새 프로토콜 영상 추가'}</h3>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>유튜브 URL 또는 영상 ID *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    required
                    placeholder="https://youtu.be/... 붙여넣기"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData('text');
                      if (pasted.includes('youtu')) {
                        setTimeout(() => handleAutoFillFromYoutube(pasted), 100);
                      }
                    }}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAutoFillFromYoutube()}
                    disabled={isFetchingMeta}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#059669',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isFetchingMeta ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {isFetchingMeta ? '분석중' : '자동 채우기'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>프로토콜 제목 (영문) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: Periodontitis"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>한글 부제목</label>
                  <input
                    type="text"
                    placeholder="예: 치주염 · REPAIR Perio"
                    value={formData.koTitle}
                    onChange={(e) => setFormData({ ...formData, koTitle: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>카테고리 선택</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                >
                  {CATEGORIES.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>적용 Tip</label>
                  <input
                    type="text"
                    placeholder="MZ6, RFPT5"
                    value={formData.tip}
                    onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>Power / Hz</label>
                  <input
                    type="text"
                    placeholder="1.5W / 30Hz"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>Water / Air</label>
                  <input
                    type="text"
                    placeholder="Water 30% / Air 40%"
                    value={formData.waterAir}
                    onChange={(e) => setFormData({ ...formData, waterAir: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>카드 요약 설명</label>
                <input
                  type="text"
                  placeholder="카드 리스트에 표시될 한 줄 요약"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#fbbf24' }}>적응증 안내</label>
                <input
                  type="text"
                  placeholder="예: 적응증: 만성 치주염, 치주낭 깊이 5mm 이상"
                  value={formData.indication}
                  onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#fbbf24' }}>원장님 상담 멘트</label>
                <textarea
                  rows={3}
                  placeholder="원장님께 브리핑할 핵심 영업·임상 멘트"
                  value={formData.salesMent}
                  onChange={(e) => setFormData({ ...formData, salesMent: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#38bdf8' }}>임상 포인트 (줄바꿈으로 항목 구분)</label>
                <textarea
                  rows={3}
                  placeholder="한 줄에 하나씩 임상 팁 입력"
                  value={formData.clinicalPointsText}
                  onChange={(e) => setFormData({ ...formData, clinicalPointsText: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{ marginTop: '6px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '11px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
              >
                {isEditModalOpen ? '수정 내용 저장' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}