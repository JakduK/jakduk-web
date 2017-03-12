<template>
  <div class="ui popup">
    <div class="ui grid">
      <div class="column">
        <h4 class="ui header">{{profile.username}}</h4>
        <a href="/user/profile" class="ui fluid small green button">
          <i class="user icon"></i> {{$t('common.view.my.profile')}}
        </a>
        <div class="ui segment" v-if="notification.list.length">
          <div class="ui relaxed divided list">
            <div class="item" v-for="item in notification.list">
              <div class="content">
                <div class="header">{{title}}</div>
                <div class="description">{{description}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ui divider"></div>
        <a href="/logout" class="ui fluid small button"><i class="sign out icon"></i> {{$t('common.logout')}}</a>
      </div>
    </div>
  </div>
</template>

<script src="./profile_menu.js"></script>
