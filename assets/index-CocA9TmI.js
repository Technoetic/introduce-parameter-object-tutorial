(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={title:`Introduce Parameter Object`,subtitle:`흩어진 조건을 하나의 의미 있는 묶음으로 바꾸는 리팩토링`,intent:`초보자가 대중 앱의 흐름을 만지며, 여러 값이 반복해서 함께 이동할 때 왜 하나의 묶음이 필요한지 체감하도록 설계했다.`,apps:[{id:`delivery`,name:`배달 앱`,shortName:`배달`,tone:`teal`,iconClass:`app-mark--delivery`,bundleName:`주문 조건 묶음`,beforeLabel:`조건 조각이 흩어짐`,afterLabel:`묶음 하나로 전달`,fragments:[{id:`zone`,label:`도착 지역`,hint:`어디로 보낼지`},{id:`time`,label:`시간대`,hint:`언제 필요한지`},{id:`status`,label:`주문 상태`,hint:`어느 단계인지`},{id:`benefit`,label:`혜택 여부`,hint:`적용할 조건`}]},{id:`maps`,name:`지도 앱`,shortName:`지도`,tone:`coral`,iconClass:`app-mark--maps`,bundleName:`경로 조건 묶음`,beforeLabel:`경로 조각이 흩어짐`,afterLabel:`경로 묶음으로 안내`,fragments:[{id:`start`,label:`출발지`,hint:`어디서 시작할지`},{id:`finish`,label:`도착지`,hint:`어디까지 갈지`},{id:`mode`,label:`이동 방식`,hint:`어떻게 이동할지`},{id:`stop`,label:`경유지`,hint:`중간에 들를 곳`}]},{id:`music`,name:`음악 앱`,shortName:`음악`,tone:`amber`,iconClass:`app-mark--music`,bundleName:`추천 조건 묶음`,beforeLabel:`추천 조각이 흩어짐`,afterLabel:`추천 묶음으로 재생`,fragments:[{id:`mood`,label:`분위기`,hint:`어떤 느낌인지`},{id:`genre`,label:`장르`,hint:`어떤 결인지`},{id:`moment`,label:`시간대`,hint:`언제 들을지`},{id:`exclude`,label:`제외 항목`,hint:`피하고 싶은 것`}]},{id:`pay`,name:`송금 앱`,shortName:`송금`,tone:`green`,iconClass:`app-mark--pay`,bundleName:`송금 조건 묶음`,beforeLabel:`송금 조각이 흩어짐`,afterLabel:`송금 묶음으로 확인`,fragments:[{id:`receiver`,label:`받는 사람`,hint:`누구에게 보낼지`},{id:`amount`,label:`금액 범위`,hint:`얼마를 다룰지`},{id:`memo`,label:`메모`,hint:`어떤 맥락인지`},{id:`safety`,label:`보안 단계`,hint:`어떤 확인이 필요한지`}]}],lessons:[{id:`notice`,title:`같이 움직이는 조각을 발견`,body:`여러 화면이 늘 같은 조건들을 함께 요구한다면, 그 조각들은 이미 한 팀처럼 행동하고 있다.`},{id:`bundle`,title:`하나의 이름으로 묶기`,body:`흩어진 조각에 의미 있는 이름을 붙이면, 화면과 화면 사이의 약속이 짧고 선명해진다.`},{id:`carry`,title:`묶음째 전달하기`,body:`각 조각을 따로 건네지 않고 묶음 하나를 건네면, 새로운 조건이 생겨도 흐름을 덜 흔든다.`},{id:`protect`,title:`변화가 들어올 자리 만들기`,body:`묶음은 단순한 봉투가 아니라, 앞으로 자랄 규칙과 설명을 담을 수 있는 작은 자리다.`}],quiz:{prompt:`다음 상황에서 가장 자연스러운 움직임은?`,situation:`배달, 지도, 음악 화면이 모두 같은 네 가지 조건을 계속 요구한다.`,choices:[{id:`bundle`,label:`조건들을 한 묶음으로 이름 붙인다`,result:`정답이다. 함께 이동하는 조건은 하나의 의미 있는 묶음으로 다루면 흐름이 단순해진다.`,correct:!0},{id:`copy`,label:`각 화면에 같은 조건을 계속 복사한다`,result:`복사는 잠깐 편하지만, 조건이 바뀔 때 여러 화면을 동시에 고쳐야 한다.`,correct:!1},{id:`hide`,label:`조건 이름을 짧게 줄여 숨긴다`,result:`짧아 보여도 의미가 사라지면 초보자에게 더 어려운 흐름이 된다.`,correct:!1}]}},t=e=>String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`),n=class{constructor({documentRef:e,root:t,state:n}){this.document=e,this.root=t,this.state=n}async init(){await Promise.resolve(),this.render(),this.bindEvents()}bindEvents(){this.root.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action]`);t&&this.handleAction(t)}),this.root.addEventListener(`input`,e=>{let t=e.target.closest(`[data-compare]`);t&&(this.state.setCompare(t.value),this.render())})}handleAction(e){let{action:t,appId:n,fragmentId:r,lessonIndex:i,choiceId:a}=e.dataset;t===`select-app`&&this.state.selectApp(n),t===`toggle-fragment`&&this.state.toggleFragment(r),t===`send-bundle`&&this.state.sendBundle(),t===`show-lesson`&&this.state.showLesson(Number.parseInt(i,10)),t===`answer-quiz`&&this.state.answerQuiz(a),t===`reset`&&this.state.resetLab(),this.render()}render(){this.root&&(this.root.innerHTML=`
      <div class="app-shell" data-testid="tutorial-app">
        ${this.renderHeader()}
        <main>
          ${this.renderHero()}
          ${this.renderLab()}
          ${this.renderLessonMap()}
          ${this.renderQuiz()}
        </main>
      </div>
    `)}renderHeader(){return`
      <header class="topbar" aria-label="튜토리얼 탐색">
        <a class="brand" href="#top" aria-label="첫 화면으로 이동">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Parameter Object Lab</span>
        </a>
        <nav class="topnav" aria-label="주요 영역">
          <a href="#lab">실험</a>
          <a href="#map">흐름</a>
          <a href="#check">확인</a>
        </nav>
      </header>
    `}renderHero(){return`
      <section class="hero" id="top" aria-labelledby="hero-title">
        <img
          class="hero-media"
          src="./assets/parameter-flow-hero.png"
          alt="흩어진 앱 조건 조각들이 하나의 묶음으로 정리되어 여러 앱 흐름으로 이동하는 추상 이미지"
        />
        <div class="hero-copy">
          <p class="eyebrow">코드 없이 만지는 리팩토링</p>
          <h1 id="hero-title">${t(this.state.content.title)}</h1>
          <p>${t(this.state.content.subtitle)}</p>
          <div class="hero-actions" aria-label="빠른 이동">
            <a class="button button--primary" href="#lab">
              <span class="button-icon button-icon--play" aria-hidden="true"></span>
              실험 시작
            </a>
            <a class="button button--quiet" href="#map">
              <span class="button-icon button-icon--map" aria-hidden="true"></span>
              흐름 보기
            </a>
          </div>
        </div>
      </section>
    `}renderLab(){let e=this.state.selectedApp,n=[`flow-board`,`flow-board--${e.tone}`,`flow-board--mix-${this.state.compareBucket}`,this.state.bundleSent?`is-sent`:``].filter(Boolean).join(` `);return`
      <section class="workspace" id="lab" aria-labelledby="lab-title">
        <div class="section-heading">
          <p class="eyebrow">대중 앱 사례</p>
          <h2 id="lab-title">흩어진 조건을 하나의 여행권처럼 묶어 보세요</h2>
          <p>칩을 눌러 함께 이동하는 조각을 모으고, 준비되면 묶음째 앱 흐름으로 보내세요.</p>
        </div>
        <div class="app-picker" aria-label="앱 사례 선택">
          ${this.renderAppButtons()}
        </div>
        <div class="lab-grid">
          <section class="panel panel--scatter" aria-labelledby="scatter-title">
            <div class="panel-heading">
              <span class="panel-kicker">Before</span>
              <h3 id="scatter-title">${t(e.beforeLabel)}</h3>
            </div>
            <div class="fragment-cloud" aria-label="흩어진 조건 조각">
              ${this.renderFragments()}
            </div>
          </section>
          <section class="panel panel--bundle" aria-labelledby="bundle-title">
            <div class="panel-heading">
              <span class="panel-kicker">Bundle</span>
              <h3 id="bundle-title">${t(e.bundleName)}</h3>
            </div>
            <div class="${n}" aria-live="polite">
              ${this.renderBundleSlots()}
              <div class="bundle-core" aria-label="${t(e.bundleName)}">
                <span class="bundle-core__ring" aria-hidden="true"></span>
                <strong>${t(e.shortName)} 묶음</strong>
                <span>${t(this.state.getProgressLabel())}</span>
              </div>
              <div class="flow-lanes" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <button
              class="button button--primary button--wide"
              type="button"
              data-action="send-bundle"
              ${this.state.isBundleReady?``:`disabled`}
            >
              <span class="button-icon button-icon--send" aria-hidden="true"></span>
              묶음째 보내기
            </button>
          </section>
          <section class="panel panel--outcome" aria-labelledby="outcome-title">
            <div class="panel-heading">
              <span class="panel-kicker">After</span>
              <h3 id="outcome-title">${t(e.afterLabel)}</h3>
            </div>
            <div class="clarity-meter" aria-label="흐름 선명도">
              <span class="clarity-meter__track">
                <span class="clarity-meter__fill clarity-meter__fill--${this.state.getClarityBand()}"></span>
              </span>
              <strong>${this.state.bundleSent?`선명한 흐름`:`아직 정리 중`}</strong>
            </div>
            <label class="compare-control">
              <span>흩어짐과 묶임 비교</span>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value="${this.state.compareValue}"
                data-compare
              />
            </label>
            <button class="button button--quiet button--wide" type="button" data-action="reset">
              <span class="button-icon button-icon--reset" aria-hidden="true"></span>
              다시 해보기
            </button>
          </section>
        </div>
      </section>
    `}renderAppButtons(){return this.state.content.apps.map(e=>{let n=e.id===this.state.selectedAppId;return`
          <button
            class="app-choice app-choice--${e.tone} ${n?`is-active`:``}"
            type="button"
            data-action="select-app"
            data-app-id="${t(e.id)}"
            aria-pressed="${n}"
          >
            <span class="app-mark ${t(e.iconClass)}" aria-hidden="true"></span>
            <span>${t(e.name)}</span>
          </button>
        `}).join(``)}renderFragments(){return this.state.fragments.map(e=>{let n=this.state.gatheredIds.has(e.id);return`
          <button
            class="fragment-chip ${n?`is-gathered`:``}"
            type="button"
            data-action="toggle-fragment"
            data-fragment-id="${t(e.id)}"
            aria-pressed="${n}"
          >
            <span>${t(e.label)}</span>
            <small>${t(e.hint)}</small>
          </button>
        `}).join(``)}renderBundleSlots(){return`
      <div class="bundle-slots" aria-label="묶음에 들어간 조각">
        ${this.state.fragments.map(e=>{let n=this.state.gatheredIds.has(e.id);return`
              <span class="bundle-slot ${n?`is-filled`:``}">
                ${n?t(e.label):`비어 있음`}
              </span>
            `}).join(``)}
      </div>
    `}renderLessonMap(){let e=this.state.lesson;return`
      <section class="lesson-map" id="map" aria-labelledby="map-title">
        <div class="section-heading">
          <p class="eyebrow">초보자 흐름</p>
          <h2 id="map-title">네 번의 움직임만 기억하면 됩니다</h2>
        </div>
        <div class="lesson-shell">
          <div class="lesson-steps" role="tablist" aria-label="학습 단계">
            ${this.state.content.lessons.map((e,n)=>`
                  <button
                    class="lesson-step ${n===this.state.lessonIndex?`is-active`:``}"
                    type="button"
                    role="tab"
                    aria-selected="${n===this.state.lessonIndex}"
                    data-action="show-lesson"
                    data-lesson-index="${n}"
                  >
                    <span>${n+1}</span>
                    ${t(e.title)}
                  </button>
                `).join(``)}
          </div>
          <div class="lesson-stage" role="tabpanel">
            <span class="lesson-orbit" aria-hidden="true"></span>
            <h3>${t(e.title)}</h3>
            <p>${t(e.body)}</p>
          </div>
        </div>
      </section>
    `}renderQuiz(){let e=this.state.content.quiz,n=this.state.quizChoice;return`
      <section class="quiz" id="check" aria-labelledby="quiz-title">
        <div class="section-heading">
          <p class="eyebrow">확인</p>
          <h2 id="quiz-title">${t(e.prompt)}</h2>
          <p>${t(e.situation)}</p>
        </div>
        <div class="quiz-options">
          ${e.choices.map(e=>`
                <button
                  class="quiz-option ${n?.id===e.id?`is-selected`:``}"
                  type="button"
                  data-action="answer-quiz"
                  data-choice-id="${t(e.id)}"
                >
                  <span class="quiz-option__mark" aria-hidden="true"></span>
                  ${t(e.label)}
                </button>
              `).join(``)}
        </div>
        <p class="quiz-result ${n?`is-visible`:``}" aria-live="polite">
          ${n?t(n.result):`선택하면 바로 피드백이 나타납니다.`}
        </p>
      </section>
    `}},r=class{constructor(e){this.content=e,this.selectedAppId=e.apps[0].id,this.gatheredIds=new Set,this.bundleSent=!1,this.lessonIndex=0,this.compareValue=0,this.quizChoiceId=null}get selectedApp(){return this.content.apps.find(e=>e.id===this.selectedAppId)??this.content.apps[0]}get fragments(){return this.selectedApp.fragments}get gatheredCount(){return this.gatheredIds.size}get totalCount(){return this.fragments.length}get isBundleReady(){return this.gatheredCount===this.totalCount}get compareBucket(){return Math.min(4,Math.max(0,Math.round(this.compareValue/25)))}get lesson(){return this.content.lessons[this.lessonIndex]}get quizChoice(){return this.content.quiz.choices.find(e=>e.id===this.quizChoiceId)??null}selectApp(e){this.content.apps.some(t=>t.id===e)&&(this.selectedAppId=e,this.gatheredIds.clear(),this.bundleSent=!1,this.quizChoiceId=null)}toggleFragment(e){if(this.fragments.some(t=>t.id===e)){if(this.gatheredIds.has(e)){this.gatheredIds.delete(e),this.bundleSent=!1;return}this.gatheredIds.add(e)}}sendBundle(){this.isBundleReady&&(this.bundleSent=!0)}setCompare(e){let t=Number.parseInt(e,10);this.compareValue=Number.isNaN(t)?0:Math.min(100,Math.max(0,t))}showLesson(e){e>=0&&e<this.content.lessons.length&&(this.lessonIndex=e)}answerQuiz(e){this.content.quiz.choices.some(t=>t.id===e)&&(this.quizChoiceId=e)}resetLab(){this.gatheredIds.clear(),this.bundleSent=!1,this.compareValue=0,this.quizChoiceId=null}getProgressLabel(){return this.bundleSent?`묶음 전달 완료`:this.isBundleReady?`묶음 준비 완료`:`${this.gatheredCount} / ${this.totalCount} 조각 수집`}getClarityBand(){let e=this.gatheredCount*25,t=this.bundleSent?25:0,n=Math.min(100,e+t);return n>=90?`full`:n>=70?`high`:n>=40?`mid`:`low`}},i=class{constructor({renderer:e}){this.renderer=e}async init(){await this.renderer.init()}};(async()=>{let t=document.querySelector(`#app`),a=new r(e);await new i({renderer:new n({documentRef:document,root:t,state:a})}).init()})().catch(e=>{let t=document.createElement(`p`);throw t.textContent=`튜토리얼을 불러오지 못했습니다. 새로고침해 주세요.`,document.body.append(t),e});