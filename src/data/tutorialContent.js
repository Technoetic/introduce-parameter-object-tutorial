// @MX:NOTE This content keeps the learning surface code-free by using app metaphors only.
export const tutorialContent = {
  title: "Introduce Parameter Object",
  subtitle: "흩어진 조건을 하나의 의미 있는 묶음으로 바꾸는 리팩토링",
  intent:
    "초보자가 대중 앱의 흐름을 만지며, 여러 값이 반복해서 함께 이동할 때 왜 하나의 묶음이 필요한지 체감하도록 설계했다.",
  apps: [
    {
      id: "delivery",
      name: "배달 앱",
      shortName: "배달",
      tone: "teal",
      iconClass: "app-mark--delivery",
      bundleName: "주문 조건 묶음",
      beforeLabel: "조건 조각이 흩어짐",
      afterLabel: "묶음 하나로 전달",
      fragments: [
        { id: "zone", label: "도착 지역", hint: "어디로 보낼지" },
        { id: "time", label: "시간대", hint: "언제 필요한지" },
        { id: "status", label: "주문 상태", hint: "어느 단계인지" },
        { id: "benefit", label: "혜택 여부", hint: "적용할 조건" },
      ],
    },
    {
      id: "maps",
      name: "지도 앱",
      shortName: "지도",
      tone: "coral",
      iconClass: "app-mark--maps",
      bundleName: "경로 조건 묶음",
      beforeLabel: "경로 조각이 흩어짐",
      afterLabel: "경로 묶음으로 안내",
      fragments: [
        { id: "start", label: "출발지", hint: "어디서 시작할지" },
        { id: "finish", label: "도착지", hint: "어디까지 갈지" },
        { id: "mode", label: "이동 방식", hint: "어떻게 이동할지" },
        { id: "stop", label: "경유지", hint: "중간에 들를 곳" },
      ],
    },
    {
      id: "music",
      name: "음악 앱",
      shortName: "음악",
      tone: "amber",
      iconClass: "app-mark--music",
      bundleName: "추천 조건 묶음",
      beforeLabel: "추천 조각이 흩어짐",
      afterLabel: "추천 묶음으로 재생",
      fragments: [
        { id: "mood", label: "분위기", hint: "어떤 느낌인지" },
        { id: "genre", label: "장르", hint: "어떤 결인지" },
        { id: "moment", label: "시간대", hint: "언제 들을지" },
        { id: "exclude", label: "제외 항목", hint: "피하고 싶은 것" },
      ],
    },
    {
      id: "pay",
      name: "송금 앱",
      shortName: "송금",
      tone: "green",
      iconClass: "app-mark--pay",
      bundleName: "송금 조건 묶음",
      beforeLabel: "송금 조각이 흩어짐",
      afterLabel: "송금 묶음으로 확인",
      fragments: [
        { id: "receiver", label: "받는 사람", hint: "누구에게 보낼지" },
        { id: "amount", label: "금액 범위", hint: "얼마를 다룰지" },
        { id: "memo", label: "메모", hint: "어떤 맥락인지" },
        { id: "safety", label: "보안 단계", hint: "어떤 확인이 필요한지" },
      ],
    },
  ],
  lessons: [
    {
      id: "notice",
      title: "같이 움직이는 조각을 발견",
      body: "여러 화면이 늘 같은 조건들을 함께 요구한다면, 그 조각들은 이미 한 팀처럼 행동하고 있다.",
    },
    {
      id: "bundle",
      title: "하나의 이름으로 묶기",
      body: "흩어진 조각에 의미 있는 이름을 붙이면, 화면과 화면 사이의 약속이 짧고 선명해진다.",
    },
    {
      id: "carry",
      title: "묶음째 전달하기",
      body: "각 조각을 따로 건네지 않고 묶음 하나를 건네면, 새로운 조건이 생겨도 흐름을 덜 흔든다.",
    },
    {
      id: "protect",
      title: "변화가 들어올 자리 만들기",
      body: "묶음은 단순한 봉투가 아니라, 앞으로 자랄 규칙과 설명을 담을 수 있는 작은 자리다.",
    },
  ],
  quiz: {
    prompt: "다음 상황에서 가장 자연스러운 움직임은?",
    situation: "배달, 지도, 음악 화면이 모두 같은 네 가지 조건을 계속 요구한다.",
    choices: [
      {
        id: "bundle",
        label: "조건들을 한 묶음으로 이름 붙인다",
        result:
          "정답이다. 함께 이동하는 조건은 하나의 의미 있는 묶음으로 다루면 흐름이 단순해진다.",
        correct: true,
      },
      {
        id: "copy",
        label: "각 화면에 같은 조건을 계속 복사한다",
        result: "복사는 잠깐 편하지만, 조건이 바뀔 때 여러 화면을 동시에 고쳐야 한다.",
        correct: false,
      },
      {
        id: "hide",
        label: "조건 이름을 짧게 줄여 숨긴다",
        result: "짧아 보여도 의미가 사라지면 초보자에게 더 어려운 흐름이 된다.",
        correct: false,
      },
    ],
  },
};
