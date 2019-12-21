<template>
  <div>
    <div class="ui vertical footer segment">
      <div class="ui section divider"></div>
      <div class="ui center aligned container">
        <div class="ui stackable divided grid">
          <div class="four wide column">
            <h4 class="ui header">{{$t('about')}}</h4>
            <div class="ui link list">
              <a
                href="https://github.com/JakduK/jakduk-wiki/blob/master/jakdu-k/%EC%9E%91%EB%91%90k-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%86%8C%EA%B0%9C.md"
                target="_blank"
                class="item">
                {{$t('about.site')}}
              </a>
              <a
                href="https://github.com/JakduK/jakduk-wiki/blob/master/jakdu-k/%EC%9E%91%EB%91%90k%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%9D%B4%EC%9A%A9%EC%95%88%EB%82%B4.md"
                target="_blank"
                class="item"
              >
                {{$t('about.site.use.guide')}}
              </a>
              <a
                href="https://github.com/JakduK/jakduk-wiki/blob/master/jakdu-k/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                target="_blank"
                class="item"
              >
                {{$t('privacy.policy')}}
              </a>
            </div>
          </div>
          <div class="four wide column">
            <h4 class="ui header">{{$t('board')}}</h4>
            <div class="ui link list">
              <router-link :to="{name: 'board', params: {name: 'free'}}" class="item">{{$t('board.name.free')}}</router-link>
              <router-link :to="{name: 'board', params: {name: 'football'}}" class="item">{{$t('board.name.football')}}</router-link>
              <router-link :to="{name: 'board', params: {name: 'developer'}}" class="item">{{$t('board.name.swdev')}}</router-link>
            </div>
          </div>
          <div class="four wide column">
            <h4 class="ui header">{{$t('stats')}}</h4>
            <div class="ui link list">
              <router-link to="/stats/supporters" class="item">{{$t('stats.supporters')}}</router-link>
              <router-link to="/stats/attendance/league" class="item">{{$t('stats.attendance')}}</router-link>
            </div>
          </div>
          <div class="four wide column">
            <div class="ui center aligned container">
              <div class="ui link list">
                <div class="item">
                  <a href="/rss.xml">
                    <i class="rss big icon"></i> RSS
                  </a>
                </div>
                <div class="item">
                  <a href="https://github.com/JakduK" target="_blank">
                    <i class="github alternate big icon"></i> Github
                  </a>
                </div>
                <div class="item">
                  <a href="mailto:phjang1983@daum.net">
                    <i class="mail big icon"></i> email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ui section divider"></div>
        <img src="/assets/jakduk/img/logo_128.png" class="ui centered mini image">
        <div class="ui tiny header">{{$t('common.jakduk.description')}}</div>
        <div class="ui horizontal small divided link list">
          <div class="item">
            <a href="https://jetbrains.com" target="_blank">
              <img src="/assets/images/jetbrains.png" class="ui image mini right spaced">
              <a href="https://jetbrains.com?from=JakduK" target="_blank">Tools supported by JetBrains</a>
            </a>
          </div>
          <div class="item">
            <a href="https://icons8.com/web-app/for/all/ghost" target="_blank">Free icons by Icons8</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ui.footer.segment {
    padding: 1em 0 3em 0;
  }
</style>

